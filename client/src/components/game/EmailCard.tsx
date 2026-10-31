import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Shield, Trash2, ChevronRight, AlertTriangle, Calendar } from 'lucide-react';
import { DemoEmail } from '../../types/index';

interface CardProps {
  email: DemoEmail;
  onAction: (action: 'archive' | 'keep') => void;
}

export const EmailCard: React.FC<CardProps> = ({ email, onAction }) => {
  const isProtected = email.category === 'IMPORTANT';

  const getCategoryBadgeStyle = () => {
    switch (email.category) {
      case 'PROMOTIONAL':
        return 'border-arcade-neonCyan/40 bg-arcade-neonCyan/10 text-arcade-neonCyan';
      case 'SPAM':
        return 'border-arcade-neonPink/40 bg-arcade-neonPink/10 text-arcade-neonPink';
      case 'NEWSLETTER':
        return 'border-arcade-electricPurple/40 bg-arcade-electricPurple/10 text-arcade-electricPurple';
      case 'IMPORTANT':
        return 'border-arcade-neonYellow/60 bg-arcade-neonYellow/20 text-arcade-neonYellow';
      case 'OLD_UNREAD':
        return 'border-blue-500/40 bg-blue-500/10 text-blue-400';
      default:
        return 'border-gray-700 bg-gray-800 text-gray-300';
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_: any, info: PanInfo) => {
        if (info.offset.x > 90) onAction('keep');
        else if (info.offset.x < -90) onAction('archive');
      }}
      style={{ touchAction: 'pan-y' }}
      className={`w-80 sm:w-88 min-h-[420px] glass-card rounded-3xl p-6 cursor-grab active:cursor-grabbing shadow-2xl flex flex-col justify-between border-2 transition-all ${
        isProtected
          ? 'border-arcade-neonYellow/80 glow-purple bg-arcade-dark/95'
          : 'border-arcade-neonCyan/40 glow-cyan bg-arcade-dark/90'
      }`}
    >
      <div>
        {/* Category & Status Header */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md border ${getCategoryBadgeStyle()}`}>
              {email.category}
            </span>

            {email.unread ? (
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-arcade-neonPink/20 text-arcade-neonPink border border-arcade-neonPink/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-arcade-neonPink animate-ping" />
                UNREAD
              </span>
            ) : (
              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                READ
              </span>
            )}

            {isProtected && (
              <div className="flex items-center space-x-1 text-arcade-neonYellow text-[9px] font-mono font-bold bg-arcade-neonYellow/20 px-2 py-0.5 rounded border border-arcade-neonYellow/40">
                <AlertTriangle className="w-3 h-3" />
                <span>PROTECTED VIP</span>
              </div>
            )}
          </div>

          <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 shrink-0 mt-0.5">
            <Calendar className="w-3 h-3 text-arcade-neonCyan" />
            {new Date(email.date).toLocaleDateString()}
          </span>
        </div>

        {/* Sender Info */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-white line-clamp-1">{email.sender}</h3>
          <p className="text-[10px] font-mono text-gray-400 truncate">&lt;{email.senderEmail}&gt;</p>
        </div>

        {/* Subject */}
        <h4 className="text-sm font-bold text-arcade-neonCyan mb-3 line-clamp-2">
          {email.subject}
        </h4>

        {/* Snippet Preview */}
        <div className="bg-arcade-dark/80 rounded-xl p-3 border border-white/5 text-xs text-gray-300 font-mono leading-relaxed line-clamp-4">
          "{email.snippet}"
        </div>
      </div>

      {/* Footer / Instructions & Actions */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        {isProtected && (
          <p className="text-[10px] text-arcade-neonYellow font-mono text-center font-bold">
            ⚠️ DO NOT ARCHIVE! KEEP THIS VIP EMAIL!
          </p>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={() => onAction('archive')}
            className="flex-1 py-2.5 rounded-xl bg-arcade-neonPink/20 text-arcade-neonPink border border-arcade-neonPink/40 hover:bg-arcade-neonPink/30 font-mono text-xs font-bold transition flex items-center justify-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>ARCHIVE (←)</span>
          </button>

          <button
            onClick={() => onAction('keep')}
            className="flex-1 py-2.5 rounded-xl bg-arcade-neonGreen/20 text-arcade-neonGreen border border-arcade-neonGreen/40 hover:bg-arcade-neonGreen/30 font-mono text-xs font-bold transition flex items-center justify-center space-x-1.5"
          >
            <ChevronRight className="w-4 h-4" />
            <span>KEEP (→)</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
