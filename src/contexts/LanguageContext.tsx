
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'sv' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  sv: {
    // Visitor types
    visitor: 'Besökare',
    service: 'Servicebesök',
    schoolVisit: 'Skolbesök',
    
    // Forms
    continue: 'Fortsätt',
    back: 'Tillbaka',
    
    // Type selection
    selectVisitType: 'Välj typ av besök',
    regularVisit: 'Vanligt besök',
    regularVisitDesc: 'För affärsbesök och möten',
    serviceVisit: 'Servicebesök',
    serviceVisitDesc: 'För service- och underhållspersonal',
    schoolVisitDesc: 'För skolklasser och studiebesök',
    
    // Company info
    companyInformation: 'Företagsinformation',
    pleaseEnterCompanyInfo: 'Ange företagets namn och antal besökare',
    company: 'Företag',
    companyPlaceholder: 'Ange företagsnamn...',
    enterCompanyName: 'Vänligen ange företagsnamn',
    numberOfVisitors: 'Antal besökare',
    selectNumber: 'Välj antal',
    selectValidNumber: 'Vänligen välj ett giltigt antal',
    
    // School info
    schoolInformation: 'Skolinformation',
    pleaseEnterSchoolInfo: 'Ange skolans namn, ansvarig lärare och antal elever',
    school: 'Skola',
    schoolPlaceholder: 'Ange skolans namn...',
    enterSchoolName: 'Vänligen ange skolans namn',
    responsibleTeacher: 'Ansvarig lärare',
    responsibleTeacherPlaceholder: 'Ange lärarens namn...',
    enterTeacherName: 'Vänligen ange lärarens namn',
    numberOfTeachers: 'Antal lärare',
    numberOfStudents: 'Antal elever',
    
    // Visitor names
    visitorNames: 'Besökaruppgifter',
    pleaseEnterNames: 'Ange namn på alla besökare',
    visitorName: 'Besökare',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    firstNamePlaceholder: 'Ange förnamn...',
    lastNamePlaceholder: 'Ange efternamn...',
    enterFirstName: 'Vänligen ange förnamn',
    enterLastName: 'Vänligen ange efternamn',
    
    // Host selection
    hostSelection: 'Välj värd',
    pleaseSelectHost: 'Vem ska ni besöka?',
    searchHosts: 'Sök värdar...',
    
    // Terms
    termsAndConditions: 'Villkor',
    readAndAccept: 'Läs och acceptera våra villkor',
    acceptTerms: 'Jag accepterar villkoren',
    mustAcceptTerms: 'Du måste acceptera villkoren för att fortsätta',
    checkIn: 'Checka in',
    
    // Confirmation
    checkInCompleted: 'Incheckning slutförd',
    visitorInfo: 'Besökarinformation',
    visitType: 'Typ av besök',
    regularVisitText: 'Vanligt besök',
    serviceVisitText: 'Servicebesök',
    schoolVisitText: 'Skolbesök',
    regularWaitingMessage: 'Vänligen vänta i receptionen så kommer er värd och hämtar er.',
    serviceWaitingMessage: 'Ni kan gå direkt till er arbetsplats.',
    closingIn: 'Stänger om',
    seconds: 'sekunder',
    
    // Check out
    checkOutTitle: 'Checka ut besökare',
    currentVisitors: 'Aktuella besökare',
    noVisitors: 'Inga besökare incheckade just nu',
    checkOut: 'Checka ut',
    cancel: 'Avbryt',
    
    // Departments
    departmentVD: 'VD',
    departmentProduktionsledning: 'Produktionsledning',
    departmentForsaljning: 'Försäljning',
    departmentProcessutveckling: 'Processutveckling',
    departmentProduktionsteknik: 'Produktionsteknik',
    departmentKvalitetOchMiljo: 'Kvalitet- och miljö',
    departmentTeknik: 'Teknik',
    departmentEkonomi: 'Ekonomi',
    departmentLogistik: 'Logistik',
    departmentLager: 'Lager',
    
    // Messages
    error: 'Fel',
    checkInCompletedToast: 'Incheckning slutförd',
    welcomeToast: 'Välkommen!',
    checkOutCompletedToast: 'Utcheckning slutförd',
    haveANiceDay: 'Ha en bra dag!',
    failedToCheckIn: 'Misslyckades att checka in',
    failedToCheckOut: 'Misslyckades att checka ut',
    failedToLoad: 'Misslyckades att ladda data',
    
    // Face recognition
    welcomeBack: 'Välkommen tillbaka',
    infoFilledAutomatically: 'Informationen har fyllts i automatiskt.',
    
    // Host information
    host: 'Värd',
  },
  en: {
    // Visitor types
    visitor: 'Visitor',
    service: 'Service Visit',
    schoolVisit: 'School Visit',
    
    // Forms
    continue: 'Continue',
    back: 'Back',
    
    // Type selection
    selectVisitType: 'Select visit type',
    regularVisit: 'Regular Visit',
    regularVisitDesc: 'For business visits and meetings',
    serviceVisit: 'Service Visit',
    serviceVisitDesc: 'For service and maintenance personnel',
    schoolVisitDesc: 'For school classes and study visits',
    
    // Company info
    companyInformation: 'Company Information',
    pleaseEnterCompanyInfo: 'Please enter company name and number of visitors',
    company: 'Company',
    companyPlaceholder: 'Enter company name...',
    enterCompanyName: 'Please enter company name',
    numberOfVisitors: 'Number of visitors',
    selectNumber: 'Select number',
    selectValidNumber: 'Please select a valid number',
    
    // School info
    schoolInformation: 'School Information',
    pleaseEnterSchoolInfo: 'Please enter school name, responsible teacher and number of students',
    school: 'School',
    schoolPlaceholder: 'Enter school name...',
    enterSchoolName: 'Please enter school name',
    responsibleTeacher: 'Responsible Teacher',
    responsibleTeacherPlaceholder: 'Enter teacher name...',
    enterTeacherName: 'Please enter teacher name',
    numberOfTeachers: 'Number of teachers',
    numberOfStudents: 'Number of students',
    
    // Visitor names
    visitorNames: 'Visitor Information',
    pleaseEnterNames: 'Please enter names of all visitors',
    visitorName: 'Visitor',
    firstName: 'First Name',
    lastName: 'Last Name',
    firstNamePlaceholder: 'Enter first name...',
    lastNamePlaceholder: 'Enter last name...',
    enterFirstName: 'Please enter first name',
    enterLastName: 'Please enter last name',
    
    // Host selection
    hostSelection: 'Select Host',
    pleaseSelectHost: 'Who are you visiting?',
    searchHosts: 'Search hosts...',
    
    // Terms
    termsAndConditions: 'Terms and Conditions',
    readAndAccept: 'Please read and accept our terms',
    acceptTerms: 'I accept the terms',
    mustAcceptTerms: 'You must accept the terms to continue',
    checkIn: 'Check In',
    
    // Confirmation
    checkInCompleted: 'Check-in Completed',
    visitorInfo: 'Visitor Information',
    visitType: 'Visit Type',
    regularVisitText: 'Regular Visit',
    serviceVisitText: 'Service Visit',
    schoolVisitText: 'School Visit',
    regularWaitingMessage: 'Please wait in reception and your host will come to get you.',
    serviceWaitingMessage: 'You can go directly to your workplace.',
    closingIn: 'Closing in',
    seconds: 'seconds',
    
    // Check out
    checkOutTitle: 'Check Out Visitors',
    currentVisitors: 'Current Visitors',
    noVisitors: 'No visitors checked in right now',
    checkOut: 'Check Out',
    cancel: 'Cancel',
    
    // Departments
    departmentVD: 'CEO',
    departmentProduktionsledning: 'Production Management',
    departmentForsaljning: 'Sales',
    departmentProcessutveckling: 'Process Development',
    departmentProduktionsteknik: 'Production Technology',
    departmentKvalitetOchMiljo: 'Quality & Environment',
    departmentTeknik: 'Technology',
    departmentEkonomi: 'Finance',
    departmentLogistik: 'Logistics',
    departmentLager: 'Warehouse',
    
    // Messages
    error: 'Error',
    checkInCompletedToast: 'Check-in completed',
    welcomeToast: 'Welcome!',
    checkOutCompletedToast: 'Check-out completed',
    haveANiceDay: 'Have a nice day!',
    failedToCheckIn: 'Failed to check in',
    failedToCheckOut: 'Failed to check out',
    failedToLoad: 'Failed to load data',
    
    // Face recognition
    welcomeBack: 'Welcome back',
    infoFilledAutomatically: 'Information has been filled in automatically.',
    
    // Host information
    host: 'Host',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('sv');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
