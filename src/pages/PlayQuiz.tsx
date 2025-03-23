import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import QuizCard from '../components/QuizCard';
import ResultsScreen from '../components/ResultsScreen';
import { getQuizQuestions, QuizQuestion } from '../data/quizQuestions';
import { Player } from '../components/PlayerSetup';
import { motion, AnimatePresence } from 'framer-motion';
import { savePlayersToDb, getSharedQuiz, createSharedQuiz } from '../utils/supabaseHelpers';
import { shuffleArray } from '../utils/quizHelpers';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  usedHelpers: {
    removeOptions: boolean;
    showHint: boolean;
    changeQuestion: boolean;
  };
}

const PlayQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [roundTransition, setRoundTransition] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [dbPlayerIds, setDbPlayerIds] = useState<Record<number, string>>({});
  const [playerTransition, setPlayerTransition] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [questionsPerPlayer, setQuestionsPerPlayer] = useState(10);
  const [isSharedQuiz, setIsSharedQuiz] = useState(false);
  const [waitingForPlayers, setWaitingForPlayers] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const initializeGame = async () => {
      try {
        if (quizId) {
          setIsSharedQuiz(true);
          const sharedQuiz = await getSharedQuiz(quizId);
          
          if (!sharedQuiz) {
            toast({
              title: "المسابقة غير موجودة",
              description: "لم نتمكن من العثور على هذه المسابقة المشتركة",
              variant: "destructive"
            });
            navigate('/quiz');
            return;
          }
          
          setDifficulty(sharedQuiz.difficulty);
          
          if (sharedQuiz.players && sharedQuiz.players.length > 0) {
            const parsedPlayers = sharedQuiz.players;
            
            try {
              const playerIdsMap = await savePlayersToDb(parsedPlayers);
              setDbPlayerIds(playerIdsMap);
            } catch (error) {
              console.error('Error saving players to database:', error);
            }
            
            const totalQuestionsNeeded = parsedPlayers.length * questionsPerPlayer;
            let allQuestions = getQuizQuestions(sharedQuiz.difficulty, Math.max(totalQuestionsNeeded * 2, 100));
            
            if (allQuestions.length < totalQuestionsNeeded) {
              setQuestionsPerPlayer(Math.floor(allQuestions.length / parsedPlayers.length));
            }
            
            allQuestions = shuffleArray(allQuestions);
            
            const playerStates = parsedPlayers.map((player, index) => {
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
                questions: playerQuestions,
                usedHelpers: {
                  removeOptions: false,
                  showHint: false,
                  changeQuestion: false
                }
              };
            });
            
            setPlayers(playerStates);
            setIsLoading(false);
            
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
          } else {
            setWaitingForPlayers(true);
            setIsLoading(false);
          }
          
          return;
        }
        
        const storedPlayers = sessionStorage.getItem('quizPlayers');
        const storedDifficulty = sessionStorage.getItem('quizDifficulty');
        
        if (!storedPlayers || !storedDifficulty) {
          navigate('/quiz');
          return;
        }
        
        const parsedPlayers: Player[] = JSON.parse(storedPlayers);
        const difficultyValue = storedDifficulty;
        setDifficulty(difficultyValue);
        
        try {
          const sharedQuizId = await createSharedQuiz(parsedPlayers, difficultyValue);
          if (sharedQuizId) {
            toast({
              title: "تم إنشاء رابط مشاركة",
              description: `يمكن للاعبين الآخرين الانضمام عبر الرابط: ${window.location.origin}/share/${sharedQuizId}`,
            });
          }
        } catch (error) {
          console.error('Error creating shared quiz:', error);
        }
        
        try {
          const playerIdsMap = await savePlayersToDb(parsedPlayers);
          setDbPlayerIds(playerIdsMap);
        } catch (error) {
          console.error('Error saving players to database:', error);
        }
        
        const totalQuestionsNeeded = parsedPlayers.length * questionsPerPlayer;
        let allQuestions = getQuizQuestions(difficultyValue, Math.max(totalQuestionsNeeded * 2, 100));
        
        if (allQuestions.length < totalQuestionsNeeded) {
          setQuestionsPerPlayer(Math.floor(allQuestions.length / parsedPlayers.length));
        }
        
        allQuestions = shuffleArray(allQuestions);
        
        const playerStates = parsedPlayers.map((player, index) => {
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
            questions: playerQuestions,
            usedHelpers: {
              removeOptions: false,
              showHint: false,
              changeQuestion: false
            }
          };
        });
        
        setPlayers(playerStates);
        setIsLoading(false);
        
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
        toast({
          title: "خطأ في تحميل اللعبة",
          description: "حدث خطأ أثناء تهيئة اللعبة. سيتم إعادتك إلى ال��فحة الرئيسية.",
          variant: "destructive"
        });
        navigate('/quiz');
      }
    };
    
    initializeGame();
  }, [navigate, questionsPerPlayer, quizId]);
  
  const currentPlayerState = players[currentPlayerIndex];
  
  const selectRandomNextPlayer = useCallback(() => {
    if (players.length <= 1) return currentPlayerIndex;
    
    const eligiblePlayers = players.filter((player, index) => 
      index !== currentPlayerIndex && player.currentQuestionIndex < questionsPerPlayer
    );
    
    if (eligiblePlayers.length === 0) {
      return currentPlayerIndex;
    }
    
    const randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
    return players.findIndex(p => p.player.id === randomPlayer.player.id);
  }, [players, currentPlayerIndex, questionsPerPlayer]);
  
  const handleAnswer = useCallback((isCorrect: boolean) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const currentPlayer = { ...updatedPlayers[currentPlayerIndex] };
      
      if (isCorrect) {
        currentPlayer.score += 1;
      }
      
      currentPlayer.currentQuestionIndex += 1;
      
      currentPlayer.helpers = {
        removeOptions: false,
        showHint: false,
        changeQuestion: false
      };
      
      updatedPlayers[currentPlayerIndex] = currentPlayer;
      return updatedPlayers;
    });
    
    setRoundTransition(true);
    setTimeout(() => {
      const allPlayersFinished = players.every(p => 
        p.currentQuestionIndex >= questionsPerPlayer - 1
      );
      
      if (allPlayersFinished) {
        setGameOver(true);
      } else {
        const nextPlayerIdx = selectRandomNextPlayer();
        setNextPlayerName(players[nextPlayerIdx].player.name);
        
        setPlayerTransition(true);
        
        setTimeout(() => {
          setCurrentPlayerIndex(nextPlayerIdx);
          setPlayerTransition(false);
        }, 2000);
      }
      
      setRoundTransition(false);
    }, 1000);
  }, [currentPlayerIndex, players, selectRandomNextPlayer, questionsPerPlayer]);
  
  const handleTimeout = useCallback(() => {
    handleAnswer(false);
  }, [handleAnswer]);
  
  const handleUseHelper = useCallback((helper: 'removeOptions' | 'showHint' | 'changeQuestion') => {
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      const currentPlayer = { ...updatedPlayers[currentPlayerIndex] };
      
      if (currentPlayer.usedHelpers[helper]) {
        toast({
          title: "لا يمكن استخدام المساعدة",
          description: "لقد استخدمت هذه المساعدة بالفعل",
          variant: "destructive"
        });
        return updatedPlayers;
      }
      
      if (helper === 'changeQuestion') {
        const nextIndex = currentPlayer.currentQuestionIndex + 1;
        
        if (nextIndex < currentPlayer.questions.length) {
          currentPlayer.currentQuestionIndex = nextIndex;
        } else {
          setGameOver(true);
          return updatedPlayers;
        }
      }
      
      currentPlayer.helpers = {
        ...currentPlayer.helpers,
        [helper]: true
      };
      
      currentPlayer.usedHelpers = {
        ...currentPlayer.usedHelpers,
        [helper]: true
      };
      
      updatedPlayers[currentPlayerIndex] = currentPlayer;
      return updatedPlayers;
    });
  }, [currentPlayerIndex, toast]);
  
  const handlePlayAgain = useCallback(() => {
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
  
  if (playerTransition) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-12 text-center"
          >
            <h2 className="text-4xl font-adventure text-white mb-4">دور اللاعب</h2>
            <span className="text-5xl font-bold text-op-yellow">{nextPlayerName}</span>
          </motion.div>
        </div>
      </Layout>
    );
  }
  
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
  
  const currentQuestion = getCurrentQuestion();
  
  if (!currentQuestion || !currentPlayerState) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container flex items-center justify-center">
          <div className="text-center text-white glass-card p-8">
            <h2 className="text-2xl mb-4">خطأ في تحميل السؤال</h2>
            <p className="mb-6">لم نتمكن من تحميل السؤال التالي. يرجى المحاولة مرة أخرى.</p>
            <button onClick={handlePlayAgain} className="bg-op-ocean text-white px-6 py-3 rounded-md hover:bg-op-blue transition">
              الرجوع للقائمة الرئيسية
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (waitingForPlayers) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container flex items-center justify-center">
          <div className="glass-card p-8 max-w-lg w-full text-center">
            <h2 className="text-2xl md:text-3xl font-adventure text-white mb-6">في انتظار اللاعبين</h2>
            <p className="text-white mb-8">شارك الرابط التالي مع أصدقائك للانضمام إلى المسابقة:</p>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6 break-all">
              <p className="text-op-yellow font-medium">{window.location.href}</p>
            </div>
            
            <button 
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="bg-op-ocean text-white px-6 py-3 rounded-md hover:bg-op-blue transition"
            >
              نسخ الرابط
            </button>
            
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <div className="w-3 h-3 rounded-full bg-op-yellow animate-bounce"></div>
                <div className="w-3 h-3 rounded-full bg-op-yellow animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 rounded-full bg-op-yellow animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
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
                  <Avatar className="w-6 h-6 overflow-hidden">
                    <AvatarImage 
                      src={p.player.avatar} 
                      alt={p.player.name}
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className="bg-op-ocean text-white text-xs">
                      {p.player.name?.substring(0, 2) || "OP"}
                    </AvatarFallback>
                  </Avatar>
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
                  usedHelpers={currentPlayerState.usedHelpers}
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
