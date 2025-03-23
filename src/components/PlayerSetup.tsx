
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, Check } from 'lucide-react';
import { savePlayersToDb } from '../utils/supabaseHelpers';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface Player {
  id: number;
  name: string;
  avatar: string;
}

interface PlayerSetupProps {
  onPlayersSubmit: (players: Player[], difficulty: string) => void;
}

// Simplified One Piece character avatars - just one male and one female
const ONE_PIECE_AVATARS = [
  "https://i.imgur.com/nRYMBl4.png", // Luffy (male)
  "https://i.imgur.com/UiRzQJ4.png", // Nami (female)
];

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onPlayersSubmit }) => {
  const [players, setPlayers] = useState<Player[]>([{ id: 1, name: '', avatar: ONE_PIECE_AVATARS[0] }]);
  const [difficulty, setDifficulty] = useState('medium');
  const [errors, setErrors] = useState<{[key: number]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const maxPlayers = 5;
  
  const addPlayer = () => {
    if (players.length < maxPlayers) {
      const newId = players.length + 1;
      setPlayers([...players, { 
        id: newId, 
        name: '', 
        avatar: ONE_PIECE_AVATARS[Math.floor(Math.random() * ONE_PIECE_AVATARS.length)] 
      }]);
    }
  };
  
  const removePlayer = (id: number) => {
    if (players.length > 1) {
      setPlayers(players.filter(player => player.id !== id));
      const newErrors = {...errors};
      delete newErrors[id];
      setErrors(newErrors);
      
      if (showAvatarSelector === id) {
        setShowAvatarSelector(null);
      }
    }
  };
  
  const updatePlayer = (id: number, name: string) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, name } : player
    ));
    
    if (name.trim()) {
      const newErrors = {...errors};
      delete newErrors[id];
      setErrors(newErrors);
    }
  };
  
  const selectAvatar = (id: number, avatar: string) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, avatar } : player
    ));
    setShowAvatarSelector(null);
  };
  
  const toggleAvatarSelector = (id: number) => {
    setShowAvatarSelector(showAvatarSelector === id ? null : id);
  };
  
  const validatePlayers = () => {
    const newErrors: {[key: number]: string} = {};
    let isValid = true;
    
    players.forEach(player => {
      if (!player.name.trim()) {
        newErrors[player.id] = "اسم اللاعب مطلوب";
        isValid = false;
      }
    });
    
    const names = players.map(p => p.name.trim().toLowerCase());
    const duplicates = names.filter((name, index) => 
      name && names.indexOf(name) !== index
    );
    
    if (duplicates.length > 0) {
      players.forEach(player => {
        if (duplicates.includes(player.name.trim().toLowerCase())) {
          newErrors[player.id] = "اسم اللاعب مكرر";
          isValid = false;
        }
      });
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePlayers()) {
      setIsSubmitting(true);
      
      try {
        await savePlayersToDb(players);
        onPlayersSubmit(players, difficulty);
      } catch (error) {
        console.error('Error saving players:', error);
        toast({
          title: "خطأ في الاتصال",
          description: "تعذر حفظ بيانات اللاعبين، الرجاء المحاولة مرة أخرى",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto glass-card p-6 md:p-8"
    >
      <h2 className="text-2xl md:text-3xl font-adventure text-op-navy mb-6 text-center">
        تسجيل اللاعبين
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {players.map((player) => (
            <motion.div 
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-4 bg-white bg-opacity-50 rounded-lg p-4 relative"
            >
              <div className="relative">
                <div onClick={() => toggleAvatarSelector(player.id)} className="cursor-pointer">
                  <Avatar className="w-16 h-16 border-2 border-op-ocean overflow-hidden">
                    <AvatarImage 
                      src={player.avatar} 
                      alt="Player Avatar" 
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className="bg-op-ocean text-white">
                      {player.name.substring(0, 2) || "OP"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <div className="bg-op-yellow text-op-navy rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-op-straw transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {showAvatarSelector === player.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-0 left-0 right-0 z-50 bg-white p-3 rounded-lg shadow-lg border border-gray-200 w-[150px] mt-20 md:mt-0"
                  >
                    <div className="flex justify-center gap-2">
                      {ONE_PIECE_AVATARS.map((avatar, index) => (
                        <div 
                          key={index}
                          onClick={() => selectAvatar(player.id, avatar)}
                          className={`w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 transition-all ${
                            player.avatar === avatar ? 'border-op-ocean scale-110' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img 
                            src={avatar} 
                            alt={index === 0 ? 'شخصية ذكر' : 'شخصية أنثى'} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = 'https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowAvatarSelector(null)}
                      className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      إغلاق
                    </button>
                  </motion.div>
                )}
              </div>
              
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayer(player.id, e.target.value)}
                    placeholder="اسم اللاعب"
                    maxLength={20}
                    className={`w-full bg-white bg-opacity-70 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-op-ocean ${
                      errors[player.id] ? 'border-red-500 focus:ring-red-500' : 'border-transparent'
                    }`}
                  />
                  {errors[player.id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[player.id]}</p>
                  )}
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => removePlayer(player.id)}
                disabled={players.length === 1}
                className={`p-2 rounded-md ${
                  players.length === 1 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-100 text-red-500 hover:bg-red-200'
                } transition-colors`}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </div>
        
        {players.length < maxPlayers && (
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <button 
              type="button"
              onClick={addPlayer}
              className="w-full bg-op-ocean bg-opacity-10 text-op-ocean rounded-md py-3 flex items-center justify-center space-x-2 rtl:space-x-reverse hover:bg-opacity-20 transition-all"
            >
              <Plus size={18} />
              <span>إضافة لاعب جديد</span>
            </button>
          </motion.div>
        )}
        
        <div className="bg-white bg-opacity-50 rounded-lg p-4">
          <h3 className="text-lg font-bold text-op-navy mb-3">اختر مستوى الصعوبة</h3>
          
          <div className="flex flex-col sm:flex-row gap-3 rtl">
            <button
              type="button"
              onClick={() => setDifficulty('easy')}
              className={`flex-1 rounded-md px-4 py-3 font-medium transition-all ${
                difficulty === 'easy'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white bg-opacity-70 text-gray-700 hover:bg-green-100'
              }`}
            >
              سهل
            </button>
            
            <button
              type="button"
              onClick={() => setDifficulty('medium')}
              className={`flex-1 rounded-md px-4 py-3 font-medium transition-all ${
                difficulty === 'medium'
                  ? 'bg-op-blue text-white shadow-md'
                  : 'bg-white bg-opacity-70 text-gray-700 hover:bg-blue-100'
              }`}
            >
              متوسط
            </button>
            
            <button
              type="button"
              onClick={() => setDifficulty('hard')}
              className={`flex-1 rounded-md px-4 py-3 font-medium transition-all ${
                difficulty === 'hard'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white bg-opacity-70 text-gray-700 hover:bg-red-100'
              }`}
            >
              صعب
            </button>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6"
        >
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-op-yellow text-op-navy py-4 rounded-md font-bold text-lg shadow-md hover:bg-op-straw transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-op-navy border-t-transparent rounded-full animate-spin mr-2 rtl:ml-2 rtl:mr-0"></div>
            ) : (
              <Check size={20} />
            )}
            <span>{isSubmitting ? 'جارِ الحفظ...' : 'بدء اللعبة'}</span>
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default PlayerSetup;
