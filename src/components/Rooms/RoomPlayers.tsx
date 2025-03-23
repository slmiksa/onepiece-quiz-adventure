
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface RoomPlayer {
  id: string;
  user_id: string;
  ready: boolean;
  users: {
    username: string;
    avatar: string;
  };
  is_owner: boolean;
}

interface Room {
  id: string;
  name: string;
  owner_id: string;
  difficulty: string;
  status: string;
}

interface RoomPlayersProps {
  roomId: string;
  onGameStart: () => void;
}

const RoomPlayers: React.FC<RoomPlayersProps> = ({ roomId, onGameStart }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const isOwner = room?.owner_id === user?.id;

  const fetchRoomAndPlayers = async () => {
    try {
      setLoading(true);
      
      // Get room details
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();
        
      if (roomError) throw roomError;
      
      setRoom(roomData);
      
      // Get players with user details
      const { data: playersData, error: playersError } = await supabase
        .from('room_players')
        .select(`
          *,
          users (username, avatar)
        `)
        .eq('room_id', roomId);
        
      if (playersError) throw playersError;
      
      // Add is_owner flag
      const playersWithOwner = playersData.map(player => ({
        ...player,
        is_owner: player.user_id === roomData.owner_id
      }));
      
      setPlayers(playersWithOwner);
      
      // Check if current user is ready
      const currentPlayer = playersWithOwner.find(p => p.user_id === user?.id);
      if (currentPlayer) {
        setIsReady(currentPlayer.ready);
      }
      
      // If room status is 'playing', trigger onGameStart
      if (roomData.status === 'playing') {
        onGameStart();
      }
      
    } catch (error: any) {
      console.error('Error fetching room data:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب بيانات الغرفة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomAndPlayers();
    
    // Subscribe to player changes
    const playersSubscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_players',
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          fetchRoomAndPlayers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          setRoom(payload.new as Room);
          
          // If room status changed to 'playing', trigger onGameStart
          if (payload.new.status === 'playing') {
            onGameStart();
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(playersSubscription);
    };
  }, [roomId]);

  const toggleReady = async () => {
    if (!user) return;
    
    try {
      const newReadyState = !isReady;
      
      const { error } = await supabase
        .from('room_players')
        .update({ ready: newReadyState })
        .eq('room_id', roomId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setIsReady(newReadyState);
    } catch (error: any) {
      console.error('Error toggling ready state:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تغيير حالة الاستعداد',
        variant: 'destructive',
      });
    }
  };

  const startGame = async () => {
    if (!isOwner || players.length < 2) return;
    
    // Check if all players are ready
    const allReady = players.every(p => p.ready);
    
    if (!allReady) {
      toast({
        title: 'انتظر',
        description: 'لم يستعد جميع اللاعبين بعد',
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ status: 'playing' })
        .eq('id', roomId);
        
      if (error) throw error;
      
      // Game will start automatically due to subscription
    } catch (error: any) {
      console.error('Error starting game:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء بدء اللعبة',
        variant: 'destructive',
      });
    }
  };

  const copyRoomLink = () => {
    const roomUrl = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(roomUrl).then(() => {
      setIsCopied(true);
      toast({
        title: 'تم النسخ!',
        description: 'تم نسخ رابط الغرفة إلى الحافظة',
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-opacity-20 border-white shadow-glass p-6">
        <div className="animate-pulse text-white">جاري تحميل معلومات اللاعبين...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-opacity-20 border-white shadow-glass p-6">
        <div className="text-white">لم يتم العثور على الغرفة</div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-opacity-20 border-white shadow-glass p-6">
      <div className="flex justify-between items-center mb-4 rtl">
        <h3 className="text-xl font-bold text-white">{room.name}</h3>
        <div className="flex gap-2">
          <Button
            onClick={copyRoomLink}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:bg-opacity-10 flex items-center gap-1"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            <span>{isCopied ? 'تم النسخ' : 'نسخ الرابط'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:bg-opacity-10"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `غرفة ون بيس: ${room.name}`,
                  text: 'انضم إلي في اختبار ون بيس!',
                  url: `${window.location.origin}/room/${roomId}`,
                }).catch(console.error);
              } else {
                copyRoomLink();
              }
            }}
          >
            <Share2 size={16} />
          </Button>
        </div>
      </div>
      
      <div className="mb-4 rtl">
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded text-xs ${
            room.difficulty === 'easy' ? 'bg-green-500' : 
            room.difficulty === 'medium' ? 'bg-yellow-500' : 
            'bg-red-500'
          } text-white`}>
            {room.difficulty === 'easy' ? 'سهل' : 
             room.difficulty === 'medium' ? 'متوسط' : 
             'صعب'}
          </span>
          <span className="text-white mx-2">•</span>
          <span className="text-white text-sm">{players.length} لاعبين</span>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {players.map((player) => (
          <div key={player.id} className="flex items-center justify-between bg-white bg-opacity-5 p-3 rounded-lg rtl">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={player.users.avatar} alt={player.users.username} />
                <AvatarFallback>{player.users.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{player.users.username}</span>
                  {player.is_owner && (
                    <span className="bg-op-yellow text-op-navy text-xs px-2 py-0.5 rounded">المضيف</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {player.ready ? (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Check size={14} />
                  مستعد
                </span>
              ) : (
                <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                  غير مستعد
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-4 mt-6 rtl">
        {isOwner ? (
          <Button 
            onClick={startGame}
            className={`w-full ${
              players.every(p => p.ready) && players.length >= 2
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-500 cursor-not-allowed'
            } text-white`}
            disabled={!players.every(p => p.ready) || players.length < 2}
          >
            بدء اللعبة
          </Button>
        ) : (
          <Button 
            onClick={toggleReady}
            className={`w-full ${
              isReady 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isReady ? 'إلغاء الاستعداد' : 'أنا مستعد'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoomPlayers;
