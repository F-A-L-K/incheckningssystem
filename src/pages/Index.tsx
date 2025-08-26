
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import CheckInSystem from "@/components/CheckInSystem";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Index() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      {/* Admin access button */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin')}
          className="text-sm"
        >
          Admin
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            {t('welcome')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('selectOption')}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/?mode=checkin')}
            className="w-full h-20 text-2xl font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {t('checkIn')}
          </Button>

          <Button
            onClick={() => navigate('/?mode=checkout')}
            className="w-full h-20 text-2xl font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {t('checkOut')}
          </Button>
        </div>
      </div>

      <CheckInSystem />
    </div>
  );
}
