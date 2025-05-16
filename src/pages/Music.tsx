
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Music as MusicIcon, Plus, Trash2, ExternalLink, Search, Play, Pause } from 'lucide-react';
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

interface MusicItem {
  id: string;
  url: string;
  title: string;
  artist: string;
  thumbnail: string;
  genre: string;
}

// Função para extrair o ID do YouTube da URL
const extractYoutubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

const MusicPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [musicList, setMusicList] = useState<MusicItem[]>([]);
  const [isAddingMusic, setIsAddingMusic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLIFrameElement | null>(null);
  
  // Estado para nova música
  const [newMusic, setNewMusic] = useState({
    url: '',
    title: '',
    artist: '',
    genre: '',
  });
  
  // Carregar músicas do localStorage
  useEffect(() => {
    const savedMusics = localStorage.getItem('musicList');
    if (savedMusics) {
      try {
        setMusicList(JSON.parse(savedMusics));
      } catch (error) {
        console.error('Erro ao carregar músicas:', error);
      }
    } else {
      // Dados de exemplo
      const exampleMusics: MusicItem[] = [
        {
          id: 'vEm-KM5E_00',
          url: 'https://www.youtube.com/watch?v=vEm-KM5E_00',
          title: 'Relaxing Jazz Music',
          artist: 'Cafe Music BGM',
          thumbnail: 'https://img.youtube.com/vi/vEm-KM5E_00/maxresdefault.jpg',
          genre: 'jazz',
        },
        {
          id: 'mRD0-GxqHVo',
          url: 'https://www.youtube.com/watch?v=mRD0-GxqHVo',
          title: 'Lofi Hip Hop Radio - beats to relax/study to',
          artist: 'Lofi Girl',
          thumbnail: 'https://img.youtube.com/vi/mRD0-GxqHVo/maxresdefault.jpg',
          genre: 'lo-fi',
        }
      ];
      
      setMusicList(exampleMusics);
      localStorage.setItem('musicList', JSON.stringify(exampleMusics));
    }
  }, []);
  
  // Salvar músicas no localStorage quando mudam
  useEffect(() => {
    if (musicList.length > 0) {
      localStorage.setItem('musicList', JSON.stringify(musicList));
    }
  }, [musicList]);
  
  // Função para adicionar nova música
  const handleAddMusic = async () => {
    if (!newMusic.url) {
      toast({
        title: "Erro",
        description: "A URL da música é obrigatória",
        variant: "destructive"
      });
      return;
    }
    
    const youtubeId = extractYoutubeId(newMusic.url);
    if (!youtubeId) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do YouTube",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar se a música já existe
    if (musicList.some(m => m.id === youtubeId)) {
      toast({
        title: "Música duplicada",
        description: "Esta música já está em sua lista",
        variant: "destructive"
      });
      return;
    }
    
    const musicToAdd: MusicItem = {
      id: youtubeId,
      url: newMusic.url,
      title: newMusic.title || 'Música do YouTube',
      artist: newMusic.artist || 'Artista desconhecido',
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      genre: newMusic.genre.toLowerCase() || 'outros',
    };
    
    setMusicList([...musicList, musicToAdd]);
    setIsAddingMusic(false);
    
    // Reset form
    setNewMusic({
      url: '',
      title: '',
      artist: '',
      genre: '',
    });
    
    toast({
      title: "Música adicionada",
      description: "A música foi adicionada à sua coleção"
    });
  };
  
  // Função para excluir música
  const handleDeleteMusic = (id: string) => {
    setMusicList(musicList.filter(music => music.id !== id));
    
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    }
    
    toast({
      title: "Música removida",
      description: "A música foi removida da sua coleção"
    });
  };
  
  // Filtrar músicas por pesquisa e gênero
  const filteredMusics = musicList.filter(music => {
    const matchesSearch = 
      searchQuery === '' || 
      music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      music.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = 
      activeGenre === 'all' || 
      music.genre === activeGenre;
    
    return matchesSearch && matchesGenre;
  });
  
  // Extrair todos os gêneros únicos
  const allGenres = [...new Set(musicList.map(music => music.genre))];
  
  // Função para tocar ou pausar música
  const togglePlay = (id: string) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(id);
    }
  };
  
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
              <MusicIcon className="w-6 h-6 mr-2 text-purple-400" /> 
              Coleção de Músicas
            </h1>
          </div>
          
          <Dialog open={isAddingMusic} onOpenChange={setIsAddingMusic}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-1" /> Adicionar Música
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 text-white border-slate-700">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Música</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Cole a URL do YouTube e adicione informações sobre a música.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="youtube-url" className="text-right text-sm">URL</label>
                  <Input
                    id="youtube-url"
                    value={newMusic.url}
                    onChange={(e) => setNewMusic({...newMusic, url: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="col-span-3 bg-slate-900/70 border-slate-600"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right text-sm">Título</label>
                  <Input
                    id="title"
                    value={newMusic.title}
                    onChange={(e) => setNewMusic({...newMusic, title: e.target.value})}
                    placeholder="Título da música"
                    className="col-span-3 bg-slate-900/70 border-slate-600"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="artist" className="text-right text-sm">Artista</label>
                  <Input
                    id="artist"
                    value={newMusic.artist}
                    onChange={(e) => setNewMusic({...newMusic, artist: e.target.value})}
                    placeholder="Nome do artista"
                    className="col-span-3 bg-slate-900/70 border-slate-600"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="genre" className="text-right text-sm">Gênero</label>
                  <Input
                    id="genre"
                    value={newMusic.genre}
                    onChange={(e) => setNewMusic({...newMusic, genre: e.target.value})}
                    placeholder="rock, pop, jazz, etc"
                    className="col-span-3 bg-slate-900/70 border-slate-600"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingMusic(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddMusic}
                  className="bg-purple-600 hover:bg-purple-700"
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
            placeholder="Buscar músicas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/40 border-slate-700 text-white"
          />
        </div>
        
        <Tabs value={activeGenre} onValueChange={setActiveGenre} className="w-full md:w-1/2">
          <TabsList className="bg-slate-800/40 border border-slate-700 w-full overflow-x-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
              Todos
            </TabsTrigger>
            {allGenres.map(genre => (
              <TabsTrigger 
                key={genre} 
                value={genre}
                className="data-[state=active]:bg-slate-700"
              >
                {genre}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main content */}
      <main className="container mx-auto p-4 flex-1">
        {filteredMusics.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <MusicIcon className="h-12 w-12 mx-auto text-purple-500/50 mb-4" />
            <p className="text-slate-400">Nenhuma música encontrada.</p>
            <p className="text-sm text-slate-500 mt-1">
              Adicione novas músicas ou ajuste seus filtros de busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMusics.map(music => (
              <Card key={music.id} className="bg-slate-800/40 border-slate-700 overflow-hidden">
                <div className="relative group">
                  <img 
                    src={music.thumbnail} 
                    alt={music.title} 
                    className="w-full h-48 object-cover transition-opacity group-hover:opacity-70"
                    onError={(e) => {
                      // Fallback se a thumbnail não carregar
                      e.currentTarget.src = `https://img.youtube.com/vi/${music.id}/0.jpg`;
                    }}
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="default"
                      size="icon"
                      className={`${
                        currentlyPlaying === music.id 
                          ? 'opacity-100 bg-purple-600 hover:bg-purple-700'
                          : 'opacity-0 group-hover:opacity-100 bg-purple-600/80 hover:bg-purple-600'
                      } transition-opacity rounded-full h-12 w-12`}
                      onClick={() => togglePlay(music.id)}
                    >
                      {currentlyPlaying === music.id ? 
                        <Pause className="h-6 w-6" /> : 
                        <Play className="h-6 w-6 ml-1" />}
                    </Button>
                  </div>
                  
                  {currentlyPlaying === music.id && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-4 py-2">
                      <p className="text-xs text-white/80">
                        Tocando agora
                      </p>
                      <iframe 
                        className="hidden"
                        width="0" 
                        height="0" 
                        src={`https://www.youtube.com/embed/${music.id}?autoplay=1`}
                        title="YouTube music player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ref={(ref) => setAudioRef(ref)}
                      ></iframe>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white line-clamp-1">{music.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{music.artist}</p>
                      
                      <div className="mt-2">
                        <span 
                          className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full cursor-pointer"
                          onClick={() => setActiveGenre(music.genre)}
                        >
                          {music.genre}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                        asChild
                      >
                        <a href={music.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                        onClick={() => handleDeleteMusic(music.id)}
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

export default MusicPage;
