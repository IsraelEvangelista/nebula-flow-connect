
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BackgroundType = 'deep-space' | 'nebula' | 'sunlit' | 'custom';

interface BackgroundContextType {
  backgroundType: BackgroundType;
  customBackground: string | null;
  changeBackground: (type: BackgroundType, customUrl?: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('nebula');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  
  // Load from localStorage on initial mount
  useEffect(() => {
    const savedBackground = localStorage.getItem('backgroundType');
    const savedCustomUrl = localStorage.getItem('customBackgroundUrl');
    
    if (savedBackground) {
      setBackgroundType(savedBackground as BackgroundType);
    }
    
    if (savedCustomUrl) {
      setCustomBackground(savedCustomUrl);
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
  
  return (
    <BackgroundContext.Provider 
      value={{ 
        backgroundType,
        customBackground,
        changeBackground
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
