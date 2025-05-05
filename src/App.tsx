import { useEffect } from 'react';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { GameOver } from './components/GameOver';
import { useGameStore, initializeGame } from './lib/store';
import { useKeyboardEvents } from './lib/utils';

function App() {
  const { game, addLetter, removeLetter, submitGuess, resetGame } = useGameStore();
  
  // Initialize game on first load
  useEffect(() => {
    initializeGame();
  }, []);
  
  // Set up keyboard event listener
  const handleKeyDown = useKeyboardEvents(
    addLetter,
    removeLetter,
    submitGuess,
    game.gameStatus === 'playing'
  );
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          <GameBoard />
          <Keyboard />
        </div>
      </main>
      
      <GameOver />
      
      <footer className="py-4 text-center text-sm text-zinc-500">
        <p>A new word puzzle every day!</p>
      </footer>
    </div>
  );
}

export default App;