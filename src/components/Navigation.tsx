
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../context/LanguageContext';

const Navigation = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.safety'), href: '/safety' },
    { name: t('nav.evacuation'), href: '/evacuation-plan' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];
  
  // Desktop navigation
  if (!isMobile) {
    return (
      <nav className="hidden md:flex space-x-4">
        {navLinks.map((link) => (
          <Link 
            key={link.href}
            to={link.href} 
            className="text-sm px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    );
  }
  
  // Mobile navigation
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle>{t('app.title')}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              to={link.href} 
              className="text-sm px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;
