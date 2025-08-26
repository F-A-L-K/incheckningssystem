
import { useState } from "react";
import CheckInSystem from "@/components/CheckInSystem";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<"menu" | "check-in" | "check-out">("menu");
  const { t } = useLanguage();
  
  const handleCheckOut = () => {
    setActiveView("check-out");
  };

  const handleCheckIn = () => {
    setActiveView("check-in");
  };

  const handleReturn = () => {
    setActiveView("menu");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Language switcher in top right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      {activeView === "menu" ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{t('welcome')}</h1>
            <p className="text-gray-600">{t('selectOption')}</p>
          </header>
          
          <div className="w-full max-w-xl flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={handleCheckIn} 
              className="bg-[#3B82F6] text-white py-6 px-10 rounded-lg text-xl flex items-center justify-center gap-3 shadow-md"
              size="lg"
            >
              <LogIn className="h-6 w-6" />
              {t('checkIn')}
            </Button>
            
            <Button 
              onClick={handleCheckOut} 
              className="bg-[#3B82F6] text-white py-6 px-10 rounded-lg text-xl flex items-center justify-center gap-3 shadow-md"
              size="lg"
            >
              <LogOut className="h-6 w-6" />
              {t('checkOut')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl">
            <CheckInSystem 
              initialStep={activeView === "check-out" ? "check-out" : "type-selection"} 
              onCheckOutComplete={handleReturn}
            />
            
            <div className="mt-6 text-center">
              <Button 
                variant="outline"
                onClick={handleReturn}
                className="text-gray-500"
              >
                {t('backToMenu')}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="pt-8 pb-4 text-center text-sm text-gray-400">
        <p>{t('footer')} | {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
