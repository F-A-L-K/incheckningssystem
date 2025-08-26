
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'sv', name: 'Svenska', flag: 'se' },
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'de', name: 'Deutsch', flag: 'de' },
  ];

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg shadow-sm p-3">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as 'sv' | 'en' | 'de')}
          className={`p-3 rounded-lg transition-colors ${
            language === lang.code 
              ? 'bg-gray-200 shadow-inner' 
              : 'hover:bg-gray-50'
          }`}
          title={lang.name}
        >
          <img
            src={`https://flagicons.lipis.dev/flags/4x3/${lang.flag}.svg`}
            alt={lang.name}
            className="w-10 h-8 object-cover rounded-sm"
          />
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
