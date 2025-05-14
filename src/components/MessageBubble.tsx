
import { useContext } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { BackgroundContext } from '@/context/BackgroundContext';

interface MessageBubbleProps {
  message: {
    content: string;
    role: 'user' | 'assistant';
  };
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { userBubbleColor, assistantBubbleColor } = useContext(BackgroundContext);
  const isUser = message.role === 'user';
  
  const bubbleStyle = {
    backgroundColor: isUser ? userBubbleColor : assistantBubbleColor,
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[80%] md:max-w-[70%] rounded-xl px-4 py-3 text-white`}
        style={bubbleStyle}
      >
        <MarkdownRenderer content={message.content} />
      </div>
    </div>
  );
};

export default MessageBubble;
