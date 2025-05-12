
import { useState } from "react";
import CheckInSystem from "@/components/CheckInSystem";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Välkommen till Falks Metall</h1>
          <p className="text-gray-600">Vänlig checka in nedan!</p>
      </header>
      
      <div className="w-full max-w-xl">
        <CheckInSystem />
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Incheckningssystem</p>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
