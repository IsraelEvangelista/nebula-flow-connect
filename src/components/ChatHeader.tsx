
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Moon } from "lucide-react";
import { useGreeting } from "@/hooks/useGreeting";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const ChatHeader = () => {
  const navigate = useNavigate();
  const greeting = useGreeting();
  const { logout } = useAuth();
  const [greetingText, setGreetingText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  
  const fullText = `${greeting} estou aqui para o que precisar!`;

  useEffect(() => {
    if (showFullText) {
      setGreetingText(fullText);
      return;
    }

    const timer = setTimeout(() => {
      setGreetingText(fullText.substring(0, textIndex + 1));
      
      if (textIndex < fullText.length - 1) {
        setTextIndex(prev => prev + 1);
      } else {
        setShowFullText(true);
      }
    }, 100); // Slowed down from 50ms to 100ms per character

    return () => clearTimeout(timer);
  }, [textIndex, fullText, showFullText]);

  // Reset the animation when the greeting changes
  useEffect(() => {
    setTextIndex(0);
    setShowFullText(false);
    setGreetingText("");
  }, [greeting]);

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/40 backdrop-blur-sm border-b border-slate-700 w-full">
      <div className="flex-1">
        <h1 className="text-lg md:text-xl font-semibold text-white">
          {greetingText}
          {!showFullText && <span className="opacity-70 animate-pulse">|</span>}
        </h1>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
          <Settings className="h-5 w-5 text-white" />
        </Button>
        <Button variant="ghost" size="icon" onClick={logout}>
          <Moon className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
