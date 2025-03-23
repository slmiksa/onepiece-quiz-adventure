
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, RefreshCcw, EyeOff } from 'lucide-react';
import { QuizQuestion } from '../data/quizQuestions';
import { Player } from './PlayerSetup';
import { shuffleArray } from '../utils/quizHelpers';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  usedHelpers: {
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
  usedHelpers,
  onUseHelper
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hideOptions, setHideOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [randomizedOptions, setRandomizedOptions] = useState<{text: string, index: number}[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setTimeLeft(30);
    setHideOptions([]);
    setShowHint(false);
    setImageLoaded(false);
    
    // Randomize options for each question to ensure answer position varies
    const options = question.options.map((option, index) => ({
      text: option,
      index: index
    }));
    
    setRandomizedOptions(shuffleArray(options));
    
    // Setup timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
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
  }, [question, onTimeout]);
  
  // Apply helpers when they are used for this specific question
  useEffect(() => {
    if (playerHelpers.removeOptions) {
      handleRemoveOptions();
    }
    
    if (playerHelpers.showHint) {
      setShowHint(true);
    }
  }, [playerHelpers]);
  
  const getOptionsToRemove = () => {
    const incorrectOptionIndices = randomizedOptions
      .filter(option => option.index !== question.correctAnswer)
      .map((_, index) => index);
    
    // Ensure we don't try to remove more options than available
    const numToRemove = Math.min(2, incorrectOptionIndices.length);
    return shuffleArray(incorrectOptionIndices).slice(0, numToRemove);
  };
  
  const handleOptionClick = (index: number, originalIndex: number) => {
    if (selectedOption !== null || hideOptions.includes(index)) return;
    
    setSelectedOption(index);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const isCorrect = originalIndex === question.correctAnswer;
    
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };
  
  const handleRemoveOptions = () => {
    if (randomizedOptions.length > 0) {
      setHideOptions(getOptionsToRemove());
    }
  };
  
  // Handle image error
  const handleImageError = () => {
    console.error("Image failed to load:", question.image);
    setImageLoaded(true); // Mark as loaded to remove loading spinner
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto glass-card p-6 md:p-8 rtl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Avatar className="w-10 h-10 border-2 border-op-ocean overflow-hidden">
            <AvatarImage 
              src={currentPlayer.avatar} 
              alt={currentPlayer.name}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-op-ocean text-white">
              {currentPlayer.name?.substring(0, 2) || "OP"}
            </AvatarFallback>
          </Avatar>
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
      
      <div className="relative mb-8 bg-black bg-opacity-10 rounded-lg overflow-hidden flex justify-center items-center min-h-[250px] max-h-[350px]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-op-ocean border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={question.image} 
          alt="Question"
          className={`w-full h-auto max-h-[350px] object-contain ${imageLoaded ? '' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
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
        {randomizedOptions.map((option, index) => (
          <motion.button
            key={index}
            className={`p-4 rounded-lg text-right transition-all ${
              selectedOption === null
                ? hideOptions.includes(index)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-op-ocean hover:text-white'
                : selectedOption === index
                  ? option.index === question.correctAnswer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : option.index === question.correctAnswer && selectedOption !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-500'
            }`}
            onClick={() => handleOptionClick(index, option.index)}
            disabled={selectedOption !== null || hideOptions.includes(index)}
            whileHover={selectedOption === null && !hideOptions.includes(index) ? { scale: 1.02 } : {}}
            whileTap={selectedOption === null && !hideOptions.includes(index) ? { scale: 0.98 } : {}}
          >
            {option.text}
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-center space-x-4 rtl:space-x-reverse">
        <motion.button
          className={`p-3 rounded-md flex items-center space-x-1 rtl:space-x-reverse ${
            usedHelpers.removeOptions
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white shadow-md hover:bg-op-ocean hover:text-white'
          }`}
          onClick={() => {
            if (!usedHelpers.removeOptions && selectedOption === null) {
              onUseHelper('removeOptions');
            }
          }}
          disabled={usedHelpers.removeOptions || selectedOption !== null}
          whileHover={!usedHelpers.removeOptions && selectedOption === null ? { scale: 1.05 } : {}}
          whileTap={!usedHelpers.removeOptions && selectedOption === null ? { scale: 0.95 } : {}}
        >
          <EyeOff size={16} />
          <span>حذف خيارين</span>
        </motion.button>
        
        <motion.button
          className={`p-3 rounded-md flex items-center space-x-1 rtl:space-x-reverse ${
            usedHelpers.showHint
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white shadow-md hover:bg-op-ocean hover:text-white'
          }`}
          onClick={() => {
            if (!usedHelpers.showHint && selectedOption === null) {
              onUseHelper('showHint');
            }
          }}
          disabled={usedHelpers.showHint || selectedOption !== null}
          whileHover={!usedHelpers.showHint && selectedOption === null ? { scale: 1.05 } : {}}
          whileTap={!usedHelpers.showHint && selectedOption === null ? { scale: 0.95 } : {}}
        >
          <HelpCircle size={16} />
          <span>تلميح</span>
        </motion.button>
        
        <motion.button
          className={`p-3 rounded-md flex items-center space-x-1 rtl:space-x-reverse ${
            usedHelpers.changeQuestion
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white shadow-md hover:bg-op-ocean hover:text-white'
          }`}
          onClick={() => {
            if (!usedHelpers.changeQuestion && selectedOption === null) {
              onUseHelper('changeQuestion');
            }
          }}
          disabled={usedHelpers.changeQuestion || selectedOption !== null}
          whileHover={!usedHelpers.changeQuestion && selectedOption === null ? { scale: 1.05 } : {}}
          whileTap={!usedHelpers.changeQuestion && selectedOption === null ? { scale: 0.95 } : {}}
        >
          <RefreshCcw size={16} />
          <span>تغيير السؤال</span>
        </motion.button>
      </div>
    </div>
  );
};

export default QuizCard;
