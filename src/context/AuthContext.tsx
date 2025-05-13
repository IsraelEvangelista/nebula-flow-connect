
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

// Types
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, nome?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Define interface for usuario data to enforce type safety
interface Usuario {
  id: string;
  perfil_id: string | null;
  nome: string | null;
  email: string | null;
  is_approved: boolean | null;
  last_active: string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Setup auth state listener and check for existing session
  useEffect(() => {
    const setupAuth = async () => {
      // First set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          // Handle auth state changes
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // If user is signed out, redirect to login page
          if (event === 'SIGNED_OUT') {
            navigate('/');
          }
        }
      );
      
      // Then check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Setup session timeout
      setupSessionTimeout();
      
      setIsLoading(false);
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuth();
  }, [navigate]);
  
  // Setup session timeout
  const setupSessionTimeout = () => {
    let inactivityTimer: NodeJS.Timeout;
    
    // 30 minutes inactivity timeout
    const TIMEOUT = 30 * 60 * 1000;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Logout user after inactivity
        logout();
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou por inatividade. Por favor, faça login novamente.",
        });
      }, TIMEOUT);
    };
    
    // Reset timer on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });
    
    // Initial timer setup
    resetTimer();
    
    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  };

  // Clean up auth state tokens from storage
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Sign up function
  const signUp = async (email: string, password: string, nome?: string) => {
    try {
      setIsLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Perform signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome || email.split('@')[0], // Use name or extract from email
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada. Por favor, aguarde aprovação do administrador.",
      });
      
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar sua conta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Perform login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Get user profile to check if approved
      const { data: profileData, error: profileError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data.user.id)
        .single() as { data: Usuario | null, error: any };
        
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      // Check if user is approved
      const isApproved = profileData?.is_approved ?? false;
      
      if (!isApproved) {
        toast({
          title: "Conta não aprovada",
          description: "Sua conta está aguardando aprovação pelo administrador.",
          variant: "destructive",
        });
      } else {
        // Navigate to chat page on successful login
        navigate('/chat');
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

  // Login with Google function
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Sign in with Google OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
    } catch (error) {
      toast({
        title: "Erro no login com Google",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao fazer login com Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear state
      setUser(null);
      setSession(null);
      
      // Force page reload for a clean state
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao fazer logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue = {
    user,
    session,
    isLoading,
    login,
    loginWithGoogle,
    signUp,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
