import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from '@/components/ChatHeader';
import { BackgroundContext, BackgroundType } from '@/context/BackgroundContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const { setBackground, customBackground, setCustomBackground } = useContext(BackgroundContext);
  const { clearMessages } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [imageUrl, setImageUrl] = useState(customBackground || '');

  useEffect(() => {
    // Load the image URL from localStorage when the component mounts
    const storedImageUrl = localStorage.getItem('customBackground');
    if (storedImageUrl) {
      setImageUrl(storedImageUrl);
      setCustomBackground(storedImageUrl);
    }
  }, [setCustomBackground]);

  const handleBackgroundChange = (background: BackgroundType) => {
    setBackground(background);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSaveCustomBackground = () => {
    localStorage.setItem('customBackground', imageUrl);
    setCustomBackground(imageUrl);
    toast({
      title: "Fundo customizado atualizado!",
      description: "O fundo customizado foi atualizado com sucesso.",
    });
  };

  const handleClearCustomBackground = () => {
    localStorage.removeItem('customBackground');
    setImageUrl('');
    setCustomBackground(null);
    toast({
      title: "Fundo customizado removido!",
      description: "O fundo customizado foi removido e revertido para o padrão.",
    });
  };

  const handleClearChat = () => {
    clearMessages();
    toast({
      title: "Chat limpo!",
      description: "Todas as mensagens foram removidas.",
    });
  };

  const handleLogout = () => {
    navigate('/');
    toast({
      title: "Logout efetuado!",
      description: "Você foi redirecionado para a página de login.",
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ChatHeader />

      <main className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-white">Configurações</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Fundo</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => handleBackgroundChange('deepSpace')}>
                Espaço profundo
              </Button>
              <Button variant="outline" onClick={() => handleBackgroundChange('nebula')}>
                Nebulosa
              </Button>
              <Button variant="outline" onClick={() => handleBackgroundChange('sunlit')}>
                Espaço iluminado
              </Button>
              <Button variant="outline" onClick={() => handleBackgroundChange('custom')}>
                Customizado
              </Button>
            </div>
          </div>

          {/* Custom Background Image URL */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Fundo Customizado</h3>
            <div className="space-y-2">
              <Label htmlFor="image-url" className="text-white">URL da Imagem</Label>
              <Input
                type="text"
                id="image-url"
                placeholder="Insira o URL da imagem"
                value={imageUrl}
                onChange={handleImageUrlChange}
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveCustomBackground}>Salvar Fundo</Button>
                <Button variant="destructive" onClick={handleClearCustomBackground}>Limpar Fundo</Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Dados</h3>
            <Button variant="destructive" onClick={handleClearChat}>Limpar Chat</Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Conta</h3>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
