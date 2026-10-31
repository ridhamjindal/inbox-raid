import React from 'react';
import { History, Zap, Trophy, Shield, Skull, Flame } from 'lucide-react';
import { MOCK_ACTIVITY, MOCK_ACHIEVEMENTS } from '../../data/mockData';

const IconMap: any = {
  Zap, Trophy, Shield, Skull, Flame, History
};

export const RecentActivity: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-white uppercase tracking-wider">Recent Activity</h3>
        <History className="w-5 h-5 text-gray-500" />
      </div>

      <div className="space-y-6">
        {MOCK_ACTIVITY.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 mt-1">
              {activity.type === 'defeat' && <Skull className="w-4 h-4 text-arcade-neonPink" />}
              {activity.type === 'xp' && <Zap className="w-4 h-4 text-arcade-neonCyan" />}
              {activity.type === 'achievement' && <Trophy className="w-4 h-4 text-arcade-neonYellow" />}
              {activity.type === 'mission' && <Shield className="w-4 h-4 text-arcade-neonGreen" />}
              {activity.type === 'level' && <Flame className="w-4 h-4 text-arcade-electricPurple" />}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-200">{activity.text}</p>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Achievements: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-white uppercase tracking-wider">Achievements</h3>
        <Trophy className="w-5 h-5 text-arcade-neonYellow" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {MOCK_ACHIEVEMENTS.map((ach) => {
          const Icon = IconMap[ach.iconName] || Trophy;
          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center space-y-3 group cursor-help
                ${ach.unlocked
                  ? 'bg-arcade-dark border-arcade-neonCyan/20 text-white'
                  : 'bg-arcade-dark/40 border-white/5 text-gray-600 grayscale opacity-40'}
              `}
              title={`${ach.title}: ${ach.description}`}
            >
              <div className={`p-3 rounded-xl border ${ach.unlocked ? 'border-arcade-neonCyan/40 bg-arcade-neonCyan/10 text-arcade-neonCyan' : 'border-white/10 text-gray-600'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter line-clamp-1">{ach.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
