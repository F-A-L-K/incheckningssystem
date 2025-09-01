import { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  Access_checkin: boolean;
  admin: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.admin || false;

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    logout
  };
};