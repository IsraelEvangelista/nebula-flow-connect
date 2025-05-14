
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type BackgroundType = 'nebula' | 'deepSpace' | 'sunlit' | 'custom';

interface BackgroundContextProps {
  background: BackgroundType;
  setBackground: (background: BackgroundType) => void;
  customBackground: string | null;
  setCustomBackground: (url: string | null) => void;
  userBubbleColor: string;
  assistantBubbleColor: string;
  setUserBubbleColor: (color: string) => void;
  setAssistantBubbleColor: (color: string) => void;
}

export const BackgroundContext = createContext<BackgroundContextProps>({
  background: 'nebula',
  setBackground: () => {},
  customBackground: null,
  setCustomBackground: () => {},
  userBubbleColor: '#1e40af', // Default blue for user
  assistantBubbleColor: '#1f2937', // Default dark gray for assistant
  setUserBubbleColor: () => {},
  setAssistantBubbleColor: () => {},
});

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [background, setBackground] = useState<BackgroundType>('nebula');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [userBubbleColor, setUserBubbleColor] = useState<string>('#1e40af');
  const [assistantBubbleColor, setAssistantBubbleColor] = useState<string>('#1f2937');

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const savedBackground = localStorage.getItem('background');
    const savedCustomBackground = localStorage.getItem('customBackground');
    const savedUserBubbleColor = localStorage.getItem('userBubbleColor');
    const savedAssistantBubbleColor = localStorage.getItem('assistantBubbleColor');
    
    if (savedBackground) {
      setBackground(savedBackground as BackgroundType);
    }
    
    if (savedCustomBackground) {
      setCustomBackground(savedCustomBackground);
    }
    
    if (savedUserBubbleColor) {
      setUserBubbleColor(savedUserBubbleColor);
    }
    
    if (savedAssistantBubbleColor) {
      setAssistantBubbleColor(savedAssistantBubbleColor);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('background', background);
  }, [background]);

  useEffect(() => {
    if (customBackground) {
      localStorage.setItem('customBackground', customBackground);
    }
  }, [customBackground]);

  useEffect(() => {
    localStorage.setItem('userBubbleColor', userBubbleColor);
  }, [userBubbleColor]);

  useEffect(() => {
    localStorage.setItem('assistantBubbleColor', assistantBubbleColor);
  }, [assistantBubbleColor]);

  return (
    <BackgroundContext.Provider value={{ 
      background, 
      setBackground, 
      customBackground, 
      setCustomBackground, 
      userBubbleColor, 
      assistantBubbleColor, 
      setUserBubbleColor, 
      setAssistantBubbleColor 
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};
