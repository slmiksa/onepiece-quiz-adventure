
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Room {
  id: string;
  name: string;
  owner_id: string;
  status: string;
  difficulty: string;
  max_players: number;
  created_at: string;
  owner_username?: string;
  player_count?: number;
}

const RoomsList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Fetch rooms with owner username and player count
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          users!rooms_owner_id_fkey (username),
          room_players (count)
        `)
        .eq('status', 'waiting')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched rooms:', data);
      
      const formattedRooms = data.map((room) => ({
        ...room,
        owner_username: room.users?.username,
        player_count: room.room_players[0]?.count || 0
      }));
      
      setRooms(formattedRooms);
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب الغرف المتاحة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshRooms = () => {
    setRefreshing(true);
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
    
    // Subscribe to changes in the rooms table
    const roomsSubscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
        },
        (payload) => {
          console.log('Room change detected:', payload);
          fetchRooms();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_players',
        },
        (payload) => {
          console.log('Room players change detected:', payload);
          fetchRooms();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(roomsSubscription);
    };
  }, []);

  const handleJoinRoom = async (roomId: string) => {
    try {
      if (!user) return;
      
      // Check if user already in room
      const { data: existingPlayer, error: checkError } = await supabase
        .from('room_players')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingPlayer) {
        // User already in room, just navigate
        navigate(`/room/${roomId}`);
        return;
      }
      
      // Add user to room
      const { error: joinError } = await supabase
        .from('room_players')
        .insert({ room_id: roomId, user_id: user.id });
        
      if (joinError) throw joinError;
      
      // Navigate to room
      navigate(`/room/${roomId}`);
    } catch (error: any) {
      console.error('Error joining room:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الانضمام إلى الغرفة',
        variant: 'destructive',
      });
    }
  };

  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading && !refreshing) {
    return (
      <div className="text-center py-10">
        <div className="animate-pulse text-white">جاري تحميل الغرف المتاحة...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">الغرف المتاحة</h2>
        <div className="flex gap-2">
          <Button
            onClick={refreshRooms}
            variant="outline"
            className="bg-white text-op-navy hover:bg-gray-100 border-none"
            disabled={refreshing}
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تحديث'}
          </Button>
          <Button 
            onClick={handleCreateRoom}
            className="bg-op-yellow text-op-navy hover:bg-op-straw flex items-center gap-2"
          >
            <Plus size={18} />
            إنشاء غرفة
          </Button>
        </div>
      </div>
      
      {rooms.length === 0 ? (
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-8 text-center text-white">
          <p className="mb-4">لم يتم العثور على غرف متاحة</p>
          <Button 
            onClick={handleCreateRoom}
            className="bg-op-yellow text-op-navy hover:bg-op-straw"
          >
            إنشاء غرفة جديدة
          </Button>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              variants={itemVariants}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-5 border border-opacity-20 border-white shadow-glass rtl"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white">{room.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  room.difficulty === 'easy' ? 'bg-green-500' : 
                  room.difficulty === 'medium' ? 'bg-yellow-500' : 
                  'bg-red-500'
                } text-white`}>
                  {room.difficulty === 'easy' ? 'سهل' : 
                   room.difficulty === 'medium' ? 'متوسط' : 
                   'صعب'}
                </span>
              </div>
              
              <div className="mb-4 text-white text-sm">
                <p>المضيف: {room.owner_username}</p>
                <div className="flex items-center mt-2">
                  <Users size={16} className="mr-2" />
                  <span>{room.player_count} / {room.max_players} لاعبين</span>
                </div>
              </div>
              
              <Button
                onClick={() => handleJoinRoom(room.id)}
                className="w-full bg-op-blue hover:bg-op-ocean text-white"
                disabled={room.player_count >= room.max_players}
              >
                {room.player_count >= room.max_players ? 'الغرفة ممتلئة' : 'انضم الآن'}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RoomsList;
