
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Globe className="h-4 w-4" />
          <span>{language === 'en' ? 'EN' : 'HI'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{t('settings.language')}</h4>
          <p className="text-xs text-muted-foreground">{t('settings.languageDescription')}</p>
          
          <div className="flex flex-col gap-2 pt-2">
            <Button 
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
              className="justify-start"
            >
              {t('settings.english')}
            </Button>
            <Button 
              variant={language === 'hi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('hi')}
              className="justify-start"
            >
              {t('settings.hindi')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
