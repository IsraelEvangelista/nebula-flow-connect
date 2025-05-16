
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
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);
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
  
  // Update recording timer
  const updateRecordingTimer = () => {
    if (recordingStartTime !== null) {
      const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
      setRecordingDuration(elapsed);
      timerRef.current = window.setTimeout(updateRecordingTimer, 1000);
    }
  };
  
  // Format recording time as mm:ss
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingStartTime(null);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Cancel recording function
  const cancelRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingStartTime(null);
      setAudioChunks([]);
      setRecordingDuration(0);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Stop all audio tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      toast({
        title: "Gravação cancelada",
        description: "A gravação de áudio foi cancelada",
      });
    }
  };
  
  // Toggle voice recording
  const toggleRecording = async () => {
    if (isRecording && mediaRecorder) {
      // Stop recording and send audio
      stopRecording();
      // Audio will be processed in the mediaRecorder.onstop event handler
    } else {
      // Start recording
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(audioStream);
        const recorder = new MediaRecorder(audioStream);
        setMediaRecorder(recorder);
        
        const chunks: Blob[] = [];
        setAudioChunks(chunks);
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        
        recorder.onstop = () => {
          // Only process audio if there are chunks and not cancelled
          if (chunks.length > 0 && audioChunks !== chunks) {
            // Create audio blob
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
              if (reader.result) {
                const base64data = (reader.result as string).split(',')[1];
                
                // Add as attachment
                const newAttachment: Attachment = {
                  type: 'audio',
                  data: base64data,
                  name: `Audio_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`,
                  mimeType: 'audio/webm'
                };
                
                // Send message immediately with just the audio
                sendMessage("", [newAttachment]);
              }
            };
            
            reader.readAsDataURL(audioBlob);
          }
          
          // Stop all audio tracks
          if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
          }
        };
        
        // Start recording
        recorder.start();
        setIsRecording(true);
        setRecordingStartTime(Date.now());
        setRecordingDuration(0);
        
        // Start timer immediately
        updateRecordingTimer();
      } catch (err) {
        console.error("Error accessing microphone:", err);
        toast({
          title: "Erro ao acessar microfone",
          description: "Verifique as permissões do navegador",
          variant: "destructive",
        });
      }
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
              {attachment.type === 'image' ? '🖼️' : attachment.type === 'audio' ? '🎤' : '📄'} 
              {attachment.name.length > 15 
                ? `${attachment.name.substring(0, 12)}...` 
                : attachment.name}
              <button 
                type="button"
                className="ml-2 text-white/70 hover:text-white"
                onClick={() => removeAttachment(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center justify-center mb-2 p-2 bg-red-500/20 rounded-md">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
          <span className="text-sm text-white">
            Gravando: {formatRecordingTime(recordingDuration)}
          </span>
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
            disabled={isLoading || isRecording}
            rows={1}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {!isRecording && (
            <>
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
            </>
          )}
          
          {/* Voice recording button */}
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "default" : "ghost"}
            className={`${
              isRecording 
                ? 'bg-gradient-to-r from-nebula-purple to-nebula-blue text-white hover:from-nebula-purple/90 hover:to-nebula-blue/90 rounded-full'
                : 'text-white/70 hover:text-white hover:bg-transparent bg-transparent'
            } h-9 w-9`}
            onClick={toggleRecording}
            disabled={isLoading}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={18} />}
          </Button>
          
          {/* Cancel recording button - only visible during recording */}
          {isRecording && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-9 w-9"
              onClick={cancelRecording}
            >
              <X size={18} />
            </Button>
          )}
          
          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            className={`${
              isRecording 
                ? 'bg-nebula-gray/50 text-white/50'
                : 'bg-gradient-to-r from-nebula-purple to-nebula-blue text-white hover:from-nebula-purple/90 hover:to-nebula-blue/90'
            } h-9 w-9 rounded-full ${
              (!message.trim() && attachments.length === 0) || isRecording ? 'opacity-50' : ''
            }`}
            disabled={isLoading || isRecording || (!message.trim() && attachments.length === 0)}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
