
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RoomPlayers from '../components/Rooms/RoomPlayers';
import RoomChat from '../components/Rooms/RoomChat';
import { motion } from 'framer-motion';
import AuthenticatedRoute from '@/components/AuthenticatedRoute';
import { Button } from '@/components/ui/button';
import { Copy, Share2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [roomExists, setRoomExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verify room exists
  useEffect(() => {
    const checkRoom = async () => {
      if (!roomId) {
        setRoomExists(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('id')
          .eq('id', roomId)
          .single();

        if (error || !data) {
          setRoomExists(false);
        } else {
          setRoomExists(true);
        }
      } catch (error) {
        console.error('Error checking room:', error);
        setRoomExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkRoom();
  }, [roomId]);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>جاري التحميل...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!roomId || !roomExists) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-opacity-20 border-white shadow-glass p-10 max-w-md mx-auto">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">الغرفة غير موجودة</h2>
              <p className="text-white mb-6">الغرفة التي تحاول الوصول إليها غير موجودة أو تم حذفها.</p>
              <Button 
                onClick={() => navigate('/rooms')}
                className="bg-op-blue text-white hover:bg-op-ocean"
              >
                العودة إلى قائمة الغرف
              </Button>
            </div>
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
                    className="bg-op-blue text-white hover:bg-op-ocean border-none transition-all"
                  >
                    <Copy size={16} className="mr-1" />
                    {isCopied ? 'تم النسخ' : 'نسخ الرابط'}
                  </Button>
                  
                  <Button
                    onClick={shareRoomLink}
                    variant="outline"
                    size="sm"
                    className="bg-op-yellow text-op-navy hover:bg-op-straw border-none transition-all"
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
