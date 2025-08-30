import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useLanguageAutoReset = (timeout: number = 8 * 60 * 60 * 1000) => { // 8 hours default
  const { language, setLanguage } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (language === 'en') {
      // Start timer when language switches to English
      timerRef.current = setTimeout(() => {
        setLanguage('sv');
      }, timeout);
    } else {
      // Clear timer if language is not English
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [language, setLanguage, timeout]);
};