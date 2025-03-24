import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { BookMarked, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface MangaItem {
  id: number;
  title: string;
  cover: string;
  episodeNumber: number;
  releaseDate: string;
  summary: string;
  link: string;
}

const MangaNews: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  const mangaItems: MangaItem[] = [
    {
      id: 1,
      title: 'لوفي يواجه كايدو في معركة حاسمة',
      cover: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1084,
      releaseDate: '2023-06-01',
      summary: 'في الحلقة الجديدة، يواجه لوفي كايدو في معركة ملحمية ستحدد مصير وانو.',
      link: '#'
    },
    {
      id: 2,
      title: 'ظهور شخصية جديدة تقلب موازين القوى',
      cover: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1083,
      releaseDate: '2023-05-25',
      summary: 'ظهور مفاجئ لشخصية جديدة ذات قوى هائلة قد تغير مسار الأحداث بشكل كامل.',
      link: '#'
    },
    {
      id: 3,
      title: 'سر الون بيس يقترب من الكشف',
      cover: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1082,
      releaseDate: '2023-05-18',
      summary: 'تلميحات جديدة حول طبيعة كنز الون بيس وارتباطه بالقرن المفقود من التاريخ.',
      link: '#'
    },
    {
      id: 4,
      title: 'زورو يتعلم تقنية جديدة',
      cover: 'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1081,
      releaseDate: '2023-05-11',
      summary: 'زورو يتدرب على تقنية جديدة للسيوف قد تساعده في المعارك القادمة ضد أقوى خصومه.',
      link: '#'
    },
    {
      id: 5,
      title: 'سانجي يكتشف أسرار عائلته',
      cover: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1080,
      releaseDate: '2023-05-04',
      summary: 'سانجي يكتشف المزيد من أسرار عائلة فينسموك وقدراته الخاصة المخفية.',
      link: '#'
    },
    {
      id: 6,
      title: 'معركة بحرية ضد قراصنة البيست',
      cover: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1079,
      releaseDate: '2023-04-27',
      summary: 'قراصنة قبعة القش يواجهون قراصنة البيست في معركة بحرية مليئة بالمفاجآت.',
      link: '#'
    },
    {
      id: 7,
      title: 'تحالف جديد بين القراصنة',
      cover: 'https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1078,
      releaseDate: '2023-04-20',
      summary: 'تحالفات جديدة تتشكل بين مجموعات القراصنة لمواجهة تهديد الحكومة العالمية.',
      link: '#'
    },
    {
      id: 8,
      title: 'روبن تكشف نقوشاً قديمة',
      cover: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1077,
      releaseDate: '2023-04-13',
      summary: 'نيكو روبن تكتشف نقوشاً قديمة تحمل معلومات هامة عن سلاح أورانوس.',
      link: '#'
    },
    {
      id: 9,
      title: 'وصول قراصنة قبعة القش إلى جزيرة جديدة',
      cover: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1076,
      releaseDate: '2023-04-06',
      summary: 'الطاقم يصل إلى جزيرة غامضة تحكمها قوانين غريبة تتعلق بالجاذبية.',
      link: '#'
    },
    {
      id: 10,
      title: 'فرانكي يخترع سلاحاً جديداً',
      cover: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1075,
      releaseDate: '2023-03-30',
      summary: 'فرانكي يكمل اختراعاً جديداً سيحول سفينة ثاوزند صني إلى قوة هجومية رهيبة.',
      link: '#'
    },
    {
      id: 11,
      title: 'نامي ترسم خريطة للعالم الجديد',
      cover: 'https://images.unsplash.com/photo-1628626125033-7fb47f539063?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1074,
      releaseDate: '2023-03-23',
      summary: 'نامي تستخدم معلومات جديدة لرسم خريطة أكثر دقة لجزء من العالم الجديد.',
      link: '#'
    },
    {
      id: 12,
      title: 'لقاء مع شانكس',
      cover: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1073,
      releaseDate: '2023-03-16',
      summary: 'بعد سنوات من الانتظار، لوفي يلتقي مجدداً مع شانكس في ظروف غير متوقعة.',
      link: '#'
    },
    {
      id: 13,
      title: 'بروك يكتشف قدرات روحية جديدة',
      cover: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1072,
      releaseDate: '2023-03-09',
      summary: 'بروك يكتشف قدرات جديدة لقوة فاكهة الشيطان الخاصة به تمكنه من رؤية عالم الأرواح.',
      link: '#'
    },
    {
      id: 14,
      title: 'جينبي يواجه قائد مجموعة السمك المرعب',
      cover: 'https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1071,
      releaseDate: '2023-03-02',
      summary: 'جينبي يواجه قائد مجموعة السمك المرعب في قاع المحيط دفاعاً عن مملكة السمك.',
      link: '#'
    },
    {
      id: 15,
      title: 'تطورات جديدة في قصة حرب ماربيلفورد',
      cover: 'https://images.unsplash.com/photo-1591017403286-fd8493524e1e?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1070,
      releaseDate: '2023-02-23',
      summary: 'كشف تفاصيل جديدة عن أحداث حرب ماربيلفورد وتأثيرها على المشهد السياسي الحالي.',
      link: '#'
    },
    {
      id: 16,
      title: 'تشوبر يطور دواءً سحرياً',
      cover: 'https://images.unsplash.com/photo-1585096164465-656ea3f40e14?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1069,
      releaseDate: '2023-02-16',
      summary: 'تشوبر يطور دواءً يمكنه معالجة الآثار الجانبية لفاكهة الشيطان في ظروف معينة.',
      link: '#'
    },
    {
      id: 17,
      title: 'الصراع بين البحرية والشيشيبوكاي',
      cover: 'https://images.unsplash.com/photo-1619731079919-4c58e26b0599?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1068,
      releaseDate: '2023-02-09',
      summary: 'تفاصيل الصراع المستمر بين البحرية ومجموعة الشيشيبوكاي بعد حل النظام رسمياً.',
      link: '#'
    },
    {
      id: 18,
      title: 'أوسوب يطور ذخيرة جديدة',
      cover: 'https://images.unsplash.com/photo-1518965402144-3c35895286cf?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1067,
      releaseDate: '2023-02-02',
      summary: 'أوسوب يطور ذخيرة جديدة لمقلاعه بمساعدة النباتات الغريبة التي جمعها من جزيرة بوين.',
      link: '#'
    },
    {
      id: 19,
      title: 'سر قوة الهاكي الملكي',
      cover: 'https://images.unsplash.com/photo-1624562563808-276626a7bd8f?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1066,
      releaseDate: '2023-01-26',
      summary: 'معلومات جديدة عن قوة الهاكي الملكي وكيفية تطويره للوصول إلى مستويات غير مسبوقة.',
      link: '#'
    },
    {
      id: 20,
      title: 'آخر التطورات في مؤتمر ريفيري',
      cover: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=800&q=80',
      episodeNumber: 1065,
      releaseDate: '2023-01-19',
      summary: 'تفاصيل القرارات المصيرية التي اتخذت في مؤتمر ريفيري وتأثيرها على النظام العالمي.',
      link: '#'
    }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-adventure text-op-navy mb-4 drop-shadow-lg">
              أخبار مانجا ون بيس
            </h1>
            <p className="text-lg text-op-navy/80 max-w-2xl mx-auto">
              آخر أخبار وإصدارات مانجا ون بيس مع تفاصيل الحلقات والتحديثات
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-op-yellow border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rtl">
              {mangaItems.map((item, index) => (
                <motion.article
                  key={item.id}
                  className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={item.cover} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1642278189161-c512348ce9f9?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-op-yellow text-op-navy font-bold px-3 py-1 rounded-full text-sm">
                      حلقة {item.episodeNumber}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{item.title}</h2>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <BookMarked size={16} className="text-op-yellow mr-1" />
                        <span className="text-white/70 text-sm">
                          {new Date(item.releaseDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-white/60 mb-4 text-sm line-clamp-3">
                      {item.summary}
                    </p>
                    
                    <a 
                      href={item.link} 
                      className="inline-flex items-center space-x-1 rtl:space-x-reverse text-op-yellow hover:text-op-straw"
                    >
                      <span>قراءة المزيد</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2 rtl:space-x-reverse">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50">
                <ChevronRight className="h-5 w-5" />
              </button>
              
              {[1, 2, 3].map(page => (
                <button 
                  key={page}
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    page === 1 
                      ? 'bg-op-yellow text-op-navy' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
                <ChevronLeft className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MangaNews;
