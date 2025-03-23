
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RoomPlayers from '../components/Rooms/RoomPlayers';
import RoomChat from '../components/Rooms/RoomChat';
import { motion } from 'framer-motion';
import AuthenticatedRoute from '@/components/AuthenticatedRoute';

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);

  // Handle game start
  const handleGameStart = () => {
    setGameStarted(true);
    
    // Store room ID in session storage
    if (roomId) {
      // Store room settings in sessionStorage
      sessionStorage.setItem('quizRoomId', roomId);
      
      // Redirect to the quiz page
      navigate('/play');
    }
  };

  if (!roomId) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container">
          <div className="container mx-auto px-4 text-center text-white">
            غرفة غير موجودة
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <AuthenticatedRoute>
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-adventure text-white mb-2 drop-shadow-lg">
                غرفة اختبار ون بيس
              </h1>
              <p className="text-lg text-white max-w-2xl mx-auto drop-shadow">
                انتظر انضمام اللاعبين واستعد للمنافسة
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <RoomPlayers roomId={roomId} onGameStart={handleGameStart} />
              </div>
              <div className="md:col-span-2 h-[500px]">
                <RoomChat roomId={roomId} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthenticatedRoute>
  );
};

export default RoomPage;
