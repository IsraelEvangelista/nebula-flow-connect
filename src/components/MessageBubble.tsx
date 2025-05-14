
import { Attachment } from '@/context/ChatContext';
import MarkdownRenderer from './MarkdownRenderer';
import { useContext } from 'react';
import { BackgroundContext } from '@/context/BackgroundContext';

export interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
}

export const MessageBubble = ({ content, sender, timestamp, attachments }: MessageBubbleProps) => {
  const { userBubbleColor, assistantBubbleColor } = useContext(BackgroundContext);
  
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
  });
  
  const isUser = sender === 'user';
  const bubbleStyle = {
    backgroundColor: isUser ? userBubbleColor : assistantBubbleColor,
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full mb-4`}>
      <div 
        className={`message-bubble ${isUser ? 'user-message ml-12' : 'assistant-message mr-12'} backdrop-blur-sm text-white rounded-2xl p-3 max-w-[80%]`}
        style={bubbleStyle}
      >
        <div className="p-1">
          <MarkdownRenderer content={content} />
        </div>
        
        {attachments && attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="attachment">
                {attachment.type === 'image' && (
                  <img 
                    src={attachment.data} 
                    alt={attachment.name} 
                    className="max-w-full rounded-lg"
                  />
                )}
                {attachment.type === 'audio' && (
                  <audio controls className="w-full">
                    <source src={attachment.data} type={attachment.mimeType} />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {attachment.type === 'document' && (
                  <div className="flex items-center p-2 bg-slate-800 rounded-lg">
                    <div className="p-2 bg-slate-700 rounded mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <a href={attachment.data} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {attachment.name}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="text-right text-xs text-gray-300 mt-1">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
