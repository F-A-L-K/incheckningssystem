
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';

// Temporary type definition for users table until types regenerate
interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  full_name: string | null;
  admin: boolean;
  Access_informationboard: boolean;
  Access_checkin: boolean | null;
  created_at: string;
}

interface User {
  id: string;
  username: string;
  full_name: string | null;
  Access_informationboard: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session with additional security validation
    const storedUser = sessionStorage.getItem('admin_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Additional validation could be added here
        if (parsedUser && parsedUser.id && parsedUser.username) {
          setUser(parsedUser);
        } else {
          // Clear invalid session data
          sessionStorage.removeItem('admin_user');
        }
      } catch (error) {
        console.error('Invalid session data found');
        sessionStorage.removeItem('admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Input validation
      if (!username || !password) {
        return false;
      }

      // Hash the password with SHA-256
      const hashedPassword = CryptoJS.SHA256(password).toString();
      
      // Query the users table with proper error handling
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password_hash', hashedPassword)
        .eq('Access_informationboard', true)
        .single() as { data: UserRow | null; error: any };

      if (error || !data) {
        // Generic error logging without exposing details
        console.error('Authentication failed');
        return false;
      }

      const userData: User = {
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        Access_informationboard: data.Access_informationboard
      };

      setUser(userData);
      // Use sessionStorage instead of localStorage for better security
      sessionStorage.setItem('admin_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error occurred');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Clear both storage types to ensure complete logout
    sessionStorage.removeItem('admin_user');
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
