
import { Attachment } from '@/context/ChatContext';
import MarkdownRenderer from './MarkdownRenderer';
import { useContext } from 'react';
import { BackgroundContext } from '@/context/BackgroundContext';
import { FileIcon, ImageIcon, FileText, File, FileCode, FileX, FileAudio, FileVideo } from 'lucide-react';

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

  // Function to get the appropriate icon based on file type
  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (mimeType.includes('text') || mimeType.includes('doc') || mimeType.includes('rtf')) {
      return <FileText className="h-8 w-8 text-blue-400" />;
    } else if (mimeType.includes('audio')) {
      return <FileAudio className="h-8 w-8 text-green-500" />;
    } else if (mimeType.includes('video')) {
      return <FileVideo className="h-8 w-8 text-purple-500" />;
    } else if (mimeType.includes('code') || mimeType.includes('json') || mimeType.includes('xml') || mimeType.includes('html')) {
      return <FileCode className="h-8 w-8 text-yellow-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-400" />;
    }
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
                  <div className="flex flex-col items-center">
                    <img 
                      src={`data:${attachment.mimeType};base64,${attachment.data}`}
                      alt={attachment.name} 
                      className="max-w-full max-h-[200px] rounded-lg object-contain"
                    />
                    <span className="text-xs text-gray-300 mt-1 truncate max-w-full">
                      {attachment.name}
                    </span>
                  </div>
                )}
                {attachment.type === 'audio' && (
                  <div className="flex flex-col">
                    <audio controls className="w-full">
                      <source src={`data:${attachment.mimeType};base64,${attachment.data}`} type={attachment.mimeType} />
                      Your browser does not support the audio element.
                    </audio>
                    <span className="text-xs text-gray-300 mt-1 truncate max-w-full">
                      {attachment.name}
                    </span>
                  </div>
                )}
                {attachment.type === 'document' && (
                  <div className="flex flex-col items-center p-3 bg-slate-800/40 rounded-lg">
                    <div className="flex flex-col items-center">
                      {getDocumentIcon(attachment.mimeType)}
                      <span className="text-xs text-gray-300 mt-2 text-center truncate max-w-full">
                        {attachment.name}
                      </span>
                    </div>
                    <a 
                      href={`data:${attachment.mimeType};base64,${attachment.data}`} 
                      download={attachment.name}
                      className="mt-2 text-xs text-blue-400 hover:underline"
                    >
                      Download
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
