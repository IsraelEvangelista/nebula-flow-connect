
import { useContext } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { BackgroundContext } from '@/context/BackgroundContext';
import { Attachment } from '@/context/ChatContext';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ content, sender, timestamp, attachments }) => {
  const { userBubbleColor, assistantBubbleColor } = useContext(BackgroundContext);
  const isUser = sender === 'user';
  
  const bubbleStyle = {
    backgroundColor: isUser ? userBubbleColor : assistantBubbleColor,
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[80%] md:max-w-[70%] rounded-xl px-4 py-3 text-white`}
        style={bubbleStyle}
      >
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default MessageBubble;
