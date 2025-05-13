
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Check, Upload } from 'lucide-react';
import DeepSpaceBackground from '@/components/backgrounds/DeepSpaceBackground';
import NebulaBackground from '@/components/backgrounds/NebulaBackground';
import SunlitSpaceBackground from '@/components/backgrounds/SunlitSpaceBackground';
import CustomBackground from '@/components/backgrounds/CustomBackground';
import { useBackground, BackgroundType } from '@/context/BackgroundContext';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { backgroundType, customBackground, changeBackground } = useBackground();
  const { toast } = useToast();
  const [localCustomBackground, setLocalCustomBackground] = useState<string | null>(customBackground);
  const customBackgroundInputRef = useRef<HTMLInputElement>(null);
  
  const handleBackgroundChange = (type: BackgroundType) => {
    changeBackground(type);
    toast({
      title: "Plano de fundo alterado",
      description: "O plano de fundo do chat foi atualizado.",
    });
  };
  
  const handleCustomBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const result = event.target.result as string;
        setLocalCustomBackground(result);
        changeBackground('custom', result);
        
        toast({
          title: "Imagem personalizada carregada",
          description: "Seu plano de fundo personalizado foi configurado.",
        });
      }
    };
    
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };
  
  const renderPreview = (type: BackgroundType) => {
    const isActive = type === backgroundType;
    
    return (
      <button
        className={`relative w-full aspect-[16/9] rounded-lg overflow-hidden border-2 ${
          isActive ? 'border-nebula-blue' : 'border-transparent hover:border-white/20'
        } transition-colors focus:outline-none focus:ring-2 focus:ring-nebula-blue`}
        onClick={() => handleBackgroundChange(type)}
      >
        <div className="absolute inset-0">
          {type === 'deep-space' && <DeepSpaceBackground starCount={50} />}
          {type === 'nebula' && <NebulaBackground starCount={50} />}
          {type === 'sunlit' && <SunlitSpaceBackground starCount={40} />}
          {type === 'custom' && localCustomBackground && <CustomBackground imageUrl={localCustomBackground} />}
        </div>
        
        {isActive && (
          <div className="absolute top-2 right-2 bg-nebula-blue rounded-full p-1">
            <Check size={16} className="text-white" />
          </div>
        )}
        
        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-sm p-2 text-white">
          {type === 'deep-space' && 'Espaço Profundo'}
          {type === 'nebula' && 'Nebulosa'}
          {type === 'sunlit' && 'Amanhecer Estelar'}
          {type === 'custom' && 'Personalizado'}
        </div>
      </button>
    );
  };
  
  return (
    <div className="min-h-screen text-white p-4 relative">
      <NebulaBackground starCount={100} />
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => navigate('/chat')}
            variant="outline"
            className="mb-4 border-white/20 bg-nebula-gray/30 backdrop-blur-md text-white hover:bg-nebula-blue/20 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o chat
          </Button>
          
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-neutral-400">Gerencie suas preferências de aplicativo</p>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-nebula-gray/40 backdrop-blur-md border-neutral-700">
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
                <p className="text-green-500">
                  Ativo
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-nebula-gray/40 backdrop-blur-md border-neutral-700">
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription className="text-neutral-400">
                Personalize a aparência do assistente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-sm font-medium mb-3">Plano de Fundo do Chat</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {renderPreview('deep-space')}
                {renderPreview('nebula')}
                {renderPreview('sunlit')}
                {(customBackground || localCustomBackground) && renderPreview('custom')}
              </div>
              
              <div>
                <Button 
                  variant="outline" 
                  className="w-full border-dashed border-white/20 bg-white/5 hover:bg-white/10"
                  onClick={() => customBackgroundInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {localCustomBackground ? 'Trocar imagem personalizada' : 'Carregar imagem personalizada'}
                </Button>
                <input 
                  ref={customBackgroundInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomBackgroundUpload}
                  className="hidden"
                />
                <p className="text-xs text-neutral-400 mt-2 text-center">
                  Recomendado: imagens escuras para melhor legibilidade
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-nebula-gray/40 backdrop-blur-md border-neutral-700">
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
