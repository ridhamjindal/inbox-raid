import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Shield, Award, Sparkles } from 'lucide-react';
import { MOCK_USER_STATS } from '../../data/mockData';

interface PlayerProgressionProps {
  onEnterArena: () => void;
}

export const PlayerProgression: React.FC<PlayerProgressionProps> = ({ onEnterArena }) => {
  const progressPercent = (MOCK_USER_STATS.currentXp / MOCK_USER_STATS.requiredXp) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Welcome Banner Card */}
      <div className="lg:col-span-8 glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between glow-purple">
        <div className="absolute top-0 right-0 w-96 h-96 bg-arcade-electricPurple/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-arcade-electricPurple/20 border border-arcade-electricPurple/40 text-arcade-electricPurple font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Operational Base Online</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonCyan to-arcade-electricPurple">RAIDER!</span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Your inbox is waiting. Ready for another battle? Clear your unread backlog and claim legendary cyber rewards.
          </p>
        </div>

        <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-arcade-dark border border-arcade-neonPink/40">
              <Flame className="w-5 h-5 text-arcade-neonPink animate-bounce" />
              <div>
                <span className="block text-[10px] font-mono text-gray-400">DAILY STREAK</span>
                <span className="text-base font-black text-arcade-neonPink font-mono">{MOCK_USER_STATS.dailyStreak} DAYS</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-arcade-dark border border-arcade-neonGreen/40">
              <Shield className="w-5 h-5 text-arcade-neonGreen" />
              <div>
                <span className="block text-[10px] font-mono text-gray-400">STATUS</span>
                <span className="text-base font-black text-arcade-neonGreen font-mono">READY</span>
              </div>
            </div>
          </div>

          <button
            onClick={onEnterArena}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-arcade-electricPurple via-blue-600 to-arcade-neonCyan text-white font-black text-sm hover:scale-105 transition glow-purple shadow-xl flex items-center justify-center space-x-2"
          >
            <Trophy className="w-5 h-5 text-arcade-neonCyan" />
            <span>ENTER THE ARENA</span>
          </button>
        </div>
      </div>

      {/* Progression Card */}
      <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Player Rank</span>
            <div className="p-2 rounded-xl bg-arcade-neonCyan/10 border border-arcade-neonCyan/30 text-arcade-neonCyan">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-arcade-neonCyan glow-cyan">
              <img src={MOCK_USER_STATS.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{MOCK_USER_STATS.username}</h3>
              <p className="text-xs font-mono text-arcade-neonCyan font-bold">LEVEL {MOCK_USER_STATS.level} ELITE</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">XP PROGRESS</span>
              <span className="text-arcade-neonCyan font-bold">{MOCK_USER_STATS.currentXp} / {MOCK_USER_STATS.requiredXp} XP</span>
            </div>
            <div className="h-3 w-full bg-arcade-dark rounded-full overflow-hidden border border-white/10 p-[2px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(MOCK_USER_STATS.currentXp / MOCK_USER_STATS.requiredXp) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-arcade-electricPurple to-arcade-neonCyan rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-arcade-dark/80 rounded-2xl p-4 border border-white/5 space-y-1">
          <span className="block text-[10px] font-mono text-gray-500 uppercase">Next Reward</span>
          <p className="text-xs font-bold text-arcade-neonYellow flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cyber Warrior Badge Unlocks at Lvl 9</span>
          </p>
        </div>
      </div>
    </div>
  );
};
