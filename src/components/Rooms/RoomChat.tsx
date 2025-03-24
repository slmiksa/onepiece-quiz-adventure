
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bell } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_details?: {
    username: string;
    avatar: string;
  };
}

interface RoomChatProps {
  roomId: string;
}

const RoomChat: React.FC<RoomChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { user } = useAuth();
  const notificationSoundRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('room_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
        
      if (messagesError) throw messagesError;
      
      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }
      
      // Then fetch user details for each message
      const userIds = [...new Set(messagesData.map(msg => msg.user_id))];
      
      const messagesWithUserDetails: ChatMessage[] = await Promise.all(
        messagesData.map(async (message) => {
          try {
            // Fetch user details for each message individually to avoid RLS policy issues
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('username, avatar')
              .eq('id', message.user_id)
              .single();
              
            return {
              ...message,
              user_details: userData ? {
                username: userData.username,
                avatar: userData.avatar
              } : {
                username: 'مستخدم مجهول',
                avatar: ''
              }
            };
          } catch (err) {
            console.error('Error fetching user details:', err);
            return {
              ...message,
              user_details: {
                username: 'مستخدم مجهول',
                avatar: ''
              }
            };
          }
        })
      );
      
      setMessages(messagesWithUserDetails);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError('حدث خطأ أثناء جلب الرسائل');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Generate a unique channel name for this room
    const channelName = `room-messages-${roomId}-${Date.now()}`;
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          try {
            // Fetch the user details for this message
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('username, avatar')
              .eq('id', payload.new.user_id)
              .single();
            
            console.log('User data fetched:', userData);
              
            if (userError) {
              console.error('Error fetching user data:', userError);
              // Continue with a default user
            }
            
            // Create a new correctly typed ChatMessage object
            const newMessageObject: ChatMessage = {
              id: payload.new.id,
              user_id: payload.new.user_id,
              message: payload.new.message,
              created_at: payload.new.created_at,
              user_details: {
                username: userData?.username || 'مستخدم مجهول',
                avatar: userData?.avatar || ''
              }
            };
            
            console.log('Adding new message to state:', newMessageObject);
            
            // Add the new message to the state using functional update to avoid race conditions
            setMessages(prevMessages => [...prevMessages, newMessageObject]);
            
            // Play notification sound for messages from other users
            if (payload.new.user_id !== user?.id && notificationSoundRef.current) {
              notificationSoundRef.current.play().catch(err => {
                console.error("Could not play notification sound:", err);
              });
            }
          } catch (error) {
            console.error('Error processing new message:', error);
          }
        }
      )
      .subscribe();
      
    // Save the channel reference for cleanup
    channelRef.current = channel;
      
    return () => {
      // Clean up the subscription using the saved reference
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [roomId, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim() || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      setError(null);
      
      const messageToSend = newMessage.trim();
      
      // Clear input immediately for better UX
      setNewMessage('');
      
      console.log('Sending message:', messageToSend);
      
      // Insert message
      const { data, error } = await supabase
        .from('room_messages')
        .insert({
          room_id: roomId,
          user_id: user.id,
          message: messageToSend
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      console.log('Message sent successfully:', data);
      
      // Manually add the message to the UI to avoid waiting for the subscription
      if (data && data.length > 0) {
        const sentMessage: ChatMessage = {
          ...data[0],
          user_details: {
            username: user.username || 'أنت',
            avatar: user.avatar || ''
          }
        };
        
        setMessages(prevMessages => [...prevMessages, sentMessage]);
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError('حدث خطأ أثناء إرسال الرسالة');
      // Restore the message so the user can try again
      setNewMessage(newMessage);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-opacity-20 border-white shadow-glass flex flex-col h-full">
      <audio ref={notificationSoundRef} preload="auto">
        <source src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      <div className="p-3 border-b border-white border-opacity-20 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">الدردشة</h3>
        <Bell className="h-5 w-5 text-white opacity-80" />
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto rtl">
        {loading ? (
          <div className="text-center text-white opacity-70">جاري تحميل الرسائل...</div>
        ) : error ? (
          <Alert variant="destructive" className="bg-red-500 bg-opacity-20 border-red-500 text-white">
            <AlertTitle className="text-white">خطأ</AlertTitle>
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        ) : messages.length === 0 ? (
          <div className="text-center text-white opacity-70">لا توجد رسائل بعد. كن أول من يرسل رسالة!</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-3 ${msg.user_id === user?.id ? 'justify-start' : 'justify-start'}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.user_details?.avatar} alt={msg.user_details?.username} />
                  <AvatarFallback>{msg.user_details?.username?.slice(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] ${msg.user_id === user?.id ? 'bg-op-blue' : 'bg-op-deep-sea'} p-3 rounded-lg`}>
                  <div className="font-semibold text-white text-xs mb-1">{msg.user_details?.username || 'Unknown User'}</div>
                  <p className="text-white break-words whitespace-pre-wrap">{msg.message}</p>
                  <div className="text-xs text-gray-300 mt-1 text-left">
                    {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white border-opacity-20 flex gap-2 rtl">
        <div className="relative flex-grow">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك هنا..."
            className="min-h-[50px] max-h-[120px] bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300 resize-none py-2"
          />
        </div>
        <Button 
          type="submit" 
          className="bg-op-yellow text-op-navy hover:bg-op-straw h-[50px]"
          disabled={!newMessage.trim() || sendingMessage}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default RoomChat;
