// A list of 5-letter words for the game
export const WORDS = [
  "APPLE", "BEACH", "CHAIR", "DANCE", "EAGLE", "FLAME", "GLOBE", "HEART", "IMAGE", "JUICE",
  "KNIFE", "LEMON", "MUSIC", "NIGHT", "OCEAN", "PIANO", "QUEEN", "RIVER", "SNAKE", "TIGER",
  "UNCLE", "VOICE", "WATER", "XENON", "YACHT", "ZEBRA", "ACTOR", "BREAD", "CLOUD", "DREAM",
  "EARTH", "FRUIT", "GHOST", "HOUSE", "IVORY", "JEWEL", "KOALA", "LIGHT", "MONEY", "NURSE",
  "OLIVE", "PLANT", "QUILT", "RADIO", "STORM", "TRAIN", "URBAN", "VIRUS", "WHALE", "XYLYL",
  "YOUTH", "ZESTY", "AMBER", "BLEND", "CRAFT", "DRILL", "ELBOW", "FLUTE", "GRAPE", "HONEY",
  "IGLOO", "JOKER", "KIOSK", "LINEN", "MAPLE", "NOBLE", "OASIS", "PEACH", "QUACK", "ROBIN",
  "SPOON", "TULIP", "UNITY", "VENOM", "WAGON", "XEROX", "YEARN", "ZONED"
];

// Get a word based on the date (same word for everyone on the same day)
export function getWordOfTheDay(): string {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  
  // Use the date string to seed a simple hash
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use the hash to select a word
  const index = Math.abs(hash) % WORDS.length;
  return WORDS[index];
}

// Check if a word is in our word list
export function isValidWord(word: string): boolean {
  return WORDS.includes(word.toUpperCase());
}

// Evaluate a guess against the solution
export function evaluateGuess(guess: string, solution: string): ('correct' | 'present' | 'absent')[] {
  const result: ('correct' | 'present' | 'absent')[] = Array(5).fill('absent');
  const solutionChars = solution.split('');
  const guessChars = guess.toUpperCase().split('');
  
  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = 'correct';
      solutionChars[i] = '#'; // Mark as used
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'absent') {
      const index = solutionChars.indexOf(guessChars[i]);
      if (index !== -1) {
        result[i] = 'present';
        solutionChars[index] = '#'; // Mark as used
      }
    }
  }
  
  return result;
}