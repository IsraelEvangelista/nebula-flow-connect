
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Layout, Youtube, Music, FileText, BarChart2 } from 'lucide-react';

const Tools = () => {
  const navigate = useNavigate();
  
  const tools = [
    {
      id: 'calendar',
      name: 'Calendário',
      description: 'Organize seus compromissos e eventos importantes integrado com IA',
      icon: Calendar,
      coming: false,
    },
    {
      id: 'projects',
      name: 'Projetos',
      description: 'Gerencie seus projetos com métodos OKR, Scrum e Kanban',
      icon: Layout,
      coming: true,
    },
    {
      id: 'youtube',
      name: 'Youtube',
      description: 'Integração com plataforma de vídeos',
      icon: Youtube,
      coming: true,
    },
    {
      id: 'music',
      name: 'Música',
      description: 'Integração com plataformas de streaming de música',
      icon: Music,
      coming: true,
    },
    {
      id: 'analysis',
      name: 'Análises',
      description: 'Analise documentos, textos, tabelas e imagens',
      icon: FileText,
      coming: true,
    },
    {
      id: 'recommendations',
      name: 'Recomendações',
      description: 'Recomendações personalizadas baseadas em seu histórico',
      icon: BarChart2,
      coming: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <header className="p-4 bg-slate-900/60 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ferramentas Nebula</h1>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-slate-800"
            onClick={() => navigate('/chat')}
          >
            Voltar para o Chat
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="bg-slate-800/40 border border-slate-700 hover:border-slate-500 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <tool.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  {tool.coming && (
                    <span className="bg-blue-900/50 text-blue-300 text-xs py-1 px-2 rounded">Em breve</span>
                  )}
                </div>
                <CardTitle className="mt-4">{tool.name}</CardTitle>
                <CardDescription className="text-slate-400">{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  className={`w-full ${tool.coming ? 'bg-slate-700/50 cursor-not-allowed' : ''}`}
                  disabled={tool.coming}
                >
                  {tool.coming ? 'Em desenvolvimento' : 'Acessar'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tools;
