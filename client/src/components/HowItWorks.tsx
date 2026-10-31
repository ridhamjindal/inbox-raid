import React from 'react';
import { Shield, Gamepad2, Trophy, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'CONNECT',
      description: 'Connect your Gmail account securely via official Google OAuth 2.0 with strict non-destructive permissions.',
      icon: Shield,
      badgeColor: 'text-arcade-neonCyan border-arcade-neonCyan/40 bg-arcade-neonCyan/10'
    },
    {
      step: '02',
      title: 'ENTER THE ARENA',
      description: 'Gemini AI analyzes your backlog and transforms unread promotional emails, spam, and newsletters into interactive game enemies.',
      icon: Gamepad2,
      badgeColor: 'text-arcade-electricPurple border-arcade-electricPurple/40 bg-arcade-electricPurple/10'
    },
    {
      step: '03',
      title: 'DEFEAT & CLEAN',
      description: 'Shoot, slash, and unleash special laser combos to archive unwanted emails instantly while earning XP and high scores.',
      icon: Trophy,
      badgeColor: 'text-arcade-neonGreen border-arcade-neonGreen/40 bg-arcade-neonGreen/10'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-arcade-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-arcade-electricPurple/40">
            <span className="text-xs font-mono uppercase tracking-widest text-arcade-electricPurple font-bold">
              Simple 3-Step Process
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            HOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-electricPurple to-arcade-neonCyan">INBOX RAID</span> WORKS
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Transform hours of boring digital chores into a 30-second arcade thrill ride.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-3xl p-8 border border-white/10 hover:border-arcade-neonCyan/60 transition group relative flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className={`p-4 rounded-2xl border ${item.badgeColor} group-hover:scale-110 transition transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-4xl font-black font-mono text-white/20 group-hover:text-white/40 transition">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-arcade-neonCyan transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-gray-500 group-hover:text-arcade-neonCyan transition">
                  <span>Step {index + 1} of 3</span>
                  <ArrowRight className="w-4 h-4 ml-auto transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
