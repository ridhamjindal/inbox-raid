import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, Trophy, Zap, AlertCircle } from 'lucide-react';
import { MOCK_USER_STATS } from '../../data/mockData';
import { MockEmailService } from '../../services/mockEmailService';

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-card p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 pointer-events-none -mr-8 -mt-8 ${color.bg}`} />

    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl border ${color.border} ${color.text} bg-opacity-10`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Demo Data</span>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-arcade-neonGreen animate-pulse" />
          <span className="text-[10px] font-mono text-arcade-neonGreen font-bold">LIVE SYNC</span>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-wider">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-black text-white tracking-tighter font-mono">{value}</span>
        {subValue && <span className="text-xs font-bold text-gray-500">{subValue}</span>}
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-white/5">
      <div className="flex items-center space-x-2 text-[10px] text-gray-500 italic font-mono">
        <AlertCircle className="w-3 h-3" />
        <span>LOCAL DEMO STATE (50 EMAILS POOL)</span>
      </div>
    </div>
  </motion.div>
);

export const StatCards: React.FC = () => {
  const [inboxStats, setInboxStats] = useState(MockEmailService.getInboxStats());

  useEffect(() => {
    setInboxStats(MockEmailService.getInboxStats());
  }, []);

  const stats = [
    {
      title: 'Unread Emails',
      value: inboxStats.unread.toString(),
      icon: Mail,
      color: { bg: 'bg-arcade-neonPink', border: 'border-arcade-neonPink/40', text: 'text-arcade-neonPink' }
    },
    {
      title: 'Emails Archived',
      value: inboxStats.archived.toString(),
      icon: ShieldCheck,
      color: { bg: 'bg-arcade-neonGreen', border: 'border-arcade-neonGreen/40', text: 'text-arcade-neonGreen' },
      subValue: 'IN DEMO'
    },
    {
      title: 'Current Level',
      value: `LVL ${MOCK_USER_STATS.level.toString().padStart(2, '0')}`,
      icon: Trophy,
      color: { bg: 'bg-arcade-neonYellow', border: 'border-arcade-neonYellow/40', text: 'text-arcade-neonYellow' }
    },
    {
      title: 'Total XP',
      value: MOCK_USER_STATS.currentXp.toLocaleString(),
      icon: Zap,
      color: { bg: 'bg-arcade-neonCyan', border: 'border-arcade-neonCyan/40', text: 'text-arcade-neonCyan' },
      subValue: 'PTS'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
