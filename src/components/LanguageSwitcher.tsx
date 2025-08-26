
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('sv')}
        className={`w-8 h-6 rounded border-2 transition-all ${
          language === 'sv' ? 'border-blue-500 shadow-lg' : 'border-gray-300 opacity-70 hover:opacity-100'
        }`}
        title="Svenska"
      >
        {/* Swedish flag */}
        <div className="w-full h-full relative overflow-hidden rounded">
          <div className="absolute inset-0 bg-[#006AA7]"></div>
          <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-[#FECC00]"></div>
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#FECC00]"></div>
        </div>
      </button>
      
      <button
        onClick={() => setLanguage('en')}
        className={`w-8 h-6 rounded border-2 transition-all ${
          language === 'en' ? 'border-blue-500 shadow-lg' : 'border-gray-300 opacity-70 hover:opacity-100'
        }`}
        title="English"
      >
        {/* American flag simplified */}
        <div className="w-full h-full relative overflow-hidden rounded">
          <div className="absolute inset-0 bg-[#B22234]"></div>
          <div className="absolute top-0 left-0 w-3 h-3 bg-[#3C3B6E]"></div>
          <div className="absolute top-0 right-0 h-0.5 bg-white"></div>
          <div className="absolute top-1 right-0 h-0.5 bg-white"></div>
          <div className="absolute top-2 right-0 h-0.5 bg-white"></div>
          <div className="absolute bottom-0 right-0 h-0.5 bg-white"></div>
          <div className="absolute bottom-1 right-0 h-0.5 bg-white"></div>
          <div className="absolute bottom-2 right-0 h-0.5 bg-white"></div>
        </div>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
