
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
    enterFullName: 'Skriv in fullständigt namn',
    fullNamePlaceholder: 'Förnamn + Efternamn',
    enterFullNameError: 'Ange fullständigt namn',
    // Terms content
    termsVisitors: 'Besökare skall vara inskrivna i systemet.',
    termsPhotography: 'Fotografering är förbjuden.',
    termsSmokeFree: 'Vi har en rökfri arbetsplats. Rökning kan ske utomhus vid uppsatta askkoppar.',
    termsRegularProducts: 'Rör aldrig maskinutrustning och ta inte med händer i några produkter.',
    termsServiceProducts: 'Rör aldrig några produkter.',
    termsEmergency: 'I händelse av nödsignal lämna byggnaden och uppsök samlingspunkten bakom fabriken i kanten av parkeringen.',
    termsHotWork: 'Heta arbeten får endast utföras av behörig personal. En godkänd blankett ska vara signerad och tillgänglig innan arbetet påbörjas.',
    termsSafety: 'Använd alltid korrekt säkerhetsutrustning som är anpassad till det arbete som ska utföras. Kontakta din beställare vid osäkerhet om vad som krävs.',
    termsWasteSort: 'Vi tillämpar källsortering. Om du producerar avfall under ditt arbete, fråga din beställare var det ska läggas och följ angivna rutiner.',
    termsWorkComplete: 'Säkerställ att allt arbete är slutfört enligt överenskommelse och att arbetsområdet är återställt innan du lämnar. Efter genomfört arbete ska beställaren tillsammans med besökaren gå igenom vad som gjorts samt erhålla eventuell servicerapport.',
    termsCheckOut: 'Anmäl till din beställare när du lämnar lokalen och checka ut dig i entrén innan du lämnar byggnaden',
    // Department translations
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
    // Terms Agreement
    termsAndSafety: 'Villkor och säkerhet',
    byContunuingYouAgree: 'Genom att fortsätta godkänner du följande:',
    acceptTermsAndCheckIn: 'Acceptera villkor och checka in',
    checkingIn: 'Checkar in...',
    registerFace: 'Registrera ansikte',
    // Visitor Type Selection
    visitorType: 'Besökstyp',
    pleaseSelectVisitorType: 'Vänligen välj besökstyp genom att klicka på en besöksruta.',
    generalVisit: 'Allmänt besök',
    generalVisitDescription: 'Möten, intervjuer eller andra besök',
    regularVisit: 'Vanligt besök',
    regularVisitDescription: 'Möten, intervjuer eller andra besök',
    serviceVisit: 'Service besök',
    serviceVisitDescription: 'Underhåll, bygg eller servicearbete',
    schoolVisit: 'Skolbesök',
    schoolVisitDescription: 'Utbildning och skolrelaterade besök',
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
    enterFullName: 'Enter full name',
    fullNamePlaceholder: 'First name + Last name',
    enterFullNameError: 'Enter full name',
    // Terms content
    termsVisitors: 'Visitors must be registered in the system.',
    termsPhotography: 'Photography is prohibited.',
    termsSmokeFree: 'We have a smoke-free workplace. Smoking is allowed outdoors at designated ashtrays.',
    termsRegularProducts: 'Never touch machinery equipment and do not touch any products with your hands.',
    termsServiceProducts: 'Never touch any products.',
    termsEmergency: 'In case of emergency signal, leave the building and go to the assembly point behind the factory at the edge of the parking lot.',
    termsHotWork: 'Hot work may only be performed by authorized personnel. An approved form must be signed and available before work begins.',
    termsSafety: 'Always use correct safety equipment that is appropriate for the work to be performed. Contact your orderer if unsure about what is required.',
    termsWasteSort: 'We apply source sorting. If you produce waste during your work, ask your orderer where it should be placed and follow specified procedures.',
    termsWorkComplete: 'Ensure that all work is completed according to agreement and that the work area is restored before leaving. After completed work, the orderer together with the visitor shall review what has been done and receive any service report.',
    termsCheckOut: 'Report to your orderer when you leave the premises and check out in the entrance before leaving the building',
    // Department translations
    departmentVD: 'CEO',
    departmentProduktionsledning: 'Production Management',
    departmentForsaljning: 'Sales',
    departmentProcessutveckling: 'Process Development',
    departmentProduktionsteknik: 'Production Technology',
    departmentKvalitetOchMiljo: 'Quality and Environment',
    departmentTeknik: 'Technology',
    departmentEkonomi: 'Finance',
    departmentLogistik: 'Logistics',
    departmentLager: 'Warehouse',
    // Terms Agreement
    termsAndSafety: 'Terms and Safety',
    byContunuingYouAgree: 'By continuing you agree to the following:',
    acceptTermsAndCheckIn: 'Accept terms and check in',
    checkingIn: 'Checking in...',
    registerFace: 'Register face',
    // Visitor Type Selection
    visitorType: 'Visitor Type',
    pleaseSelectVisitorType: 'Please select visitor type by clicking on a visit box.',
    generalVisit: 'General visit',
    generalVisitDescription: 'Meetings, interviews or other visits',
    regularVisit: 'Regular visit',
    regularVisitDescription: 'Meetings, interviews or other visits',
    serviceVisit: 'Service visit',
    serviceVisitDescription: 'Maintenance, construction or service work',
    schoolVisit: 'School visit',
    schoolVisitDescription: 'Education and school-related visits',
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
    enterFullName: 'Vollständigen Namen eingeben',
    fullNamePlaceholder: 'Vorname + Nachname',
    enterFullNameError: 'Vollständigen Namen eingeben',
    // Terms content
    termsVisitors: 'Besucher müssen im System registriert sein.',
    termsPhotography: 'Fotografieren ist verboten.',
    termsSmokeFree: 'Wir haben einen rauchfreien Arbeitsplatz. Rauchen ist im Freien an den aufgestellten Aschenbechern erlaubt.',
    termsRegularProducts: 'Berühren Sie niemals Maschinenausrüstung und fassen Sie keine Produkte mit den Händen an.',
    termsServiceProducts: 'Berühren Sie niemals Produkte.',
    termsEmergency: 'Im Falle eines Notsignals verlassen Sie das Gebäude und begeben Sie sich zum Sammelplatz hinter der Fabrik am Rand des Parkplatzes.',
    termsHotWork: 'Heißarbeiten dürfen nur von autorisiertem Personal durchgeführt werden. Ein genehmigtes Formular muss unterzeichnet und verfügbar sein, bevor die Arbeit beginnt.',
    termsSafety: 'Verwenden Sie immer korrekte Sicherheitsausrüstung, die für die durchzuführende Arbeit geeignet ist. Wenden Sie sich bei Unsicherheit über die Anforderungen an Ihren Auftraggeber.',
    termsWasteSort: 'Wir wenden Mülltrennung an. Wenn Sie bei Ihrer Arbeit Abfall produzieren, fragen Sie Ihren Auftraggeber, wo er entsorgt werden soll und befolgen Sie die angegebenen Verfahren.',
    termsWorkComplete: 'Stellen Sie sicher, dass alle Arbeiten gemäß Vereinbarung abgeschlossen sind und der Arbeitsbereich wiederhergestellt ist, bevor Sie gehen. Nach abgeschlossener Arbeit soll der Auftraggeber zusammen mit dem Besucher durchgehen, was getan wurde, und gegebenenfalls einen Servicebericht erhalten.',
    termsCheckOut: 'Melden Sie sich bei Ihrem Auftraggeber, wenn Sie die Räumlichkeiten verlassen, und checken Sie im Eingang aus, bevor Sie das Gebäude verlassen',
    // Department translations
    departmentVD: 'Geschäftsführer',
    departmentProduktionsledning: 'Produktionsleitung',
    departmentForsaljning: 'Vertrieb',
    departmentProcessutveckling: 'Prozessentwicklung',
    departmentProduktionsteknik: 'Produktionstechnik',
    departmentKvalitetOchMiljo: 'Qualität und Umwelt',
    departmentTeknik: 'Technik',
    departmentEkonomi: 'Finanzen',
    departmentLogistik: 'Logistik',
    departmentLager: 'Lager',
    // Terms Agreement
    termsAndSafety: 'Bedingungen und Sicherheit',
    byContunuingYouAgree: 'Durch Fortfahren stimmen Sie folgendem zu:',
    acceptTermsAndCheckIn: 'Bedingungen akzeptieren und einchecken',
    checkingIn: 'Checke ein...',
    registerFace: 'Gesicht registrieren',
    // Visitor Type Selection
    visitorType: 'Besuchertyp',
    pleaseSelectVisitorType: 'Bitte wählen Sie den Besuchertyp durch Klicken auf ein Besuchsfeld.',
    generalVisit: 'Allgemeiner Besuch',
    generalVisitDescription: 'Besprechungen, Interviews oder andere Besuche',
    regularVisit: 'Regulärer Besuch',
    regularVisitDescription: 'Besprechungen, Interviews oder andere Besuche',
    serviceVisit: 'Service-Besuch',
    serviceVisitDescription: 'Wartung, Bau oder Servicearbeiten',
    schoolVisit: 'Schulbesuch',
    schoolVisitDescription: 'Bildung und schulbezogene Besuche',
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
