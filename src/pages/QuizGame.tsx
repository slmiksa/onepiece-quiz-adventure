
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import PlayerSetup, { Player } from '../components/PlayerSetup';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const QuizGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Check if coming from profile with room ID
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('roomId');
  
  useEffect(() => {
    // If we have a roomId, navigate directly to the room
    if (roomId) {
      navigate(`/room/${roomId}`);
    } else {
      setLoading(false);
    }
  }, [roomId, navigate]);
  
  const handlePlayersSubmit = (players: Player[], difficulty: string) => {
    // Store the players and difficulty in sessionStorage
    sessionStorage.setItem('quizPlayers', JSON.stringify(players));
    sessionStorage.setItem('quizDifficulty', difficulty);
    
    // Navigate to the quiz gameplay page
    navigate('/play');
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-op-yellow border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-adventure text-op-navy mb-4 drop-shadow-lg">
              اختبار ون بيس
            </h1>
            <p className="text-lg text-op-navy max-w-2xl mx-auto drop-shadow">
              اختبر معرفتك بعالم ون بيس مع أصدقائك! يمكنك تسجيل من لاعب واحد إلى خمسة لاعبين.
            </p>
          </motion.div>
          
          <div className="flex justify-center rtl">
            <PlayerSetup onPlayersSubmit={handlePlayersSubmit} />
          </div>
          
          <motion.div 
            className="mt-12 max-w-2xl mx-auto bg-white/80 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-op-navy rtl shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-4 text-op-yellow">كيفية اللعب</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>ستواجه كل لاعب 10 أسئلة عن ون بيس بالتناوب.</li>
              <li>لديك 30 ثانية للإجابة على كل سؤال.</li>
              <li>كل لاعب لديه 3 وسائل مساعدة:</li>
              <ul className="mr-6 mt-2 space-y-2">
                <li>حذف إجابتين خاطئتين.</li>
                <li>الحصول على تلميح تقريبي للجواب.</li>
                <li>تغيير السؤال الحالي بسؤال آخر.</li>
              </ul>
              <li>في نهاية الجولة، سيتم عرض نتائج جميع اللاعبين.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizGame;
