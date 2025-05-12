
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

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

  const sendMessage = async (content: string, attachments?: Attachment[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    try {
      setIsLoading(true);
      
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
        attachments
      };
      
      // Add user message to state
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Prepare data for webhook
      const webhookData = {
        message: content,
        timestamp: new Date().toISOString(),
        attachments: attachments ? attachments.map(att => ({
          type: att.type,
          data: att.data,
          name: att.name,
          mimeType: att.mimeType
        })) : []
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
        attachments: responseData.attachments
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
        timestamp: new Date()
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
