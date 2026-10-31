import { create } from 'zustand';
import { fetchAuthStatus, fetchGoogleAuthUrl, disconnectGmail, unarchiveEmail } from './api';

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
}

export interface LastArchivedAction {
  id: string;
  subject: string;
  isDemo: boolean;
  timestamp: number;
}

interface AuthState {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  authError: string | null;
  notification: string | null;
  lastArchived: LastArchivedAction | null;

  initAuth: () => Promise<void>;
  connectGmail: () => Promise<{ success: boolean; url?: string; notConfigured?: boolean; message?: string }>;
  disconnect: () => Promise<void>;
  setDemoMode: (isDemo: boolean) => void;
  toggleMode: () => void;
  clearNotification: () => void;
  setLastArchived: (item: LastArchivedAction | null) => void;
  undoLastArchive: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isDemoMode: true,
  user: null,
  isLoading: true,
  authError: null,
  notification: null,
  lastArchived: null,

  initAuth: async () => {
    set({ isLoading: true });

    // 1. Check for URL redirect parameters from OAuth callback
    const searchParams = new URLSearchParams(window.location.search);
    const authParam = searchParams.get('auth');
    const authErrorParam = searchParams.get('auth_error');
    const sidParam = searchParams.get('sid');

    if (authParam === 'success') {
      set({ notification: '🟢 Successfully connected to Gmail! Live Mode is now active.' });
    } else if (authErrorParam) {
      const errorMsg =
        authErrorParam === 'cancelled'
          ? 'Google authentication was cancelled.'
          : authErrorParam === 'invalid_state'
          ? 'OAuth verification state expired. Please try connecting again.'
          : `Authentication error: ${decodeURIComponent(authErrorParam)}`;

      set({ authError: errorMsg, notification: `⚠️ ${errorMsg}` });
    }

    // 2. Query backend for active session (passes sid if returned in OAuth redirect)
    try {
      const res = await fetchAuthStatus(sidParam || undefined);
      if (res.authenticated && res.user) {
        set({
          isAuthenticated: true,
          isDemoMode: false,
          user: res.user,
          isLoading: false
        });
      } else {
        set({
          isAuthenticated: false,
          isDemoMode: true,
          user: null,
          isLoading: false
        });
      }
    } catch (err) {
      set({
        isAuthenticated: false,
        isDemoMode: true,
        user: null,
        isLoading: false
      });
    }

    // Clean query parameters from URL without reloading page
    if (authParam || authErrorParam || sidParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },

  connectGmail: async () => {
    try {
      set({ isLoading: true, authError: null });
      const res = await fetchGoogleAuthUrl();

      if (res.notConfigured) {
        set({
          isLoading: false,
          authError: res.message || 'Google OAuth credentials not configured on backend.'
        });
        return res;
      }

      if (res.success && res.url) {
        // Redirect browser to Google's official OAuth consent page
        window.location.href = res.url;
        return res;
      }

      set({
        isLoading: false,
        authError: res.message || 'Failed to initiate Google authentication.'
      });
      return { success: false, message: res.message || 'Failed to get auth URL' };
    } catch (err: any) {
      set({ isLoading: false, authError: err.message });
      return { success: false, message: err.message };
    }
  },

  disconnect: async () => {
    try {
      set({ isLoading: true });
      await disconnectGmail();
      set({
        isAuthenticated: false,
        isDemoMode: true,
        user: null,
        isLoading: false,
        notification: '🛡️ Disconnected from Gmail. Switched to Demo Mode.'
      });
    } catch (err) {
      set({
        isAuthenticated: false,
        isDemoMode: true,
        user: null,
        isLoading: false
      });
    }
  },

  setDemoMode: (isDemo: boolean) => {
    const { isAuthenticated } = get();
    // Cannot turn off demo mode if not authenticated
    if (!isDemo && !isAuthenticated) {
      set({ notification: '⚠️ Connect your Gmail account first to enable Live Gmail Mode!' });
      return;
    }
    set({
      isDemoMode: isDemo,
      notification: isDemo
        ? '⚡ Switched to Demo Mode (Mock enemies, zero real inbox impact).'
        : '🟢 Switched to Live Gmail Mode (Actions sync with real Gmail).'
    });
  },

  toggleMode: () => {
    const { isDemoMode, isAuthenticated, setDemoMode } = get();
    if (isDemoMode && !isAuthenticated) {
      set({ notification: '⚠️ Connect your Gmail account first to enable Live Gmail Mode!' });
      return;
    }
    setDemoMode(!isDemoMode);
  },

  clearNotification: () => set({ notification: null, authError: null }),

  setLastArchived: (item: LastArchivedAction | null) => set({ lastArchived: item }),

  undoLastArchive: async () => {
    const { lastArchived } = get();
    if (!lastArchived) return false;

    try {
      const res = await unarchiveEmail(lastArchived.id, lastArchived.isDemo);
      if (res.success) {
        set({
          lastArchived: null,
          notification: `🔄 Restored to Inbox: "${lastArchived.subject.slice(0, 32)}..."`
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to undo archive:', err);
      return false;
    }
  }
}));

