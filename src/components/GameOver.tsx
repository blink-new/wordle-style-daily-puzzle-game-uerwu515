import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trophy, Clock, Share2 } from 'lucide-react';

export function GameOver() {
  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);
  const { game, addToLeaderboard, leaderboard } = useGameStore();
  
  const isGameOver = game.gameStatus === 'won' || game.gameStatus === 'lost';
  const isWon = game.gameStatus === 'won';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      addToLeaderboard(playerName.trim());
      setPlayerName('');
    }
  };
  
  const formatTime = (ms?: number) => {
    if (!ms) return '0:00';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const canSubmitScore = isWon && 
    !leaderboard.some(entry => 
      entry.date === game.date && 
      entry.guesses === game.currentRowIndex && 
      entry.time === (game.endTime && game.startTime 
        ? Math.floor((game.endTime - game.startTime) / 1000) 
        : 0)
    );
  
  const generateShareText = () => {
    const date = new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const guessCount = game.currentRowIndex;
    
    let shareText = `Wordly - ${date}\n`;
    
    if (isWon) {
      shareText += `Solved in ${guessCount}/6 guesses\n\n`;
    } else {
      shareText += `Failed to solve today's puzzle\n\n`;
    }
    
    // Generate the emoji grid
    game.rows.slice(0, game.currentRowIndex).forEach(row => {
      let rowText = '';
      row.cells.forEach(cell => {
        if (cell.state === 'correct') {
          rowText += '🟩';
        } else if (cell.state === 'present') {
          rowText += '🟨';
        } else {
          rowText += '⬛';
        }
      });
      shareText += rowText + '\n';
    });
    
    shareText += '\nPlay at: [your-game-url]';
    
    return shareText;
  };
  
  const handleShare = async () => {
    const shareText = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wordly',
          text: shareText
        });
      } catch (err) {
        console.error('Error sharing:', err);
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  if (!isGameOver) return null;
  
  return (
    <Dialog open={isGameOver} modal={false}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {isWon ? 'Congratulations!' : 'Game Over'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isWon 
              ? `You solved today's puzzle in ${game.currentRowIndex} ${game.currentRowIndex === 1 ? 'guess' : 'guesses'}!` 
              : `The word was ${game.solution}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {isWon && (
            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold">{game.currentRowIndex}/6</div>
                <div className="text-xs text-zinc-500">Guesses</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold">
                  {formatTime(game.endTime && game.startTime ? game.endTime - game.startTime : 0)}
                </div>
                <div className="text-xs text-zinc-500">Time</div>
              </div>
            </div>
          )}
          
          {canSubmitScore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-medium">Add your score to the leaderboard</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={15}
                    required
                  />
                  <Button type="submit">
                    <Trophy className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleShare}>
              {copied ? 'Copied!' : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm text-zinc-500">
            <p>A new puzzle will be available tomorrow!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}