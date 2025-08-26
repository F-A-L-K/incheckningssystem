
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
    footer: 'FMAB Incheckningssystem',
    // Company Info Form
    companyInformation: 'Företagsinformation',
    pleaseEnterCompanyAndCount: 'Vänligen ange företag och antal besökare.',
    company: 'Företag',
    companyPlaceholder: 'Företagsnamn',
    enterCompanyName: 'Ange namn på företag/organisation',
    numberOfVisitors: 'Antal besökare',
    selectNumber: 'Välj antal',
    continue: 'Fortsätt',
    // Visitor Names Form
    visitorNames: 'Besökarnamn',
    enterNamesForAllVisitors: 'Ange namn på alla besökare från',
    visitor: 'Besökare',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    firstNamePlaceholder: 'Förnamn',
    lastNamePlaceholder: 'Efternamn',
    enterFirstName: 'Ange ett förnamn',
    enterLastName: 'Ange ett efternamn',
    // Terms Agreement
    termsAndSafety: 'Villkor och säkerhet',
    byContunuingYouAgree: 'Genom att fortsätta godkänner du följande:',
    acceptTermsAndCheckIn: 'Acceptera villkor och checka in',
    checkingIn: 'Checkar in...',
    registerFace: 'Registrera ansikte',
    // Visitor Type Selection
    visitorType: 'Besökstyp',
    pleaseSelectVisitorType: 'Vänligen välj besökstyp genom att klicka på en besöksruta.',
    regularVisit: 'Vanligt besök',
    regularVisitDescription: 'Möten, intervjuer eller andra besök',
    serviceVisit: 'Service besök',
    serviceVisitDescription: 'Underhåll, bygg eller servicearbete',
    faceIdentification: 'Ansiktsidentifiering',
    choose: 'Välj',
    // Host Selection
    visitingHost: 'Besöksvärd',
    pleaseSelectHost: 'Vänligen välj i listan vem ni besöker genom att klicka på namnet.',
    searchPlaceholder: 'Sök efter namn eller avdelning...',
    noMatchingPersons: 'Inga matchande personer hittades',
    // Check In Confirmation
    checkInCompleted: 'Incheckning genomförd!',
    visitorInfo: 'Besöksinformation',
    host: 'Värd',
    visitType: 'Besökstyp',
    regularVisitText: 'Vanligt besök',
    serviceVisitText: 'Service besök',
    regularWaitingMessage: 'Vid väntan, ta gärna en titt på vår utställning av diverse produkter vid ingången eller sätt er ner vid bordet bakom.',
    serviceWaitingMessage: 'Vänligen vänta på att din kontaktperson kommer och möter dig.',
    closingIn: 'Stänger om',
    seconds: 'sekunder...',
    // Check Out
    checkOutTitle: 'Utcheckning',
    clickNameToCheckOut: 'Klicka på ditt namn i listan nedan för att checka ut',
    visiting: 'Besöker',
    noCheckedInVisitors: 'Det finns inga incheckade besökare för närvarande.',
    confirmCheckOut: 'Bekräfta utcheckning',
    areYouSureCheckOut: 'Är du säker på att du vill checka ut',
    cancel: 'Avbryt',
    checkOutButton: 'Checka ut',
    // Navigation
    back: 'Tillbaka',
    // Toast messages
    checkInCompletedToast: 'Incheckning genomförd!',
    welcomeToast: 'Välkommen!',
    checkOutCompletedToast: 'Utcheckning genomförd!',
    haveANiceDay: 'Ha en bra dag!',
    error: 'Fel',
    failedToLoad: 'Kunde inte ladda incheckade besökare',
    failedToCheckIn: 'Kunde inte genomföra incheckning',
    failedToCheckOut: 'Kunde inte genomföra utcheckning',
    welcomeBack: 'Välkommen tillbaka!',
    infoFilledAutomatically: 'Information ifylld automatiskt.'
  },
  en: {
    welcome: 'Welcome!',
    selectOption: 'Please select an option below',
    checkIn: 'Check in',
    checkOut: 'Check out',
    backToMenu: 'Back to main menu',
    footer: 'FMAB Check-in System',
    // Company Info Form
    companyInformation: 'Company Information',
    pleaseEnterCompanyAndCount: 'Please enter company and number of visitors.',
    company: 'Company',
    companyPlaceholder: 'Company name',
    enterCompanyName: 'Enter company/organization name',
    numberOfVisitors: 'Number of visitors',
    selectNumber: 'Select number',
    continue: 'Continue',
    // Visitor Names Form
    visitorNames: 'Visitor Names',
    enterNamesForAllVisitors: 'Enter names for all visitors from',
    visitor: 'Visitor',
    firstName: 'First name',
    lastName: 'Last name',
    firstNamePlaceholder: 'First name',
    lastNamePlaceholder: 'Last name',
    enterFirstName: 'Enter a first name',
    enterLastName: 'Enter a last name',
    // Terms Agreement
    termsAndSafety: 'Terms and Safety',
    byContunuingYouAgree: 'By continuing you agree to the following:',
    acceptTermsAndCheckIn: 'Accept terms and check in',
    checkingIn: 'Checking in...',
    registerFace: 'Register face',
    // Visitor Type Selection
    visitorType: 'Visitor Type',
    pleaseSelectVisitorType: 'Please select visitor type by clicking on a visit box.',
    regularVisit: 'Regular visit',
    regularVisitDescription: 'Meetings, interviews or other visits',
    serviceVisit: 'Service visit',
    serviceVisitDescription: 'Maintenance, construction or service work',
    faceIdentification: 'Face identification',
    choose: 'Choose',
    // Host Selection
    visitingHost: 'Visiting Host',
    pleaseSelectHost: 'Please select from the list who you are visiting by clicking on the name.',
    searchPlaceholder: 'Search by name or department...',
    noMatchingPersons: 'No matching persons found',
    // Check In Confirmation
    checkInCompleted: 'Check-in completed!',
    visitorInfo: 'Visitor Information',
    host: 'Host',
    visitType: 'Visit Type',
    regularVisitText: 'Regular visit',
    serviceVisitText: 'Service visit',
    regularWaitingMessage: 'While waiting, feel free to take a look at our exhibition of various products at the entrance or sit down at the table behind.',
    serviceWaitingMessage: 'Please wait for your contact person to come and meet you.',
    closingIn: 'Closing in',
    seconds: 'seconds...',
    // Check Out
    checkOutTitle: 'Check out',
    clickNameToCheckOut: 'Click on your name in the list below to check out',
    visiting: 'Visiting',
    noCheckedInVisitors: 'There are no checked-in visitors currently.',
    confirmCheckOut: 'Confirm check out',
    areYouSureCheckOut: 'Are you sure you want to check out',
    cancel: 'Cancel',
    checkOutButton: 'Check out',
    // Navigation
    back: 'Back',
    // Toast messages
    checkInCompletedToast: 'Check-in completed!',
    welcomeToast: 'Welcome!',
    checkOutCompletedToast: 'Check-out completed!',
    haveANiceDay: 'Have a nice day!',
    error: 'Error',
    failedToLoad: 'Failed to load checked-in visitors',
    failedToCheckIn: 'Failed to complete check-in',
    failedToCheckOut: 'Failed to complete check-out',
    welcomeBack: 'Welcome back!',
    infoFilledAutomatically: 'Information filled automatically.'
  },
  de: {
    welcome: 'Willkommen!',
    selectOption: 'Bitte wählen Sie eine Option unten',
    checkIn: 'Einchecken',
    checkOut: 'Auschecken',
    backToMenu: 'Zurück zum Hauptmenü',
    footer: 'FMAB Einchecksystem',
    // Company Info Form
    companyInformation: 'Unternehmensinformationen',
    pleaseEnterCompanyAndCount: 'Bitte geben Sie Unternehmen und Anzahl der Besucher ein.',
    company: 'Unternehmen',
    companyPlaceholder: 'Unternehmensname',
    enterCompanyName: 'Geben Sie Unternehmens-/Organisationsname ein',
    numberOfVisitors: 'Anzahl der Besucher',
    selectNumber: 'Anzahl wählen',
    continue: 'Weiter',
    // Visitor Names Form
    visitorNames: 'Besuchernamen',
    enterNamesForAllVisitors: 'Geben Sie Namen für alle Besucher von',
    visitor: 'Besucher',
    firstName: 'Vorname',
    lastName: 'Nachname',
    firstNamePlaceholder: 'Vorname',
    lastNamePlaceholder: 'Nachname',
    enterFirstName: 'Geben Sie einen Vornamen ein',
    enterLastName: 'Geben Sie einen Nachnamen ein',
    // Terms Agreement
    termsAndSafety: 'Bedingungen und Sicherheit',
    byContunuingYouAgree: 'Durch Fortfahren stimmen Sie folgendem zu:',
    acceptTermsAndCheckIn: 'Bedingungen akzeptieren und einchecken',
    checkingIn: 'Checke ein...',
    registerFace: 'Gesicht registrieren',
    // Visitor Type Selection
    visitorType: 'Besuchertyp',
    pleaseSelectVisitorType: 'Bitte wählen Sie den Besuchertyp durch Klicken auf ein Besuchsfeld.',
    regularVisit: 'Regulärer Besuch',
    regularVisitDescription: 'Besprechungen, Interviews oder andere Besuche',
    serviceVisit: 'Service-Besuch',
    serviceVisitDescription: 'Wartung, Bau oder Servicearbeiten',
    faceIdentification: 'Gesichtserkennung',
    choose: 'Wählen',
    // Host Selection
    visitingHost: 'Besuchter Gastgeber',
    pleaseSelectHost: 'Bitte wählen Sie aus der Liste wen Sie besuchen, indem Sie auf den Namen klicken.',
    searchPlaceholder: 'Nach Name oder Abteilung suchen...',
    noMatchingPersons: 'Keine passenden Personen gefunden',
    // Check In Confirmation
    checkInCompleted: 'Einchecken abgeschlossen!',
    visitorInfo: 'Besucherinformationen',
    host: 'Gastgeber',
    visitType: 'Besuchstyp',
    regularVisitText: 'Regulärer Besuch',
    serviceVisitText: 'Service-Besuch',
    regularWaitingMessage: 'Während des Wartens können Sie gerne einen Blick auf unsere Ausstellung verschiedener Produkte am Eingang werfen oder sich an den Tisch dahinter setzen.',
    serviceWaitingMessage: 'Bitte warten Sie darauf, dass Ihr Ansprechpartner kommt und Sie trifft.',
    closingIn: 'Schließt in',
    seconds: 'Sekunden...',
    // Check Out
    checkOutTitle: 'Auschecken',
    clickNameToCheckOut: 'Klicken Sie auf Ihren Namen in der Liste unten, um auszuchecken',
    visiting: 'Besucht',
    noCheckedInVisitors: 'Es gibt derzeit keine eingecheckten Besucher.',
    confirmCheckOut: 'Auschecken bestätigen',
    areYouSureCheckOut: 'Sind Sie sicher, dass Sie auschecken möchten',
    cancel: 'Abbrechen',
    checkOutButton: 'Auschecken',
    // Navigation
    back: 'Zurück',
    // Toast messages
    checkInCompletedToast: 'Einchecken abgeschlossen!',
    welcomeToast: 'Willkommen!',
    checkOutCompletedToast: 'Auschecken abgeschlossen!',
    haveANiceDay: 'Haben Sie einen schönen Tag!',
    error: 'Fehler',
    failedToLoad: 'Fehler beim Laden der eingecheckten Besucher',
    failedToCheckIn: 'Fehler beim Abschließen des Eincheckens',
    failedToCheckOut: 'Fehler beim Abschließen des Auscheckens',
    welcomeBack: 'Willkommen zurück!',
    infoFilledAutomatically: 'Informationen automatisch ausgefüllt.'
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
