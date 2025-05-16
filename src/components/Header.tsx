
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { Droplets } from 'lucide-react';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-2 sm:p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-sm">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
            <Droplets className="h-6 w-6 text-white" />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-800/70"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gradient">{t('app.title')}</h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Real-time flood monitoring, predictions, and safety information for India
            </p>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <LanguageSelector />
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
