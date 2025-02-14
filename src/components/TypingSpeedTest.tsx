import React, { useState, useRef } from 'react';

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "She sells seashells by the seashore.",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
  "Peter Piper picked a peck of pickled peppers.",
  "I scream, you scream, we all scream for ice cream!"
];

const TypingSpeedTest: React.FC = () => {
  const [text, setText] = useState('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const calculateProgress = () => {
    return Math.min(100, (text.length / sentences[currentSentenceIndex].length) * 100);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isRunning) {
        finishTest();
      }
    }
  };

  const startTest = () => {
    setText('');
    setIsRunning(true);
    setShowResults(false);
    setStartTime(Date.now());
    textareaRef.current?.focus();
  };

  const finishTest = () => {
    if (!startTime || text.length === 0) return;
    
    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 1000 / 60;
    const words = text.trim().split(/\s+/).length;
    const calculatedWpm = Math.round(words / timeInMinutes);
    
    const correctChars = [...sentences[currentSentenceIndex]].filter((char, i) => char === text[i]).length;
    const calculatedAccuracy = Math.round((correctChars / sentences[currentSentenceIndex].length) * 100);

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    setIsRunning(false);
    setShowResults(true);
  };

  const resetTest = () => {
    setText('');
    setIsRunning(false);
    setShowResults(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(0);
    // Move to next sentence
    setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-700 to-blue-500">
      <img 
        src="/LBD LOGO-white.svg" 
        alt="LBD Logo" 
        className="max-w-xs mx-auto mb-6"
      />
      <h1 className="text-4xl font-bold mb-6 text-white">Typing Speed Test</h1>
      
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <p className="text-white mb-4">Type this text:</p>
        <p className="text-white mb-4 text-xl font-medium font-mono">
          {sentences[currentSentenceIndex]}
        </p>

        {isRunning && (
          <>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyPress}
              disabled={showResults}
              className="w-full p-4 rounded-lg mb-4 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />

            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </>
        )}

        <div className="flex gap-4">
          {!isRunning && !showResults && (
            <button
              onClick={startTest}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Test
            </button>
          )}

          {isRunning && (
            <button
              onClick={finishTest}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Finish Test
            </button>
          )}

          {(isRunning || showResults) && (
            <button
              onClick={resetTest}
              className="border-2 border-white text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {showResults && (
          <div className="mt-6 p-4 bg-white/20 rounded-lg">
            <p className="text-white text-xl mb-2">Speed: {wpm} WPM</p>
            <p className="text-white text-xl">Accuracy: {accuracy}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingSpeedTest;