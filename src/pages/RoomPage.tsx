
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RoomPlayers from '../components/Rooms/RoomPlayers';
import RoomChat from '../components/Rooms/RoomChat';
import { motion } from 'framer-motion';
import AuthenticatedRoute from '@/components/AuthenticatedRoute';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // Reset copy state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

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

  // Copy room link to clipboard
  const copyRoomLink = () => {
    const roomLink = window.location.href;
    navigator.clipboard.writeText(roomLink)
      .then(() => {
        setIsCopied(true);
        toast({
          title: 'تم النسخ',
          description: 'تم نسخ رابط الغرفة إلى الحافظة',
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          title: 'خطأ',
          description: 'فشل نسخ الرابط',
          variant: 'destructive',
        });
      });
  };

  // Share room link
  const shareRoomLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'غرفة اختبار ون بيس',
        text: 'انضم إلى غرفة اختبار ون بيس',
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: 'تمت المشاركة',
          description: 'تمت مشاركة رابط الغرفة بنجاح',
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      copyRoomLink();
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
              <div className="flex items-center justify-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-adventure text-white drop-shadow-lg">
                  غرفة اختبار ون بيس
                </h1>
                <div className="flex space-x-2">
                  <Button 
                    onClick={copyRoomLink} 
                    variant="outline" 
                    size="sm" 
                    className="bg-op-yellow text-op-navy hover:bg-op-straw border-none transition-all"
                  >
                    <Copy size={16} className="mr-1" />
                    {isCopied ? 'تم النسخ' : 'نسخ الرابط'}
                  </Button>
                  
                  <Button
                    onClick={shareRoomLink}
                    variant="outline"
                    size="sm"
                    className="bg-op-blue text-white hover:bg-op-ocean border-none transition-all"
                  >
                    <Share2 size={16} className="mr-1" />
                    مشاركة
                  </Button>
                </div>
              </div>
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
