
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';
import { supabase } from "@/integrations/supabase/client";

export type MessageType = 'text' | 'image' | 'audio' | 'document';

export interface Attachment {
  type: 'image' | 'audio' | 'document';
  data: string; // base64
  name: string;
  mimeType: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
  messageType?: string;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, session } = useAuth();

  // Load messages from localStorage on initial mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const determineMessageType = (content: string, attachments?: Attachment[]): string => {
    if (!content && (!attachments || attachments.length === 0)) {
      return 'unknown';
    }
    
    // If there are attachments, determine by the first one
    if (attachments && attachments.length > 0) {
      switch(attachments[0].type) {
        case 'image': return 'image';
        case 'audio': return 'audio';
        case 'document': return 'document';
        default: return 'conversation';
      }
    }
    
    // If only text
    return 'conversation';
  };

  const sendMessage = async (content: string, attachments?: Attachment[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    try {
      setIsLoading(true);
      
      // Determine message type
      const messageType = determineMessageType(content, attachments);
      
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
        attachments,
        messageType
      };
      
      // Add user message to state
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Prepare data for webhook
      const webhookData = {
        message: content,
        timestamp: new Date().toISOString(),
        messageType,
        attachments: attachments ? attachments.map(att => ({
          type: att.type,
          data: att.data,
          name: att.name,
          mimeType: att.mimeType
        })) : [],
        session: {
          userId: user?.id || null,
          userEmail: user?.email || null,
          sessionId: session?.access_token?.substring(0, 8) || null,
          timestamp: new Date().toISOString()
        }
      };

      // Send to webhook
      const webhookUrl = "https://n8n.agilenebula.tech/webhook-test/nebula";
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }

      // Parse response
      const responseData = await response.json();
      
      // Mock response from webhook for now
      // In production, we'll use the actual webhook response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseData.reply || "Olá! Este é um assistente de demonstração. Em breve o webhook real será implementado.",
        sender: 'assistant',
        timestamp: new Date(),
        attachments: responseData.attachments,
        messageType: 'conversation'
      };

      // Add assistant message to state
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
      
      // Add a mocked response for now
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, estou com dificuldades para processar sua mensagem no momento. Por favor, tente novamente mais tarde.",
        sender: 'assistant',
        timestamp: new Date(),
        messageType: 'conversation'
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
