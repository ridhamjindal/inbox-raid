import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../services/gameStore';
import { EmailCard } from './EmailCard';
import { MockEmailService } from '../../services/mockEmailService';
import { DemoEmail } from '../../types/index';
import { Trophy, Flame, Shield, ArrowLeft, Zap, Pause, Play, RotateCcw, Skull, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../services/authStore';
import { fetchEmails, archiveEmailsBatch } from '../../services/api';

const BOSS_EMAIL = {
  id: 'boss_msg',
  sender: 'THE UNREAD OVERLORD',
  subject: '⚠️ INBOX OVERFLOW CRITICAL WARNING (10,000 UNREAD MESSAGES)',
  snippet: 'I am the aggregation of all newsletters, marketing spams, and unread threads you ignored since 2020. DEFEAT ME OR SUCCUMB TO EMAIL PROCRASTINATION!',
  category: 'BOSS' as const,
  enemyType: 'Boss' as const,
  hp: 10,
  maxHp: 10,
  points: 1000,
  date: 'NOW'
};

interface ArenaProps {
  onExit?: () => void;
}

export const Arena: React.FC<ArenaProps> = ({ onExit }) => {
  const { score, combo, health, addScore, resetCombo, loseHealth } = useGameStore();
  const { isAuthenticated, isDemoMode, setDemoMode, setLastArchived, lastArchived, undoLastArchive } = useAuthStore();

  const [emails, setEmails] = useState<DemoEmail[]>([]);
  const [currentBoss, setCurrentBoss] = useState<any | null>(null);
  const [bossHp, setBossHp] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(60);
  const [scanPulseActive, setScanPulseActive] = useState(false);
  const [doubleXpActive, setDoubleXpActive] = useState(false);
  const [inGameNotice, setInGameNotice] = useState<string | null>(null);

  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [initialWaveCount, setInitialWaveCount] = useState<number | null>(null);

  const isLiveGmail = !isDemoMode && isAuthenticated;

  // Load emails on mount or mode change
  useEffect(() => {
    loadRaidEmails();
  }, [isDemoMode, isAuthenticated]);

  const loadRaidEmails = async () => {
    setCurrentBoss(null);
    setBossHp(10);
    setTimer(60);
    setFetchError(null);
    setIsLoadingEmails(true);

    if (isLiveGmail) {
      try {
        const res = await fetchEmails(false, undefined, 8);
        if (res.success && Array.isArray(res.emails)) {
          setEmails(res.emails);
          setInitialWaveCount(res.emails.length);
        } else {
          setFetchError(res.error || 'Failed to retrieve emails from your Gmail inbox.');
          setEmails([]);
          setInitialWaveCount(0);
        }
      } catch (err: any) {
        console.error('Failed to fetch live Gmail emails:', err);
        setFetchError(err.message || 'Network error fetching Gmail messages.');
        setEmails([]);
        setInitialWaveCount(0);
      } finally {
        setIsLoadingEmails(false);
      }
      return;
    }

    // Demo Mode: Default to high-fidelity demo wave
    const batch = MockEmailService.getRandomRaidEmails(8);
    setEmails(batch);
    setInitialWaveCount(batch.length);
    setIsLoadingEmails(false);
  };

  // Game timer tick
  useEffect(() => {
    if (isPaused || (emails.length === 0 && !currentBoss)) return;
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, emails.length, currentBoss]);

  // Trigger Boss Battle when initial wave of emails is cleared
  useEffect(() => {
    if (initialWaveCount !== null && initialWaveCount > 0 && emails.length === 0 && !currentBoss && bossHp > 0) {
      setCurrentBoss(BOSS_EMAIL);
    }
  }, [emails.length, currentBoss, bossHp, initialWaveCount]);

  // Keyboard Navigation Controls (Left = Archive, Right = Keep)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (e.key === 'ArrowLeft') {
        if (currentBoss) handleBossAttack();
        else if (emails.length > 0) handleAction('archive', emails[0]);
      } else if (e.key === 'ArrowRight') {
        if (currentBoss) handleBossKeep();
        else if (emails.length > 0) handleAction('keep', emails[0]);
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        // Ctrl+Z or Cmd+Z for Quick Undo
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emails, currentBoss, isPaused, lastArchived]);

  const handleAction = async (action: 'archive' | 'keep', email: DemoEmail) => {
    const isProtected = email.category === 'IMPORTANT';

    if (action === 'archive') {
      if (isProtected) {
        // Penalty for attempting to archive protected VIP email (Safety Rule #3)
        resetCombo();
        loseHealth();
        flashNotice('⚠️ BLOCKED! DO NOT ARCHIVE PROTECTED VIP EMAILS!');
      } else {
        // Real or demo archive
        if (isLiveGmail) {
          archiveEmailsBatch([email.id], false).catch((err) =>
            console.error('Failed to sync archive with Gmail:', err)
          );
        } else {
          MockEmailService.archiveEmails([email.id]);
        }

        // Save last archived for Undo support
        setLastArchived({
          id: email.id,
          subject: email.subject,
          isDemo: !isLiveGmail,
          timestamp: Date.now()
        });

        const pts = (doubleXpActive ? 40 : 20) + email.points;
        addScore(pts, true);
        flashNotice(`🎯 ARCHIVED: "${email.subject.slice(0, 24)}..." (+${pts} PTS)`);
      }
    } else {
      // Keep action
      if (isProtected) {
        // Correct action to preserve important email
        addScore(10, true);
        flashNotice('🛡️ VIP EMAIL PRESERVED IN INBOX (+10 PTS)');
      } else {
        // Kept a promotional/spam email (missed archive)
        resetCombo();
        flashNotice('💨 ENEMY KEPT (COMBO RESET)');
      }
    }

    setEmails((prev) => prev.slice(1));
  };

  const handleUndo = async () => {
    if (lastArchived) {
      await undoLastArchive();
      flashNotice('🔄 LAST ACTION UNDONE: EMAIL RESTORED TO INBOX!');
    }
  };

  const flashNotice = (msg: string) => {
    setInGameNotice(msg);
    setTimeout(() => setInGameNotice(null), 3000);
  };

  const handleBossAttack = () => {
    if (bossHp > 1) {
      setBossHp((hp) => hp - 1);
      addScore(50, true);
      flashNotice('💥 DIRECT HIT ON UNREAD OVERLORD! (-1 HP)');
    } else {
      setBossHp(0);
      addScore(1000, true);
      setCurrentBoss(null);
      flashNotice('🏆 UNREAD OVERLORD DESTROYED! (+1000 PTS)');
    }
  };

  const handleBossKeep = () => {
    resetCombo();
    loseHealth();
    flashNotice('⚠️ DAMAGE TAKEN! UNREAD OVERLORD SPREADS PROCRASTINATION!');
  };

  const handlePowerupScan = () => {
    setScanPulseActive(true);
    flashNotice('⚡ SCAN PULSE: ENEMY WEAKNESSES REVEALED!');
    setTimeout(() => setScanPulseActive(false), 5000);
  };

  const handlePowerupFreeze = () => {
    setTimer((t) => t + 15);
    flashNotice('🛡️ TIME FREEZE ACTIVATED (+15 SECONDS)');
  };

  const handlePowerupBoost = () => {
    setDoubleXpActive(true);
    flashNotice('🔥 COMBO BOOST: 2X XP MULTIPLIER ACTIVATED!');
    setTimeout(() => setDoubleXpActive(false), 8000);
  };

  return (
    <div className="fixed inset-0 bg-arcade-dark flex flex-col p-4 sm:p-6 select-none z-50 overflow-y-auto overflow-x-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-arcade-electricPurple/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Top HUD */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between glass-card p-4 rounded-2xl border border-white/10 glow-cyan relative z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-black text-white font-mono uppercase tracking-wider">CYBER ARENA</h2>
            <div className="flex items-center space-x-1.5">
              {isLiveGmail ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-arcade-neonGreen animate-pulse" />
                  <span className="text-[10px] text-arcade-neonGreen font-mono font-bold tracking-tight">
                    LIVE GMAIL COMBAT
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-arcade-neonCyan" />
                  <span className="text-[10px] text-arcade-neonCyan font-mono">
                    NON-DESTRUCTIVE COMBAT (DEMO STATE)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* HUD Center Stats */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-sm font-mono">
          <div className="text-center">
            <span className="block text-[10px] text-gray-400">SCORE</span>
            <span className="text-lg font-black text-arcade-neonCyan">{score}</span>
          </div>

          <div className="text-center">
            <span className="block text-[10px] text-gray-400">COMBO</span>
            <span className="text-lg font-black text-arcade-neonPink">{combo}x</span>
          </div>

          <div className="text-center">
            <span className="block text-[10px] text-gray-400">TIMER</span>
            <span
              className={`text-lg font-black ${
                timer < 10 ? 'text-arcade-neonPink animate-ping' : 'text-arcade-neonGreen'
              }`}
            >
              {timer}s
            </span>
          </div>

          <div className="text-center hidden sm:block">
            <span className="block text-[10px] text-gray-400">HP</span>
            <div className="flex space-x-1 text-arcade-neonPink text-base">
              {Array.from({ length: Math.max(0, health) }).map((_, i) => (
                <span key={i}>❤️</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Controls: In-Game Undo & Pause */}
        <div className="flex items-center space-x-2">
          {lastArchived && (
            <button
              onClick={handleUndo}
              title="Undo last archive (Ctrl+Z)"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-arcade-neonYellow/20 text-arcade-neonYellow border border-arcade-neonYellow/50 hover:bg-arcade-neonYellow/30 transition text-xs font-mono font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">UNDO</span>
            </button>
          )}

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2.5 rounded-xl glass-card text-arcade-neonCyan border border-arcade-neonCyan/40 hover:bg-arcade-neonCyan/10 transition"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Tactical In-Game Action Feedback */}
      {inGameNotice && (
        <div className="w-full max-w-xl mx-auto my-2 text-center relative z-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-arcade-card/90 border border-arcade-neonCyan text-arcade-neonCyan font-mono text-xs shadow-lg animate-bounce">
            {inGameNotice}
          </div>
        </div>
      )}

      {/* Main Playing Area */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center relative my-4">
        {isLoadingEmails ? (
          /* Loading State */
          <div className="w-full max-w-md glass-card border border-arcade-neonCyan/40 p-8 sm:p-12 rounded-3xl text-center glow-cyan space-y-4">
            <RefreshCw className="w-12 h-12 text-arcade-neonCyan mx-auto animate-spin" />
            <h3 className="text-xl font-black text-white uppercase tracking-wider">
              INTERCEPTING LIVE GMAIL FREQUENCIES...
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Fetching real unread messages from your authenticated inbox via official Gmail API.
            </p>
          </div>
        ) : fetchError ? (
          /* Error State */
          <div className="w-full max-w-md glass-card border border-arcade-neonPink/60 p-8 sm:p-10 rounded-3xl text-center glow-pink space-y-5">
            <div className="p-4 rounded-full bg-arcade-neonPink/20 border border-arcade-neonPink inline-block">
              <Skull className="w-10 h-10 text-arcade-neonPink" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">GMAIL SIGNAL LOST</h3>
              <p className="text-xs text-arcade-neonPink font-mono mt-1">{fetchError}</p>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Unable to reach your live Gmail inbox. You can retry the connection or switch to Demo Mode.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={loadRaidEmails}
                className="flex-1 py-3 rounded-xl bg-arcade-neonCyan/20 text-arcade-neonCyan border border-arcade-neonCyan/50 font-bold font-mono text-xs hover:bg-arcade-neonCyan/30 transition flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>RETRY GMAIL SCAN</span>
              </button>
              <button
                onClick={() => setDemoMode(true)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-bold font-mono text-xs hover:bg-white/20 transition"
              >
                SWITCH TO DEMO
              </button>
            </div>
          </div>
        ) : currentBoss ? (
          /* Boss Battle UI */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md glass-card border-2 border-arcade-neonPink rounded-3xl p-8 text-center space-y-6 glow-pink relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-arcade-neonPink text-black font-black text-xs uppercase tracking-widest rounded-bl-xl">
              BOSS BATTLE
            </div>

            <div className="p-4 rounded-full bg-arcade-neonPink/20 border border-arcade-neonPink inline-block animate-pulse">
              <Skull className="w-12 h-12 text-arcade-neonPink" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">{currentBoss.sender}</h3>
              <p className="text-xs font-mono text-arcade-neonPink mt-1">{currentBoss.subject}</p>
            </div>

            <p className="text-xs text-gray-300 font-mono leading-relaxed bg-arcade-dark/80 p-3 rounded-xl border border-white/10">
              "{currentBoss.snippet}"
            </p>

            {/* Boss HP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-arcade-neonPink">
                <span>BOSS HEALTH</span>
                <span>{bossHp} / 10 HP</span>
              </div>
              <div className="h-4 w-full bg-arcade-dark rounded-full overflow-hidden border border-arcade-neonPink/50 p-[2px]">
                <div
                  className="h-full bg-gradient-to-r from-arcade-neonPink to-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${(bossHp / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Boss Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBossKeep}
                className="flex-1 py-3.5 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition text-sm"
              >
                SPARE (KEEP)
              </button>
              <button
                onClick={handleBossAttack}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-arcade-neonPink to-red-600 text-white font-black hover:opacity-90 transition shadow-lg text-sm glow-pink"
              >
                ATTACK (-1 HP)
              </button>
            </div>
          </motion.div>
        ) : emails.length > 0 ? (
          /* Normal Email Card Stack */
          <div className="relative w-full max-w-sm min-h-[420px] flex items-center justify-center">
            <AnimatePresence>
              <EmailCard
                key={emails[0].id}
                email={emails[0]}
                onAction={(a) => handleAction(a, emails[0])}
              />
            </AnimatePresence>
          </div>
        ) : initialWaveCount === 0 && isLiveGmail ? (
          /* Real Inbox Zero State (No emails in inbox from the beginning!) */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card border border-arcade-neonGreen p-8 sm:p-12 rounded-3xl text-center glow-green space-y-6 max-w-md"
          >
            <div className="p-4 rounded-full bg-arcade-neonGreen/20 border border-arcade-neonGreen inline-block">
              <CheckCircle2 className="w-12 h-12 text-arcade-neonGreen" />
            </div>
            <h3 className="text-3xl font-black text-arcade-neonGreen">INBOX ZERO ACHIEVED!</h3>
            <p className="text-gray-300 text-sm leading-relaxed font-mono">
              Your real Gmail inbox has 0 unread enemy messages to raid right now. You are totally caught up!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={loadRaidEmails}
                className="flex-1 py-3 rounded-xl bg-arcade-card border border-arcade-neonGreen/40 text-arcade-neonGreen font-bold hover:bg-arcade-neonGreen/10 transition text-xs flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>CHECK FOR NEW EMAILS</span>
              </button>
              <button
                onClick={() => setDemoMode(true)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-arcade-electricPurple to-arcade-neonCyan text-black font-black hover:opacity-90 transition text-xs"
              >
                PLAY DEMO RAID
              </button>
            </div>
          </motion.div>
        ) : (
          /* Victory / Clearance Screen */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card border border-arcade-neonGreen p-8 sm:p-12 rounded-3xl text-center glow-green space-y-6 max-w-md"
          >
            <div className="p-4 rounded-full bg-arcade-neonGreen/20 border border-arcade-neonGreen inline-block">
              <Trophy className="w-12 h-12 text-arcade-neonGreen" />
            </div>
            <h3 className="text-3xl font-black text-arcade-neonGreen">INVASION CLEARED!</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {isLiveGmail
                ? 'You cleared incoming emails from your Gmail inbox and defeated the Unread Overlord!'
                : 'You defeated all incoming email enemies and the Unread Overlord!'}
              <span className="block mt-1 text-arcade-neonCyan font-bold">Total score: {score} PTS</span>
            </p>
            <div className="flex gap-4">
              <button
                onClick={loadRaidEmails}
                className="flex-1 py-3 rounded-xl bg-arcade-card border border-white/20 text-white font-bold hover:bg-white/10 transition text-xs flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>NEXT RAID WAVE</span>
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-arcade-electricPurple to-arcade-neonCyan text-black font-black hover:opacity-90 transition text-xs"
              >
                RETURN TO DASHBOARD
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Powerups Bar */}
      <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 justify-center items-center relative z-10 shrink-0 pb-2">
        <button
          onClick={handlePowerupScan}
          className={`flex-1 w-full py-3 px-4 rounded-xl glass-card border text-xs font-bold transition flex items-center justify-center space-x-2 ${
            scanPulseActive
              ? 'border-arcade-neonCyan bg-arcade-neonCyan/20 text-arcade-neonCyan'
              : 'border-white/10 text-gray-300 hover:border-arcade-neonCyan'
          }`}
        >
          <Zap className="w-4 h-4 text-arcade-neonCyan" />
          <span>SCAN PULSE (HIGHLIGHT)</span>
        </button>

        <button
          onClick={handlePowerupFreeze}
          className="flex-1 w-full py-3 px-4 rounded-xl glass-card border border-white/10 text-gray-300 hover:border-arcade-neonGreen text-xs font-bold transition flex items-center justify-center space-x-2"
        >
          <Shield className="w-4 h-4 text-arcade-neonGreen" />
          <span>TIME FREEZE (+15S)</span>
        </button>

        <button
          onClick={handlePowerupBoost}
          className={`flex-1 w-full py-3 px-4 rounded-xl glass-card border text-xs font-bold transition flex items-center justify-center space-x-2 ${
            doubleXpActive
              ? 'border-arcade-neonPink bg-arcade-neonPink/20 text-arcade-neonPink'
              : 'border-white/10 text-gray-300 hover:border-arcade-neonPink'
          }`}
        >
          <Flame className="w-4 h-4 text-arcade-neonPink" />
          <span>COMBO BOOST (2X XP)</span>
        </button>
      </div>
    </div>
  );
};
