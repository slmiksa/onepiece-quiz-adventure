
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getAnnouncements, DbAnnouncement } from '@/utils/supabaseHelpers';

const Announcement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<DbAnnouncement[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchActiveAnnouncements = async () => {
      try {
        const activeAnnouncements = await getAnnouncements(true);
        if (activeAnnouncements.length > 0) {
          setAnnouncements(activeAnnouncements);
          setVisible(true);
        }
      } catch (error) {
        console.error('Error fetching active announcements:', error);
      }
    };

    fetchActiveAnnouncements();
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!visible || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 rtl">
      <div className="bg-yellow-50 border-t-4 border-yellow-400 p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1 ml-3">
              <h3 className="text-yellow-800 font-bold">{currentAnnouncement.title}</h3>
              <p className="text-yellow-700 mt-1">{currentAnnouncement.content}</p>
              {announcements.length > 1 && (
                <button 
                  className="text-yellow-600 hover:text-yellow-800 text-sm mt-2 underline"
                  onClick={handleNext}
                >
                  التالي ({currentIndex + 1}/{announcements.length})
                </button>
              )}
            </div>
            <button 
              onClick={handleClose}
              className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
