
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'sv' | 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  sv: {
    welcome: 'Välkommen!',
    selectOption: 'Vänligen välj ett alternativ nedan',
    checkIn: 'Checka in',
    checkOut: 'Checka ut',
    backToMenu: 'Tillbaka till huvudmenyn',
    footer: 'FMAB Incheckningssystem'
  },
  en: {
    welcome: 'Welcome!',
    selectOption: 'Please select an option below',
    checkIn: 'Check in',
    checkOut: 'Check out',
    backToMenu: 'Back to main menu',
    footer: 'FMAB Check-in System'
  },
  de: {
    welcome: 'Willkommen!',
    selectOption: 'Bitte wählen Sie eine Option unten',
    checkIn: 'Einchecken',
    checkOut: 'Auschecken',
    backToMenu: 'Zurück zum Hauptmenü',
    footer: 'FMAB Einchecksystem'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('sv');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['sv']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
