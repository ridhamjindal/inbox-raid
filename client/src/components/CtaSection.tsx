import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  onOpenModal: (type: 'connect' | 'demo') => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-arcade-neonCyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card rounded-[40px] p-8 sm:p-16 border border-arcade-neonCyan/40 glow-cyan text-center relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00f3ff_1px,transparent_1px)] [background-size:20px_20px]" />

          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
            READY TO RAID <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonCyan via-white to-arcade-electricPurple">
              YOUR INBOX?
            </span>
          </h2>

          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Join the elite arena and transform your boring email management into an adrenaline-fueled combat mission.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onOpenModal('connect')}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-arcade-electricPurple via-blue-600 to-arcade-neonCyan text-white font-black text-lg hover:scale-105 transition glow-purple flex items-center justify-center space-x-3 shadow-2xl"
            >
              <Shield className="w-6 h-6" />
              <span>CONNECT GMAIL</span>
            </button>

            <button
              onClick={() => onOpenModal('demo')}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl glass-card text-arcade-neonCyan border border-arcade-neonCyan/50 hover:bg-arcade-neonCyan/10 transition font-bold text-lg flex items-center justify-center space-x-3 glow-cyan"
            >
              <Sparkles className="w-6 h-6" />
              <span>PLAY DEMO</span>
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-arcade-neonGreen" />
              <span>NO CREDIT CARD REQUIRED</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-arcade-neonGreen" />
              <span>STEP 2 ARCADE PREVIEW</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-arcade-neonGreen" />
              <span>SECURE OAUTH READY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
