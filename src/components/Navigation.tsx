
import React from 'react';
import { Menu, Home, Shield, Map, Info, MessageSquare, AlertTriangle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../context/LanguageContext';

const Navigation = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const navLinks = [
    { name: t('nav.home'), href: '/', icon: Home, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { name: t('nav.safety'), href: '/safety', icon: Shield, color: 'text-green-500', bgColor: 'bg-green-100' },
    { name: t('nav.evacuation'), href: '/evacuation-plan', icon: Map, color: 'text-orange-500', bgColor: 'bg-orange-100' },
    { name: t('nav.about'), href: '/about', icon: Info, color: 'text-purple-500', bgColor: 'bg-purple-100' },
    { name: t('nav.contact'), href: '/contact', icon: MessageSquare, color: 'text-pink-500', bgColor: 'bg-pink-100' },
    { name: t('nav.emergency'), href: '/emergency', icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-100' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  // Desktop navigation
  if (!isMobile) {
    return (
      <nav className="flex space-x-1 bg-white px-2 py-1 rounded-lg shadow-sm">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          
          return (
            <Link 
              key={link.href}
              to={link.href} 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all 
                ${active 
                  ? `${link.bgColor} ${link.color} font-medium shadow-sm border border-${link.color.split('-')[1]}-200` 
                  : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-sm'
                }
              `}
            >
              <Icon className={`h-4 w-4 ${link.color}`} />
              <span className={active ? link.color : ""}>{link.name}</span>
              {link.href === '/emergency' && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
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
            const active = isActive(link.href);
            
            return (
              <Link 
                key={link.href}
                to={link.href} 
                className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all
                  ${active 
                    ? `${link.bgColor} ${link.color} font-medium shadow-sm border border-${link.color.split('-')[1]}-200` 
                    : 'hover:bg-white hover:shadow-sm'
                  } 
                  ${link.href === '/emergency' 
                    ? 'relative overflow-hidden bg-gradient-to-r from-red-50 to-red-100' 
                    : ''
                  }
                `}
              >
                <div className={`rounded-full ${link.bgColor} p-2 ${active ? 'animate-pulse' : ''}`}>
                  <Icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <span className={`font-medium ${active ? link.color : ""}`}>{link.name}</span>
                {link.href === '/emergency' && (
                  <div className="absolute -right-1 -top-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;
