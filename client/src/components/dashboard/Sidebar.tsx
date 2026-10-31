import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Gamepad2,
  Cpu,
  Trophy,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'arena', label: 'Enter Arena', icon: Gamepad2, highlight: true },
    { id: 'intelligence', label: 'Inbox Intelligence', icon: Cpu },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { id: 'history', label: 'Game History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="bg-arcade-card/50 backdrop-blur-xl border-r border-white/10 h-screen sticky top-0 flex flex-col transition-all duration-300 z-30"
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="bg-gradient-to-br from-arcade-electricPurple to-arcade-neonCyan p-1.5 rounded-lg">
              <Gamepad2 className="w-5 h-5 text-black" />
            </div>
            <span className="font-black tracking-tighter text-lg bg-clip-text text-transparent bg-gradient-to-r from-arcade-neonCyan to-white">
              INBOX RAID
            </span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="bg-gradient-to-br from-arcade-electricPurple to-arcade-neonCyan p-1.5 rounded-lg mx-auto">
            <Gamepad2 className="w-5 h-5 text-black" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-arcade-electricPurple/20 text-arcade-neonCyan border border-arcade-electricPurple/40 glow-purple'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}
                ${item.highlight && !isActive ? 'border-arcade-neonPink/30' : ''}
              `}
            >
              <Icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-arcade-neonCyan' : 'group-hover:text-arcade-neonCyan'}`} />

              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-3 font-bold text-sm"
                >
                  {item.label}
                </motion.span>
              )}

              {item.highlight && !isActive && !isCollapsed && (
                <span className="absolute right-3 w-2 h-2 rounded-full bg-arcade-neonPink animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <div className="flex items-center space-x-2"><ChevronLeft className="w-5 h-5" /> <span className="text-xs font-mono">COLLAPSE</span></div>}
        </button>
      </div>
    </motion.aside>
  );
};
