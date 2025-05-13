
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MarkdownRenderer from './MarkdownRenderer';
import { type Attachment } from '@/context/ChatContext';
import { useBackground } from '@/context/BackgroundContext';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  content, 
  sender, 
  timestamp, 
  attachments 
}) => {
  const isUser = sender === 'user';
  const { userBubbleColor, assistantBubbleColor } = useBackground();
  
  // Format timestamp to HH:mm
  const formattedTime = format(timestamp, 'HH:mm', { locale: ptBR });
  
  // Dynamic background style based on user settings
  const bubbleStyle = {
    background: isUser 
      ? userBubbleColor 
      : assistantBubbleColor,
    backgroundImage: isUser && userBubbleColor === '#8A65DF' 
      ? 'linear-gradient(to right, #8A65DF, #5B9DF1)' 
      : 'none'
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div 
        className={`message-bubble rounded-2xl p-3 text-white ${
          isUser 
            ? 'mr-2' 
            : 'ml-2'
        }`}
        style={bubbleStyle}
      >
        {/* Render attachments if any */}
        {attachments && attachments.length > 0 && (
          <div className="attachments mb-2">
            {attachments.map((attachment, index) => {
              if (attachment.type === 'image') {
                return (
                  <div key={index} className="mb-2">
                    <img 
                      src={`data:${attachment.mimeType};base64,${attachment.data}`} 
                      alt={attachment.name}
                      className="rounded-lg max-w-full"
                    />
                  </div>
                );
              } else if (attachment.type === 'audio') {
                return (
                  <div key={index} className="mb-2">
                    <audio 
                      controls
                      src={`data:${attachment.mimeType};base64,${attachment.data}`}
                      className="w-full"
                    >
                      Seu navegador não suporta áudio.
                    </audio>
                  </div>
                );
              } else if (attachment.type === 'document') {
                return (
                  <div key={index} className="mb-2 p-2 bg-black/20 rounded-lg flex items-center">
                    <div className="mr-2">
                      📄
                    </div>
                    <div className="text-sm truncate">
                      {attachment.name}
                    </div>
                    <a 
                      href={`data:${attachment.mimeType};base64,${attachment.data}`} 
                      download={attachment.name}
                      className="ml-auto bg-white/10 hover:bg-white/20 rounded-md p-1 text-xs"
                    >
                      Baixar
                    </a>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        
        {/* Render message content */}
        {content && (
          <MarkdownRenderer content={content} className="text-sm" />
        )}
        
        {/* Timestamp */}
        <div className="text-xs mt-1 text-right text-white/70">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
