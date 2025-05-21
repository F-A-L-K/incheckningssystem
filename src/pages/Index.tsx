
import { useState } from "react";
import CheckInSystem from "@/components/CheckInSystem";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<"menu" | "check-in" | "check-out">("menu");
  
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Välkommen till Falks Metall AB!</h1>
        <p className="text-gray-600">
          {activeView === "menu" ? "Vänligen välj ett alternativ nedan" : 
           activeView === "check-in" ? "Incheckning" : "Utcheckning"}
        </p>
      </header>
      
      {activeView === "menu" ? (
        <div className="w-full max-w-xl mb-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={handleCheckIn} 
            className="bg-[#19647E] hover:bg-[#16576C] text-white py-6 px-10 rounded-lg text-xl flex items-center justify-center gap-3 shadow-md"
            size="lg"
          >
            <LogIn className="h-6 w-6" />
            Checka in
          </Button>
          
          <Button 
            onClick={handleCheckOut} 
            className="bg-[#19647E] hover:bg-[#16576C] text-white py-6 px-10 rounded-lg text-xl flex items-center justify-center gap-3 shadow-md"
            size="lg"
          >
            <LogOut className="h-6 w-6" />
            Checka ut
          </Button>
        </div>
      ) : (
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
              Tillbaka till huvudmenyn
            </Button>
          </div>
        </div>
      )}
      
      <footer className="mt-auto pt-8 pb-4 text-center text-sm text-gray-400">
        <p>FMAB Incheckningssystem | {new Date().getFullYear()}</p>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
