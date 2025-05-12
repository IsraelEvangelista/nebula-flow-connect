
import React, { useRef, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import MessageInput from '@/components/MessageInput';
import StarBackground from '@/components/StarBackground';
import { useChat } from '@/context/ChatContext';

const Chat: React.FC = () => {
  const { messages, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-screen bg-nebula-dark">
      <ChatHeader />
      
      <main className="flex-1 overflow-y-auto p-4 relative">
        <StarBackground starCount={150} />
        
        <div className="relative z-10 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/50">
              <p>Envie uma mensagem para começar a conversa.</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
                attachments={message.attachments}
              />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="message-bubble bg-nebula-gray text-white rounded-2xl p-3 ml-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <MessageInput />
    </div>
  );
};

export default Chat;
