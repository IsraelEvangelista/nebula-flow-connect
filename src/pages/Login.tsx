
import React, { useState, useEffect } from 'react';
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
  
  // Create pulsating effect for the logo
  const [pulseIntensity, setPulseIntensity] = useState(0);
  
  useEffect(() => {
    // Create a slowly changing pulse effect
    let animationFrame: number;
    let start = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - start;
      // Sine wave oscillation for natural pulsing effect
      const intensity = Math.sin(elapsed / 1000) * 0.3 + 0.7;
      setPulseIntensity(intensity);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

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
          {/* Pulsating logo */}
          <div className="relative mb-4">
            <div 
              className="absolute inset-0 rounded-full blur-xl"
              style={{ 
                background: `radial-gradient(circle, rgba(138, 101, 223, ${pulseIntensity * 0.8}) 0%, rgba(91, 157, 241, ${pulseIntensity * 0.4}) 50%, transparent 80%)`,
                transform: `scale(${1 + pulseIntensity * 0.3})`,
                opacity: pulseIntensity
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
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
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
