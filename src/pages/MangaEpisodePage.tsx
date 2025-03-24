
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MangaEpisodePage: React.FC = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  
  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6 rtl">
              <Button asChild variant="ghost" className="mb-4">
                <Link to="/manga" className="flex items-center gap-2">
                  <ArrowRight size={16} />
                  <span>العودة إلى قائمة المانجا</span>
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-op-navy mb-2">
                حلقة المانجا رقم {episodeId}
              </h1>
              <div className="text-sm text-op-navy/60 mb-4">
                تاريخ النشر: {new Date().toLocaleDateString('ar-SA')}
              </div>
            </div>
            
            <div className="prose max-w-none rtl text-op-navy/80">
              <p className="text-lg mb-4">
                هذه صفحة تفاصيل حلقة المانجا رقم {episodeId}. سيتم إضافة المزيد من المحتوى لاحقاً.
              </p>
              
              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-2">ملخص الحلقة</h3>
                <p>
                  في هذه الحلقة المثيرة من ون بيس، نشهد تطورات جديدة في رحلة البحث عن كنز الون بيس. 
                  لوفي وطاقمه يواجهون تحديات جديدة وأعداء أقوياء، بينما تتكشف المزيد من أسرار العالم.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">لقطات من الحلقة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80" 
                    alt="لقطة من المانجا" 
                    className="rounded-md w-full h-48 object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=800&q=80" 
                    alt="لقطة من المانجا" 
                    className="rounded-md w-full h-48 object-cover"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-xl font-bold mb-4">تعليقات القراء</h3>
                <p className="italic text-op-navy/60">
                  ستتمكن قريباً من إضافة تعليقات والتفاعل مع القراء الآخرين حول هذه الحلقة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MangaEpisodePage;
