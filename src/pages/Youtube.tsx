
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Youtube as YoutubeIcon, Plus, Trash2, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  description: string;
  tags: string[];
}

// Função para extratar o ID do YouTube da URL
const extractYoutubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

const YoutubePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Estado para novo vídeo
  const [newVideo, setNewVideo] = useState({
    url: '',
    title: '',
    description: '',
    tags: ''
  });
  
  // Carregar vídeos do localStorage
  useEffect(() => {
    const savedVideos = localStorage.getItem('youtubeVideos');
    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos));
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
      }
    } else {
      // Dados de exemplo
      const exampleVideos: VideoItem[] = [
        {
          id: 'dQw4w9WgXcQ',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Rick Astley - Never Gonna Give You Up',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          description: 'Clássico dos anos 80',
          tags: ['música', 'pop', 'anos80']
        },
        {
          id: '9bZkp7q19f0',
          url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
          title: 'PSY - GANGNAM STYLE',
          thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
          description: 'O vídeo mais viral de todos os tempos',
          tags: ['música', 'kpop']
        }
      ];
      
      setVideos(exampleVideos);
      localStorage.setItem('youtubeVideos', JSON.stringify(exampleVideos));
    }
  }, []);
  
  // Salvar vídeos no localStorage quando mudam
  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('youtubeVideos', JSON.stringify(videos));
    }
  }, [videos]);
  
  // Função para adicionar novo vídeo
  const handleAddVideo = async () => {
    if (!newVideo.url) {
      toast({
        title: "Erro",
        description: "A URL do vídeo é obrigatória",
        variant: "destructive"
      });
      return;
    }
    
    const youtubeId = extractYoutubeId(newVideo.url);
    if (!youtubeId) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do YouTube",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar se o vídeo já existe
    if (videos.some(v => v.id === youtubeId)) {
      toast({
        title: "Vídeo duplicado",
        description: "Este vídeo já está em sua lista",
        variant: "destructive"
      });
      return;
    }
    
    const videoToAdd: VideoItem = {
      id: youtubeId,
      url: newVideo.url,
      title: newVideo.title || 'Vídeo do YouTube',
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      description: newVideo.description || '',
      tags: newVideo.tags ? newVideo.tags.split(',').map(tag => tag.trim().toLowerCase()) : []
    };
    
    setVideos([...videos, videoToAdd]);
    setIsAddingVideo(false);
    
    // Reset form
    setNewVideo({
      url: '',
      title: '',
      description: '',
      tags: ''
    });
    
    toast({
      title: "Vídeo adicionado",
      description: "O vídeo foi adicionado à sua lista"
    });
  };
  
  // Função para excluir vídeo
  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
    toast({
      title: "Vídeo removido",
      description: "O vídeo foi removido da sua lista"
    });
  };
  
  // Filtrar vídeos por pesquisa e tag
  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (video.tags.includes(activeTab));
    
    return matchesSearch && matchesTab;
  });
  
  // Extrair todas as tags únicas dos vídeos
  const allTags = [...new Set(videos.flatMap(video => video.tags))];
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="p-4 bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate("/chat")}
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </Button>
            <h1 className="text-xl font-bold flex items-center">
              <YoutubeIcon className="w-6 h-6 mr-2 text-red-500" /> 
              YouTube Collection
            </h1>
          </div>
          
          <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-1" /> Adicionar Vídeo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 text-white border-slate-700">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Cole a URL do YouTube e adicione informações sobre o vídeo.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="youtube-url" className="text-right text-sm">URL</label>
                  <Input
                    id="youtube-url"
                    value={newVideo.url}
                    onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="col-span-3 bg-slate-900/70 border-slate-600"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right text-sm">Título</label>
                  <Input
                    id="title"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                    placeholder="Título do vídeo"
                    className="col-span-3 bg-slate-900/70 border-slate-600"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right text-sm">Descrição</label>
                  <Input
                    id="description"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                    placeholder="Breve descrição"
                    className="col-span-3 bg-slate-900/70 border-slate-600"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="tags" className="text-right text-sm">Tags</label>
                  <Input
                    id="tags"
                    value={newVideo.tags}
                    onChange={(e) => setNewVideo({...newVideo, tags: e.target.value})}
                    placeholder="música, tutorial, etc (separados por vírgula)"
                    className="col-span-3 bg-slate-900/70 border-slate-600"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingVideo(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddVideo}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      
      {/* Search Bar and Filters */}
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/2 relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar vídeos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/40 border-slate-700 text-white"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-1/2">
          <TabsList className="bg-slate-800/40 border border-slate-700 w-full overflow-x-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
              Todos
            </TabsTrigger>
            {allTags.map(tag => (
              <TabsTrigger 
                key={tag} 
                value={tag}
                className="data-[state=active]:bg-slate-700"
              >
                {tag}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main content */}
      <main className="container mx-auto p-4 flex-1">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <YoutubeIcon className="h-12 w-12 mx-auto text-red-500/50 mb-4" />
            <p className="text-slate-400">Nenhum vídeo encontrado.</p>
            <p className="text-sm text-slate-500 mt-1">
              Adicione novos vídeos ou ajuste seus filtros de busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <Card key={video.id} className="bg-slate-800/40 border-slate-700 overflow-hidden">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      // Fallback se a thumbnail não carregar
                      e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/0.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <a 
                      href={video.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="m-3"
                    >
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Assistir
                      </Button>
                    </a>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{video.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full"
                            onClick={() => setActiveTab(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                        asChild
                      >
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default YoutubePage;
