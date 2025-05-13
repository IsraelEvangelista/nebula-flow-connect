
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BackgroundType = 'deep-space' | 'nebula' | 'sunlit' | 'custom';

interface BackgroundContextType {
  backgroundType: BackgroundType;
  customBackground: string | null;
  userBubbleColor: string;
  assistantBubbleColor: string;
  changeBackground: (type: BackgroundType, customUrl?: string) => void;
  changeBubbleColors: (userColor: string, assistantColor: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('nebula');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [userBubbleColor, setUserBubbleColor] = useState<string>('#8A65DF');
  const [assistantBubbleColor, setAssistantBubbleColor] = useState<string>('#2A2A2A');
  
  // Load from localStorage on initial mount
  useEffect(() => {
    const savedBackground = localStorage.getItem('backgroundType');
    const savedCustomUrl = localStorage.getItem('customBackgroundUrl');
    const savedUserBubbleColor = localStorage.getItem('userBubbleColor');
    const savedAssistantBubbleColor = localStorage.getItem('assistantBubbleColor');
    
    if (savedBackground) {
      setBackgroundType(savedBackground as BackgroundType);
    }
    
    if (savedCustomUrl) {
      setCustomBackground(savedCustomUrl);
    }
    
    if (savedUserBubbleColor) {
      setUserBubbleColor(savedUserBubbleColor);
    }
    
    if (savedAssistantBubbleColor) {
      setAssistantBubbleColor(savedAssistantBubbleColor);
    }
  }, []);
  
  const changeBackground = (type: BackgroundType, customUrl?: string) => {
    setBackgroundType(type);
    localStorage.setItem('backgroundType', type);
    
    if (type === 'custom' && customUrl) {
      setCustomBackground(customUrl);
      localStorage.setItem('customBackgroundUrl', customUrl);
    }
  };
  
  const changeBubbleColors = (userColor: string, assistantColor: string) => {
    setUserBubbleColor(userColor);
    setAssistantBubbleColor(assistantColor);
    localStorage.setItem('userBubbleColor', userColor);
    localStorage.setItem('assistantBubbleColor', assistantColor);
  };
  
  return (
    <BackgroundContext.Provider 
      value={{ 
        backgroundType,
        customBackground,
        userBubbleColor,
        assistantBubbleColor,
        changeBackground,
        changeBubbleColors
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
