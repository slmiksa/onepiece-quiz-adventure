
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface FormValues {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  maxPlayers: number;
}

const CreateRoom: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      difficulty: 'medium',
      maxPlayers: 4
    }
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Create room
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: values.name,
          owner_id: user.id,
          difficulty: values.difficulty,
          max_players: values.maxPlayers,
          status: 'waiting'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add creator as a player
      const { error: playerError } = await supabase
        .from('room_players')
        .insert({
          room_id: data.id,
          user_id: user.id
        });
      
      if (playerError) throw playerError;
      
      toast({
        title: 'تم إنشاء الغرفة بنجاح',
        description: 'يمكنك الآن مشاركة الرابط مع أصدقائك للانضمام',
      });
      
      // Navigate to room
      navigate(`/room/${data.id}`);
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إنشاء الغرفة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 border border-opacity-20 border-white shadow-glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-white">إنشاء غرفة جديدة</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rtl">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">اسم الغرفة</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="أدخل اسم الغرفة" 
                    required 
                    className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-white">مستوى الصعوبة</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2 flex-row-reverse">
                      <RadioGroupItem value="easy" id="easy" />
                      <Label htmlFor="easy" className="text-white">سهل</Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-row-reverse">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="text-white">متوسط</Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-row-reverse">
                      <RadioGroupItem value="hard" id="hard" />
                      <Label htmlFor="hard" className="text-white">صعب</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxPlayers"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">عدد اللاعبين (2-4)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={2}
                    max={4}
                    {...field}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val < 2) field.onChange(2);
                      else if (val > 4) field.onChange(4);
                      else field.onChange(val);
                    }}
                    className="bg-white bg-opacity-20 border-none text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-center gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/rooms')}
              className="w-1/2 border-white text-white hover:bg-white hover:bg-opacity-10"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              className="w-1/2 bg-op-yellow text-op-navy hover:bg-op-straw"
              disabled={loading}
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء الغرفة'}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default CreateRoom;
