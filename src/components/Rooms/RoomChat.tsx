
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bell } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  users: {
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
  const [sendingMessage, setSendingMessage] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const notificationSoundRef = useRef<HTMLAudioElement>(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('room_messages')
        .select(`
          *,
          users (username, avatar)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب الرسائل',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          // Fetch complete message with user data
          supabase
            .from('room_messages')
            .select(`
              *,
              users (username, avatar)
            `)
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setMessages((prevMessages) => [...prevMessages, data]);
                
                // Play notification sound for messages from other users
                if (data.user_id !== user?.id && notificationSoundRef.current) {
                  notificationSoundRef.current.play().catch(err => {
                    console.error("Could not play notification sound:", err);
                  });
                  
                  // Show toast notification
                  toast({
                    title: 'رسالة جديدة',
                    description: `${data.users.username}: ${data.message.substring(0, 30)}${data.message.length > 30 ? '...' : ''}`,
                  });
                }
              }
            });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [roomId, user?.id, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim() || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      
      // Insert message
      const { error } = await supabase
        .from('room_messages')
        .insert({
          room_id: roomId,
          user_id: user.id,
          message: newMessage.trim()
        });
        
      if (error) throw error;
      
      // Clear input
      setNewMessage('');
      
      // Show success toast
      toast({
        title: 'تم الإرسال',
        description: 'تم إرسال رسالتك بنجاح',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الرسالة',
        variant: 'destructive',
      });
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
                  <AvatarImage src={msg.users.avatar} alt={msg.users.username} />
                  <AvatarFallback>{msg.users.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] ${msg.user_id === user?.id ? 'bg-op-blue' : 'bg-op-deep-sea'} p-3 rounded-lg`}>
                  <div className="font-semibold text-white text-xs mb-1">{msg.users.username}</div>
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
