
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Player } from './PlayerSetup';
import { Award, RotateCcw, Home, TrendingUp, Share2 } from 'lucide-react';
import { saveQuizResult } from '../utils/supabaseHelpers';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PlayerResult {
  player: Player;
  score: number;
  totalQuestions: number;
}

interface ResultsScreenProps {
  results: PlayerResult[];
  onPlayAgain: () => void;
  difficulty: string;
  dbPlayerIds?: Record<number, string>;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  results, 
  onPlayAgain, 
  difficulty,
  dbPlayerIds = {} 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(true);
  const [showShareLink, setShowShareLink] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  // Sort players by score (descending)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  
  // Determine if there's a tie for first place
  const highestScore = sortedResults[0]?.score || 0;
  const winners = sortedResults.filter(r => r.score === highestScore);
  const isTie = winners.length > 1;
  
  useEffect(() => {
    const saveResults = async () => {
      try {
        // Save all results to the database
        for (const result of results) {
          const dbPlayerId = dbPlayerIds[result.player.id];
          
          // Skip if we don't have a database ID for this player
          if (!dbPlayerId) continue;
          
          await saveQuizResult(
            dbPlayerId,
            result.score,
            result.totalQuestions,
            difficulty
          );
        }
        
        toast({
          title: "تم حفظ النتائج",
          description: "تم حفظ نتائج الاختبار بنجاح",
          variant: "default"
        });
      } catch (error) {
        console.error('Error saving results:', error);
        toast({
          title: "خطأ في الحفظ",
          description: "تعذر حفظ نتائج الاختبار",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    };
    
    saveResults();
  }, [results, dbPlayerIds, difficulty, toast]);
  
  const handleShareResults = () => {
    // Generate a share link with results encoded in query params
    const resultsData = encodeURIComponent(JSON.stringify({
      players: results.map(r => ({
        name: r.player.name,
        score: r.score,
        total: r.totalQuestions
      })),
      difficulty
    }));
    
    const shareUrl = `${window.location.origin}/quiz?share=${resultsData}`;
    setShareLink(shareUrl);
    setShowShareLink(true);
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ رابط المشاركة إلى الحافظة",
          variant: "default"
        });
      })
      .catch(() => {
        toast({
          title: "تعذر نسخ الرابط",
          description: "يرجى نسخ الرابط يدويًا",
          variant: "destructive"
        });
      });
  };
  
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
      {isSaving && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg z-10">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-5 h-5 border-4 border-op-ocean border-t-transparent rounded-full animate-spin"></div>
            <span className="text-op-navy">جارٍ حفظ النتائج...</span>
          </div>
        </div>
      )}
      
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
                  <Avatar className="w-24 h-24 border-4 border-op-yellow">
                    <AvatarImage 
                      src={winners[0].player.avatar} 
                      alt={winners[0].player.name}
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className="bg-op-ocean text-white text-xl">
                      {winners[0].player.name?.substring(0, 2) || "OP"}
                    </AvatarFallback>
                  </Avatar>
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
              <Avatar className="w-12 h-12 border-2 border-white mr-3">
                <AvatarImage 
                  src={result.player.avatar} 
                  alt={result.player.name}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="bg-op-ocean text-white">
                  {result.player.name?.substring(0, 2) || "OP"}
                </AvatarFallback>
              </Avatar>
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
      
      {showShareLink && (
        <motion.div 
          className="mb-6 bg-white bg-opacity-20 p-4 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p className="mb-2 font-medium text-op-navy">رابط المشاركة:</p>
          <div className="flex items-center bg-white bg-opacity-40 rounded p-2">
            <input 
              type="text" 
              value={shareLink} 
              readOnly 
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700" 
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast({
                  title: "تم النسخ",
                  description: "تم نسخ الرابط إلى الحافظة",
                  variant: "default"
                });
              }}
              className="ml-2 p-2 bg-op-ocean text-white rounded hover:bg-op-blue transition"
            >
              نسخ
            </button>
          </div>
        </motion.div>
      )}
      
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
          onClick={handleShareResults}
          className="btn-accent flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <Share2 size={18} />
          <span>مشاركة النتائج</span>
        </button>
        
        <button 
          onClick={() => navigate('/leaderboard')}
          className="btn-accent flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <TrendingUp size={18} />
          <span>سجل النتائج</span>
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
