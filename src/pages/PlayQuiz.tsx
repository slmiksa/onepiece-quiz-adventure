import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import QuizCard from '../components/QuizCard';
import ResultsScreen from '../components/ResultsScreen';
import { getQuizQuestions, QuizQuestion } from '../data/quizQuestions';
import { Player } from '../components/PlayerSetup';
import { motion, AnimatePresence } from 'framer-motion';
import { savePlayersToDb } from '../utils/supabaseHelpers';

interface PlayerState {
  player: Player;
  score: number;
  currentQuestionIndex: number;
  helpers: {
    removeOptions: boolean;
    showHint: boolean;
    changeQuestion: boolean;
  };
  questions: QuizQuestion[];
}

const PlayQuiz: React.FC = () => {
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [roundTransition, setRoundTransition] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [dbPlayerIds, setDbPlayerIds] = useState<Record<number, string>>({});
  
  const navigate = useNavigate();
  
  const questionsPerPlayer = 10;
  
  // Initialize the game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Get players and difficulty from sessionStorage
        const storedPlayers = sessionStorage.getItem('quizPlayers');
        const storedDifficulty = sessionStorage.getItem('quizDifficulty');
        
        if (!storedPlayers || !storedDifficulty) {
          // If not found, redirect back to setup
          navigate('/quiz');
          return;
        }
        
        const parsedPlayers: Player[] = JSON.parse(storedPlayers);
        const difficultyValue = storedDifficulty;
        setDifficulty(difficultyValue);
        
        // Save players to database and get mapping of local IDs to DB IDs
        const playerIdsMap = await savePlayersToDb(parsedPlayers);
        setDbPlayerIds(playerIdsMap);
        
        // Get enough questions for all players
        const totalQuestionsNeeded = parsedPlayers.length * questionsPerPlayer;
        const allQuestions = getQuizQuestions(difficultyValue, totalQuestionsNeeded);
        
        // Setup player states
        const playerStates: PlayerState[] = parsedPlayers.map((player, index) => {
          // Get unique questions for this player
          const startIndex = index * questionsPerPlayer;
          const playerQuestions = allQuestions.slice(startIndex, startIndex + questionsPerPlayer);
          
          return {
            player,
            score: 0,
            currentQuestionIndex: 0,
            helpers: {
              removeOptions: false,
              showHint: false,
              changeQuestion: false
            },
            questions: playerQuestions
          };
        });
        
        setPlayers(playerStates);
        setIsLoading(false);
        
        // Start countdown
        setShowCountdown(true);
        let count = 3;
        const countdownInterval = setInterval(() => {
          count--;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(countdownInterval);
            setShowCountdown(false);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Error initializing game:', error);
        navigate('/quiz');
      }
    };
    
    initializeGame();
  }, [navigate]);
  
  const currentPlayerState = players[currentPlayerIndex];
  
  const handleAnswer = useCallback((isCorrect: boolean) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const currentPlayer = { ...updatedPlayers[currentPlayerIndex] };
      
      // Update score if answer is correct
      if (isCorrect) {
        currentPlayer.score += 1;
      }
      
      // Move to next question
      currentPlayer.currentQuestionIndex += 1;
      
      updatedPlayers[currentPlayerIndex] = currentPlayer;
      return updatedPlayers;
    });
    
    // Show transition between rounds
    setRoundTransition(true);
    setTimeout(() => {
      // Check if current player has finished all questions
      const currentPlayer = players[currentPlayerIndex];
      const isLastQuestion = currentPlayer.currentQuestionIndex >= questionsPerPlayer - 1;
      
      if (isLastQuestion) {
        // Check if all players have finished
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        const allPlayersFinished = nextPlayerIndex === 0 && 
          players.every(p => p.currentQuestionIndex >= questionsPerPlayer - 1);
        
        if (allPlayersFinished) {
          setGameOver(true);
        } else {
          // Move to next player
          setCurrentPlayerIndex(nextPlayerIndex);
        }
      }
      
      setRoundTransition(false);
    }, 1000);
  }, [currentPlayerIndex, players]);
  
  const handleTimeout = useCallback(() => {
    // Same logic as answering incorrectly
    handleAnswer(false);
  }, [handleAnswer]);
  
  const handleUseHelper = useCallback((helper: 'removeOptions' | 'showHint' | 'changeQuestion') => {
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const currentPlayer = { ...updatedPlayers[currentPlayerIndex] };
      
      if (helper === 'changeQuestion') {
        // Get a new question (simple implementation - just move to next question)
        // In a real game, you'd want to replace with a different question
        currentPlayer.currentQuestionIndex += 1;
      }
      
      // Mark the helper as used
      currentPlayer.helpers = {
        ...currentPlayer.helpers,
        [helper]: true
      };
      
      updatedPlayers[currentPlayerIndex] = currentPlayer;
      return updatedPlayers;
    });
  }, [currentPlayerIndex]);
  
  const handlePlayAgain = useCallback(() => {
    // Clear session storage and redirect to quiz setup
    sessionStorage.removeItem('quizPlayers');
    sessionStorage.removeItem('quizDifficulty');
    navigate('/quiz');
  }, [navigate]);
  
  const getCurrentQuestion = useCallback(() => {
    if (!currentPlayerState) return null;
    
    const questionIndex = currentPlayerState.currentQuestionIndex;
    if (questionIndex >= currentPlayerState.questions.length) {
      return null;
    }
    
    return currentPlayerState.questions[questionIndex];
  }, [currentPlayerState]);
  
  // Render loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container flex items-center justify-center">
          <div className="animate-bounce-slow h-16 w-16 rounded-full bg-op-yellow flex items-center justify-center">
            <span className="font-adventure text-op-navy text-2xl">...</span>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Show countdown
  if (showCountdown) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container flex items-center justify-center">
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-32 w-32 rounded-full bg-op-yellow flex items-center justify-center shadow-lg"
          >
            <span className="font-adventure text-op-navy text-6xl">{countdown}</span>
          </motion.div>
        </div>
      </Layout>
    );
  }
  
  // Show results when game is over
  if (gameOver) {
    const results = players.map(p => ({
      player: p.player,
      score: p.score,
      totalQuestions: questionsPerPlayer
    }));
    
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container flex items-center justify-center">
          <ResultsScreen 
            results={results} 
            onPlayAgain={handlePlayAgain} 
            difficulty={difficulty}
            dbPlayerIds={dbPlayerIds}
          />
        </div>
      </Layout>
    );
  }
  
  // Get current question
  const currentQuestion = getCurrentQuestion();
  
  if (!currentQuestion || !currentPlayerState) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl mb-4">خطأ في تحميل السؤال</h2>
            <button onClick={handlePlayAgain} className="btn-accent">
              الرجوع للقائمة الرئيسية
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 quiz-container">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-block bg-white bg-opacity-20 backdrop-filter backdrop-blur-md rounded-full px-6 py-2 text-white text-sm font-medium mb-4">
              {`السؤال ${currentPlayerState.currentQuestionIndex + 1} من ${questionsPerPlayer}`}
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {players.map((p, index) => (
                <div 
                  key={p.player.id}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full ${
                    index === currentPlayerIndex 
                      ? 'bg-op-yellow text-op-navy' 
                      : 'bg-white bg-opacity-20 text-white'
                  }`}
                >
                  <img 
                    src={p.player.avatar} 
                    alt={p.player.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm">{p.player.name}</span>
                  <span className="text-xs opacity-80">{p.score}/{questionsPerPlayer}</span>
                </div>
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {roundTransition ? (
              <motion.div
                key="transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-[500px]"
              >
                <div className="animate-spin h-16 w-16 border-4 border-op-yellow border-t-transparent rounded-full"></div>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuizCard 
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  onTimeout={handleTimeout}
                  currentPlayer={currentPlayerState.player}
                  playerHelpers={currentPlayerState.helpers}
                  onUseHelper={handleUseHelper}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default PlayQuiz;
