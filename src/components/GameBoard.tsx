import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../lib/store';
import { cn } from '../lib/utils';

export function GameBoard() {
  const game = useGameStore(state => state.game);
  
  // Cell color mapping
  const getCellColor = (state: string) => {
    switch (state) {
      case 'correct':
        return 'bg-emerald-500 border-emerald-600 text-white';
      case 'present':
        return 'bg-amber-500 border-amber-600 text-white';
      case 'absent':
        return 'bg-zinc-700 border-zinc-800 text-white';
      case 'tbd':
        return 'bg-transparent border-zinc-400 text-zinc-800 dark:text-zinc-200';
      default:
        return 'bg-transparent border-zinc-300 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200';
    }
  };

  return (
    <div className="grid grid-rows-6 gap-1.5 mx-auto max-w-sm">
      {game.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-1.5">
          {row.cells.map((cell, cellIndex) => {
            const isRevealing = row.submitted && rowIndex === game.currentRowIndex - 1;
            
            return (
              <motion.div
                key={`${rowIndex}-${cellIndex}`}
                className={cn(
                  "flex items-center justify-center w-14 h-14 text-2xl font-bold border-2 rounded",
                  getCellColor(cell.state)
                )}
                animate={isRevealing ? { rotateX: [0, 90, 0], scale: [1, 1.1, 1] } : {}}
                transition={isRevealing ? { 
                  duration: 0.5, 
                  delay: cellIndex * 0.15,
                  type: "spring",
                  stiffness: 200
                } : {}}
              >
                {cell.letter}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}