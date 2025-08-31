// Devcanva — chat UI step (week 1-2) — client UI only
// Message bubble component for chat interface

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  isLoading?: boolean;
}

export function MessageBubble({ message, isUser, timestamp, isLoading = false }: MessageBubbleProps) {
  return (
    <div className={cn(
      'flex w-full mb-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'flex max-w-[80%] gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage 
            src={isUser ? undefined : '/bot-avatar.png'} 
            alt={isUser ? 'User' : 'Assistant'}
          />
          <AvatarFallback className={cn(
            'text-xs',
            isUser ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
          )}>
            {isUser ? 'U' : 'A'}
          </AvatarFallback>
        </Avatar>
        
        <Card className={cn(
          'flex-shrink-0',
          isUser 
            ? 'bg-blue-500 text-white border-blue-500' 
            : 'bg-gray-100 text-gray-900 border-gray-200'
        )}>
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap break-words">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              ) : (
                message
              )}
            </p>
            {timestamp && (
              <p className={cn(
                'text-xs mt-1',
                isUser ? 'text-blue-100' : 'text-gray-500'
              )}>
                {timestamp}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 