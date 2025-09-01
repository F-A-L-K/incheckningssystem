
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CurrentVisitors from '@/components/admin/CurrentVisitors';
import VisitorHistory from '@/components/admin/VisitorHistory';
import SchoolVisitHistory from '@/components/admin/SchoolVisitHistory';
import VisitorStatistics from '@/components/admin/VisitorStatistics';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Admin = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'current';

  const renderContent = () => {
    switch (activeTab) {
      case 'current':
        return <CurrentVisitors />;
      case 'history':
        return <VisitorHistory />;
      case 'schools':
        return <SchoolVisitHistory />;
      case 'statistics':
        return <VisitorStatistics />;
      default:
        return <CurrentVisitors />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <AdminTopBar />
          
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
