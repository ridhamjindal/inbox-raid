import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesSection } from './components/FeaturesSection';
import { GamePreview } from './components/GamePreview';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { ActionModal } from './components/ActionModal';
import { Dashboard } from './components/dashboard/Dashboard';
import { Arena } from './components/game/Arena';
import { useAuthStore } from './services/authStore';
import { RotateCcw, X, Shield, Zap } from 'lucide-react';

const LandingPage: React.FC<{ onOpenModal: (type: 'connect' | 'demo') => void }> = ({ onOpenModal }) => (
  <>
    <Navbar onOpenModal={onOpenModal} />
    <main>
      <Hero onOpenModal={onOpenModal} />
      <HowItWorks />
      <GamePreview />
      <FeaturesSection />
      <CtaSection onOpenModal={onOpenModal} />
    </main>
    <Footer />
  </>
);

export function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'arena'>('landing');
  const [modalType, setModalType] = useState<'connect' | 'demo' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isAuthenticated,
    isDemoMode,
    initAuth,
    notification,
    clearNotification,
    lastArchived,
    undoLastArchive
  } = useAuthStore();

  useEffect(() => {
    initAuth().then(() => {
      // If user arrived back from a successful OAuth login, land them right on the Dashboard
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('auth') === 'success') {
        setView('dashboard');
      }
    });
  }, [initAuth]);

  const handleOpenModal = (type: 'connect' | 'demo') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setView('dashboard');
      setModalType(null);
    }, 300);
  };

  const renderView = () => {
    switch (view) {
      case 'landing': return <LandingPage onOpenModal={handleOpenModal} />;
      case 'dashboard': return <Dashboard onEnterArena={() => setView('arena')} onOpenModal={handleOpenModal} />;
      case 'arena': return <Arena onExit={() => setView('dashboard')} />;
      default: return <LandingPage onOpenModal={handleOpenModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-arcade-dark text-white selection:bg-arcade-neonCyan selection:text-black">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Global Mode & Undo Toast Notification */}
      {(notification || lastArchived) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5">
          <div className="glass-card border border-arcade-neonCyan/50 rounded-2xl p-4 shadow-2xl glow-cyan flex items-center justify-between gap-3 bg-arcade-card/95">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2 rounded-xl bg-arcade-neonCyan/10 text-arcade-neonCyan border border-arcade-neonCyan/30 shrink-0">
                {lastArchived ? <RotateCcw className="w-4 h-4 animate-spin-slow" /> : !isDemoMode ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                {lastArchived ? (
                  <>
                    <p className="text-xs font-bold text-white truncate">
                      Archived: <span className="text-arcade-neonCyan">"{lastArchived.subject}"</span>
                    </p>
                    <p className="text-[10px] font-mono text-gray-400">
                      {lastArchived.isDemo ? 'Local Demo' : 'Real Gmail Inbox'} (Zero deletion policy)
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-mono text-white leading-tight">
                    {notification}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {lastArchived && (
                <button
                  onClick={undoLastArchive}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-arcade-electricPurple to-arcade-neonCyan text-black font-black text-xs hover:opacity-90 transition flex items-center space-x-1 shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>UNDO</span>
                </button>
              )}
              <button
                onClick={clearNotification}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {renderView()}
      </div>

      <ActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={modalType}
      />
    </div>
  );
}

export default App;
