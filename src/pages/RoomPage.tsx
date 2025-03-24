
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RoomPlayers from '../components/Rooms/RoomPlayers';
import RoomChat from '../components/Rooms/RoomChat';
import { motion } from 'framer-motion';
import AuthenticatedRoute from '@/components/AuthenticatedRoute';
import { Button } from '@/components/ui/button';
import { Copy, Share2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [roomExists, setRoomExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle connection attempts and room data fetching with improved error handling
  const checkRoom = useCallback(async () => {
    if (!roomId) {
      setRoomExists(false);
      setIsLoading(false);
      setErrorMessage("معرف الغرفة غير موجود في الرابط");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      console.log(`Checking if room ${roomId} exists (attempt ${retryCount + 1})`);
      
      // First, check if the room exists
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('id, status, name, owner_id, difficulty, max_players')
        .eq('id', roomId)
        .maybeSingle();

      if (roomError) {
        console.error('Error fetching room data:', roomError);
        throw new Error(roomError.message || 'حدث خطأ أثناء جلب بيانات الغرفة');
      }

      if (!roomData) {
        console.error('No room data returned');
        setRoomExists(false);
        setErrorMessage("الغرفة غير موجودة أو تم حذفها");
        setIsLoading(false);
        return;
      }
      
      console.log('Room data fetched successfully:', roomData);
      setRoomExists(true);
      setErrorMessage(null);
      
      // If game is already in 'playing' status, navigate to play
      if (roomData.status === 'playing') {
        console.log('Room is in playing state, redirecting to play screen');
        sessionStorage.setItem('quizRoomId', roomId);
        navigate('/play');
        return;
      }
    } catch (error: any) {
      console.error('Error checking room:', error);
      setErrorMessage(error.message || "حدث خطأ أثناء جلب بيانات الغرفة");
      
      // Retry logic if under max attempts
      if (retryCount < 3) {
        console.log(`Will retry in 2 seconds (attempt ${retryCount + 1} of 3)`);
        setIsRetrying(true);
        const timer = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setIsRetrying(false);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        console.log('Max retry attempts reached');
        setIsRetrying(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [roomId, navigate, retryCount]);

  useEffect(() => {
    checkRoom();
    
    // Set up realtime subscription to room status with unique channel names
    if (!roomId) return;
    
    const uniqueChannelId = `room-status-${roomId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`Creating realtime channel for room status: ${uniqueChannelId}`);
    
    const roomStatusChannel = supabase
      .channel(uniqueChannelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          console.log('Room status change detected:', payload);
          // If room status changed to 'playing'
          if (payload.new && typeof payload.new === 'object' && 'status' in payload.new && payload.new.status === 'playing') {
            console.log('Room status changed to playing, navigating to play screen');
            sessionStorage.setItem('quizRoomId', roomId as string);
            navigate('/play');
          }
          // If room was deleted
          if (payload.eventType === 'DELETE') {
            console.log('Room was deleted, updating UI');
            setRoomExists(false);
            setErrorMessage("تم حذف الغرفة");
          }
        }
      )
      .subscribe((status) => {
        console.log(`Room status subscription: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to room status changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to room status channel');
        }
      });
      
    return () => {
      console.log(`Removing channel: ${uniqueChannelId}`);
      supabase.removeChannel(roomStatusChannel);
    };
  }, [roomId, navigate, checkRoom]);

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
    console.log('Game starting...');
    setGameStarted(true);
    
    // Store room ID in session storage
    if (roomId) {
      // Store room settings in sessionStorage
      sessionStorage.setItem('quizRoomId', roomId);
      
      // Redirect to the quiz page
      navigate('/play');
    }
  };

  // Manual retry function with loading state
  const handleRetry = () => {
    console.log('Manual retry initiated');
    setRetryCount(0);
    setIsRetrying(true);
    
    // Small delay to show the loading state before retrying
    setTimeout(() => {
      checkRoom();
    }, 500);
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
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p>جاري تحميل بيانات الغرفة...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // عرض واجهة الخطأ مع زر إعادة المحاولة
  if (errorMessage) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-opacity-20 border-white shadow-glass p-10 max-w-md mx-auto">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">خطأ</h2>
              <Alert variant="destructive" className="mb-6 bg-red-500 bg-opacity-10">
                <AlertTitle>حدث خطأ أثناء جلب بيانات الغرفة</AlertTitle>
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={handleRetry}
                  className="bg-op-blue text-white hover:bg-op-ocean flex items-center gap-2"
                  disabled={isRetrying}
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري إعادة المحاولة...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      إعادة المحاولة
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => navigate('/rooms')}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:bg-opacity-10"
                >
                  العودة إلى قائمة الغرف
                </Button>
              </div>
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
                {roomId && <RoomPlayers roomId={roomId} onGameStart={handleGameStart} />}
              </div>
              <div className="md:col-span-2 h-[500px]">
                {roomId && <RoomChat roomId={roomId} />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthenticatedRoute>
  );
};

export default RoomPage;
