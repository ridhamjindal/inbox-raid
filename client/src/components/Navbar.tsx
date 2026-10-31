import React, { useState } from 'react';
import { Gamepad2, Shield, Sparkles, Menu, X, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../services/authStore';

interface NavbarProps {
  onOpenModal: (type: 'connect' | 'demo') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className="sticky top-0 z-40 w-full bg-arcade-dark/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-arcade-electricPurple to-arcade-neonCyan p-2.5 rounded-xl glow-cyan group-hover:scale-105 transition transform">
            <Gamepad2 className="w-6 h-6 text-black font-black" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonCyan via-white to-arcade-electricPurple">
              INBOX RAID
            </span>
            <span className="block text-[10px] font-mono text-gray-400 tracking-widest uppercase">
              PromptWars × OUTLIER
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#home" className="hover:text-arcade-neonCyan transition">Home</a>
          <a href="#how-it-works" className="hover:text-arcade-neonCyan transition">How It Works</a>
          <a href="#features" className="hover:text-arcade-neonCyan transition">Features</a>
          <a href="#preview" className="hover:text-arcade-neonCyan transition">Live Preview</a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => onOpenModal('demo')}
            className="px-4 py-2.5 rounded-xl glass-card text-arcade-neonCyan border border-arcade-neonCyan/40 hover:bg-arcade-neonCyan/10 transition text-sm font-bold flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Play Demo</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => onOpenModal('demo')}
              className="px-5 py-2.5 rounded-xl bg-arcade-neonGreen/15 border border-arcade-neonGreen/50 text-arcade-neonGreen font-bold text-sm hover:opacity-90 transition glow-green flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Gmail Connected ({user?.email.split('@')[0]})</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenModal('connect')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-arcade-electricPurple to-blue-600 text-white font-bold text-sm hover:opacity-90 transition glow-purple flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Connect Gmail</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-xl glass-card"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-white/10 px-6 py-6 space-y-4">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-arcade-neonCyan font-medium"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-arcade-neonCyan font-medium"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-arcade-neonCyan font-medium"
          >
            Features
          </a>
          <a
            href="#preview"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-arcade-neonCyan font-medium"
          >
            Live Preview
          </a>
          <div className="pt-4 flex flex-col gap-3 border-t border-white/10">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenModal('demo'); }}
              className="w-full py-3 rounded-xl glass-card text-arcade-neonCyan border border-arcade-neonCyan/40 font-bold flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Play Demo</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenModal('connect'); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-arcade-electricPurple to-blue-600 text-white font-bold flex items-center justify-center space-x-2 glow-purple"
            >
              <Shield className="w-4 h-4" />
              <span>{isAuthenticated ? 'Gmail Connected' : 'Connect Gmail'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
