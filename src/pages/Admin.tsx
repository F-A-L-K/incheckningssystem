
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CurrentVisitors from '@/components/admin/CurrentVisitors';
import VisitorHistory from '@/components/admin/VisitorHistory';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';

const Admin = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'current';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminTopBar />
        
        <div className="flex-1 p-6">
          {activeTab === 'current' ? (
            <CurrentVisitors />
          ) : (
            <VisitorHistory />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
