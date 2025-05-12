
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ArrowDown } from 'lucide-react';
import StarBackground from '@/components/StarBackground';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-nebula-dark text-white p-4 relative">
      <StarBackground starCount={100} />
      
      <div className="relative z-10 max-w-md mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => navigate('/chat')}
            variant="outline"
            className="mb-4 border-neutral-700 text-white hover:bg-nebula-gray/20"
          >
            <ArrowDown className="mr-2 h-4 w-4 rotate-90" />
            Voltar para o chat
          </Button>
          
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-neutral-400">Gerencie suas preferências de aplicativo</p>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-nebula-gray/80 backdrop-blur-sm border-neutral-700">
            <CardHeader>
              <CardTitle>Conta</CardTitle>
              <CardDescription className="text-neutral-400">
                Suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-neutral-400">Email</p>
                <p>{user?.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-400">Status da conta</p>
                <p className={user?.isApproved ? 'text-green-500' : 'text-orange-500'}>
                  {user?.isApproved ? 'Aprovado' : 'Aguardando aprovação'}
                </p>
              </div>
              
              {!user?.isApproved && (
                <div className="bg-nebula-blue/10 p-3 rounded-md text-sm">
                  <p>Sua conta está aguardando aprovação pelo administrador.</p>
                  <p>Você receberá uma notificação quando sua conta for aprovada.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-nebula-gray/80 backdrop-blur-sm border-neutral-700">
            <CardHeader>
              <CardTitle>Ferramentas</CardTitle>
              <CardDescription className="text-neutral-400">
                Funcionalidades disponíveis (em breve)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span>Calendário</span>
                  <span className="text-xs bg-neutral-700 px-2 py-1 rounded">Em breve</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Projetos</span>
                  <span className="text-xs bg-neutral-700 px-2 py-1 rounded">Em breve</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Integração com Youtube</span>
                  <span className="text-xs bg-neutral-700 px-2 py-1 rounded">Em breve</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Análises</span>
                  <span className="text-xs bg-neutral-700 px-2 py-1 rounded">Em breve</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Recomendações</span>
                  <span className="text-xs bg-neutral-700 px-2 py-1 rounded">Em breve</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-nebula-gray/80 backdrop-blur-sm border-neutral-700">
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-400 mb-2">
                Assistente Nebula v1.0
              </p>
              <p className="text-xs text-neutral-500">
                Um assistente inteligente conectado ao n8n para automatizar suas tarefas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
