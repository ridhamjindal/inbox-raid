import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, Flame, Trophy, Mail, ArrowRight, Skull } from 'lucide-react';

interface HeroProps {
  onOpenModal: (type: 'connect' | 'demo') => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  return (
    <section id="home" className="relative pt-12 pb-24 overflow-hidden">
      {/* Background glow gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-arcade-electricPurple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-arcade-neonCyan/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
          >
            {/* Event Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-arcade-neonCyan/40">
              <Sparkles className="w-4 h-4 text-arcade-neonCyan animate-spin" />
              <span className="text-xs font-mono uppercase tracking-widest text-arcade-neonCyan font-bold">
                PromptWars × OUTLIER 2026 Hackathon
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
              YOUR INBOX IS THE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonPink via-arcade-electricPurple to-arcade-neonCyan">
                ENEMY.
              </span>
            </h1>

            {/* Supporting Headline */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Stop wasting hours cleaning unread emails. Enter the arena, defeat email monsters, and let your gameplay clean your real Gmail inbox.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={() => onOpenModal('connect')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-arcade-electricPurple via-blue-600 to-arcade-neonCyan text-white font-black text-base hover:opacity-95 transition glow-purple flex items-center justify-center space-x-3 group"
              >
                <Shield className="w-5 h-5 text-arcade-neonCyan" />
                <span>CONNECT GMAIL</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => onOpenModal('demo')}
                className="px-8 py-4 rounded-xl glass-card text-arcade-neonCyan border border-arcade-neonCyan/50 hover:bg-arcade-neonCyan/10 transition font-bold text-base flex items-center justify-center space-x-3 glow-cyan"
              >
                <Sparkles className="w-5 h-5" />
                <span>PLAY DEMO</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl font-black text-arcade-neonCyan font-mono">100%</span>
                <span className="text-xs text-gray-400 font-mono">Non-Destructive</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-arcade-electricPurple font-mono">AI-Powered</span>
                <span className="text-xs text-gray-400 font-mono">Gemini Analysis</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-arcade-neonPink font-mono">Arcade</span>
                <span className="text-xs text-gray-400 font-mono">Real-Time Combat</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Gaming Illustration / Animated Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Floating XP Indicator */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-6 -left-6 z-20 bg-arcade-card/90 backdrop-blur border border-arcade-neonGreen px-4 py-2 rounded-xl glow-green flex items-center space-x-2"
              >
                <Trophy className="w-5 h-5 text-arcade-neonGreen" />
                <div>
                  <span className="block text-[10px] font-mono text-gray-400">XP REWARD</span>
                  <span className="text-sm font-black text-arcade-neonGreen font-mono">+1,000 PTS</span>
                </div>
              </motion.div>

              {/* Floating Combo Badge */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -bottom-6 -right-6 z-20 bg-arcade-card/90 backdrop-blur border border-arcade-neonPink px-4 py-2 rounded-xl glow-pink flex items-center space-x-2"
              >
                <Flame className="w-5 h-5 text-arcade-neonPink animate-bounce" />
                <div>
                  <span className="block text-[10px] font-mono text-gray-400">COMBO STREAK</span>
                  <span className="text-sm font-black text-arcade-neonPink font-mono">12x MULTIPLIER</span>
                </div>
              </motion.div>

              {/* Main Enemy Card Illustration */}
              <div className="glass-card rounded-2xl p-6 border border-arcade-electricPurple/60 glow-purple relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-arcade-neonPink/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-arcade-neonPink animate-ping" />
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-arcade-neonPink/20 text-arcade-neonPink border border-arcade-neonPink/40 font-bold uppercase">
                      BOSS ENEMY #042
                    </span>
                  </div>
                  <span className="text-xs font-mono text-arcade-neonCyan font-bold">
                    HP: 8 / 10
                  </span>
                </div>

                <div className="space-y-3 my-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-arcade-electricPurple/20 p-3 rounded-xl border border-arcade-electricPurple">
                      <Skull className="w-6 h-6 text-arcade-electricPurple" />
                    </div>
                    <div>
                      <h4 className="text-sm font-mono text-gray-400">OFFER / NEWSLETTER</h4>
                      <h3 className="text-base font-bold text-white line-clamp-1">🔥 FLASH SALE: 80% OFF EVERYTHING TODAY!</h3>
                    </div>
                  </div>

                  <div className="bg-arcade-dark/80 rounded-xl p-3 border border-white/5 text-xs text-gray-300 font-mono">
                    "Don't miss out on giant discounts on tech and apparel. Click now to claim coupon code..."
                  </div>
                </div>

                {/* Simulated Archive Action Bar */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
                    <Mail className="w-4 h-4 text-arcade-neonCyan" />
                    <span>Gmail: Unread</span>
                  </div>
                  <div className="bg-arcade-neonGreen/20 text-arcade-neonGreen border border-arcade-neonGreen px-4 py-1.5 rounded-lg text-xs font-black tracking-wider flex items-center space-x-1">
                    <span>ARCHIVE LASER READY</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
