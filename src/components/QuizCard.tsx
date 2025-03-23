import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, RefreshCcw, EyeOff } from 'lucide-react';
import { QuizQuestion } from '../data/quizQuestions';
import { Player } from './PlayerSetup';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onTimeout: () => void;
  currentPlayer: Player;
  playerHelpers: {
    removeOptions: boolean;
    showHint: boolean;
    changeQuestion: boolean;
  };
  onUseHelper: (helper: 'removeOptions' | 'showHint' | 'changeQuestion') => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  onAnswer, 
  onTimeout,
  currentPlayer,
  playerHelpers,
  onUseHelper
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hideOptions, setHideOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const getOptionsToRemove = () => {
    const incorrectOptions = question.options
      .map((_, index) => index)
      .filter(index => index !== question.correctAnswer);
    
    return shuffleArray(incorrectOptions).slice(0, 2);
  };
  
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  useEffect(() => {
    setSelectedOption(null);
    setTimeLeft(30);
    setHideOptions([]);
    setShowHint(false);
    setImageLoaded(false);
    
    if (playerHelpers.removeOptions) {
      setHideOptions(getOptionsToRemove());
    }
    
    if (playerHelpers.showHint) {
      setShowHint(true);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [question, playerHelpers]);
  
  const handleOptionClick = (index: number) => {
    if (selectedOption !== null || hideOptions.includes(index)) return;
    
    setSelectedOption(index);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const isCorrect = index === question.correctAnswer;
    
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };
  
  const handleRemoveOptions = () => {
    if (!playerHelpers.removeOptions) {
      onUseHelper('removeOptions');
      setHideOptions(getOptionsToRemove());
    }
  };
  
  const handleShowHint = () => {
    if (!playerHelpers.showHint) {
      onUseHelper('showHint');
      setShowHint(true);
    }
  };
  
  const handleChangeQuestion = () => {
    if (!playerHelpers.changeQuestion) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onUseHelper('changeQuestion');
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto glass-card p-6 md:p-8 rtl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <img 
            src={currentPlayer.avatar} 
            alt={currentPlayer.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-op-ocean"
          />
          <span className="font-medium text-lg text-op-navy">{currentPlayer.name}</span>
        </div>
        
        <div className="flex items-center">
          <div 
            className={`text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center ${
              timeLeft > 10 
                ? 'bg-op-blue text-white' 
                : timeLeft > 5 
                  ? 'bg-op-yellow text-op-navy' 
                  : 'bg-red-500 text-white animate-pulse'
            }`}
          >
            {timeLeft}
          </div>
        </div>
      </div>
      
      <div className="relative mb-8 bg-black bg-opacity-10 rounded-lg overflow-hidden flex justify-center items-center min-h-[250px]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-op-ocean border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <motion.img 
          src={question.image} 
          alt="Question"
          className={`w-full h-auto max-h-[350px] object-contain ${imageLoaded ? '' : 'opacity-0'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-op-navy mb-6">{question.question}</h3>
      
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-op-yellow bg-opacity-20 border border-op-yellow border-opacity-30 rounded-md p-4 mb-6"
        >
          <p className="text-op-navy">
            <span className="font-bold">تلميح:</span> {question.hint}
          </p>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            className={`p-4 rounded-lg text-right transition-all ${
              selectedOption === null
                ? hideOptions.includes(index)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-op-ocean hover:text-white'
                : selectedOption === index
                  ? index === question.correctAnswer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : index === question.correctAnswer && selectedOption !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-500'
            }`}
            onClick={() => handleOptionClick(index)}
            disabled={selectedOption !== null || hideOptions.includes(index)}
            whileHover={selectedOption === null && !hideOptions.includes(index) ? { scale: 1.02 } : {}}
            whileTap={selectedOption === null && !hideOptions.includes(index) ? { scale: 0.98 } : {}}
          >
            {option}
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-center space-x-4 rtl:space-x-reverse">
        <motion.button
          className={`p-3 rounded-md flex items-center space-x-1 rtl:space-x-reverse ${
            playerHelpers.removeOptions
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white shadow-md hover:bg-op-ocean hover:text-white'
          }`}
          onClick={handleRemoveOptions}
          disabled={playerHelpers.removeOptions || selectedOption !== null}
          whileHover={!playerHelpers.removeOptions && selectedOption === null ? { scale: 1.05 } : {}}
          whileTap={!playerHelpers.removeOptions && selectedOption === null ? { scale: 0.95 } : {}}
        >
          <EyeOff size={16} />
          <span>حذف خيارين</span>
        </motion.button>
        
        <motion.button
          className={`p-3 rounded-md flex items-center space-x-1 rtl:space-x-reverse ${
            playerHelpers.showHint
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white shadow-md hover:bg-op-ocean hover:text-white'
          }`}
          onClick={handleShowHint}
          disabled={playerHelpers.showHint || selectedOption !== null}
          whileHover={!playerHelpers.showHint && selectedOption === null ? { scale: 1.05 } : {}}
          whileTap={!playerHelpers.showHint && selectedOption === null ? { scale: 0.95 } : {}}
        >
          <HelpCircle size={16} />
          <span>تلميح</span>
        </motion.button>
        
        <motion.button
          className={`p-3 rounded-md flex items-center space-x-1 rtl:space-x-reverse ${
            playerHelpers.changeQuestion
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white shadow-md hover:bg-op-ocean hover:text-white'
          }`}
          onClick={handleChangeQuestion}
          disabled={playerHelpers.changeQuestion || selectedOption !== null}
          whileHover={!playerHelpers.changeQuestion && selectedOption === null ? { scale: 1.05 } : {}}
          whileTap={!playerHelpers.changeQuestion && selectedOption === null ? { scale: 0.95 } : {}}
        >
          <RefreshCcw size={16} />
          <span>تغيير السؤال</span>
        </motion.button>
      </div>
    </div>
  );
};

export default QuizCard;
