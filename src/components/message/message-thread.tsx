import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useMessagesStore } from '@/store/messages-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface MessageThreadProps {
  threadId: string;
}

export function MessageThread({ threadId }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const { 
    messages,
    threads,
    isLoading,
    error,
    sendMessage,
    fetchMessages,
    markThreadAsRead
  } = useMessagesStore();
  
  const thread = threads.find(t => t.id === threadId);
  const threadMessages = messages[threadId] || [];
  const recipient = thread?.participants.find(p => p.did !== user?.did);

  useEffect(() => {
    if (threadId) {
      fetchMessages(threadId);
      markThreadAsRead(threadId);
    }
  }, [threadId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !recipient) return;

    await sendMessage(newMessage, recipient.did);
    setNewMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  if (!recipient) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
          <p className="text-muted-foreground">
            Select a user to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {threadMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>This is the beginning of your conversation with {recipient.name || recipient.did}</p>
              <p className="text-sm">Say hello! 👋</p>
            </div>
          ) : (
            threadMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.did === user?.did ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender.did === user?.did
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Send'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

