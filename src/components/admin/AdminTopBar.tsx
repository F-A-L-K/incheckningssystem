
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminTopBar = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Du har loggats ut');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-800">{t('controlPanel')}</h2>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-800">
            {user?.full_name || user?.username || 'Admin User'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <LogOut className="w-4 h-4" />
          Logga ut
        </Button>
      </div>
    </div>
  );
};

export default AdminTopBar;
