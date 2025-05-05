import { useGameStore } from '../lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface StatisticsProps {
  onClose: () => void;
}

export function Statistics({ onClose }: StatisticsProps) {
  const stats = useGameStore(state => state.stats);
  const maxGuessCount = Math.max(...stats.guessDistribution, 1);
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Statistics</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.gamesPlayed}</span>
            <span className="text-xs text-zinc-500">Played</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">
              {stats.gamesPlayed > 0 
                ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
                : 0}%
            </span>
            <span className="text-xs text-zinc-500">Win %</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.currentStreak}</span>
            <span className="text-xs text-zinc-500">Current Streak</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.maxStreak}</span>
            <span className="text-xs text-zinc-500">Max Streak</span>
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="text-center font-medium mb-4">Guess Distribution</h3>
          
          <div className="space-y-2">
            {stats.guessDistribution.map((count, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 text-center">{index + 1}</div>
                <div 
                  className="h-6 bg-zinc-300 dark:bg-zinc-700 text-white text-xs flex items-center justify-end px-2"
                  style={{ 
                    width: `${count > 0 ? (count / maxGuessCount) * 100 : 0}%`,
                    minWidth: count > 0 ? '2rem' : '0'
                  }}
                >
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}