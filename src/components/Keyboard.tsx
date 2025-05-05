import { motion } from 'framer-motion';
import { useGameStore } from '../lib/store';
import { cn } from '../lib/utils';
import { Delete, CornerDownLeft } from 'lucide-react';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
];

export function Keyboard() {
  const { game, addLetter, removeLetter, submitGuess } = useGameStore();
  
  const handleKeyClick = (key: string) => {
    if (game.gameStatus !== 'playing') return;
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'DELETE') {
      removeLetter();
    } else {
      addLetter(key);
    }
  };
  
  // Get key color based on its status
  const getKeyColor = (key: string) => {
    const status = game.keyboardStatus[key];
    
    switch (status) {
      case 'correct':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'present':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'absent':
        return 'bg-zinc-700 hover:bg-zinc-800 text-white';
      default:
        return 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6 px-1">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5 my-1.5">
          {row.map((key) => {
            const isSpecialKey = key === 'ENTER' || key === 'DELETE';
            
            return (
              <motion.button
                key={key}
                className={cn(
                  "flex items-center justify-center rounded font-bold transition-colors",
                  isSpecialKey ? "px-3 py-4 text-xs" : "w-10 h-12 text-sm",
                  getKeyColor(key)
                )}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleKeyClick(key)}
              >
                {key === 'DELETE' ? (
                  <Delete className="w-4 h-4" />
                ) : key === 'ENTER' ? (
                  <CornerDownLeft className="w-4 h-4" />
                ) : (
                  key
                )}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}