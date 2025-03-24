
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Gamepad, Share2, Key, UserCircle } from 'lucide-react';
import AuthenticatedRoute from '@/components/AuthenticatedRoute';

const ProfilePage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [username, setUsername] = useState(userProfile?.username || '');
  const [favoriteCharacter, setFavoriteCharacter] = useState(userProfile?.favoriteCharacter || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  const [roomName, setRoomName] = useState('');
  const [roomDifficulty, setRoomDifficulty] = useState('medium');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمة المرور الجديدة والتأكيد",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "كلمة المرور قصيرة جدًا",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح"
      });
      
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: error.message || "حدث خطأ أثناء محاولة تغيير كلمة المرور",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleProfileUpdate = async () => {
    try {
      setIsUpdatingProfile(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          favorite_character: favoriteCharacter
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم تحديث معلومات ملفك الشخصي بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: error.message || "حدث خطأ أثناء محاولة تحديث الملف الشخصي",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      toast({
        title: "اسم الغرفة مطلوب",
        description: "يرجى إدخال اسم للغرفة",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCreatingRoom(true);
      
      const { data: room, error } = await supabase
        .from('rooms')
        .insert([
          {
            name: roomName,
            difficulty: roomDifficulty,
            owner_id: user?.id,
            status: 'waiting'
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      if (!room) throw new Error("لم يتم إنشاء الغرفة");
      
      // إضافة المالك كلاعب في الغرفة
      const { error: playerError } = await supabase
        .from('room_players')
        .insert([
          {
            room_id: room.id,
            user_id: user?.id,
            ready: false
          }
        ]);
        
      if (playerError) throw playerError;
      
      const shareUrl = `${window.location.origin}/room/${room.id}`;
      setShareLink(shareUrl);
      
      toast({
        title: "تم إنشاء الغرفة",
        description: "تم إنشاء الغرفة بنجاح. يمكنك مشاركة الرابط مع أصدقائك."
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الغرفة",
        description: error.message || "حدث خطأ أثناء محاولة إنشاء الغرفة",
        variant: "destructive"
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط الغرفة إلى الحافظة"
    });
  };
  
  const startGame = () => {
    if (!shareLink) return;
    
    const roomId = shareLink.split('/').pop();
    navigate(`/room/${roomId}`);
  };
  
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
                الملف الشخصي
              </h1>
              <p className="text-lg text-white max-w-2xl mx-auto drop-shadow">
                إدارة معلوماتك الشخصية وإعدادات حسابك
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="profile" className="rtl">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <UserCircle size={16} />
                    <span>الملف الشخصي</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Key size={16} />
                    <span>الأمان</span>
                  </TabsTrigger>
                  <TabsTrigger value="games" className="flex items-center gap-2">
                    <Gamepad size={16} />
                    <span>إنشاء لعبة</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white shadow-glass text-white">
                    <CardHeader>
                      <CardTitle>معلومات الملف الشخصي</CardTitle>
                      <CardDescription className="text-white text-opacity-70">
                        قم بتعديل معلومات ملفك الشخصي هنا
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center mb-6">
                        <Avatar className="w-24 h-24 border-2 border-white">
                          <AvatarImage src={user?.user_metadata?.avatar || ''} />
                          <AvatarFallback className="bg-op-ocean text-white text-xl">
                            {username?.substring(0, 2) || user?.email?.substring(0, 2) || 'OP'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          value={user?.email || ''}
                          readOnly
                          className="bg-white bg-opacity-5 border-white border-opacity-20 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">اسم المستخدم</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="bg-white bg-opacity-5 border-white border-opacity-20 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="favorite">الشخصية المفضلة</Label>
                        <Input
                          id="favorite"
                          value={favoriteCharacter}
                          onChange={(e) => setFavoriteCharacter(e.target.value)}
                          className="bg-white bg-opacity-5 border-white border-opacity-20 text-white"
                          placeholder="لوفي، زورو، نامي، ..."
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={isUpdatingProfile}
                        className="w-full bg-op-yellow text-op-navy hover:bg-op-straw"
                      >
                        {isUpdatingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white shadow-glass text-white">
                    <CardHeader>
                      <CardTitle>إعدادات الأمان</CardTitle>
                      <CardDescription className="text-white text-opacity-70">
                        قم بتغيير كلمة المرور وإعدادات الأمان الخاصة بحسابك
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        كلمة المرور القوية تساعد في حماية حسابك من الاختراق. نوصي بتغيير كلمة المرور بشكل دوري.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-op-ocean text-white hover:bg-op-blue">
                            تغيير كلمة المرور
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white sm:max-w-[425px] rtl">
                          <DialogHeader>
                            <DialogTitle>تغيير كلمة المرور</DialogTitle>
                            <DialogDescription>
                              قم بإدخال كلمة المرور الجديدة وتأكيدها أدناه.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                              <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handlePasswordChange}
                              disabled={isChangingPassword}
                              className="bg-op-yellow text-op-navy hover:bg-op-straw"
                            >
                              {isChangingPassword ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="games">
                  <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white shadow-glass text-white">
                    <CardHeader>
                      <CardTitle>إنشاء غرفة لعب جديدة</CardTitle>
                      <CardDescription className="text-white text-opacity-70">
                        أنشئ غرفة واستضف أصدقاءك للعب معًا (حتى 4 لاعبين)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="room-name">اسم الغرفة</Label>
                        <Input
                          id="room-name"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                          className="bg-white bg-opacity-5 border-white border-opacity-20 text-white"
                          placeholder="غرفة ون بيس"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>مستوى الصعوبة</Label>
                        <div className="flex gap-3 rtl">
                          <Button
                            type="button"
                            onClick={() => setRoomDifficulty('easy')}
                            className={`flex-1 ${
                              roomDifficulty === 'easy'
                                ? 'bg-green-500 text-white'
                                : 'bg-white bg-opacity-5 text-white'
                            }`}
                          >
                            سهل
                          </Button>
                          
                          <Button
                            type="button"
                            onClick={() => setRoomDifficulty('medium')}
                            className={`flex-1 ${
                              roomDifficulty === 'medium'
                                ? 'bg-op-blue text-white'
                                : 'bg-white bg-opacity-5 text-white'
                            }`}
                          >
                            متوسط
                          </Button>
                          
                          <Button
                            type="button"
                            onClick={() => setRoomDifficulty('hard')}
                            className={`flex-1 ${
                              roomDifficulty === 'hard'
                                ? 'bg-red-500 text-white'
                                : 'bg-white bg-opacity-5 text-white'
                            }`}
                          >
                            صعب
                          </Button>
                        </div>
                      </div>
                      
                      {shareLink && (
                        <div className="bg-white bg-opacity-5 p-4 rounded-md mt-4">
                          <Label className="block mb-2">رابط المشاركة</Label>
                          <div className="flex gap-2">
                            <Input
                              value={shareLink}
                              readOnly
                              className="bg-white bg-opacity-5 border-white border-opacity-20 text-white flex-grow"
                            />
                            <Button
                              onClick={copyShareLink}
                              className="bg-op-ocean text-white hover:bg-op-blue"
                            >
                              نسخ
                            </Button>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <Button
                              onClick={startGame}
                              className="bg-op-yellow text-op-navy hover:bg-op-straw flex items-center gap-2"
                            >
                              <Gamepad size={16} />
                              <span>بدء اللعبة</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    {!shareLink && (
                      <CardFooter>
                        <Button
                          onClick={handleCreateRoom}
                          disabled={isCreatingRoom || !roomName.trim()}
                          className="w-full bg-op-yellow text-op-navy hover:bg-op-straw flex items-center gap-2"
                        >
                          <Share2 size={16} />
                          <span>{isCreatingRoom ? 'جاري الإنشاء...' : 'إنشاء غرفة وتوليد رابط'}</span>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    </AuthenticatedRoute>
  );
};

export default ProfilePage;
