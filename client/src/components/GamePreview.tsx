import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Trophy, Flame, Zap, Shield, Mail, CheckCircle2, XCircle } from 'lucide-react';

export const GamePreview: React.FC = () => {
  const previewEnemies = [
    {
      id: '1',
      sender: 'MegaStore Deals',
      subject: '🔥 FLASH SALE: 80% OFF EVERYTHING TODAY ONLY!',
      snippet: 'Don’t miss out on giant discounts on tech, apparel, and home goods...',
      category: 'PROMOTIONAL',
      hp: 1,
      maxHp: 1,
      points: 100,
      color: 'border-arcade-neonCyan/40 text-arcade-neonCyan'
    },
    {
      id: '2',
      sender: 'DevWeekly Digest',
      subject: 'Issue #342: The Future of AI Game Engines & WebGL',
      snippet: 'In this issue: 10 trends changing fullstack dev, top open-source tools...',
      category: 'NEWSLETTER',
      hp: 5,
      maxHp: 5,
      points: 500,
      color: 'border-arcade-electricPurple text-arcade-electricPurple'
    },
    {
      id: '3',
      sender: 'Cryptic Crypto Bot',
      subject: 'URGENT: Your 5000 USDT Airdrop is waiting',
      snippet: 'Your wallet has been selected for exclusive reward distribution...',
      category: 'SPAM',
      hp: 3,
      maxHp: 3,
      points: 300,
      color: 'border-arcade-neonPink text-arcade-neonPink'
    }
  ];

  return (
    <section id="preview" className="py-24 relative bg-arcade-dark overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-arcade-electricPurple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-arcade-neonCyan/40">
            <Terminal className="w-4 h-4 text-arcade-neonCyan" />
            <span className="text-xs font-mono uppercase tracking-widest text-arcade-neonCyan font-bold">
              Visual Preview Interface
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            EXPERIENCE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonCyan to-arcade-electricPurple">ARCADE ARENA</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            This is a preview of the interactive combat interface where emails transform into enemies and your laser destroys them by archiving them in Gmail.
          </p>
        </div>

        {/* Arcade HUD & Board Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 glow-cyan">
          {/* HUD Top Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="bg-arcade-dark/80 px-6 py-4 rounded-2xl border border-arcade-neonCyan/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6 text-arcade-neonCyan" />
                <span className="text-xs font-mono text-gray-400">SCORE</span>
              </div>
              <span className="text-2xl font-black text-arcade-neonCyan font-mono">14,250</span>
            </div>

            <div className="bg-arcade-dark/80 px-6 py-4 rounded-2xl border border-arcade-neonGreen/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-arcade-neonGreen" />
                <span className="text-xs font-mono text-gray-400">ARCHIVED</span>
              </div>
              <span className="text-2xl font-black text-arcade-neonGreen font-mono">42</span>
            </div>

            <div className="bg-arcade-dark/80 px-6 py-4 rounded-2xl border border-arcade-neonPink/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Flame className="w-6 h-6 text-arcade-neonPink animate-bounce" />
                <span className="text-xs font-mono text-gray-400">COMBO STREAK</span>
              </div>
              <span className="text-2xl font-black text-arcade-neonPink font-mono">8x</span>
            </div>
          </div>

          {/* Enemy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewEnemies.map((enemy) => (
              <div
                key={enemy.id}
                className="bg-arcade-dark/90 rounded-2xl p-6 border border-white/10 hover:border-arcade-neonCyan transition relative group flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-mono px-3 py-1 rounded-full bg-arcade-dark border ${enemy.color} font-bold`}>
                      {enemy.category}
                    </span>
                    <span className="text-xs font-mono text-gray-400 font-bold">
                      HP: {enemy.hp} / {enemy.maxHp}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-arcade-neonCyan transition line-clamp-1">
                    {enemy.subject}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 font-mono">
                    {enemy.snippet}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-gray-500 font-mono">
                    +{enemy.points} XP
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 rounded-lg bg-arcade-neonPink/20 text-arcade-neonPink border border-arcade-neonPink/40 text-xs font-bold hover:bg-arcade-neonPink/30 transition flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Keep</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-arcade-neonGreen/20 text-arcade-neonGreen border border-arcade-neonGreen/40 text-xs font-bold hover:bg-arcade-neonGreen/30 transition flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-mono text-gray-500">
              * Interactive arcade physics and live Gmail batch synchronization will activate in Step 4.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
