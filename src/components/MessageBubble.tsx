import { Attachment } from '@/context/ChatContext';
import MarkdownRenderer from './MarkdownRenderer';
import { useContext, useState, useRef, useEffect } from 'react';
import { BackgroundContext } from '@/context/BackgroundContext';
import { FileIcon, ImageIcon, FileText, File, FileCode, FileX, FileAudio, FileVideo, Play, Pause } from 'lucide-react';

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
  
  // Audio player component - improved to match WhatsApp style
  const AudioPlayer = ({ audioData, mimeType }: { audioData: string, mimeType: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }, []);
    
    const togglePlayPause = () => {
      if (!audioRef.current) return;
      
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      
      setIsPlaying(!isPlaying);
    };
    
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !progressBarRef.current) return;
      
      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect();
      const clickPositionX = e.clientX - rect.left;
      const progressBarWidth = rect.width;
      const clickPositionRatio = clickPositionX / progressBarWidth;
      
      const newTime = clickPositionRatio * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    };
    
    return (
      <div className="flex items-center space-x-2 w-[200px] bg-blue-600/40 rounded-lg p-2.5">
        <button 
          onClick={togglePlayPause}
          className="bg-blue-500/60 rounded-full p-2.5 transition-all hover:bg-blue-500/80 flex-shrink-0"
        >
          {isPlaying ? (
            <Pause size={16} className="text-white" />
          ) : (
            <Play size={16} className="text-white ml-0.5" />
          )}
        </button>
        
        <div className="flex-1 cursor-pointer" onClick={handleProgressBarClick}>
          <div 
            ref={progressBarRef}
            className="bg-blue-300/30 h-1 rounded-full w-full"
          >
            <div 
              className="bg-blue-300 h-1 rounded-full" 
              style={{ width: `${(currentTime / Math.max(0.1, duration)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-xs text-white/80 min-w-[40px] flex-shrink-0">
          {formatTime(currentTime)}
        </div>
        
        <audio 
          ref={audioRef} 
          className="hidden"
        >
          <source src={`data:${mimeType};base64,${audioData}`} type={mimeType} />
        </audio>
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full mb-4`}>
      <div 
        className={`message-bubble ${isUser ? 'user-message ml-12' : 'assistant-message mr-12'} backdrop-blur-sm text-white rounded-2xl p-3 max-w-[80%]`}
        style={bubbleStyle}
      >
        {content && (
          <div className="p-1">
            <MarkdownRenderer content={content} />
          </div>
        )}
        
        {attachments && attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="attachment">
                {attachment.type === 'image' && (
                  <div className="flex flex-col items-center">
                    <img 
                      src={`data:${attachment.mimeType};base64,${attachment.data}`}
                      alt="Attached image" 
                      className="max-w-full max-h-[150px] rounded-lg object-contain"
                    />
                  </div>
                )}
                {attachment.type === 'audio' && (
                  <div className="flex flex-col">
                    <AudioPlayer 
                      audioData={attachment.data}
                      mimeType={attachment.mimeType}
                    />
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
