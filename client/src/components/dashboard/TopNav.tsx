import React, { useState } from 'react';
import { Bell, Settings, Shield, Zap, ChevronDown, LogOut, CheckCircle2 } from 'lucide-react';
import { MOCK_USER_STATS } from '../../data/mockData';
import { useAuthStore } from '../../services/authStore';

interface TopNavProps {
  onOpenModal?: (type: 'connect' | 'demo') => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenModal }) => {
  const { isAuthenticated, isDemoMode, user, disconnect, toggleMode, connectGmail } = useAuthStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const progressPercent = (MOCK_USER_STATS.currentXp / MOCK_USER_STATS.requiredXp) * 100;

  const displayName = isAuthenticated && user?.name ? user.name : MOCK_USER_STATS.username;
  const displayEmail = isAuthenticated && user?.email ? user.email : 'commander@inboxraid.demo';
  const displayAvatar = isAuthenticated && user?.picture ? user.picture : MOCK_USER_STATS.avatarUrl;

  return (
    <header className="h-20 border-b border-white/10 bg-arcade-dark/60 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mode Indicators & Connect Button */}
      <div className="flex items-center space-x-3">
        {/* Mode Pill */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              title="Click to toggle between Live Gmail and Demo Mode"
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition text-xs font-mono font-bold ${
                !isDemoMode
                  ? 'bg-arcade-neonGreen/15 text-arcade-neonGreen border-arcade-neonGreen/50 glow-green'
                  : 'bg-arcade-neonPink/15 text-arcade-neonPink border-arcade-neonPink/50'
              }`}
            >
              {!isDemoMode ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-arcade-neonGreen animate-pulse" />
                  <span className="tracking-tight uppercase">LIVE GMAIL ACTIVE</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-arcade-neonPink" />
                  <span className="tracking-tight uppercase">DEMO MODE ACTIVE</span>
                </>
              )}
            </button>

            <button
              onClick={toggleMode}
              className="hidden sm:inline-block text-[11px] font-mono text-gray-400 hover:text-white underline underline-offset-2"
            >
              Switch to {!isDemoMode ? 'Demo' : 'Live'}
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-arcade-neonPink/10 border border-arcade-neonPink/30">
              <Zap className="w-3.5 h-3.5 text-arcade-neonPink animate-pulse" />
              <span className="text-[10px] font-black text-arcade-neonPink tracking-tighter uppercase">Demo Mode Active</span>
            </div>

            <button
              onClick={() => (onOpenModal ? onOpenModal('connect') : connectGmail())}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-arcade-electricPurple to-blue-600 text-white font-bold text-xs hover:opacity-90 transition glow-purple flex items-center space-x-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-arcade-neonCyan" />
              <span>Connect Gmail</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* XP Progress Bar */}
        <div className="hidden lg:flex flex-col items-end space-y-1 w-48">
          <div className="flex justify-between w-full text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
            <span>Level {MOCK_USER_STATS.level}</span>
            <span className="text-arcade-neonCyan">{Math.floor(progressPercent)}% to Lvl {MOCK_USER_STATS.level + 1}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-arcade-electricPurple to-arcade-neonCyan rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-3 border-l border-white/10 pl-6">
          <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-arcade-neonPink rounded-full border-2 border-arcade-dark" />
          </button>
          <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-arcade-neonCyan group-hover:glow-cyan transition bg-arcade-card">
              <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-black text-white leading-none mb-1 truncate max-w-[130px]">{displayName}</p>
              <p className="text-[10px] font-mono text-arcade-neonCyan font-bold leading-none truncate max-w-[130px]">
                {!isDemoMode && isAuthenticated ? 'GMAIL RAIDER' : 'DEMO RAIDER'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-4 border border-white/15 shadow-2xl z-50 space-y-3 bg-arcade-dark/95 animate-in fade-in">
              <div className="border-b border-white/10 pb-3">
                <p className="text-sm font-bold text-white truncate">{displayName}</p>
                <p className="text-xs font-mono text-gray-400 truncate">{displayEmail}</p>
              </div>

              {isAuthenticated ? (
                <>
                  <div className="text-xs font-mono space-y-1">
                    <p className="text-gray-400">Current Mode:</p>
                    <button
                      onClick={toggleMode}
                      className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-arcade-neonCyan font-bold text-left flex justify-between items-center"
                    >
                      <span>{!isDemoMode ? '🟢 Live Gmail' : '⚡ Demo Mode'}</span>
                      <span className="text-[10px] text-gray-400">Toggle</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      disconnect();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center space-x-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect Gmail</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (onOpenModal) onOpenModal('connect');
                    else connectGmail();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-arcade-electricPurple to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2 glow-purple"
                >
                  <Shield className="w-4 h-4" />
                  <span>Connect Gmail</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
