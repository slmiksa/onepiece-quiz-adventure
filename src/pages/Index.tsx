
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Trophy, Scroll } from 'lucide-react';
import { getTopScores } from '../utils/supabaseHelpers';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  
  useEffect(() => {
    // Load top players from the database
    const loadTopPlayers = async () => {
      try {
        const topScores = await getTopScores(3);
        setTopPlayers(topScores);
      } catch (error) {
        console.error('Error loading top players:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTopPlayers();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1a3a] to-[#0a2756] text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: 'cover'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-adventure text-op-yellow mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              عالم ون بيس
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            استمتع بعالم ون بيس المذهل مع أصدقائك! استكشف الأخبار، اختبر معرفتك، وتنافس مع الأصدقاء في مسابقة ممتعة.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <NavigationCard 
              title="اختبار ون بيس"
              description="اختبر معلوماتك حول أنمي ون بيس"
              icon={<Play className="w-10 h-10 text-op-yellow" />}
              onClick={() => navigate('/quiz')}
              color="bg-gradient-to-br from-blue-600 to-blue-800"
            />
            
            <NavigationCard 
              title="أخبار المانجا"
              description="آخر أخبار وإصدارات مانجا ون بيس"
              icon={<BookOpen className="w-10 h-10 text-op-yellow" />}
              onClick={() => navigate('/manga')}
              color="bg-gradient-to-br from-purple-600 to-purple-800"
            />
            
            <NavigationCard 
              title="قائمة المتصدرين"
              description="شاهد أفضل اللاعبين في اختبار ون بيس"
              icon={<Trophy className="w-10 h-10 text-op-yellow" />}
              onClick={() => navigate('/leaderboard')}
              color="bg-gradient-to-br from-amber-600 to-amber-800"
            />
          </motion.div>
        </div>
        
        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-op-yellow">اسحب للأسفل</span>
            <div className="w-6 h-10 border-2 border-op-yellow rounded-full flex justify-center">
              <motion.div 
                className="w-1.5 h-1.5 bg-op-yellow rounded-full"
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Top Players Section */}
      <div className="py-24 bg-[#0d2149]">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block">
              <h2 className="text-3xl md:text-4xl font-adventure text-op-yellow mb-4">
                أفضل اللاعبين
              </h2>
              <div className="h-1 bg-op-yellow w-1/2 mx-auto rounded-full" />
            </div>
            <p className="text-lg mt-4 max-w-2xl mx-auto text-gray-300">
              تعرف على أفضل اللاعبين في اختبار ون بيس وانضم إلى المنافسة
            </p>
          </motion.div>
          
          <div className="max-w-5xl mx-auto rtl">
            {loading ? (
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-op-yellow border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topPlayers.length > 0 ? (
                  topPlayers.map((player, index) => (
                    <motion.div
                      key={player.id}
                      className={`bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 ${
                        index === 0 ? 'md:col-span-3 md:flex' : ''
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      {index === 0 ? (
                        <>
                          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex justify-center">
                            <div className="relative">
                              <img
                                src={(player.players as any)?.avatar || 'https://i.pinimg.com/564x/c5/25/64/c52564e5004db2a86f023d9c12767433.jpg'}
                                alt={(player.players as any)?.name || 'الفائز'}
                                className="w-24 h-24 rounded-full object-cover border-4 border-op-yellow"
                              />
                              <div className="absolute -top-3 -right-3 bg-op-yellow text-op-navy rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">1</div>
                            </div>
                          </div>
                          <div className="flex-1 text-center md:text-right">
                            <h3 className="text-2xl font-bold mb-2">
                              {(player.players as any)?.name || 'الفائز'}
                            </h3>
                            <div className="flex justify-center md:justify-start items-center gap-4 mb-3">
                              <span className="text-op-yellow font-bold text-xl">
                                {player.score} / {player.total_questions}
                              </span>
                              <span className="text-gray-400 text-sm">
                                {player.difficulty === 'easy' ? 'سهل' : 
                                 player.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                              </span>
                            </div>
                            <div className="text-gray-400 text-sm">
                              تاريخ اللعب: {new Date(player.created_at).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <div className="relative">
                              <img
                                src={(player.players as any)?.avatar || 'https://i.pinimg.com/564x/c5/25/64/c52564e5004db2a86f023d9c12767433.jpg'}
                                alt={(player.players as any)?.name || 'لاعب'}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-400"
                              />
                              <div className="absolute -top-2 -right-2 bg-gray-200 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {(player.players as any)?.name || 'لاعب'}
                          </h3>
                          <div className="flex justify-center items-center gap-2 mb-2">
                            <span className="text-op-yellow font-bold">
                              {player.score} / {player.total_questions}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {player.difficulty === 'easy' ? 'سهل' : 
                               player.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-xl">لم يتم تسجيل أي نتائج بعد</p>
                    <button 
                      onClick={() => navigate('/quiz')}
                      className="mt-4 px-6 py-2 bg-op-yellow text-op-navy rounded-md font-medium"
                    >
                      كن أول من يلعب!
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/leaderboard')}
                className="px-6 py-3 bg-transparent border border-op-yellow text-op-yellow rounded-md font-medium hover:bg-op-yellow hover:bg-opacity-10 transition-all flex items-center mx-auto space-x-2 rtl:space-x-reverse"
              >
                <span>عرض جميع النتائج</span>
                <Trophy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#091633] py-12 text-center rtl">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.pinimg.com/564x/7a/b8/55/7ab8554f1c4cdf0cc14334e05b0dd35d.jpg" 
              alt="One Piece Logo" 
              className="h-20 object-contain"
            />
          </div>
          <p className="text-gray-400 max-w-md mx-auto">
            موقع غير رسمي لعالم ون بيس، تم إنشاؤه بواسطة محبي السلسلة.
            حقوق الشخصيات والقصة محفوظة لمؤلف السلسلة إييتشيرو أودا.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ title, description, icon, onClick, color }) => {
  return (
    <motion.div
      className={`${color} rounded-xl p-6 w-full md:w-[300px] cursor-pointer overflow-hidden relative group`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-white bg-opacity-10" />
      <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-black bg-opacity-10" />
      
      <div className="flex flex-col items-center md:items-start h-full relative z-10">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-200 mb-6 text-center md:text-right">{description}</p>
        <div className="mt-auto">
          <motion.div 
            className="w-8 h-8 rounded-full bg-op-yellow flex items-center justify-center transform group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform"
            initial={{ x: 0 }}
            whileHover={{ x: 0 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-op-navy rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Index;
