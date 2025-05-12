
import React, { useState, useRef, ChangeEvent } from 'react';
import { useChat, type Attachment } from '@/context/ChatContext';
import { Send, Mic, MicOff, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
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
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative bg-gradient-to-r from-nebula-dark to-neutral-900 p-4 border-t border-neutral-800"
    >
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment, index) => (
            <div 
              key={index} 
              className="bg-nebula-gray rounded-md p-1 text-xs text-white flex items-center"
            >
              {attachment.type === 'image' ? '🖼️' : '📄'} {attachment.name.length > 15 
                ? `${attachment.name.substring(0, 12)}...` 
                : attachment.name}
              <button 
                type="button"
                className="ml-1 text-white/70 hover:text-white"
                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="min-h-10 max-h-40 bg-nebula-gray text-white border-none resize-none"
          disabled={isLoading}
        />
        
        <div className="flex flex-col gap-2">
          {/* Image upload button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-nebula-gray"
            onClick={() => imageInputRef.current?.click()}
            disabled={isLoading}
          >
            <Image size={20} />
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
            className="text-white/70 hover:text-white hover:bg-nebula-gray"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <File size={20} />
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
            } hover:bg-nebula-gray`}
            onClick={toggleRecording}
            disabled={isLoading}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          
          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-to-r from-nebula-purple to-nebula-blue text-white hover:from-nebula-purple/90 hover:to-nebula-blue/90"
            disabled={isLoading || (!message.trim() && attachments.length === 0)}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
