
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  isApproved: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // Mock functions - to be replaced with actual Supabase implementation
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock authentication - will be replaced with Supabase
      if (email && password) {
        const mockUser = {
          id: '123',
          email,
          name: email.split('@')[0],
          isApproved: false // By default users are not approved
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        if (!mockUser.isApproved) {
          toast({
            title: "Conta não aprovada",
            description: "Sua conta está aguardando aprovação pelo administrador.",
            variant: "destructive",
          });
          return;
        }
        
        navigate('/chat');
      } else {
        throw new Error("Email e senha são necessários");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao fazer login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      // Mock Google authentication - will be replaced with Supabase
      const mockUser = {
        id: '123',
        email: 'user@gmail.com',
        name: 'User Name',
        isApproved: true
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/chat');
    } catch (error) {
      toast({
        title: "Erro no login com Google",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao fazer login com Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        loginWithGoogle, 
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
