
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, UserCircle, Home, Users } from 'lucide-react';

const UserMenu: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-12 w-12 rounded-full bg-op-blue ring-2 ring-white hover:bg-op-ocean transition-all"
        >
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={user.user_metadata?.avatar || ''} />
            <AvatarFallback className="bg-op-yellow text-op-navy">
              {userProfile?.username?.substring(0, 2) || user.email?.substring(0, 2) || 'OP'}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-op-yellow text-op-navy text-xs">
            <UserCircle size={14} />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rtl" align="end">
        <DropdownMenuLabel className="flex flex-col items-center py-3 text-center">
          <Avatar className="h-16 w-16 mb-2 border border-gray-200">
            <AvatarImage src={user.user_metadata?.avatar || ''} />
            <AvatarFallback className="bg-op-ocean text-white text-lg">
              {userProfile?.username?.substring(0, 2) || user.email?.substring(0, 2) || 'OP'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-slate-900">{userProfile?.username || user.email}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/" className="cursor-pointer flex items-center justify-between">
            <span>الصفحة الرئيسية</span>
            <Home className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex items-center justify-between">
            <span>الملف الشخصي</span>
            <User className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/rooms" className="cursor-pointer flex items-center justify-between">
            <span>الغرف</span>
            <Users className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/create-room" className="cursor-pointer flex items-center justify-between">
            <span>إنشاء غرفة</span>
            <Settings className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer flex items-center justify-between text-red-500 focus:text-red-500">
          <span>تسجيل الخروج</span>
          <LogOut className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
