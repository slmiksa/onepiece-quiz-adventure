
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getTopScores, DbQuizResult } from '../utils/supabaseHelpers';
import { motion } from 'framer-motion';
import { ArrowLeft, Medal, Trophy, Award } from 'lucide-react';
import { getDifficultyLabel } from '../utils/quizHelpers';

interface PlayerScore extends DbQuizResult {
  players: {
    name: string;
    avatar: string;
  };
}

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchScores = async () => {
      setIsLoading(true);
      const topScores = await getTopScores(20);
      setScores(topScores as PlayerScore[]);
      setIsLoading(false);
    };
    
    fetchScores();
  }, []);
  
  const filteredScores = filter === 'all' 
    ? scores 
    : scores.filter(score => score.difficulty === filter);
  
  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="text-yellow-500" />;
    if (index === 1) return <Medal className="text-gray-400" />;
    if (index === 2) return <Award className="text-amber-700" />;
    return <span className="text-gray-600 font-mono">{index + 1}</span>;
  };
  
  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 quiz-container">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="btn-secondary flex items-center rtl:space-x-reverse space-x-2"
            >
              <ArrowLeft size={18} />
              <span>الرجوع</span>
            </button>
            
            <h1 className="text-3xl md:text-4xl font-adventure text-white drop-shadow-lg">
              سجل النتائج
            </h1>
          </div>
          
          <div className="glass-card p-6 md:p-8 rtl">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    filter === 'all'
                      ? 'bg-op-ocean text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('easy')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'easy'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  سهل
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('medium')}
                  className={`px-4 py-2 text-sm font-medium ${
                    filter === 'medium'
                      ? 'bg-op-blue text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  متوسط
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('hard')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    filter === 'hard'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  صعب
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-op-ocean border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredScores.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">لم يتم تسجيل أي نتائج بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredScores.map((score, index) => (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center"
                  >
                    <div className="w-10 h-10 flex items-center justify-center mr-4">
                      {getMedalIcon(index)}
                    </div>
                    
                    <div className="flex items-center flex-1">
                      <img 
                        src={score.players.avatar} 
                        alt={score.players.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 mr-4"
                      />
                      
                      <div>
                        <h3 className="font-bold text-gray-800">{score.players.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="bg-gray-100 rounded px-2 py-0.5 mr-2">
                            {score.score}/{score.total_questions}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(score.created_at!).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        score.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800'
                          : score.difficulty === 'medium'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {getDifficultyLabel(score.difficulty)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/quiz')}
                className="btn-primary"
              >
                ابدأ لعبة جديدة
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
