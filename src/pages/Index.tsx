
import { useState } from "react";
import CheckInSystem from "@/components/CheckInSystem";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

const Index = () => {
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(true);
  
  const handleCheckOut = () => {
    setShowCheckOut(true);
    setShowCheckIn(false);
  };

  const handleCheckIn = () => {
    setShowCheckOut(false);
    setShowCheckIn(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Välkommen till Falks Metall AB</h1>
        <p className="text-gray-600">Vänligen checka in eller ut nedan</p>
      </header>
      
      <div className="w-full max-w-xl mb-6 flex justify-center gap-4">
        <Button 
          onClick={handleCheckIn} 
          className={`bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg flex items-center gap-2 shadow-md ${showCheckIn ? 'ring-2 ring-blue-300' : ''}`}
          size="lg"
        >
          <LogIn className="h-5 w-5" />
          Checka in
        </Button>
        
        <Button 
          onClick={handleCheckOut} 
          className={`bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg text-lg flex items-center gap-2 shadow-md ${showCheckOut ? 'ring-2 ring-purple-300' : ''}`}
          size="lg"
        >
          <LogOut className="h-5 w-5" />
          Checka ut
        </Button>
      </div>
      
      <div className="w-full max-w-xl">
        <CheckInSystem 
          initialStep={showCheckOut ? "check-out" : "type-selection"} 
          onCheckOutComplete={() => {
            setShowCheckOut(false);
            setShowCheckIn(true);
          }} 
        />
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Incheckningssystem</p>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
