import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BarChart2, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Statistics } from './Statistics';
import { Leaderboard } from './Leaderboard';
import { HowToPlay } from './HowToPlay';

export function Header() {
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 py-3 px-4">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 0.5, repeat: 0, repeatType: 'reverse' }}
          >
            <Trophy className="w-6 h-6 text-amber-500" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">Wordly</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setShowHelp(true);
              setShowStats(false);
              setShowLeaderboard(false);
            }}
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setShowStats(true);
              setShowHelp(false);
              setShowLeaderboard(false);
            }}
          >
            <BarChart2 className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setShowLeaderboard(true);
              setShowHelp(false);
              setShowStats(false);
            }}
          >
            <Trophy className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {showStats && <Statistics onClose={() => setShowStats(false)} />}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
    </header>
  );
}