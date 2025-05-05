export type CellState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

export interface GameCell {
  letter: string;
  state: CellState;
}

export interface GameRow {
  cells: GameCell[];
  submitted: boolean;
}

export interface GameState {
  solution: string;
  rows: GameRow[];
  currentRowIndex: number;
  gameStatus: 'playing' | 'won' | 'lost';
  keyboardStatus: Record<string, CellState>;
  date: string;
  startTime?: number;
  endTime?: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastPlayed: string;
}

export interface LeaderboardEntry {
  name: string;
  guesses: number;
  time: number; // in seconds
  date: string;
}