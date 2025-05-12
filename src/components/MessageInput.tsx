
import React, { useState, useRef, ChangeEvent } from 'react';
import { useChat, type Attachment } from '@/context/ChatContext';
import { Send, Mic, MicOff, Image, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useChat();
  const { toast } = useToast();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) return;
    
    await sendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
  };
  
  // Handle Enter key to submit form (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Handle text change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  
  // Toggle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording logic will go here
      setIsRecording(false);
      toast({
        title: "Gravação finalizada",
        description: "Implementação completa de áudio em breve.",
      });
    } else {
      // Start recording logic will go here
      setIsRecording(true);
      toast({
        title: "Gravando áudio",
        description: "Implementação completa de áudio em breve.",
      });
    }
  };
  
  // Handle file upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const base64 = (event.target.result as string).split(',')[1];
        const newAttachment: Attachment = {
          type,
          data: base64,
          name: file.name,
          mimeType: file.type
        };
        
        setAttachments(prev => [...prev, newAttachment]);
        
        toast({
          title: `${type === 'image' ? 'Imagem' : 'Documento'} anexado`,
          description: file.name,
        });
      }
    };
    
    reader.readAsDataURL(file);
    
    // Reset the file input
    e.target.value = '';
  };
  
  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative p-4 border-t border-neutral-800 bg-gradient-to-r from-nebula-dark to-neutral-900"
    >
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment, index) => (
            <div 
              key={index} 
              className="bg-nebula-gray/50 backdrop-blur-md rounded-lg p-2 text-xs text-white flex items-center"
            >
              {attachment.type === 'image' ? '🖼️' : '📄'} {attachment.name.length > 15 
                ? `${attachment.name.substring(0, 12)}...` 
                : attachment.name}
              <button 
                type="button"
                className="ml-2 text-white/70 hover:text-white"
                onClick={() => removeAttachment(index)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end p-3 bg-nebula-gray/50 backdrop-blur-md rounded-2xl border border-neutral-700">
        {/* Input area */}
        <div className="flex-1 mr-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="bg-transparent text-white border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-h-[40px] max-h-[120px] placeholder:text-white/50"
            disabled={isLoading}
            rows={1}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Image upload button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-nebula-blue/20 h-9 w-9"
            onClick={() => imageInputRef.current?.click()}
            disabled={isLoading}
          >
            <Image size={18} />
          </Button>
          
          {/* Hidden image input */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'image')}
            className="hidden"
          />
          
          {/* File upload button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-nebula-blue/20 h-9 w-9"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <File size={18} />
          </Button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileChange(e, 'document')}
            className="hidden"
          />
          
          {/* Voice recording button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`${
              isRecording 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-white/70 hover:text-white'
            } hover:bg-nebula-blue/20 h-9 w-9`}
            onClick={toggleRecording}
            disabled={isLoading}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          
          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            className={`bg-gradient-to-r from-nebula-purple to-nebula-blue text-white hover:from-nebula-purple/90 hover:to-nebula-blue/90 h-9 w-9 rounded-full ${
              (!message.trim() && attachments.length === 0) ? 'opacity-50' : ''
            }`}
            disabled={isLoading || (!message.trim() && attachments.length === 0)}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
