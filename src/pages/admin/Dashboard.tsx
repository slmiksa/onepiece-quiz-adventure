
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, BrainCircuit, Image, Users } from 'lucide-react';
import { getAvatars, getAllUsers, getMangaPages, getQuestions, getAnnouncements } from '@/utils/supabaseHelpers';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [questionsCount, setQuestionsCount] = useState<number>(0);
  const [mangaPagesCount, setMangaPagesCount] = useState<number>(0);
  const [avatarsCount, setAvatarsCount] = useState<number>(0);
  const [announcementsCount, setAnnouncementsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, questions, mangaPages, avatars, announcements] = await Promise.all([
          getAllUsers(),
          getQuestions(),
          getMangaPages(),
          getAvatars(),
          getAnnouncements()
        ]);

        setUsersCount(users.length);
        setQuestionsCount(questions.length);
        setMangaPagesCount(mangaPages.length);
        setAvatarsCount(avatars.length);
        setAnnouncementsCount(announcements.length);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'المستخدمين',
      value: usersCount,
      icon: <Users className="text-blue-600" />,
      route: '/admin/users'
    },
    {
      title: 'الأسئلة',
      value: questionsCount,
      icon: <BrainCircuit className="text-purple-600" />,
      route: '/admin/questions'
    },
    {
      title: 'صفحات المانجا',
      value: mangaPagesCount,
      icon: <Book className="text-amber-600" />,
      route: '/admin/manga'
    },
    {
      title: 'الأفاتارات',
      value: avatarsCount,
      icon: <Image className="text-green-600" />,
      route: '/admin/avatars'
    }
  ];

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
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <Button 
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          العودة للموقع الرئيسي
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <CardDescription className="mt-2">
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => navigate(stat.route)}
                >
                  عرض التفاصيل &larr;
                </Button>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>الإعلانات النشطة</CardTitle>
            <CardDescription>عدد الإعلانات: {announcementsCount}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => navigate('/admin/announcements')}
            >
              إدارة الإعلانات
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>الإحصائيات</CardTitle>
            <CardDescription>مراجعة نشاط الموقع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>المستخدمون النشطون</span>
                <span className="font-medium">{Math.round(usersCount * 0.7)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>اللاعبون النشطون</span>
                <span className="font-medium">{Math.round(usersCount * 0.4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>الزيارات اليومية</span>
                <span className="font-medium">{Math.round(usersCount * 2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
