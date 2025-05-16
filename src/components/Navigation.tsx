
import React from 'react';
import { Menu, Home, Shield, Map, Info, MessageSquare, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../context/LanguageContext';

const Navigation = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const navLinks = [
    { name: t('nav.home'), href: '/', icon: Home, color: 'text-blue-500' },
    { name: t('nav.safety'), href: '/safety', icon: Shield, color: 'text-green-500' },
    { name: t('nav.evacuation'), href: '/evacuation-plan', icon: Map, color: 'text-orange-500' },
    { name: t('nav.about'), href: '/about', icon: Info, color: 'text-purple-500' },
    { name: t('nav.contact'), href: '/contact', icon: MessageSquare, color: 'text-pink-500' },
    { name: t('nav.emergency'), href: '/emergency', icon: AlertTriangle, color: 'text-red-500' },
  ];
  
  // Desktop navigation
  if (!isMobile) {
    return (
      <nav className="hidden md:flex space-x-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link 
              key={link.href}
              to={link.href} 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all 
                hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 
                hover:shadow-sm ${link.color}`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
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
      <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-gradient-to-b from-white to-blue-50">
        <SheetHeader>
          <SheetTitle className="text-primary">{t('app.title')}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-3 mt-8">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.href}
                to={link.href} 
                className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all
                  hover:bg-white hover:shadow-sm ${link.color} border-l-2 border-transparent
                  hover:border-l-2 hover:border-blue-500`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;
