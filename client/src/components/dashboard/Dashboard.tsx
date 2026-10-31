import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { StatCards } from './StatCards';
import { PlayerProgression } from './PlayerProgression';
import { Missions } from './Missions';
import { RecentActivity, Achievements } from './RecentActivity';
import { DemoInbox } from './DemoInbox';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../services/authStore';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';

interface DashboardProps {
  onEnterArena?: () => void;
  onOpenModal?: (type: 'connect' | 'demo') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onEnterArena, onOpenModal }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated, isDemoMode, user, connectGmail, authError } = useAuthStore();

  const handleSidebarTabChange = (tab: string) => {
    if (tab === 'arena' && onEnterArena) {
      onEnterArena();
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex h-screen bg-arcade-dark text-white font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSidebarTabChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onOpenModal={onOpenModal} />
        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto min-h-0">
          {/* Auth Error Banner if present */}
          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
              <button
                onClick={() => (onOpenModal ? onOpenModal('connect') : connectGmail())}
                className="underline hover:text-white font-bold ml-4"
              >
                Reconnect
              </button>
            </div>
          )}

          {/* Quick Gmail Connection Callout Banner if not authenticated */}
          {!isAuthenticated && (
            <div className="glass-card rounded-2xl p-4 border border-arcade-electricPurple/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-arcade-electricPurple/10 via-transparent to-transparent">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-arcade-electricPurple/20 text-arcade-electricPurple border border-arcade-electricPurple/40">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Fight Your Real Gmail Inbox</h4>
                  <p className="text-xs text-gray-400 font-mono">
                    Connect Google OAuth to convert your real unread emails into enemy invaders.
                  </p>
                </div>
              </div>

              <button
                onClick={() => (onOpenModal ? onOpenModal('connect') : connectGmail())}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-arcade-electricPurple to-blue-600 text-white font-bold text-xs hover:opacity-90 transition glow-purple flex items-center space-x-2 shrink-0 shadow-md"
              >
                <Shield className="w-4 h-4 text-arcade-neonCyan" />
                <span>Connect Gmail</span>
              </button>
            </div>
          )}

          {activeTab === 'intelligence' ? (
            <DemoInbox onEnterArena={onEnterArena} onOpenModal={onOpenModal} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <PlayerProgression onEnterArena={onEnterArena || (() => {})} />
              <StatCards />
              <Missions />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Achievements />
                </div>
                <div className="lg:col-span-1">
                  <RecentActivity />
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};
