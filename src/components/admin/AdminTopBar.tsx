
import React from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminTopBar = () => {
  const { t } = useLanguage();
  // Placeholder user name - will be replaced with actual user data later
  const currentUser = "Admin User";

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-800">{t('controlPanel')}</h2>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-800">{currentUser}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
