
import React from 'react';
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
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-nebula-dark to-neutral-900 border-b border-neutral-800 text-white">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/5b5998f2-160b-4865-a545-2c09cd692258.png" 
          alt="Nebula Logo" 
          className="w-10 h-10 mr-3"
        />
        <h1 className="text-lg font-medium hidden sm:block">Assistente Nebula</h1>
      </div>
      
      <div className="flex-1 mx-4 text-center text-sm sm:text-base">
        {greeting}
      </div>
      
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-nebula-gray text-white border-neutral-700">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
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
