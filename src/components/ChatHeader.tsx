
import React, { useEffect, useRef } from 'react';
import { useGreeting } from '@/hooks/useGreeting';
import { Menu, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatHeader: React.FC = () => {
  const greeting = useGreeting();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeRef.current) return;
      
      const marqueeElement = marqueeRef.current;
      const textElement = marqueeElement.querySelector('.marquee-text');
      
      if (!textElement) return;
      
      // Setting the animation duration proportional to the text length,
      // but slower than before for better readability
      const scrollWidth = marqueeElement.scrollWidth;
      const viewWidth = marqueeElement.offsetWidth;
      
      // Increased duration by multiplying by 10 to make it slower
      const duration = scrollWidth > viewWidth ? (scrollWidth / 100) * 10 : 10;
      
      marqueeElement.style.setProperty('--scroll-duration', `${duration}s`);
    };
    
    setupMarquee();
    
    // Re-setup marquee if greeting changes
    const observer = new MutationObserver(setupMarquee);
    if (marqueeRef.current) {
      observer.observe(marqueeRef.current, { childList: true, subtree: true });
    }
    
    // Re-setup marquee on window resize
    window.addEventListener('resize', setupMarquee);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', setupMarquee);
    };
  }, [greeting]);
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const PulsatingLogo = () => (
    <div className="pulsating-logo relative">
      <img 
        src="/lovable-uploads/5b5998f2-160b-4865-a545-2c09cd692258.png" 
        alt="Nebula Logo" 
        className="w-10 h-10 mr-3 relative z-10"
      />
      <div className="absolute inset-0 bg-nebula-purple rounded-full animate-pulse-slow opacity-50 blur-md z-0"></div>
    </div>
  );
  
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-nebula-dark to-neutral-900 border-b border-neutral-800 text-white">
      <div className="flex items-center">
        <PulsatingLogo />
        <h1 className="text-lg font-medium hidden sm:block">Assistente Nebula</h1>
      </div>
      
      <div 
        ref={marqueeRef}
        className="marquee flex-1 mx-4 overflow-hidden whitespace-nowrap"
      >
        <span className="marquee-text inline-block text-sm sm:text-base">
          {greeting}
        </span>
      </div>
      
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-nebula-gray text-white border-neutral-700">
            <DropdownMenuLabel>Olá, {user?.email?.split('@')[0]}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-700" />
            <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer hover:bg-nebula-blue/20">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-nebula-blue/20">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
