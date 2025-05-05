import { useState } from 'react';
import { useGameStore } from '../lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog';
import { X, Trophy, Clock, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LeaderboardProps {
  onClose: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [playerName, setPlayerName] = useState('');
  const { game, leaderboard, addToLeaderboard } = useGameStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      addToLeaderboard(playerName.trim());
      setPlayerName('');
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const canSubmitScore = game.gameStatus === 'won' && 
    !leaderboard.some(entry => 
      entry.date === game.date && 
      entry.guesses === game.currentRowIndex && 
      entry.time === (game.endTime && game.startTime 
        ? Math.floor((game.endTime - game.startTime) / 1000) 
        : 0)
    );
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Daily Leaderboard
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        {canSubmitScore && (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <h3 className="text-sm font-medium">Add your score to the leaderboard</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={15}
                required
              />
              <Button type="submit">Submit</Button>
            </div>
          </form>
        )}
        
        <div className="py-4">
          {leaderboard.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-500 pb-2 border-b">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Player</div>
                <div className="col-span-3">Guesses</div>
                <div className="col-span-2">Time</div>
              </div>
              
              {leaderboard
                .filter(entry => entry.date === game.date)
                .map((entry, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="col-span-1 font-medium">{index + 1}</div>
                  <div className="col-span-6 flex items-center gap-1.5 truncate">
                    <User className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="truncate">{entry.name}</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span>{entry.guesses}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{formatTime(entry.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
              <p>No scores on the leaderboard yet!</p>
              <p className="text-sm mt-2">Be the first to add your score.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}