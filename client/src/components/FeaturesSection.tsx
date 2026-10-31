import React from 'react';
import { Cpu, ShieldCheck, Gamepad2, Trophy, Skull, Lock, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'AI Email Detection',
      description: 'Gemini AI automatically categorizes emails into enemy types based on content and priority.',
      icon: Cpu,
      color: 'text-arcade-neonCyan'
    },
    {
      title: 'Real Gmail Integration',
      description: 'Actions in the game translate to real archive operations in your inbox via secure API sync.',
      icon: Zap,
      color: 'text-arcade-neonGreen'
    },
    {
      title: 'Interactive Gameplay',
      description: 'Retro arcade mechanics, particle effects, and sound synthesis turn chores into high-score fun.',
      icon: Gamepad2,
      color: 'text-arcade-electricPurple'
    },
    {
      title: 'XP & Rewards',
      description: 'Earn points and level up your player profile as you clear your digital backlog.',
      icon: Trophy,
      color: 'text-arcade-neonYellow'
    },
    {
      title: 'Boss Battles',
      description: 'Massive newsletters and deep unread threads become multi-phase boss monsters.',
      icon: Skull,
      color: 'text-arcade-neonPink'
    },
    {
      title: 'Smart Protection',
      description: 'Strict non-destructive security ensures you never accidentally delete important data.',
      icon: ShieldCheck,
      color: 'text-blue-500'
    }
  ];

  return (
    <section id="features" className="py-24 relative bg-arcade-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-arcade-neonPink/40">
            <span className="text-xs font-mono uppercase tracking-widest text-arcade-neonPink font-bold">
              Premium Game Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            POWERED BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonPink to-arcade-electricPurple">ELITE TECH</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            A fusion of modern productivity tools and hardcore gaming engine design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all hover:bg-white/5 shadow-lg group"
              >
                <div className={`p-3 rounded-xl inline-block bg-arcade-dark border border-white/10 mb-6 group-hover:scale-110 transition ${feature.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-mono">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
