import React from 'react';
import { RuneType } from '../types/runequest';

interface RuneBadgeProps {
  rune: RuneType | string;
  value?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const RUNE_COLORS: { [key: string]: { bg: string; text: string; border: string; glow: string; glyph: string } } = {
  // Elements
  'Air': { bg: 'bg-amber-950/40', text: 'text-amber-300', border: 'border-amber-500/50', glow: 'shadow-amber-500/20', glyph: '🌪️' },
  'Terre': { bg: 'bg-emerald-950/40', text: 'text-emerald-300', border: 'border-emerald-500/50', glow: 'shadow-emerald-500/20', glyph: '⛰️' },
  'Feu': { bg: 'bg-orange-950/40', text: 'text-orange-300', border: 'border-orange-500/50', glow: 'shadow-orange-500/20', glyph: '🔥' },
  'Eau': { bg: 'bg-cyan-950/40', text: 'text-cyan-300', border: 'border-cyan-500/50', glow: 'shadow-cyan-500/20', glyph: '🌊' },
  'Ténèbres': { bg: 'bg-zinc-950/70', text: 'text-zinc-300', border: 'border-zinc-500/50', glow: 'shadow-zinc-500/20', glyph: '🌑' },
  'Lune': { bg: 'bg-rose-950/50', text: 'text-rose-300', border: 'border-rose-500/50', glow: 'shadow-rose-500/20', glyph: '🌙' },

  // Powers
  'Mort': { bg: 'bg-neutral-900/80', text: 'text-red-400', border: 'border-red-600/50', glow: 'shadow-red-500/20', glyph: '⚔️' },
  'Fertilité': { bg: 'bg-green-950/50', text: 'text-green-300', border: 'border-green-500/50', glow: 'shadow-green-500/20', glyph: '🌱' },
  'Harmonie': { bg: 'bg-teal-950/50', text: 'text-teal-300', border: 'border-teal-500/50', glow: 'shadow-teal-500/20', glyph: '🕊️' },
  'Désaccord': { bg: 'bg-red-950/50', text: 'text-red-300', border: 'border-red-500/50', glow: 'shadow-red-500/20', glyph: '⚡' },
  'Vérité': { bg: 'bg-blue-950/50', text: 'text-blue-300', border: 'border-blue-500/50', glow: 'shadow-blue-500/20', glyph: '📜' },
  'Illusion': { bg: 'bg-purple-950/50', text: 'text-purple-300', border: 'border-purple-500/50', glow: 'shadow-purple-500/20', glyph: '🔮' },
  'Stase': { bg: 'bg-stone-900/60', text: 'text-stone-300', border: 'border-stone-500/50', glow: 'shadow-stone-500/20', glyph: '🧊' },
  'Mouvement': { bg: 'bg-yellow-950/50', text: 'text-yellow-300', border: 'border-yellow-500/50', glow: 'shadow-yellow-500/20', glyph: '🌀' },
  'Homme': { bg: 'bg-indigo-950/50', text: 'text-indigo-300', border: 'border-indigo-500/50', glow: 'shadow-indigo-500/20', glyph: '👤' },
  'Bête': { bg: 'bg-yellow-950/60', text: 'text-amber-400', border: 'border-amber-600/50', glow: 'shadow-amber-600/20', glyph: '🐂' },
  'Esprit': { bg: 'bg-sky-950/50', text: 'text-sky-300', border: 'border-sky-500/50', glow: 'shadow-sky-500/20', glyph: '✨' },
  'Magie': { bg: 'bg-violet-950/50', text: 'text-violet-300', border: 'border-violet-500/50', glow: 'shadow-violet-500/20', glyph: '🌟' },
  'Maîtrise': { bg: 'bg-yellow-950/70', text: 'text-amber-200', border: 'border-amber-400/60', glow: 'shadow-amber-400/30', glyph: '👑' },
};

export const RuneBadge: React.FC<RuneBadgeProps> = ({
  rune,
  value,
  size = 'md',
  showLabel = true,
  className = '',
  onClick,
  selected = false,
}) => {
  const config = RUNE_COLORS[rune] || {
    bg: 'bg-stone-800',
    text: 'text-stone-300',
    border: 'border-stone-600',
    glow: 'shadow-stone-500/10',
    glyph: '✦',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center rounded-md border font-serif transition-all duration-200 ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${
        selected ? 'ring-2 ring-amber-400 shadow-md ' + config.glow : ''
      } ${onClick ? 'cursor-pointer hover:scale-105 hover:border-amber-400' : ''} ${className}`}
    >
      <span className="select-none text-base">{config.glyph}</span>
      {showLabel && <span className="font-semibold tracking-wide">{rune}</span>}
      {value !== undefined && (
        <span className="ml-1 rounded bg-black/40 px-1.5 py-0.2 text-xs font-mono font-bold text-amber-200 border border-amber-500/30">
          {value}%
        </span>
      )}
    </div>
  );
};
