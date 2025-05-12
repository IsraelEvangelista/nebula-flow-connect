
import { useState, useEffect } from 'react';

export const useGreeting = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      
      let baseGreeting = '';
      if (hour >= 5 && hour < 12) {
        baseGreeting = 'Bom dia';
      } else if (hour >= 12 && hour < 18) {
        baseGreeting = 'Boa tarde';
      } else {
        baseGreeting = 'Boa noite';
      }
      
      // Generate a random complement for each session
      const complements = [
        'senhor! Em que posso ser útil hoje?',
        'como posso ajudá-lo hoje?',
        'espero que esteja bem! Como posso auxiliá-lo?',
        'o que está planejando para hoje?',
        'estou aqui para o que precisar!',
        'tem algo em que eu possa ajudar?',
        'estou pronto para auxiliá-lo!'
      ];
      
      const randomComplement = complements[Math.floor(Math.random() * complements.length)];
      
      return `${baseGreeting} ${randomComplement}`;
    };
    
    // Set greeting on component mount
    setGreeting(getGreeting());
    
    // This greeting won't change during the session
    // It will only change when the component remounts (new session)
  }, []);
  
  return greeting;
};
