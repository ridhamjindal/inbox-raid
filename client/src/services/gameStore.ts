import { create } from 'zustand';

interface GameState {
  score: number;
  xp: number;
  combo: number;
  level: number;
  health: number;
  isRunning: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  gameState: 'menu' | 'playing' | 'paused' | 'boss' | 'victory' | 'gameover';

  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (victory: boolean) => void;
  addScore: (points: number, comboIncrement: boolean) => void;
  resetCombo: () => void;
  loseHealth: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  xp: 0,
  combo: 0,
  level: 1,
  health: 3,
  isRunning: false,
  isPaused: false,
  isGameOver: false,
  gameState: 'menu',

  startGame: () => set({
    score: 0, xp: 0, combo: 0, health: 3,
    isRunning: true, gameState: 'playing', isGameOver: false
  }),

  pauseGame: () => set({ isPaused: true, isRunning: false }),

  resumeGame: () => set({ isPaused: false, isRunning: true }),

  endGame: (victory: boolean) => set({
    isRunning: false, gameState: victory ? 'victory' : 'gameover', isGameOver: true
  }),

  addScore: (points: number, comboIncrement: boolean) => set((state: GameState) => ({
    score: state.score + (points * (state.combo > 10 ? 3 : state.combo > 5 ? 2 : 1)),
    xp: state.xp + points,
    combo: comboIncrement ? state.combo + 1 : state.combo
  })),

  resetCombo: () => set({ combo: 0 }),

  loseHealth: () => set((state: GameState) => ({
    health: Math.max(0, state.health - 1),
    gameState: state.health <= 1 ? 'gameover' : state.gameState
  })),
}));
