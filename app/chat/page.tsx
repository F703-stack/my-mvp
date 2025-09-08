// Devcanva — chat UI step (week 1-2) — client UI only
// Main chat page with message display and input handling

'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/chat/message-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { SkeletonMessage } from '@/components/SkeletonMessage';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages are added or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content })
      });
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (!inputRef.current) {
          const el = document.querySelector('textarea[placeholder="Type your message or use voice input..."]') as HTMLTextAreaElement | null;
          el?.focus();
        } else {
          inputRef.current.focus();
        }
      }, 30);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Card className="flex-1 m-4 flex flex-col">
        <CardHeader className="border-b bg-white flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Chat Assistant</CardTitle>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500" htmlFor="lang-select">Lang</label>
            <select
              id="lang-select"
              className="h-8 px-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={i18n.language?.slice(0,2).toLowerCase()}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              {['en','es','fr','de','ar','zh','hi','ru','pt','ja'].map(code => (
                <option key={code} value={code}>{code.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea 
            ref={scrollAreaRef}
            className="flex-1 p-4 overflow-y-auto"
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isLoading && <SkeletonMessage />}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </CardContent>
        
        <div className="sticky bottom-0 bg-background">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder={t('chat.placeholder')}
            ref={inputRef}
          />
        </div>
      </Card>
    </div>
  );
} 