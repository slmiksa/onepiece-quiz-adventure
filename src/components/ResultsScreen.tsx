
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Player } from './PlayerSetup';
import { Award, RotateCcw, Home } from 'lucide-react';

interface PlayerResult {
  player: Player;
  score: number;
  totalQuestions: number;
}

interface ResultsScreenProps {
  results: PlayerResult[];
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onPlayAgain }) => {
  const navigate = useNavigate();
  
  // Sort players by score (descending)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  
  // Determine if there's a tie for first place
  const highestScore = sortedResults[0]?.score || 0;
  const winners = sortedResults.filter(r => r.score === highestScore);
  const isTie = winners.length > 1;
  
  const getPositionClass = (index: number) => {
    if (index === 0) return 'bg-op-yellow text-op-navy';
    if (index === 1) return 'bg-gray-300 text-gray-800';
    if (index === 2) return 'bg-amber-700 text-amber-50';
    return 'bg-white text-gray-800';
  };
  
  const getPositionText = (index: number) => {
    if (index === 0) return 'المركز الأول 🏆';
    if (index === 1) return 'المركز الثاني 🥈';
    if (index === 2) return 'المركز الثالث 🥉';
    return `المركز ${index + 1}`;
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto glass-card p-6 md:p-8 rtl">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-adventure text-op-navy mb-4">
          نتائج الاختبار
        </h2>
        
        {isTie ? (
          <p className="text-lg text-gray-700 mb-2">
            تعادل في المركز الأول! مبروك للفائزين
          </p>
        ) : winners.length > 0 ? (
          <div className="mb-6">
            <p className="text-lg text-gray-700 mb-2">
              مبروك للفائز
            </p>
            <div className="flex justify-center items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative"
              >
                <div className="relative z-10">
                  <img 
                    src={winners[0].player.avatar} 
                    alt={winners[0].player.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-op-yellow shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-op-yellow rounded-full p-2 shadow-md">
                    <Award className="h-5 w-5 text-op-navy" />
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -bottom-3 -right-3 -left-3 -top-3 border-4 border-op-yellow rounded-full z-0 border-dashed"
                />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold text-op-navy mt-2">
              {winners[0].player.name}
            </h3>
            <p className="text-op-ocean font-medium">
              {winners[0].score} / {winners[0].totalQuestions} نقطة
            </p>
          </div>
        ) : null}
      </motion.div>
      
      <motion.div
        className="space-y-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedResults.map((result, index) => (
          <motion.div 
            key={result.player.id}
            className={`flex items-center p-4 rounded-lg ${getPositionClass(index)}`}
            variants={itemVariants}
          >
            <div className="mr-3 text-center min-w-[60px]">
              <span className="text-sm font-medium">{getPositionText(index)}</span>
            </div>
            
            <div className="flex items-center flex-1 mr-4">
              <img 
                src={result.player.avatar} 
                alt={result.player.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white mr-3"
              />
              <div>
                <h4 className="font-bold">{result.player.name}</h4>
                <div className="flex items-center">
                  <div className="h-2 bg-gray-200 rounded-full w-32 mr-2">
                    <div 
                      className="h-2 rounded-full bg-op-ocean"
                      style={{ width: `${(result.score / result.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{result.score} / {result.totalQuestions}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <button 
          onClick={onPlayAgain}
          className="btn-primary flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <RotateCcw size={18} />
          <span>لعب مرة أخرى</span>
        </button>
        
        <button 
          onClick={() => navigate('/')}
          className="btn-secondary flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <Home size={18} />
          <span>العودة للصفحة الرئيسية</span>
        </button>
      </motion.div>
    </div>
  );
};

export default ResultsScreen;
