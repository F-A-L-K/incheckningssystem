
import { useState } from "react";
import CheckInSystem from "@/components/CheckInSystem";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const [showCheckOut, setShowCheckOut] = useState(false);
  
  const handleCheckOut = () => {
    setShowCheckOut(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Välkommen</h1>
        <p className="text-gray-600">Incheckningssystem för besökare</p>
      </header>
      
      {!showCheckOut && (
        <div className="w-full max-w-xl mb-6 flex justify-center">
          <Button 
            onClick={handleCheckOut} 
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg text-lg flex items-center gap-2 shadow-md"
            size="lg"
          >
            <LogOut className="h-5 w-5" />
            Checka ut
          </Button>
        </div>
      )}
      
      <div className="w-full max-w-xl">
        <CheckInSystem initialStep={showCheckOut ? "check-out" : "type-selection"} onCheckOutComplete={() => setShowCheckOut(false)} />
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Incheckningssystem</p>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
