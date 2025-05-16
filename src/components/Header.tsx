
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
            <span className="absolute text-primary-foreground font-bold text-sm">FV</span>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-700"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t('app.title')}</h1>
        </Link>
        <p className="text-sm text-muted-foreground max-w-md">
          Real-time flood monitoring, predictions, and safety information for India
        </p>
      </div>
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <LanguageSelector />
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
