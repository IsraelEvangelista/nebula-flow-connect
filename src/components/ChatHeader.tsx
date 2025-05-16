
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Wrench, LogOut, Settings, Calendar, Layout, Youtube, Music, FileText, BarChart2 } from "lucide-react";
import { useGreeting } from "@/hooks/useGreeting";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ChatHeader = () => {
  const navigate = useNavigate();
  const greeting = useGreeting();
  const [greetingText, setGreetingText] = useState("");
  const [animationPhase, setAnimationPhase] = useState("typing"); // typing, complete, moving
  const [scrollPosition, setScrollPosition] = useState(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const fullText = `${greeting}`;
  const containerWidth = isMobile ? 200 : 300; // Reduced width on mobile
  
  // Typing animation effect
  useEffect(() => {
    if (animationPhase === "typing" && greetingText.length < fullText.length) {
      const timer = setTimeout(() => {
        setGreetingText(fullText.substring(0, greetingText.length + 1));
      }, 150); // Slowed down animation speed
      
      return () => clearTimeout(timer);
    } else if (animationPhase === "typing" && greetingText.length === fullText.length) {
      // When typing is done, wait 2 seconds then start scrolling
      const timer = setTimeout(() => {
        setAnimationPhase("moving");
      }, 2000);
      
      return () => clearTimeout(timer);
    } else if (animationPhase === "moving") {
      // Text scrolling animation - right to left
      const textWidth = fullText.length * 10; // Approximate text width
      
      if (scrollPosition <= -(textWidth + containerWidth)) {
        // Reset position to start from right again
        setScrollPosition(containerWidth);
      } else {
        const timer = setTimeout(() => {
          setScrollPosition(prev => prev - 1);
        }, 50); // Slower animation speed
        
        return () => clearTimeout(timer);
      }
    }
  }, [greetingText, fullText, animationPhase, scrollPosition, containerWidth]);

  // Reset the animation when the greeting changes
  useEffect(() => {
    setGreetingText("");
    setAnimationPhase("typing");
    setScrollPosition(0);
  }, [greeting]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
    }
  };

  // Ferramentas disponíveis
  const tools = [
    { name: "Calendário", icon: Calendar, route: "/calendar", available: true },
    { name: "Projetos", icon: Layout, route: "/projects", available: false },
    { name: "Youtube", icon: Youtube, route: "/youtube", available: true },
    { name: "Música", icon: Music, route: "/music", available: true },
    { name: "Análises", icon: FileText, route: "/analysis", available: false },
    { name: "Recomendações", icon: BarChart2, route: "/recommendations", available: false }
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700 w-full z-20 relative">
      <div className="flex items-center">
        {/* Logo com efeito de luz */}
        <div className="mr-4">
          <img 
            src="/lovable-uploads/af36109a-107a-4fb7-8951-8e005cb8fa45.png" 
            alt="Nebula" 
            className="h-8 w-auto animate-pulse"
            onError={(e) => {
              // Fallback in case image doesn't load
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.textContent = 'NEBULA';
              fallback.className = 'text-white font-bold text-sm';
              e.currentTarget.parentNode?.appendChild(fallback);
            }}
          />
        </div>
        
        <div className="overflow-hidden" style={{ width: `${containerWidth}px` }}>
          <h1 
            className={`${isMobile ? 'text-sm' : 'text-md md:text-lg'} font-semibold text-white whitespace-nowrap`}
            style={{ 
              transform: animationPhase === "moving" ? `translateX(${scrollPosition}px)` : 'none'
            }}
          >
            {greetingText}
            {animationPhase === "typing" && <span className="opacity-70 animate-pulse">|</span>}
          </h1>
        </div>
      </div>
      
      <div className="flex gap-2">
        {/* Menu de ferramentas */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size={isMobile ? "sm" : "icon"}>
              <Wrench className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-slate-800 border-slate-700 text-white p-0">
            <div className="flex flex-col">
              {tools.map((tool) => (
                <Button 
                  key={tool.name}
                  variant="ghost" 
                  className={`justify-start px-4 py-2 ${tool.available ? 'hover:bg-slate-700' : 'text-slate-500 cursor-not-allowed'}`}
                  onClick={() => tool.available ? navigate(tool.route) : null}
                  disabled={!tool.available}
                >
                  <tool.icon className="mr-2 h-4 w-4" />
                  <span>{tool.name}</span>
                  {!tool.available && <span className="ml-auto text-xs">Em breve</span>}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size={isMobile ? "sm" : "icon"}>
              <Menu className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-slate-800 border-slate-700 text-white p-0">
            <div className="flex flex-col">
              <Button 
                variant="ghost" 
                className="justify-start px-4 py-2 hover:bg-slate-700" 
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ChatHeader;
