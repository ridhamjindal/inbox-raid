import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  RefreshCw,
  Search,
  Shield,
  Mail,
  CheckCircle2,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Zap,
  ChevronRight,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { MockEmailService } from '../../services/mockEmailService';
import { DemoEmail, EmailCategory } from '../../types/index';
import { useAuthStore } from '../../services/authStore';
import { fetchEmails, archiveEmailsBatch, unarchiveEmail } from '../../services/api';

interface DemoInboxProps {
  onEnterArena?: () => void;
  onOpenModal?: (type: 'connect' | 'demo') => void;
}

export const DemoInbox: React.FC<DemoInboxProps> = ({ onEnterArena, onOpenModal }) => {
  const { isAuthenticated, isDemoMode, user, toggleMode, connectGmail, setLastArchived, undoLastArchive } = useAuthStore();

  const [emails, setEmails] = useState<DemoEmail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stats, setStats] = useState(MockEmailService.getInboxStats());
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState<boolean>(false);
  const [archivingInProgress, setArchivingInProgress] = useState<boolean>(false);

  // Load emails when mode changes
  useEffect(() => {
    loadEmails();
  }, [isDemoMode, isAuthenticated]);

  const loadEmails = async (loadMore: boolean = false) => {
    setIsLoading(true);
    setLoadError(null);

    if (isDemoMode) {
      const list = MockEmailService.getEmails();
      setEmails(list);
      setStats(MockEmailService.getInboxStats());
      setNextPageToken(undefined);
      setIsLoading(false);
      return;
    }

    // Live Gmail Mode - STRICT: Never fallback to mock emails when connected!
    try {
      const res = await fetchEmails(false, loadMore ? nextPageToken : undefined, 20);
      if (res.success && Array.isArray(res.emails)) {
        if (loadMore) {
          setEmails((prev) => [...prev, ...res.emails]);
        } else {
          setEmails(res.emails);
        }
        setNextPageToken(res.nextPageToken);
        computeGmailStats(loadMore ? [...emails, ...res.emails] : res.emails);
      } else {
        const errMsg = res.error || 'Could not load live Gmail messages.';
        setLoadError(errMsg);
        showToast(`⚠️ ${errMsg}`);
        if (!loadMore) {
          setEmails([]);
          setStats({ total: 0, unread: 0, archived: 0, categoriesCount: { PROMOTIONAL: 0, SPAM: 0, NEWSLETTER: 0, IMPORTANT: 0, OLD_UNREAD: 0 } });
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch Gmail emails:', err);
      const errMsg = err.message || 'Network error connecting to Gmail backend.';
      setLoadError(errMsg);
      showToast(`⚠️ ${errMsg}`);
      if (!loadMore) {
        setEmails([]);
        setStats({ total: 0, unread: 0, archived: 0, categoriesCount: { PROMOTIONAL: 0, SPAM: 0, NEWSLETTER: 0, IMPORTANT: 0, OLD_UNREAD: 0 } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const computeGmailStats = (emailList: DemoEmail[]) => {
    const unread = emailList.filter((e) => !e.isArchived && e.unread).length;
    const archived = emailList.filter((e) => e.isArchived).length;
    const categoriesCount = {
      PROMOTIONAL: emailList.filter((e) => e.category === 'PROMOTIONAL' && !e.isArchived).length,
      SPAM: emailList.filter((e) => e.category === 'SPAM' && !e.isArchived).length,
      NEWSLETTER: emailList.filter((e) => e.category === 'NEWSLETTER' && !e.isArchived).length,
      IMPORTANT: emailList.filter((e) => e.category === 'IMPORTANT' && !e.isArchived).length,
      OLD_UNREAD: emailList.filter((e) => e.category === 'OLD_UNREAD' && !e.isArchived).length
    };
    setStats({ total: emailList.length, unread, archived, categoriesCount });
  };

  const handleResetInbox = () => {
    if (isDemoMode) {
      const fresh = MockEmailService.resetEmails();
      setEmails(fresh);
      setStats(MockEmailService.getInboxStats());
      showToast('🔄 Demo inbox reset to 50 unread sample emails!');
    } else {
      loadEmails(false);
      showToast('🔄 Live Gmail inbox refreshed from Google servers!');
    }
  };

  const handleArchiveSingle = async (email: DemoEmail) => {
    // Safety check for VIP emails
    if (email.category === 'IMPORTANT') {
      const confirmed = window.confirm(
        '⚠️ PROTECTED VIP EMAIL!\n\nThis email is categorized as IMPORTANT / CRITICAL. Are you sure you want to archive it?'
      );
      if (!confirmed) return;
    }

    try {
      if (isDemoMode) {
        MockEmailService.archiveEmails([email.id]);
        setEmails((prev) =>
          prev.map((e) => (e.id === email.id ? { ...e, isArchived: true, unread: false } : e))
        );
        setStats(MockEmailService.getInboxStats());
      } else {
        await archiveEmailsBatch([email.id], false);
        setEmails((prev) =>
          prev.map((e) => (e.id === email.id ? { ...e, isArchived: true, unread: false } : e))
        );
      }

      setLastArchived({
        id: email.id,
        subject: email.subject,
        isDemo: isDemoMode,
        timestamp: Date.now()
      });

      showToast(`🚀 Archived: "${email.subject.slice(0, 28)}..." (Undo available)`);
    } catch (err) {
      showToast('❌ Failed to archive email.');
    }
  };

  const handleBulkArchive = async () => {
    setArchivingInProgress(true);
    const unarchivedIds = filteredEmails.filter((e) => !e.isArchived).map((e) => e.id);

    if (unarchivedIds.length === 0) {
      setShowBulkConfirmModal(false);
      setArchivingInProgress(false);
      return;
    }

    try {
      if (isDemoMode) {
        MockEmailService.archiveEmails(unarchivedIds);
      } else {
        await archiveEmailsBatch(unarchivedIds, false);
      }

      setEmails((prev) =>
        prev.map((e) => (unarchivedIds.includes(e.id) ? { ...e, isArchived: true, unread: false } : e))
      );

      setShowBulkConfirmModal(false);
      showToast(`🔥 Purged ${unarchivedIds.length} emails from inbox!`);
    } catch (err) {
      showToast('❌ Bulk archive failed.');
    } finally {
      setArchivingInProgress(false);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredEmails = emails.filter((email) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'ARCHIVED' && email.isArchived) ||
      (selectedCategory !== 'ARCHIVED' && !email.isArchived && email.category === selectedCategory);

    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.snippet.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: EmailCategory) => {
    switch (category) {
      case 'PROMOTIONAL':
        return 'bg-arcade-neonCyan/20 text-arcade-neonCyan border-arcade-neonCyan/40';
      case 'SPAM':
        return 'bg-arcade-neonPink/20 text-arcade-neonPink border-arcade-neonPink/40';
      case 'NEWSLETTER':
        return 'bg-arcade-electricPurple/20 text-arcade-electricPurple border-arcade-electricPurple/40';
      case 'IMPORTANT':
        return 'bg-arcade-neonYellow/20 text-arcade-neonYellow border-arcade-neonYellow/40';
      case 'OLD_UNREAD':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Banner */}
      {notification && (
        <div className="fixed top-24 right-8 z-50 bg-arcade-card border border-arcade-neonCyan text-arcade-neonCyan px-6 py-3 rounded-xl font-mono text-sm shadow-2xl flex items-center space-x-3 glow-cyan">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div
              className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase ${
                !isDemoMode && isAuthenticated
                  ? 'bg-arcade-neonGreen/15 text-arcade-neonGreen border-arcade-neonGreen/50 glow-green'
                  : 'bg-arcade-neonPink/15 text-arcade-neonPink border-arcade-neonPink/40'
              }`}
            >
              {!isDemoMode && isAuthenticated ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-arcade-neonGreen animate-pulse" />
                  <span>LIVE GMAIL INBOX INSPECTOR</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-arcade-neonPink" />
                  <span>LOCAL DEMO INBOX INSPECTOR</span>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <button
                onClick={toggleMode}
                className="text-xs font-mono text-arcade-neonCyan hover:underline px-2 py-0.5 rounded bg-white/5 border border-white/10"
              >
                Switch to {!isDemoMode ? 'Demo Mode' : 'Live Gmail Mode'}
              </button>
            ) : (
              <button
                onClick={() => (onOpenModal ? onOpenModal('connect') : connectGmail())}
                className="text-xs font-mono text-arcade-neonCyan hover:underline px-2 py-0.5 rounded bg-arcade-electricPurple/20 border border-arcade-electricPurple/40"
              >
                Connect Real Gmail &rarr;
              </button>
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white">
            INBOX{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonCyan to-arcade-electricPurple">
              INTELLIGENCE
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
            {!isDemoMode && isAuthenticated
              ? `Connected: ${user?.email} • Live Gmail API synchronization`
              : '50 Pre-seeded sample emails. Inspect your inbox wave before entering the arena.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Refresh Button */}
          <button
            onClick={handleResetInbox}
            disabled={isLoading}
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white font-bold text-xs flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-arcade-neonCyan ${isLoading ? 'animate-spin' : ''}`} />
            <span>{!isDemoMode ? 'REFRESH GMAIL' : 'RESET DEMO INBOX'}</span>
          </button>

          {/* Bulk Archive Button with Confirmation */}
          <button
            onClick={() => setShowBulkConfirmModal(true)}
            className="px-4 py-3 rounded-xl bg-arcade-neonPink/15 hover:bg-arcade-neonPink/25 border border-arcade-neonPink/40 text-arcade-neonPink font-bold text-xs flex items-center space-x-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>WAVE PURGE (ARCHIVE ALL)</span>
          </button>

          {/* Enter Arena Button */}
          {onEnterArena && (
            <button
              onClick={onEnterArena}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-arcade-electricPurple via-blue-600 to-arcade-neonCyan text-white font-black text-xs hover:scale-105 transition glow-purple flex items-center space-x-2 shadow-lg"
            >
              <Shield className="w-4 h-4 text-arcade-neonCyan" />
              <span>LAUNCH RAID SESSION</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border ${
              selectedCategory === 'ALL'
                ? 'bg-arcade-neonCyan text-black border-arcade-neonCyan'
                : 'glass-card text-gray-400 hover:text-white border-white/10'
            }`}
          >
            ALL UNREAD ({stats.unread})
          </button>

          <button
            onClick={() => setSelectedCategory('PROMOTIONAL')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border ${
              selectedCategory === 'PROMOTIONAL'
                ? 'bg-arcade-neonCyan/20 text-arcade-neonCyan border-arcade-neonCyan'
                : 'glass-card text-gray-400 hover:text-white border-white/10'
            }`}
          >
            PROMOTIONS ({stats.categoriesCount.PROMOTIONAL})
          </button>

          <button
            onClick={() => setSelectedCategory('SPAM')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border ${
              selectedCategory === 'SPAM'
                ? 'bg-arcade-neonPink/20 text-arcade-neonPink border-arcade-neonPink'
                : 'glass-card text-gray-400 hover:text-white border-white/10'
            }`}
          >
            SPAM ({stats.categoriesCount.SPAM})
          </button>

          <button
            onClick={() => setSelectedCategory('NEWSLETTER')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border ${
              selectedCategory === 'NEWSLETTER'
                ? 'bg-arcade-electricPurple/20 text-arcade-electricPurple border-arcade-electricPurple'
                : 'glass-card text-gray-400 hover:text-white border-white/10'
            }`}
          >
            NEWSLETTERS ({stats.categoriesCount.NEWSLETTER})
          </button>

          <button
            onClick={() => setSelectedCategory('IMPORTANT')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border ${
              selectedCategory === 'IMPORTANT'
                ? 'bg-arcade-neonYellow/20 text-arcade-neonYellow border-arcade-neonYellow'
                : 'glass-card text-gray-400 hover:text-white border-white/10'
            }`}
          >
            IMPORTANT/VIP ({stats.categoriesCount.IMPORTANT})
          </button>

          <button
            onClick={() => setSelectedCategory('OLD_UNREAD')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border ${
              selectedCategory === 'OLD_UNREAD'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                : 'glass-card text-gray-400 hover:text-white border-white/10'
            }`}
          >
            OLD UNREAD ({stats.categoriesCount.OLD_UNREAD})
          </button>

          <button
            onClick={() => setSelectedCategory('ARCHIVED')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border ${
              selectedCategory === 'ARCHIVED'
                ? 'bg-arcade-neonGreen/20 text-arcade-neonGreen border-arcade-neonGreen'
                : 'glass-card text-gray-400 hover:text-white border-white/10'
            }`}
          >
            ARCHIVED ({stats.archived})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sender or subject..."
            className="w-full bg-arcade-dark/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-arcade-neonCyan font-mono transition"
          />
        </div>
      </div>

      {/* Email List Table/Cards */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
        <div className="flex justify-between items-center pb-4 border-b border-white/10 text-xs font-mono text-gray-500 uppercase tracking-wider px-2">
          <span>SENDER &amp; SUBJECT</span>
          <span>ENEMY TYPE / ARCHIVE ACTION</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-arcade-neonCyan font-mono text-xs space-y-3 animate-pulse">
            <RefreshCw className="w-8 h-8 text-arcade-neonCyan mx-auto animate-spin" />
            <p>Scanning inbox frequencies &amp; categorizing enemy ships...</p>
          </div>
        ) : loadError ? (
          <div className="py-12 text-center text-arcade-neonPink font-mono text-xs space-y-3">
            <AlertTriangle className="w-8 h-8 text-arcade-neonPink mx-auto" />
            <p className="font-bold text-white text-sm">FAILED TO SYNC GMAIL INBOX</p>
            <p className="text-gray-400 max-w-md mx-auto">{loadError}</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => loadEmails(false)}
                className="px-4 py-2 rounded-xl bg-arcade-neonCyan/20 text-arcade-neonCyan border border-arcade-neonCyan/50 hover:bg-arcade-neonCyan/30 transition font-bold"
              >
                Retry Gmail Sync
              </button>
              <button
                onClick={toggleMode}
                className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition font-bold"
              >
                Switch to Demo Mode
              </button>
            </div>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-mono text-xs space-y-3">
            <Mail className="w-8 h-8 text-gray-600 mx-auto" />
            <p>
              {!isDemoMode && isAuthenticated
                ? 'Your Gmail inbox is completely clear! 0 unread enemy messages detected.'
                : 'No emails found in this category filter.'}
            </p>
            <button onClick={handleResetInbox} className="text-arcade-neonCyan underline hover:text-white">
              Refresh Inbox
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  email.isArchived
                    ? 'bg-arcade-dark/40 border-white/5 opacity-60'
                    : email.category === 'IMPORTANT'
                    ? 'bg-arcade-dark/90 border-arcade-neonYellow/40 hover:border-arcade-neonYellow'
                    : 'bg-arcade-dark/90 border-white/10 hover:border-arcade-neonCyan/40'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                    <span className="text-xs font-bold text-white">{email.sender}</span>
                    <span className="text-[10px] font-mono text-gray-500 truncate max-w-[200px]">
                      &lt;{email.senderEmail}&gt;
                    </span>
                    {email.unread ? (
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-arcade-neonPink/20 text-arcade-neonPink border border-arcade-neonPink/40">
                        UNREAD
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                        READ
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-arcade-neonCyan" />
                      {new Date(email.date).toLocaleDateString()}
                    </span>
                    {email.category === 'IMPORTANT' && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-arcade-neonYellow/20 text-arcade-neonYellow border border-arcade-neonYellow/40 font-black">
                        PROTECTED VIP
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-200">{email.subject}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1 font-mono">{email.snippet}</p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${getCategoryBadge(email.category)}`}>
                    {email.category}
                  </span>

                  {!email.isArchived ? (
                    <button
                      onClick={() => handleArchiveSingle(email)}
                      className="p-2 rounded-xl bg-arcade-neonPink/10 text-arcade-neonPink border border-arcade-neonPink/30 hover:bg-arcade-neonPink/25 transition group"
                      title={email.category === 'IMPORTANT' ? 'Archive Protected VIP Email (Warning)' : 'Archive Email (Removes INBOX label)'}
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-arcade-neonGreen flex items-center space-x-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ARCHIVED</span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination Button for Live Gmail */}
            {!isDemoMode && nextPageToken && (
              <div className="pt-4 text-center">
                <button
                  onClick={() => loadEmails(true)}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl glass-card border border-arcade-neonCyan/40 text-arcade-neonCyan font-mono text-xs font-bold hover:bg-arcade-neonCyan/10 transition inline-flex items-center space-x-2"
                >
                  <span>LOAD NEXT GMAIL BATCH</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bulk Archive Confirmation Modal */}
      <AnimatePresence>
        {showBulkConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card border-2 border-arcade-neonPink rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 glow-pink bg-arcade-card/95"
            >
              <div className="p-4 rounded-full bg-arcade-neonPink/20 border border-arcade-neonPink inline-block">
                <AlertTriangle className="w-10 h-10 text-arcade-neonPink" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">CONFIRM BATCH PURGE</h3>
                <p className="text-xs font-mono text-arcade-neonPink mt-1">
                  {!isDemoMode ? 'LIVE GMAIL OPERATION' : 'LOCAL DEMO OPERATION'}
                </p>
              </div>

              <div className="text-xs text-gray-300 font-mono space-y-2 bg-arcade-dark/80 p-4 rounded-2xl border border-white/10 text-left">
                <p>
                  You are about to archive{' '}
                  <span className="text-arcade-neonCyan font-bold">
                    {filteredEmails.filter((e) => !e.isArchived).length} unread email(s)
                  </span>.
                </p>
                <p className="text-gray-400">
                  {!isDemoMode
                    ? '• Real Gmail emails will have their INBOX label removed.\n• Zero deletion guarantee: messages remain in All Mail.'
                    : '• Demo emails will be marked archived locally in your browser.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkConfirmModal(false)}
                  disabled={archivingInProgress}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white font-mono text-xs transition"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleBulkArchive}
                  disabled={archivingInProgress}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-arcade-neonPink to-red-600 text-white font-black font-mono text-xs hover:opacity-90 transition glow-pink flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{archivingInProgress ? 'ARCHIVING...' : 'CONFIRM PURGE'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
