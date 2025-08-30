
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Settings } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/login');
  };

  const handleCheckin = () => {
    navigate('/checkin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{t('welcome')}</h1>
          <p className="text-xl text-gray-600">{t('selectOption')}</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer" onClick={handleCheckin}>
            <CardHeader className="text-center pb-4">
              <LogIn className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                Besökssystem
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Checka in och checka ut besökare i systemet
              </p>
              <Button 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base"
                onClick={handleCheckin}
              >
                Öppna besökssystem
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer" onClick={handleAdminLogin}>
            <CardHeader className="text-center pb-4">
              <Settings className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                Administratörspanel
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Hantera besökare och visa historik
              </p>
              <Button 
                variant="outline"
                className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-base"
                onClick={handleAdminLogin}
              >
                Logga in som admin
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <footer className="pt-12 text-center text-base text-gray-400">
          <p>{t('footer')} | {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
