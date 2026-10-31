import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Sparkles, Terminal, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../services/authStore';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'connect' | 'demo' | null;
}

export const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, type }) => {
  const { connectGmail, setDemoMode } = useAuthStore();
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  if (!isOpen) return null;

  const isDemo = type === 'demo';

  const handleStartOAuth = async () => {
    setConnecting(true);
    setErrorMessage(null);

    const res = await connectGmail();
    if (res.notConfigured || (res as any).backendOffline) {
      setConnecting(false);
      setShowConfigGuide(true);
      if (res.message) {
        setErrorMessage(res.message);
      }
    } else if (!res.success) {
      setConnecting(false);
      setErrorMessage(res.message || 'Failed to initialize Google authentication.');
    }
  };

  const handleStartDemo = () => {
    setDemoMode(true);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-arcade-neonCyan/40 glow-cyan max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/15 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div
              className={`p-3 rounded-2xl border ${
                isDemo
                  ? 'bg-arcade-neonCyan/10 border-arcade-neonCyan text-arcade-neonCyan'
                  : 'bg-arcade-electricPurple/10 border-arcade-electricPurple text-arcade-electricPurple'
              }`}
            >
              {isDemo ? <Sparkles className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isDemo ? 'INSTANT DEMO ARENA' : 'CONNECT REAL GMAIL'}
              </h3>
              <p className="text-xs font-mono text-arcade-neonCyan">
                {isDemo ? '50 Sample Unread Enemies' : 'Official Google OAuth 2.0 & Gmail API'}
              </p>
            </div>
          </div>

          {/* Connect Gmail Content */}
          {!isDemo && (
            <div className="space-y-5 text-sm text-gray-300">
              <div className="space-y-2.5">
                <p className="leading-relaxed">
                  Connect your Google account to fight your real inbox. Every archived enemy email removes the <code className="text-arcade-neonCyan bg-white/5 px-1.5 py-0.5 rounded font-mono">INBOX</code> label in Gmail.
                </p>

                {/* Security Guarantees */}
                <div className="bg-arcade-dark/90 rounded-2xl p-4 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center space-x-2 text-arcade-neonGreen">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Zero Deletion Guarantee: Permanent deletion is disabled</span>
                  </div>
                  <div className="flex items-center space-x-2 text-arcade-neonCyan">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Minimal Scope: Only requests gmail.modify to archive</span>
                  </div>
                  <div className="flex items-center space-x-2 text-arcade-neonYellow">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Tokens Protected: Stored securely in backend memory only</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 text-red-400 text-xs font-mono flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Google Cloud Console Setup Guide (Displayed if credentials are not yet added to .env) */}
              {showConfigGuide && (
                <div className="bg-arcade-card/90 rounded-2xl p-4 border border-arcade-neonYellow/40 space-y-3 text-xs">
                  <div className="flex items-center space-x-2 text-arcade-neonYellow font-bold uppercase tracking-wider font-mono">
                    <Terminal className="w-4 h-4" />
                    <span>Google Cloud Console Configuration Required</span>
                  </div>
                  <p className="text-gray-300">
                    To connect your real Gmail, configure your OAuth credentials in <code className="text-arcade-neonCyan font-mono">server/.env</code>:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-gray-400 font-mono text-[11px]">
                    <li>Go to <strong className="text-white">Google Cloud Console &gt; APIs &amp; Services &gt; Credentials</strong></li>
                    <li>Create an <strong className="text-white">OAuth 2.0 Client ID</strong> (Web Application)</li>
                    <li>
                      Add Authorized Redirect URI:
                      <div className="bg-arcade-dark p-1.5 rounded mt-1 border border-white/10 text-arcade-neonCyan select-all break-all">
                        http://localhost:5000/api/auth/google/callback
                      </div>
                    </li>
                    <li>
                      Enable the <strong className="text-white">Gmail API</strong> under Library
                    </li>
                    <li>
                      Set in <code className="text-white">server/.env</code>:
                      <pre className="bg-arcade-dark p-2 rounded mt-1 border border-white/10 text-gray-300">
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
                      </pre>
                    </li>
                  </ol>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartOAuth}
                  disabled={connecting}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-arcade-electricPurple via-blue-600 to-arcade-neonCyan text-white font-black hover:opacity-90 transition text-sm flex items-center justify-center space-x-2 shadow-lg glow-purple disabled:opacity-50"
                >
                  <Shield className="w-4 h-4 text-arcade-neonCyan" />
                  <span>{connecting ? 'INITIALIZING OAUTH...' : 'CONTINUE WITH GOOGLE'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleStartDemo}
                  className="py-3.5 px-4 rounded-xl glass-card border border-white/20 text-gray-300 hover:text-white font-mono text-xs transition"
                >
                  Play Demo Mode Instead
                </button>
              </div>
            </div>
          )}

          {/* Demo Mode Content */}
          {isDemo && (
            <div className="space-y-5 text-sm text-gray-300">
              <p className="leading-relaxed">
                Experience full INBOX RAID combat instantly! Demo Mode seeds your session with <span className="text-arcade-neonCyan font-bold">50 high-priority promotional, newsletter, spam, and VIP email enemies</span> without requiring Google credentials.
              </p>

              <div className="bg-arcade-dark/80 rounded-2xl p-4 border border-white/10 space-y-2 font-mono text-xs text-gray-400">
                <div className="flex items-center space-x-2 text-arcade-neonCyan">
                  <Sparkles className="w-4 h-4" />
                  <span>No login required &bull; 100% Safe Demo Wave</span>
                </div>
                <p>You can switch to Live Gmail mode at any time from the top navigation bar.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleStartDemo}
                  className="flex-1 bg-gradient-to-r from-arcade-neonCyan to-arcade-electricPurple text-black font-black py-3.5 px-4 rounded-xl hover:opacity-90 transition text-center shadow-lg text-sm"
                >
                  LAUNCH DEMO RAID WAVE
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
