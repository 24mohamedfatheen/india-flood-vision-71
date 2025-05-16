
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'hi';

// Define context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.title': 'India Flood Vision Dashboard',
    'nav.home': 'Home',
    'nav.safety': 'Safety Tips',
    'nav.emergency': 'Emergency',
    'nav.evacuation': 'Evacuation Plan',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.settings': 'Settings',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin Panel',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.view': 'View',
    'common.close': 'Close',
    
    // Flood data
    'flood.riskLevels': 'Risk Levels',
    'flood.lowRisk': 'Low Risk',
    'flood.mediumRisk': 'Medium Risk',
    'flood.highRisk': 'High Risk',
    'flood.severeRisk': 'Severe Risk',
    'flood.lastUpdate': 'Last updated:',
    'flood.nextUpdate': 'Next scheduled update:',
    'flood.refreshData': 'Refresh Data',
    'flood.staleDataWarning': 'Data may not be current',
    'flood.staleDataDescription': 'The flood data has not been updated in over 12 hours. The information displayed may not reflect the current situation.',
    
    // Map
    'map.title': 'Flood Risk Map',
    'map.legend': 'Map Legend',
    'map.emergencyButton': 'Emergency Evacuation Plan',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.languageDescription': 'Select your preferred language',
    'settings.english': 'English',
    'settings.hindi': 'Hindi',
    
    // About
    'about.title': 'About Us',
    'about.description': 'Information about the India Flood Vision project',
    'about.dataIntegration': 'Data Integration and Sources',
    
    // Emergency Reports
    'emergencyReports.title': 'Emergency Reports',
    'emergencyReports.description': 'View and manage emergency assistance requests from citizens',
    'emergencyReports.status.pending': 'Pending',
    'emergencyReports.status.inProgress': 'In Progress',
    'emergencyReports.status.resolved': 'Resolved',
  },
  hi: {
    // Header
    'app.title': 'भारत बाढ़ विज़न डैशबोर्ड',
    'nav.home': 'होम',
    'nav.safety': 'सुरक्षा टिप्स',
    'nav.emergency': 'आपातकाल',
    'nav.evacuation': 'निकासी योजना',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.settings': 'सेटिंग्स',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.admin': 'एडमिन पैनल',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.search': 'खोज',
    'common.filter': 'फ़िल्टर',
    'common.sort': 'क्रमबद्ध करें',
    'common.view': 'देखें',
    'common.close': 'बंद करें',
    
    // Flood data
    'flood.riskLevels': 'जोखिम स्तर',
    'flood.lowRisk': 'कम जोखिम',
    'flood.mediumRisk': 'मध्यम जोखिम',
    'flood.highRisk': 'उच्च जोखिम',
    'flood.severeRisk': 'गंभीर जोखिम',
    'flood.lastUpdate': 'अंतिम अपडेट:',
    'flood.nextUpdate': 'अगला निर्धारित अपडेट:',
    'flood.refreshData': 'डेटा रिफ्रेश करें',
    'flood.staleDataWarning': 'डेटा वर्तमान नहीं हो सकता है',
    'flood.staleDataDescription': 'बाढ़ डेटा 12 घंटे से अधिक समय से अपडेट नहीं किया गया है। प्रदर्शित जानकारी वर्तमान स्थिति को नहीं दर्शा सकती है।',
    
    // Map
    'map.title': 'बाढ़ जोखिम मानचित्र',
    'map.legend': 'मानचित्र कुंजी',
    'map.emergencyButton': 'आपातकालीन निकासी योजना',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.language': 'भाषा',
    'settings.languageDescription': 'अपनी पसंदीदा भाषा चुनें',
    'settings.english': 'अंग्रेज़ी',
    'settings.hindi': 'हिन्दी',
    
    // About
    'about.title': 'हमारे बारे में',
    'about.description': 'भारत बाढ़ विज़न प्रोजेक्ट के बारे में जानकारी',
    'about.dataIntegration': 'डेटा एकीकरण और स्रोत',
    
    // Emergency Reports
    'emergencyReports.title': 'आपातकालीन रिपोर्ट',
    'emergencyReports.description': 'नागरिकों से आपातकालीन सहायता अनुरोधों को देखें और प्रबंधित करें',
    'emergencyReports.status.pending': 'लंबित',
    'emergencyReports.status.inProgress': 'प्रगति में',
    'emergencyReports.status.resolved': 'हल किया गया',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from localStorage or use 'en' as default
  const getSavedLanguage = (): Language => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang && ['en', 'hi'].includes(savedLang) ? savedLang : 'en';
  };

  const [language, setLanguageState] = useState<Language>(getSavedLanguage());

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Value to be provided to consumers
  const value = {
    language,
    setLanguage,
    t,
  };

  useEffect(() => {
    // Set html lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
