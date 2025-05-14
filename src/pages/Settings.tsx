
import { useContext, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackgroundContext } from "@/context/BackgroundContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const isMobile = useIsMobile();
  const { background, setBackground, userBubbleColor, assistantBubbleColor, setUserBubbleColor, setAssistantBubbleColor } = useContext(BackgroundContext);
  const navigate = useNavigate();
  const [showAnimations, setShowAnimations] = useState(true);
  const [starDensity, setStarDensity] = useState(100);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // User profile data
  const [userData, setUserData] = useState({
    nome: "",
    email: ""
  });
  
  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome, email')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar seus dados de perfil.",
            variant: "destructive",
          });
        } else if (data) {
          setUserData({
            nome: data.nome || "",
            email: data.email || ""
          });
        }
      }
    };
    
    fetchUserData();
  }, [user, toast]);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação de senha devem ser idênticas.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Não foi possível alterar sua senha.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-auto text-white">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Configurações</h1>
          <Button onClick={() => navigate("/chat")} variant="outline" className="text-white border-white hover:bg-slate-800">
            Voltar para o Chat
          </Button>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 bg-slate-800">
            <TabsTrigger value="appearance" className="text-white data-[state=active]:bg-slate-700">Aparência</TabsTrigger>
            <TabsTrigger value="account" className="text-white data-[state=active]:bg-slate-700">Conta</TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-slate-700">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <Card className="bg-slate-800/40 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Aparência</CardTitle>
                <CardDescription className="text-slate-300">
                  Personalize a aparência da interface do chat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Plano de Fundo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`rounded-lg p-4 border-2 cursor-pointer bg-black ${background === 'nebula' ? 'border-primary' : 'border-slate-700'}`}
                      onClick={() => setBackground('nebula')}
                    >
                      <div className="h-24 rounded bg-purple-900/40 flex items-center justify-center mb-2">
                        <span className="text-white text-sm">Nebulosa</span>
                      </div>
                    </div>
                    <div 
                      className={`rounded-lg p-4 border-2 cursor-pointer bg-black ${background === 'deepSpace' ? 'border-primary' : 'border-slate-700'}`}
                      onClick={() => setBackground('deepSpace')}
                    >
                      <div className="h-24 rounded bg-blue-900/20 flex items-center justify-center mb-2">
                        <span className="text-white text-sm">Espaço Profundo</span>
                      </div>
                    </div>
                    <div 
                      className={`rounded-lg p-4 border-2 cursor-pointer bg-black ${background === 'sunlit' ? 'border-primary' : 'border-slate-700'}`}
                      onClick={() => setBackground('sunlit')}
                    >
                      <div className="h-24 rounded bg-amber-500/30 flex items-center justify-center mb-2">
                        <span className="text-white text-sm">Amanhecer Estelar</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-slate-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Efeitos</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations" className="text-white">Mostrar animações</Label>
                    <Switch 
                      id="animations" 
                      checked={showAnimations} 
                      onCheckedChange={setShowAnimations} 
                    />
                  </div>
                  
                  {showAnimations && (
                    <div className="space-y-3">
                      <Label htmlFor="starDensity" className="text-white">Densidade de estrelas: {starDensity}</Label>
                      <Input 
                        id="starDensity" 
                        type="range" 
                        min="50" 
                        max="200" 
                        value={starDensity} 
                        onChange={(e) => setStarDensity(parseInt(e.target.value))} 
                        className="w-full" 
                      />
                    </div>
                  )}
                </div>

                <Separator className="my-4 bg-slate-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Cores dos balões de chat</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userBubbleColor" className="text-white">Cor do balão do usuário</Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          id="userBubbleColor" 
                          type="color" 
                          value={userBubbleColor} 
                          onChange={(e) => setUserBubbleColor(e.target.value)}
                          className="w-14 h-10 p-1 rounded" 
                        />
                        <div 
                          className="p-4 rounded-lg flex-grow"
                          style={{ backgroundColor: userBubbleColor }}
                        >
                          <span className="text-xs font-mono">
                            {userBubbleColor}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assistantBubbleColor" className="text-white">Cor do balão do assistente</Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          id="assistantBubbleColor" 
                          type="color" 
                          value={assistantBubbleColor} 
                          onChange={(e) => setAssistantBubbleColor(e.target.value)}
                          className="w-14 h-10 p-1 rounded" 
                        />
                        <div 
                          className="p-4 rounded-lg flex-grow"
                          style={{ backgroundColor: assistantBubbleColor }}
                        >
                          <span className="text-xs font-mono">
                            {assistantBubbleColor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="bg-slate-800/40 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações da Conta</CardTitle>
                <CardDescription className="text-slate-300">
                  Gerencie as configurações da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white">Perfil</h3>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Nome de usuário</Label>
                    <Input 
                      id="username" 
                      value={userData.nome} 
                      readOnly 
                      className="bg-slate-700 text-white opacity-80" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={userData.email} 
                      readOnly 
                      className="bg-slate-700 text-white opacity-80" 
                    />
                  </div>
                </div>

                <Separator className="my-4 bg-slate-700" />

                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <h3 className="text-lg font-medium text-white">Senha</h3>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">Senha atual</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-slate-700 text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">Nova senha</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-slate-700 text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirmar senha</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-slate-700 text-white" 
                    />
                  </div>
                  <Button type="submit" className="mt-2">Alterar senha</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-slate-800/40 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Notificações</CardTitle>
                <CardDescription className="text-slate-300">
                  Configure como você deseja receber as notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-white block mb-1">Notificações por email</Label>
                      <p className="text-sm text-slate-400">Receba atualizações importantes por email</p>
                    </div>
                    <Switch id="emailNotifications" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications" className="text-white block mb-1">Notificações push</Label>
                      <p className="text-sm text-slate-400">Receba alertas em tempo real diretamente no navegador</p>
                    </div>
                    <Switch id="pushNotifications" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="soundAlerts" className="text-white block mb-1">Alertas sonoros</Label>
                      <p className="text-sm text-slate-400">Reproduza sons ao receber novas mensagens</p>
                    </div>
                    <Switch id="soundAlerts" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
