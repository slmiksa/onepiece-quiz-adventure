import React, { useState, useEffect, useCallback } from 'react';
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
  user_details?: {
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
  status: 'waiting' | 'playing' | 'finished';
  max_players: number;
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

  const fetchRoomAndPlayers = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log(`Fetching room and players for room ${roomId}`);
      
      // Get room details
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();
        
      if (roomError) {
        console.error('Error fetching room:', roomError);
        throw roomError;
      }
      
      if (!roomData) {
        console.error('No room data found');
        setLoading(false);
        return;
      }
      
      console.log('Room data:', roomData);
      setRoom(roomData as Room);
      
      // Get ALL players for this room using exact count
      const { data: playersData, count, error: playersError } = await supabase
        .from('room_players')
        .select('*', { count: 'exact' })
        .eq('room_id', roomId);
        
      if (playersError) {
        console.error('Error fetching players:', playersError);
        throw playersError;
      }
      
      console.log(`Found ${count} players in room ${roomId}`);
      console.log('Players data:', playersData);
      
      if (!playersData || playersData.length === 0) {
        setPlayers([]);
        setLoading(false);
        // If the user is not in the room and is authenticated, join automatically
        if (user) {
          joinRoom();
        }
        return;
      }
      
      // Fetch user details for each player
      const userIds = playersData.map(player => player.user_id);
      
      console.log('Fetching user details for IDs:', userIds);
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, username, avatar')
        .in('id', userIds);
        
      if (usersError) {
        console.error('Error fetching user details:', usersError);
        throw usersError;
      }
      
      console.log('User details:', usersData);
      
      // Map user details to players
      const playersWithUserDetails = playersData.map(player => {
        const userDetail = usersData?.find(u => u.id === player.user_id);
        return {
          ...player,
          user_details: userDetail ? {
            username: userDetail.username,
            avatar: userDetail.avatar
          } : {
            username: 'Unknown User',
            avatar: ''
          },
          is_owner: player.user_id === roomData.owner_id
        };
      });
      
      console.log('Players with user details:', playersWithUserDetails);
      setPlayers(playersWithUserDetails);
      
      // Check if current user is ready
      const currentPlayer = playersWithUserDetails.find(p => p.user_id === user?.id);
      if (currentPlayer) {
        setIsReady(currentPlayer.ready);
      } else if (user) {
        // User is not in the room yet, join automatically
        joinRoom();
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
  }, [roomId, user, toast, onGameStart]);

  const joinRoom = async () => {
    if (!user) return;
    
    try {
      // Check if user is already in the room
      const { data: existingPlayer, error: checkError } = await supabase
        .from('room_players')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking if user is in room:', checkError);
        return;
      }
      
      if (existingPlayer) {
        console.log('User already in room');
        return;
      }
      
      console.log(`User ${user.id} joining room ${roomId}`);
      
      // Add user to room
      const { error: joinError } = await supabase
        .from('room_players')
        .insert({
          room_id: roomId,
          user_id: user.id,
          ready: false
        });
        
      if (joinError) {
        console.error('Error joining room:', joinError);
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء الانضمام إلى الغرفة',
          variant: 'destructive',
        });
      } else {
        console.log('User joined room successfully');
        toast({
          title: 'تم الانضمام',
          description: 'تم انضمامك إلى الغرفة بنجاح',
        });
        // Refresh players after joining
        fetchRoomAndPlayers();
      }
    } catch (error) {
      console.error('Exception joining room:', error);
    }
  };

  useEffect(() => {
    console.log('Room component mounted or roomId changed');
    fetchRoomAndPlayers();
    
    // Set up realtime subscriptions with a unique channel name to prevent conflicts
    const channelName = `room-changes-${roomId}-${Date.now()}`;
    console.log(`Creating realtime channel: ${channelName}`);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_players',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log('Room players change detected:', payload);
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
          console.log('Room change detected:', payload);
          if (payload.new && typeof payload.new === 'object' && 'status' in payload.new) {
            setRoom(payload.new as Room);
            
            // If room status changed to 'playing', trigger onGameStart
            if (payload.new.status === 'playing') {
              onGameStart();
            }
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });
      
    // Cleanup function
    return () => {
      console.log(`Removing channel: ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [roomId, fetchRoomAndPlayers]);

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
      toast({
        title: newReadyState ? 'أنت الآن مستعد' : 'تم إلغاء الاستعداد',
        description: newReadyState ? 'تم تعيين حالتك كمستعد للعب' : 'تم إلغاء حالة الاستعداد',
      });
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
      
      toast({
        title: 'بدأت اللعبة',
        description: 'تم بدء اللعبة بنجاح',
      });
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
            className="text-white border-white hover:bg-white hover:bg-opacity-10 flex items-center gap-1 bg-op-blue"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            <span>{isCopied ? 'تم النسخ' : 'نسخ الرابط'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:bg-opacity-10 bg-op-blue"
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
          <span className="text-white text-sm">{players.length} / {room.max_players} لاعبين</span>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {players.map((player) => (
          <div key={player.id} className="flex items-center justify-between bg-white bg-opacity-5 p-3 rounded-lg rtl">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={player.user_details?.avatar} alt={player.user_details?.username} />
                <AvatarFallback>{player.user_details?.username?.slice(0, 2).toUpperCase() || 'OP'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{player.user_details?.username || 'Unknown User'}</span>
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
