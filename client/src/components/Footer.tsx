import React from 'react';
import { Gamepad2, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-arcade-dark border-t border-white/10 pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-arcade-electricPurple to-arcade-neonCyan p-2 rounded-xl">
                <Gamepad2 className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-black tracking-wider text-white">
                INBOX RAID
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              The ultimate AI-powered email cleanup game. Don't just archive your emails—defeat them in the arena. Built for PromptWars × OUTLIER 2026.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2.5 rounded-lg glass-card border border-white/10 text-gray-400 hover:text-arcade-neonCyan transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg glass-card border border-white/10 text-gray-400 hover:text-arcade-neonCyan transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg glass-card border border-white/10 text-gray-400 hover:text-arcade-neonCyan transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-arcade-neonCyan transition">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-arcade-neonCyan transition">How It Works</a></li>
              <li><a href="#features" className="hover:text-arcade-neonCyan transition">Features</a></li>
              <li><a href="#preview" className="hover:text-arcade-neonCyan transition">Live Preview</a></li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-arcade-neonCyan transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-arcade-neonCyan transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-arcade-neonCyan transition">Hackathon Rules</a></li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:commander@inboxraid.xyz" className="hover:text-arcade-neonCyan transition">Contact Base</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
          <p>© 2026 INBOX RAID. PROMPTWARS × OUTLIER SUBMISSION.</p>
          <div className="flex items-center space-x-6">
            <span>V2.0.0-HACKATHON-EDITION</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-arcade-neonGreen animate-pulse" />
              <span className="text-arcade-neonGreen">SERVER ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
