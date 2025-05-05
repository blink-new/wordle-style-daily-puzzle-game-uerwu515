import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface HowToPlayProps {
  onClose: () => void;
}

export function HowToPlay({ onClose }: HowToPlayProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">How To Play</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <p className="mb-2">Guess the word in 6 tries.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Each guess must be a valid 5-letter word.</li>
              <li>The color of the tiles will change to show how close your guess was to the word.</li>
            </ul>
          </div>
          
          <div>
            <p className="font-medium mb-2">Examples</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white font-bold rounded border-2 border-emerald-600">W</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">E</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">A</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">R</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">Y</div>
                </div>
                <p className="text-sm">The letter <strong>W</strong> is in the word and in the correct spot.</p>
              </div>
              
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">P</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-500 text-white font-bold rounded border-2 border-amber-600">I</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">L</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">L</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">S</div>
                </div>
                <p className="text-sm">The letter <strong>I</strong> is in the word but in the wrong spot.</p>
              </div>
              
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">V</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">A</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">G</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-zinc-700 text-white font-bold rounded border-2 border-zinc-800">U</div>
                  <div className="w-10 h-10 flex items-center justify-center bg-transparent text-zinc-800 dark:text-zinc-200 font-bold rounded border-2 border-zinc-300 dark:border-zinc-700">E</div>
                </div>
                <p className="text-sm">The letter <strong>U</strong> is not in the word in any spot.</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="mb-2">A new puzzle is available each day!</p>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <Button onClick={handleClose}>Got it!</Button>
        </div>
      </div>
    </div>
  );
}