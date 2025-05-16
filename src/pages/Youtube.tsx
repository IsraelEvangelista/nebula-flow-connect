
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Youtube as YoutubeIcon, Plus, Trash2, ExternalLink, Search, Play } from 'lucide-react';
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
  categoryId?: string; // ID da categoria
}

interface Category {
  id: string;
  name: string;
  color?: string; // Para personalizar cores das categorias
}

// Função para extratar o ID do YouTube da URL
const extractYoutubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Cores para categorias
const categoryColors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", 
  "bg-yellow-500", "bg-purple-500", "bg-pink-500",
  "bg-indigo-500", "bg-orange-500", "bg-teal-500"
];

const YoutubePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Estado para novo vídeo
  const [newVideo, setNewVideo] = useState({
    url: '',
    title: '',
    description: '',
    tags: '',
    categoryId: ''
  });
  
  // Carregar vídeos e categorias do localStorage
  useEffect(() => {
    const savedVideos = localStorage.getItem('youtubeVideos');
    const savedCategories = localStorage.getItem('youtubeCategories');
    
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
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    } else {
      // Categorias de exemplo
      const exampleCategories: Category[] = [
        { id: 'cat1', name: 'Música', color: 'bg-purple-500' },
        { id: 'cat2', name: 'Tutoriais', color: 'bg-blue-500' }
      ];
      
      setCategories(exampleCategories);
      localStorage.setItem('youtubeCategories', JSON.stringify(exampleCategories));
    }
  }, []);
  
  // Salvar vídeos e categorias no localStorage quando mudam
  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('youtubeVideos', JSON.stringify(videos));
    }
    
    if (categories.length > 0) {
      localStorage.setItem('youtubeCategories', JSON.stringify(categories));
    }
  }, [videos, categories]);
  
  // Função para adicionar nova categoria
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar se a categoria já existe
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        title: "Categoria duplicada",
        description: "Esta categoria já existe",
        variant: "destructive"
      });
      return;
    }
    
    // Selecionar uma cor aleatória para a categoria
    const randomColorIndex = Math.floor(Math.random() * categoryColors.length);
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      color: categoryColors[randomColorIndex]
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsAddingCategory(false);
    
    toast({
      title: "Categoria adicionada",
      description: `A categoria "${newCategoryName}" foi adicionada com sucesso`
    });
  };
  
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
      tags: newVideo.tags ? newVideo.tags.split(',').map(tag => tag.trim().toLowerCase()) : [],
      categoryId: newVideo.categoryId || undefined
    };
    
    setVideos([...videos, videoToAdd]);
    setIsAddingVideo(false);
    
    // Reset form
    setNewVideo({
      url: '',
      title: '',
      description: '',
      tags: '',
      categoryId: ''
    });
    
    toast({
      title: "Vídeo adicionado",
      description: "O vídeo foi adicionado à sua lista"
    });
  };
  
  // Função para excluir vídeo
  const handleDeleteVideo = (id: string) => {
    if (currentVideoId === id) {
      setCurrentVideoId(null);
    }
    
    setVideos(videos.filter(video => video.id !== id));
    toast({
      title: "Vídeo removido",
      description: "O vídeo foi removido da sua lista"
    });
  };
  
  // Função para reproduzir vídeo
  const playVideo = (id: string) => {
    setCurrentVideoId(id === currentVideoId ? null : id);
  };
  
  // Filtrar vídeos por pesquisa, tag e categoria
  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      video.tags.includes(activeTab);
    
    const matchesCategory =
      !categoryFilter || 
      video.categoryId === categoryFilter;
    
    return matchesSearch && matchesTab && matchesCategory;
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
          
          <div className="flex gap-2">
            {/* Diálogo para nova categoria */}
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-slate-600">
                  <Plus className="h-4 w-4 mr-1" /> Categoria
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 text-white border-slate-700">
                <DialogHeader>
                  <DialogTitle>Nova Categoria</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Crie uma categoria para organizar seus vídeos.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nome da categoria"
                    className="bg-slate-900/70 border-slate-600"
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingCategory(false)}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddCategory}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Diálogo para novo vídeo */}
            <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-1" /> Vídeo
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
                  
                  {categories.length > 0 && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Categoria</label>
                      <div className="col-span-3">
                        <select
                          value={newVideo.categoryId}
                          onChange={(e) => setNewVideo({...newVideo, categoryId: e.target.value})}
                          className="w-full bg-slate-900/70 border-slate-600 rounded-md p-2 text-white"
                        >
                          <option value="">Sem categoria</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
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
        </div>
      </header>
      
      {/* Search Bar and Filters */}
      <div className="container mx-auto p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2 relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Buscar vídeos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/40 border-slate-700 text-white"
            />
          </div>
          
          {categories.length > 0 && (
            <div className="w-full md:w-1/2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-800/40 border-slate-700 rounded-md p-2 text-white"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                  {/* Se o vídeo estiver sendo reproduzido, exibir o player do YouTube */}
                  {currentVideoId === video.id ? (
                    <div className="w-full aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          // Fallback se a thumbnail não carregar
                          e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/0.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          variant="default"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 bg-red-600/80 hover:bg-red-600 transition-opacity rounded-full h-12 w-12"
                          onClick={() => playVideo(video.id)}
                        >
                          <Play className="h-6 w-6 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{video.description}</p>
                      
                      {/* Exibir categoria se existir */}
                      {video.categoryId && (
                        <div className="mt-2">
                          {categories.filter(cat => cat.id === video.categoryId).map(cat => (
                            <span
                              key={cat.id}
                              className={`text-xs text-white px-2 py-1 rounded-full mr-1 ${cat.color || 'bg-slate-700'}`}
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full cursor-pointer"
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
