
import React, { createContext, useState, useEffect, ReactNode } from 'react';

type BackgroundType = 'nebula' | 'deepSpace' | 'sunlit';

interface BackgroundContextProps {
  background: BackgroundType;
  setBackground: (background: BackgroundType) => void;
  userBubbleColor: string;
  assistantBubbleColor: string;
  setUserBubbleColor: (color: string) => void;
  setAssistantBubbleColor: (color: string) => void;
}

export const BackgroundContext = createContext<BackgroundContextProps>({
  background: 'nebula',
  setBackground: () => {},
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
  const [userBubbleColor, setUserBubbleColor] = useState<string>('#1e40af');
  const [assistantBubbleColor, setAssistantBubbleColor] = useState<string>('#1f2937');

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const savedBackground = localStorage.getItem('background');
    const savedUserBubbleColor = localStorage.getItem('userBubbleColor');
    const savedAssistantBubbleColor = localStorage.getItem('assistantBubbleColor');
    
    if (savedBackground) {
      setBackground(savedBackground as BackgroundType);
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
    localStorage.setItem('userBubbleColor', userBubbleColor);
  }, [userBubbleColor]);

  useEffect(() => {
    localStorage.setItem('assistantBubbleColor', assistantBubbleColor);
  }, [assistantBubbleColor]);

  return (
    <BackgroundContext.Provider value={{ 
      background, 
      setBackground, 
      userBubbleColor, 
      assistantBubbleColor, 
      setUserBubbleColor, 
      setAssistantBubbleColor 
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};
