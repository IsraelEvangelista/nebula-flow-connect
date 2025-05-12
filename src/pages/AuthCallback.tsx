
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      // Get the session information
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        toast({
          title: "Erro na autenticação",
          description: error.message,
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      if (data?.session) {
        // Check if the user exists in our usuarios table
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        // If there's a 'not found' error, user doesn't exist in our table
        if (userError && userError.code === 'PGRST116') {
          // Create user in our usuarios table
          const { error: insertError } = await supabase
            .from('usuarios')
            .insert({
              id: data.session.user.id,
              nome: data.session.user.user_metadata.full_name || data.session.user.email,
              email: data.session.user.email,
              is_approved: false // Default to not approved
            });
            
          if (insertError) {
            toast({
              title: "Erro ao criar perfil",
              description: insertError.message,
              variant: "destructive",
            });
            navigate('/');
            return;
          }
          
          toast({
            title: "Cadastro realizado com sucesso",
            description: "Sua conta foi criada. Por favor, aguarde aprovação do administrador.",
          });
          navigate('/');
          return;
        }

        // Check if user is approved
        if (userData && !userData.is_approved) {
          toast({
            title: "Conta não aprovada",
            description: "Sua conta está aguardando aprovação pelo administrador.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // If all checks pass, redirect to chat
        navigate('/chat');
      } else {
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-nebula-dark">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nebula-purple mx-auto mb-4"></div>
        <p>Processando autenticação...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
