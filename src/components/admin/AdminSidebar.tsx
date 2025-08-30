
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, History, Home, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminSidebar = () => {
  const { t } = useLanguage();
  
  return (
    <div className="w-96 bg-blue-600 text-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Home className="w-6 h-6" />
          <h1 className="text-xl font-bold">{t('adminDashboard')}</h1>
        </div>
        
        <nav className="space-y-2">
          <NavLink
            to="/admin?tab=current"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive || window.location.search === '' || window.location.search === '?tab=current'
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`
            }
          >
            <Users className="w-5 h-5" />
            <span>{t('currentVisitors')}</span>
          </NavLink>
          
          <NavLink
            to="/admin?tab=history"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                window.location.search === '?tab=history'
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`
            }
          >
            <History className="w-5 h-5" />
            <span>{t('historyTab')}</span>
          </NavLink>
          
          <NavLink
            to="/admin?tab=schools"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                window.location.search === '?tab=schools'
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`
            }
          >
            <GraduationCap className="w-5 h-5" />
            <span>{t('schoolVisitHistory')}</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
