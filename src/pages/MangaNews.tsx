
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { CalendarIcon, Clock, Eye } from 'lucide-react';

interface MangaNews {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  readTime: number;
  views: number;
}

const MangaNews: React.FC = () => {
  const [news, setNews] = useState<MangaNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<MangaNews | null>(null);
  
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setNews([
        {
          id: 1,
          title: "الكشف عن تفاصيل جديدة حول أسرار الفاكهة المعجزة",
          excerpt: "إيتشيرو أودا يكشف عن معلومات جديدة ومثيرة حول أصول وقوى الفاكهة المعجزة في العالم.",
          content: "كشف إيتشيرو أودا، مبدع سلسلة ون بيس الشهيرة، في الفصل الأخير من المانجا عن تفاصيل جديدة ومثيرة حول أصول الفاكهة المعجزة وكيف تم صنعها في العالم. حيث أشار إلى أن الفاكهة المعجزة لها علاقة وطيدة بالقرن المفقود والحكومة العالمية. كما أوضح أودا أن هناك فئة سرية من الفاكهة لم يتم الكشف عنها بعد، وأنها قد تلعب دورًا محوريًا في الأحداث القادمة من القصة. وأضاف أن لوفي سيكتشف المزيد عن قوى فاكهة الجوم جوم التي تناولها، وكيف يمكن أن تتطور قدراته في المستقبل.\n\nوقد أثارت هذه التفاصيل الجديدة حماس المعجبين الذين طالما تساءلوا عن أصول وأسرار الفاكهة المعجزة في عالم ون بيس. ويُتوقع أن تكشف الفصول القادمة المزيد من الأسرار حول هذا الموضوع المثير.",
          image: "https://m.media-amazon.com/images/I/91GSj25XyCL.jpg",
          publishedAt: "2023-10-15",
          readTime: 4,
          views: 1245
        },
        {
          id: 2,
          title: "لوفي يواجه تحديًا جديدًا في مواجهة قراصنة لاف تيل",
          excerpt: "المواجهة المرتقبة بين طاقم قبعة القش وقراصنة لاف تيل تتكشف في الفصول الأخيرة.",
          content: "في التطورات الأخيرة من مانجا ون بيس، وصل طاقم قبعة القش أخيرًا إلى جزيرة لاف تيل المرموقة، حيث تنتظرهم مواجهة قوية مع قراصنة معروفين بقوتهم الهائلة. وقد أظهر الفصل الأخير لوفي وهو يستعد لمواجهة زعيم هؤلاء القراصنة في معركة قد تكون الأكثر إثارة في تاريخ السلسلة.\n\nويُظهر لوفي قدرات جديدة لفاكهة الجوم جوم، مما يشير إلى تطور كبير في قوته منذ أحداث وانو. كما أن بقية أفراد الطاقم يواجهون خصومهم الخاصين، مع تألق زورو وسانجي بشكل خاص في المعارك الجانبية.\n\nوتشير التوقعات إلى أن هذه المواجهة ستكشف أسرارًا مهمة حول تاريخ القرن المفقود والكنز العظيم ون بيس، مما قد يغير مسار القصة بشكل كبير.",
          image: "https://www.thathashtagshow.com/wp-content/uploads/2023/05/One-Piece-1060-Monkey-D-Luffy-new-form.png",
          publishedAt: "2023-09-28",
          readTime: 5,
          views: 2354
        },
        {
          id: 3,
          title: "الكشف عن تاريخ عائلة دي في أحدث أحداث ون بيس",
          excerpt: "أودا يقدم معلومات جديدة عن عائلة D المرموقة وعلاقتها بالحكومة العالمية.",
          content: "قدم الفصل الأخير من مانجا ون بيس معلومات مثيرة حول تاريخ عائلة D المرموقة وأهميتها في عالم ون بيس. حيث كشف أودا أن أفراد هذه العائلة لديهم صلة قوية بالقرن المفقود والمملكة القديمة، وأنهم كانوا يشكلون تهديدًا كبيرًا للحكومة العالمية منذ قرون.\n\nوتم الكشف أيضًا عن أن الحرف D في أسماء شخصيات مثل مونكي دي لوفي، وجول دي روجر، ومارشال دي تيتش، له معنى خاص وسري لم يُكشف عنه بالكامل بعد. كما أشارت الأحداث إلى وجود نبوءة قديمة مرتبطة بهذه العائلة وبمصير العالم.\n\nوقد أثارت هذه المعلومات الجديدة نظريات كثيرة بين المعجبين حول هوية الشخص الذي سيصبح ملك القراصنة، وماذا سيحدث عندما يتم اكتشاف الكنز العظيم ون بيس.",
          image: "https://staticg.sportskeeda.com/editor/2023/04/0236c-16827026254925-1920.jpg",
          publishedAt: "2023-08-12",
          readTime: 6,
          views: 3456
        },
        {
          id: 4,
          title: "شانكس يعود: عودة الشعر الأحمر إلى أحداث ون بيس",
          excerpt: "عودة مفاجئة لشانكس ودوره المهم في الأحداث المقبلة من السلسلة.",
          content: "فاجأ إيتشيرو أودا المعجبين بعودة مفاجئة وقوية لشانكس، قائد قراصنة الشعر الأحمر، إلى أحداث ون بيس بعد غياب طويل. وقد ظهر شانكس في موقف دراماتيكي حيث تدخل في صراع كبير بين القوى البحرية والقراصنة.\n\nوكشفت الأحداث الجديدة أن شانكس لديه معرفة واسعة بأسرار العالم وتاريخ القرن المفقود، وأنه يلعب دورًا أكبر بكثير مما كان يُعتقد سابقًا. كما أظهر قوة هائلة في استخدام هاكي الملوك، مما أذهل حتى أقوى الشخصيات في العالم.\n\nويُشير التطور الجديد إلى احتمالية لقاء قريب بين شانكس ولوفي، وهو اللقاء الذي ينتظره المعجبون منذ بداية السلسلة، حيث وعد لوفي بإعادة القبعة لشانكس عندما يصبح قرصانًا عظيمًا.",
          image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/04/shanks-and-his-crew-in-one-piece.jpg",
          publishedAt: "2023-07-20",
          readTime: 3,
          views: 4567
        },
        {
          id: 5,
          title: "أودا يؤكد: ون بيس تقترب من نهايتها",
          excerpt: "مبدع ون بيس يؤكد أن السلسلة تقترب من نهايتها بعد أكثر من 25 عامًا من النشر.",
          content: "في مقابلة حديثة، أكد إيتشيرو أودا، مبدع سلسلة ون بيس الشهيرة، أن المانجا تقترب من نهايتها بعد أكثر من 25 عامًا من النشر المستمر. وقال أودا إن القصة دخلت مرحلتها النهائية، وأنه يخطط لإنهاء السلسلة خلال السنوات القليلة القادمة.\n\nوأشار أودا إلى أنه سيكشف عن جميع الأسرار الكبرى في العالم، بما في ذلك حقيقة الكنز العظيم ون بيس، وتاريخ القرن المفقود، وهوية Joy Boy، وأصل الفاكهة المعجزة، وغيرها من الألغاز التي حيرت القراء لسنوات.\n\nوقد أثار هذا التصريح مشاعر مختلطة بين المعجبين، ما بين الحماس لمعرفة نهاية القصة والحزن على قرب انتهاء واحدة من أكثر سلاسل المانجا شهرة وتأثيرًا في التاريخ.",
          image: "https://cdn.vox-cdn.com/thumbor/9KydVL-dzYXGWHYXPwcpF4CTRqQ=/0x0:1280x668/1200x800/filters:focal(538x232:742x436)/cdn.vox-cdn.com/uploads/chorus_image/image/71253617/Eiichiro_20Oda.6.jpg",
          publishedAt: "2023-06-05",
          readTime: 4,
          views: 6789
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 rtl">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-adventure text-op-navy mb-4">أخبار المانجا</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اطلع على آخر أخبار وتطورات مانجا ون بيس وتابع أحدث الإصدارات والتحليلات
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-bounce-slow h-16 w-16 rounded-full bg-op-yellow flex items-center justify-center">
                <span className="font-adventure text-op-navy text-2xl">...</span>
              </div>
            </div>
          ) : selectedNews ? (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-soft-xl overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <img 
                    src={selectedNews.image} 
                    alt={selectedNews.title}
                    className="w-full h-[300px] md:h-[400px] object-cover"
                  />
                  <button 
                    onClick={() => setSelectedNews(null)}
                    className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-op-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6 md:p-8">
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 ml-1" />
                      <span>{formatDate(selectedNews.publishedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 ml-1" />
                      <span>{selectedNews.readTime} دقائق للقراءة</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 ml-1" />
                      <span>{selectedNews.views}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-op-navy mb-4">
                    {selectedNews.title}
                  </h2>
                  
                  <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                    {selectedNews.content.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {news.map((item) => (
                <motion.div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <CalendarIcon className="h-3 w-3 ml-1" />
                      <span>{formatDate(item.publishedAt)}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 ml-1" />
                      <span>{item.readTime} دقائق للقراءة</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-op-navy mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>
                    
                    <button 
                      className="text-op-ocean font-medium hover:text-op-blue transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNews(item);
                      }}
                    >
                      قراءة المزيد
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MangaNews;
