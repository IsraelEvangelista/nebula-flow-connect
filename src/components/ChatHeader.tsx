
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useGreeting } from "@/hooks/useGreeting";
import { useEffect, useState } from "react";

export const ChatHeader = () => {
  const navigate = useNavigate();
  const greeting = useGreeting();
  const [greetingText, setGreetingText] = useState("");
  const [animationPhase, setAnimationPhase] = useState("typing"); // typing, complete, moving
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const fullText = `${greeting}`;
  const containerWidth = 300; // Fixed width for text container

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
      // Text scrolling animation
      const textWidth = fullText.length * 10; // Approximate text width
      
      if (scrollPosition <= -(textWidth)) {
        // Reset position and start again
        setScrollPosition(containerWidth);
      } else {
        const timer = setTimeout(() => {
          setScrollPosition(prev => prev - 1);
        }, 30);
        
        return () => clearTimeout(timer);
      }
    }
  }, [greetingText, fullText, animationPhase, scrollPosition]);

  // Reset the animation when the greeting changes
  useEffect(() => {
    setGreetingText("");
    setAnimationPhase("typing");
    setScrollPosition(0);
  }, [greeting]);

  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/40 backdrop-blur-sm border-b border-slate-700 w-full">
      <div className="flex items-center">
        <div 
          className="cursor-pointer mr-4" 
          onClick={() => navigate("/tools")}
        >
          <img 
            src="/nebula-logo.png" 
            alt="Nebula" 
            className="h-8 w-auto"
            onError={(e) => {
              // Fallback if image doesn't exist
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
            className="text-md md:text-lg font-semibold text-white whitespace-nowrap"
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
          <Settings className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
