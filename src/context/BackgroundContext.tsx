
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type BackgroundType = 'nebula' | 'deepSpace' | 'sunlit' | 'custom';

export interface BackgroundContextProps {
  background: BackgroundType;
  setBackground: (background: BackgroundType) => void;
  customBackground: string | null;
  setCustomBackground: (url: string | null) => void;
  userBubbleColor: string;
  setUserBubbleColor: (color: string) => void;
  assistantBubbleColor: string;
  setAssistantBubbleColor: (color: string) => void;
}

// Create context with default values
const BackgroundContext = createContext<BackgroundContextProps>({
  background: 'nebula',
  setBackground: () => {},
  customBackground: null,
  setCustomBackground: () => {},
  userBubbleColor: '#1e40af',
  setUserBubbleColor: () => {},
  assistantBubbleColor: '#1f2937',
  setAssistantBubbleColor: () => {},
});

// Define provider props
interface BackgroundProviderProps {
  children: ReactNode;
}

// Provider component
export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [background, setBackground] = useState<BackgroundType>('nebula');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [userBubbleColor, setUserBubbleColor] = useState<string>('#1e40af');
  const [assistantBubbleColor, setAssistantBubbleColor] = useState<string>('#1f2937');

  // Load saved settings from localStorage on initial render
  useEffect(() => {
    const savedBackground = localStorage.getItem('background') as BackgroundType;
    const savedCustomBackground = localStorage.getItem('customBackground');
    const savedUserBubbleColor = localStorage.getItem('userBubbleColor');
    const savedAssistantBubbleColor = localStorage.getItem('assistantBubbleColor');
    
    if (savedBackground) setBackground(savedBackground);
    if (savedCustomBackground) setCustomBackground(savedCustomBackground);
    if (savedUserBubbleColor) setUserBubbleColor(savedUserBubbleColor);
    if (savedAssistantBubbleColor) setAssistantBubbleColor(savedAssistantBubbleColor);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('background', background);
  }, [background]);
  
  useEffect(() => {
    if (customBackground) {
      localStorage.setItem('customBackground', customBackground);
    } else {
      localStorage.removeItem('customBackground');
    }
  }, [customBackground]);
  
  useEffect(() => {
    localStorage.setItem('userBubbleColor', userBubbleColor);
  }, [userBubbleColor]);
  
  useEffect(() => {
    localStorage.setItem('assistantBubbleColor', assistantBubbleColor);
  }, [assistantBubbleColor]);

  return (
    <BackgroundContext.Provider 
      value={{ 
        background, 
        setBackground,
        customBackground,
        setCustomBackground,
        userBubbleColor,
        setUserBubbleColor,
        assistantBubbleColor,
        setAssistantBubbleColor
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export { BackgroundContext };
