import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Target, ArrowRight } from 'lucide-react';
import { MOCK_MISSIONS } from '../../data/mockData';

export const Missions: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">Available Missions</h3>
          <p className="text-xs text-gray-400 font-mono italic">Complete missions to earn massive XP rewards</p>
        </div>
        <div className="p-2 rounded-xl bg-arcade-neonCyan/10 border border-arcade-neonCyan/30 text-arcade-neonCyan">
          <Target className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_MISSIONS.map((mission) => (
          <div
            key={mission.id}
            className="bg-arcade-dark/80 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-black px-2 py-1 rounded bg-white/5 border border-white/10 font-mono ${
                  mission.difficulty === 'Easy' ? 'text-arcade-neonGreen' :
                  mission.difficulty === 'Medium' ? 'text-arcade-neonYellow' : 'text-arcade-neonPink'
                }`}>
                  {mission.difficulty}
                </span>
                <span className="text-xs font-black text-arcade-neonCyan font-mono">+{mission.reward} XP</span>
              </div>

              <h4 className="text-base font-black text-white mb-2 group-hover:text-arcade-neonCyan transition uppercase">{mission.title}</h4>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">{mission.description}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-500">PROGRESS</span>
                  <span className="text-white">{mission.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mission.progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-arcade-neonCyan rounded-full"
                  />
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl border border-arcade-neonCyan/40 text-arcade-neonCyan text-xs font-black uppercase tracking-widest hover:bg-arcade-neonCyan/10 transition flex items-center justify-center space-x-2">
                <span>Start Mission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
