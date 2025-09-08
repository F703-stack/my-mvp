// Devcanva — chat UI step (week 1-2) — client UI only
// Chat input component with send and microphone buttons

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Send, Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { useDebouncedValue } from '@/app/lib/useDebouncedValue';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onDebouncedInput?: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(function ChatInput(
  { onSendMessage, onDebouncedInput, disabled = false, placeholder = "Type your message..." }: ChatInputProps,
  ref
) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { 
    isListening, 
    transcript, 
    interimTranscript, 
    isSupported, 
    error,
    startListening, 
    stopListening 
  } = useSpeechToText();

  // Debounce the message input
  const debouncedValue = useDebouncedValue(message, 600);

  // Log when user starts typing (for debugging debounce behavior)
  useEffect(() => {
    if (message.trim() && message !== debouncedValue) {
      console.log("⌨️ User typing:", message, "- Debounce timer started (600ms)");
    }
  }, [message, debouncedValue]);

  // Call onDebouncedInput when debounced value changes
  useEffect(() => {
    if (debouncedValue.trim()) {
      console.log("🔄 Debounced: Input triggered after 600ms delay:", debouncedValue);
      onDebouncedInput?.(debouncedValue.trim());
    }
  }, [debouncedValue, onDebouncedInput]);

  // Handle transcript updates
  useEffect(() => {
    if (transcript && !isListening) {
      // When listening stops, append the transcript to the current message
      setMessage(prev => {
        const newMessage = prev.trim() ? `${prev.trim()} ${transcript.trim()}` : transcript.trim();
        return newMessage.replace(/\s+/g, ' ');
      });
    }
  }, [transcript, isListening]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  // Determine if send button should be disabled
  const isSendDisabled = disabled || (!message.trim() && isListening);

  return (
    <div className="flex flex-col gap-2 p-4 border-t bg-white">
      {/* Interim transcript display */}
      {isListening && interimTranscript && (
        <div className="text-sm text-gray-500 px-3 py-1 bg-gray-50 rounded-md">
          {interimTranscript}
        </div>
      )}
      
      {/* Helper text when listening */}
      {isListening && (
        <div className="text-sm text-blue-600 px-3">
          Listening… try speaking now
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="text-sm text-red-600 px-3">
          {error}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={(el) => {
              textareaRef.current = el;
              if (typeof ref === 'function') {
                ref(el);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
              }
            }}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-[120px] resize-none pr-12"
            rows={1}
          />
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleMicToggle}
                  disabled={disabled || !isSupported}
                  className={cn(
                    'w-10 h-10',
                    isListening && 'bg-red-50 border-red-200 text-red-600'
                  )}
                  aria-label={isListening ? 'Stop recording' : 'Start recording'}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!isSupported 
                  ? 'Voice input not supported in this browser'
                  : isListening 
                    ? 'Stop recording' 
                    : 'Start voice input'
                }
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSend}
                  disabled={isSendDisabled}
                  size="icon"
                  className="w-10 h-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Send message
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
});

// Helper function for conditional classes
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
} 