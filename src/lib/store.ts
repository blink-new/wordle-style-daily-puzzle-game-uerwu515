import { create } from 'zustand';
import { GameState, GameStats, LeaderboardEntry, CellState } from './types';
import { getWordOfTheDay, evaluateGuess } from './words';

// Initialize a new game
const createNewGame = (): GameState => {
  const solution = getWordOfTheDay();
  const today = new Date().toISOString().split('T')[0];
  
  return {
    solution,
    rows: Array(6).fill(null).map(() => ({
      cells: Array(5).fill(null).map(() => ({ letter: '', state: 'empty' })),
      submitted: false
    })),
    currentRowIndex: 0,
    gameStatus: 'playing',
    keyboardStatus: {},
    date: today,
    startTime: Date.now()
  };
};

// Initialize empty stats
const createEmptyStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  lastPlayed: ''
});

// Game store
export const useGameStore = create<{
  game: GameState;
  stats: GameStats;
  leaderboard: LeaderboardEntry[];
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  resetGame: () => void;
  addToLeaderboard: (name: string) => void;
}>((set, get) => ({
  game: createNewGame(),
  stats: createEmptyStats(),
  leaderboard: [],
  
  addLetter: (letter: string) => {
    const { game } = get();
    
    if (game.gameStatus !== 'playing') return;
    if (game.currentRowIndex >= 6) return;
    
    const currentRow = game.rows[game.currentRowIndex];
    const emptyIndex = currentRow.cells.findIndex(cell => cell.letter === '');
    
    if (emptyIndex === -1) return; // Row is full
    
    set(state => {
      const newRows = [...state.game.rows];
      newRows[state.game.currentRowIndex].cells[emptyIndex] = {
        letter: letter.toUpperCase(),
        state: 'tbd'
      };
      
      return {
        game: {
          ...state.game,
          rows: newRows
        }
      };
    });
  },
  
  removeLetter: () => {
    const { game } = get();
    
    if (game.gameStatus !== 'playing') return;
    if (game.currentRowIndex >= 6) return;
    
    const currentRow = game.rows[game.currentRowIndex];
    // Find the last filled cell (from right to left)
    let lastFilledIndex = -1;
    for (let i = 4; i >= 0; i--) {
      if (currentRow.cells[i].letter !== '') {
        lastFilledIndex = i;
        break;
      }
    }
    
    if (lastFilledIndex === -1) return; // Row is empty
    
    set(state => {
      const newRows = [...state.game.rows];
      newRows[state.game.currentRowIndex].cells[lastFilledIndex] = {
        letter: '',
        state: 'empty'
      };
      
      return {
        game: {
          ...state.game,
          rows: newRows
        }
      };
    });
  },
  
  submitGuess: () => {
    const { game, stats } = get();
    
    if (game.gameStatus !== 'playing') return;
    if (game.currentRowIndex >= 6) return;
    
    const currentRow = game.rows[game.currentRowIndex];
    
    // Check if the row is complete
    const isRowComplete = currentRow.cells.every(cell => cell.letter !== '');
    if (!isRowComplete) return;
    
    // Get the guess as a string
    const guess = currentRow.cells.map(cell => cell.letter).join('');
    
    // Evaluate the guess
    const evaluation = evaluateGuess(guess, game.solution);
    
    // Update the row with evaluation results
    const newRows = [...game.rows];
    newRows[game.currentRowIndex] = {
      cells: currentRow.cells.map((cell, index) => ({
        letter: cell.letter,
        state: evaluation[index]
      })),
      submitted: true
    };
    
    // Update keyboard status
    const newKeyboardStatus = { ...game.keyboardStatus };
    currentRow.cells.forEach((cell, index) => {
      const letter = cell.letter;
      const currentState = newKeyboardStatus[letter] || 'absent';
      const newState = evaluation[index] as CellState;
      
      // Only upgrade the state (absent -> present -> correct)
      if (
        (currentState === 'absent' && (newState === 'present' || newState === 'correct')) ||
        (currentState === 'present' && newState === 'correct')
      ) {
        newKeyboardStatus[letter] = newState;
      }
    });
    
    // Check if the game is won or lost
    let gameStatus = game.gameStatus;
    let endTime = game.endTime;
    let newStats = { ...stats };
    
    const isCorrect = evaluation.every(result => result === 'correct');
    
    if (isCorrect) {
      gameStatus = 'won';
      endTime = Date.now();
      
      // Update stats for win
      const today = new Date().toISOString().split('T')[0];
      const guessCount = game.currentRowIndex + 1;
      
      newStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        currentStreak: stats.lastPlayed === today ? stats.currentStreak : stats.currentStreak + 1,
        maxStreak: Math.max(stats.maxStreak, stats.lastPlayed === today ? stats.currentStreak : stats.currentStreak + 1),
        guessDistribution: stats.guessDistribution.map((count, index) => 
          index === guessCount - 1 ? count + 1 : count
        ),
        lastPlayed: today
      };
    } else if (game.currentRowIndex === 5) {
      // Last row and not correct = game over
      gameStatus = 'lost';
      endTime = Date.now();
      
      // Update stats for loss
      const today = new Date().toISOString().split('T')[0];
      
      newStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon,
        currentStreak: 0, // Reset streak on loss
        maxStreak: stats.maxStreak,
        guessDistribution: stats.guessDistribution,
        lastPlayed: today
      };
    }
    
    set({
      game: {
        ...game,
        rows: newRows,
        currentRowIndex: game.currentRowIndex + 1,
        gameStatus,
        keyboardStatus: newKeyboardStatus,
        endTime
      },
      stats: newStats
    });
  },
  
  resetGame: () => {
    // Check if it's a new day
    const today = new Date().toISOString().split('T')[0];
    const { game } = get();
    
    if (game.date !== today || game.gameStatus !== 'playing') {
      set({ game: createNewGame() });
    }
  },
  
  addToLeaderboard: (name: string) => {
    const { game, leaderboard } = get();
    
    if (game.gameStatus !== 'won' || !game.endTime || !game.startTime) return;
    
    const entry: LeaderboardEntry = {
      name,
      guesses: game.currentRowIndex,
      time: Math.floor((game.endTime - game.startTime) / 1000), // Time in seconds
      date: game.date
    };
    
    // Add to leaderboard and sort by guesses (fewer is better) and then by time
    const newLeaderboard = [...leaderboard, entry]
      .filter(entry => entry.date === game.date) // Only keep entries for today
      .sort((a, b) => {
        if (a.guesses !== b.guesses) return a.guesses - b.guesses;
        return a.time - b.time;
      })
      .slice(0, 10); // Keep only top 10
    
    set({ leaderboard: newLeaderboard });
  }
}));

// Initialize the game on first load
export const initializeGame = () => {
  const { game, resetGame } = useGameStore.getState();
  const today = new Date().toISOString().split('T')[0];
  
  // Reset the game if it's a new day
  if (game.date !== today) {
    resetGame();
  }
};