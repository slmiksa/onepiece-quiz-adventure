
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  createAnnouncement, 
  getAnnouncements, 
  updateAnnouncement,
  deleteAnnouncement,
  DbAnnouncement,
} from '@/utils/supabaseHelpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Bell, Edit, Plus, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const AnnouncementsManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<DbAnnouncement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<DbAnnouncement | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const allAnnouncements = await getAnnouncements();
      setAnnouncements(allAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب الإعلانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsActive(true);
    setEditingAnnouncement(null);
  };

  const handleOpenDialog = (announcement?: DbAnnouncement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setTitle(announcement.title);
      setContent(announcement.content);
      setIsActive(announcement.active);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingAnnouncement) {
        // Update existing announcement
        const success = await updateAnnouncement(
          editingAnnouncement.id,
          { title, content, active: isActive }
        );
        
        if (success) {
          setAnnouncements(announcements.map(a => 
            a.id === editingAnnouncement.id 
              ? { ...a, title, content, active: isActive, updated_at: new Date().toISOString() } 
              : a
          ));
          
          toast({
            title: 'تم التحديث',
            description: 'تم تحديث الإعلان بنجاح',
          });
        } else {
          throw new Error('فشل تحديث الإعلان');
        }
      } else {
        // Create new announcement
        const newAnnouncement = await createAnnouncement(title, content, isActive);
        
        if (newAnnouncement) {
          setAnnouncements([newAnnouncement, ...announcements]);
          
          toast({
            title: 'تم الإنشاء',
            description: 'تم إنشاء الإعلان بنجاح',
          });
        } else {
          throw new Error('فشل إنشاء الإعلان');
        }
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ الإعلان',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الإعلان؟')) {
      try {
        const success = await deleteAnnouncement(id);
        
        if (success) {
          setAnnouncements(announcements.filter(a => a.id !== id));
          
          toast({
            title: 'تم الحذف',
            description: 'تم حذف الإعلان بنجاح',
          });
        } else {
          throw new Error('فشل حذف الإعلان');
        }
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء حذف الإعلان',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">إدارة الإعلانات</h1>
        <div className="flex gap-2">
          <Button 
            onClick={fetchAnnouncements}
            variant="outline"
          >
            تحديث
          </Button>
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="ml-2 h-4 w-4" /> إضافة إعلان جديد
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            قائمة الإعلانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>المحتوى</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    لا يوجد إعلانات
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((announcement, index) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{announcement.title}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{announcement.content}</TableCell>
                    <TableCell>
                      {announcement.active ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">نشط</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">غير نشط</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(announcement.created_at), 'PPP', { locale: ar })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDialog(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(announcement.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" onInteractOutside={handleCloseDialog}>
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right col-span-1">
                  العنوان
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right col-span-1 mt-2">
                  المحتوى
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="col-span-3"
                  rows={5}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right col-span-1">
                  نشط
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                إلغاء
              </Button>
              <Button type="submit">
                {editingAnnouncement ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsManagement;
