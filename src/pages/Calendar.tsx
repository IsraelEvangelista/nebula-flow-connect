import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, Clock, Globe, Bell, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

// Tipo para eventos
interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  meetingUrl?: string;
  reminders: number[]; // Tempos em horas antes do evento
  isHoliday?: boolean;
}

// Função para verificar se uma data é fim de semana
const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 é domingo, 6 é sábado
};

// Componente principal
const CalendarPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  
  // Estado para novo evento
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: new Date(),
    time: '',
    meetingUrl: '',
    reminders: [1], // 1 hora por padrão
  });
  
  // Carregar eventos do localStorage ao iniciar
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        // Converte strings de data de volta para objetos Date
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    }
    
    // Adicionar alguns feriados de exemplo se não houver eventos
    if (!savedEvents || JSON.parse(savedEvents).length === 0) {
      const holidays = [
        {
          id: 'holiday-1',
          title: 'Ano Novo',
          date: new Date(new Date().getFullYear(), 0, 1), // 1º de Janeiro
          isHoliday: true,
          reminders: []
        },
        {
          id: 'holiday-2',
          title: 'Carnaval',
          date: new Date(new Date().getFullYear(), 1, 13), // Aproximadamente
          isHoliday: true,
          reminders: []
        },
        {
          id: 'holiday-3',
          title: 'Tiradentes',
          date: new Date(new Date().getFullYear(), 3, 21), // 21 de Abril
          isHoliday: true,
          reminders: []
        },
        {
          id: 'holiday-4',
          title: 'Natal',
          date: new Date(new Date().getFullYear(), 11, 25), // 25 de Dezembro
          isHoliday: true,
          reminders: []
        }
      ];
      setEvents(holidays);
      localStorage.setItem('calendarEvents', JSON.stringify(holidays));
    }
  }, []);
  
  // Salvar eventos no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);
  
  // Eventos do dia selecionado
  const eventsForSelectedDate = events.filter(event => 
    event.date.getDate() === selectedDate.getDate() &&
    event.date.getMonth() === selectedDate.getMonth() &&
    event.date.getFullYear() === selectedDate.getFullYear()
  );
  
  // Função para adicionar novo evento
  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast({
        title: "Erro",
        description: "O título do evento é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    const eventToAdd = {
      ...newEvent,
      id: `event-${Date.now()}`,
      date: selectedDate // Usar a data selecionada
    };
    
    setEvents([...events, eventToAdd]);
    setIsAddingEvent(false);
    
    // Reset form
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      time: '',
      meetingUrl: '',
      reminders: [1]
    });
    
    toast({
      title: "Evento adicionado",
      description: `${eventToAdd.title} foi adicionado com sucesso`
    });
  };
  
  // Função para excluir evento
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Evento removido",
      description: "O evento foi removido com sucesso"
    });
  };
  
  // Função para adicionar lembrete
  const handleAddReminder = () => {
    if (newEvent.reminders.length < 5) {
      setNewEvent({
        ...newEvent,
        reminders: [...newEvent.reminders, 1]
      });
    } else {
      toast({
        title: "Limite de lembretes",
        description: "Você atingiu o limite de 5 lembretes por evento",
        variant: "destructive"
      });
    }
  };
  
  // Função para remover lembrete
  const handleRemoveReminder = (index: number) => {
    setNewEvent({
      ...newEvent,
      reminders: newEvent.reminders.filter((_, i) => i !== index)
    });
  };
  
  // Função para atualizar um lembrete
  const handleUpdateReminder = (index: number, value: string) => {
    const newReminders = [...newEvent.reminders];
    newReminders[index] = parseInt(value, 10);
    setNewEvent({
      ...newEvent,
      reminders: newReminders
    });
  };
  
  // Função para criar classe CSS para dias do calendário
  const getDayClassName = (date: Date) => {
    // Classes para estilo de dia
    let className = "";
    
    // Verificar se é fim de semana
    if (isWeekend(date)) {
      className += "bg-blue-100/20 text-blue-200 ";
    }
    
    // Verificar se há eventos neste dia
    const hasEvents = events.some(
      event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
    
    if (hasEvents) {
      className += "font-bold text-purple-300 ";
    }
    
    // Verificar se é feriado
    const isHoliday = events.some(
      event => 
        event.isHoliday &&
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
    
    if (isHoliday) {
      className += "text-red-400 font-bold ";
    }
    
    return className;
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
              <CalendarIcon className="w-6 h-6 mr-2 text-purple-400" /> 
              Calendário
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto p-4 flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="col-span-1">
          <Card className="bg-slate-800/40 border-slate-700">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="bg-slate-900/70 text-white border-slate-700 rounded-lg p-3 pointer-events-auto"
                modifiers={{
                  weekend: (date) => isWeekend(date),
                  hasEvents: (date) => events.some(
                    event => 
                      event.date.getDate() === date.getDate() &&
                      event.date.getMonth() === date.getMonth() &&
                      event.date.getFullYear() === date.getFullYear()
                  ),
                  isHoliday: (date) => events.some(
                    event => 
                      event.isHoliday &&
                      event.date.getDate() === date.getDate() &&
                      event.date.getMonth() === date.getMonth() &&
                      event.date.getFullYear() === date.getFullYear()
                  )
                }}
                modifiersClassNames={{
                  weekend: "bg-blue-100/20 text-blue-200",
                  hasEvents: "font-bold text-purple-300",
                  isHoliday: "text-red-400 font-bold"
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Lista de eventos */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Eventos para {selectedDate.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-1" /> Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-lg">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Evento</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Preencha os detalhes do evento abaixo.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  {/* Título */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="title" className="text-right">Título</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="col-span-3 bg-slate-900/70 border-slate-600"
                      placeholder="Reunião de equipe"
                    />
                  </div>
                  
                  {/* Descrição */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="description" className="text-right">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="col-span-3 bg-slate-900/70 border-slate-600"
                      placeholder="Detalhes sobre o evento..."
                    />
                  </div>
                  
                  {/* Horário */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="time" className="text-right">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="col-span-3 bg-slate-900/70 border-slate-600"
                    />
                  </div>
                  
                  {/* URL de reunião */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="url" className="text-right">URL</Label>
                    <Input
                      id="url"
                      value={newEvent.meetingUrl}
                      onChange={(e) => setNewEvent({...newEvent, meetingUrl: e.target.value})}
                      className="col-span-3 bg-slate-900/70 border-slate-600"
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                  
                  {/* Lembretes */}
                  <div className="grid grid-cols-4 gap-2">
                    <Label className="text-right pt-2">Lembretes</Label>
                    <div className="col-span-3 space-y-2">
                      {newEvent.reminders.map((reminder, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Select 
                            value={reminder.toString()} 
                            onValueChange={(value) => handleUpdateReminder(index, value)}
                          >
                            <SelectTrigger className="bg-slate-900/70 border-slate-600">
                              <SelectValue placeholder="Selecione o tempo" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-600">
                              <SelectItem value="0.25">15 minutos antes</SelectItem>
                              <SelectItem value="0.5">30 minutos antes</SelectItem>
                              <SelectItem value="1">1 hora antes</SelectItem>
                              <SelectItem value="2">2 horas antes</SelectItem>
                              <SelectItem value="4">4 horas antes</SelectItem>
                              <SelectItem value="8">8 horas antes</SelectItem>
                              <SelectItem value="24">1 dia antes</SelectItem>
                              <SelectItem value="48">2 dias antes</SelectItem>
                              <SelectItem value="168">1 semana antes</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveReminder(index)} 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {newEvent.reminders.length < 5 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAddReminder}
                          className="mt-2 border-slate-600 text-slate-300"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Adicionar Lembrete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingEvent(false)}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddEvent}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Lista de eventos do dia */}
          {eventsForSelectedDate.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <CalendarIcon className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400">Nenhum evento programado para este dia.</p>
              <p className="text-sm text-slate-500 mt-1">
                Clique em "Novo Evento" para adicionar um compromisso.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {eventsForSelectedDate.map(event => (
                <Card 
                  key={event.id} 
                  className={`${
                    event.isHoliday 
                      ? 'bg-red-900/20 border-red-800/50' 
                      : 'bg-slate-800/40 border-slate-700'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`text-lg font-semibold ${event.isHoliday ? 'text-red-300' : 'text-white'}`}>
                          {event.title}
                        </h3>
                        
                        {event.time && (
                          <div className="flex items-center mt-1 text-slate-300">
                            <Clock className="h-4 w-4 mr-1 text-purple-400" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        
                        {event.description && (
                          <p className="mt-2 text-slate-300">{event.description}</p>
                        )}
                        
                        {event.meetingUrl && (
                          <div className="mt-2">
                            <a 
                              href={event.meetingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-400 hover:text-blue-300"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              <span>Link da reunião</span>
                            </a>
                          </div>
                        )}
                        
                        {event.reminders && event.reminders.length > 0 && !event.isHoliday && (
                          <div className="flex items-center mt-3 text-xs text-slate-400">
                            <Bell className="h-3 w-3 mr-1 text-yellow-500" />
                            <span>
                              Lembretes: {event.reminders.map(time => {
                                if (time < 1) return `${time * 60} min`;
                                return time === 1 ? `${time} hora` : time < 24 ? `${time} horas` : `${time/24} dia(s)`;
                              }).join(', ')} antes
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {!event.isHoliday && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
