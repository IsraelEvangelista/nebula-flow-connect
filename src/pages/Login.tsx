
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import NebulaBackground from '@/components/backgrounds/NebulaBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login: React.FC = () => {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nome, setNome] = useState('');

  // Auth hooks
  const { login, loginWithGoogle, signUp, isLoading } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (registerPassword !== confirmPassword) {
      alert("As senhas não conferem");
      return;
    }
    
    if (registerPassword.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    signUp(registerEmail, registerPassword, nome);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <NebulaBackground starCount={300} />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          {/* Logo with pulsation effect */}
          <div className="relative mb-4">
            <div 
              className="absolute inset-0 rounded-full blur-xl"
              style={{ 
                background: 'radial-gradient(circle, rgba(138, 101, 223, 0.8) 0%, rgba(91, 157, 241, 0.4) 50%, transparent 80%)',
                animation: 'pulse-slow 3s ease-in-out infinite'
              }}
            />
            <img 
              src="/lovable-uploads/5b5998f2-160b-4865-a545-2c09cd692258.png" 
              alt="Nebula Logo" 
              className="relative z-10 w-20 h-20"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Assistente Nebula</h1>
        </div>
        
        <Card className="bg-nebula-gray/70 backdrop-blur-md border-neutral-700 text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Bem-vindo</CardTitle>
            <CardDescription className="text-neutral-300 text-center">
              Acesse ou crie uma conta para utilizar o assistente
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 bg-nebula-dark/70">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="email"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="bg-nebula-dark/50 text-white border-neutral-600 placeholder:text-neutral-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      id="password"
                      placeholder="Senha"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-nebula-dark/50 text-white border-neutral-600 placeholder:text-neutral-400"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-nebula-purple to-nebula-blue text-white hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <Input
                      id="nome"
                      placeholder="Nome completo"
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      disabled={isLoading}
                      className="bg-nebula-dark/50 text-white border-neutral-600 placeholder:text-neutral-400 mb-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      id="register-email"
                      placeholder="Email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      disabled={isLoading}
                      className="bg-nebula-dark/50 text-white border-neutral-600 placeholder:text-neutral-400 mb-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      id="register-password"
                      placeholder="Senha (mín. 6 caracteres)"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-nebula-dark/50 text-white border-neutral-600 placeholder:text-neutral-400 mb-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      id="confirm-password"
                      placeholder="Confirme a senha"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-nebula-dark/50 text-white border-neutral-600 placeholder:text-neutral-400"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-nebula-purple to-nebula-blue text-white hover:opacity-90 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-nebula-gray px-2 text-neutral-400">Ou continue com</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full bg-transparent border-neutral-600 text-white hover:bg-nebula-blue/20"
              onClick={loginWithGoogle}
              disabled={isLoading}
            >
              {/* Google "G" logo com as cores oficiais */}
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Entrar com Google
            </Button>
          </CardContent>
          
          <CardFooter className="text-center text-xs text-neutral-400">
            Ao entrar, você concorda com nossos termos de serviço.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
