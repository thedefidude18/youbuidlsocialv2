import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAccount } from 'wagmi';
import { Image, Play, X, Loader2, Code, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPost } from '@/lib/orbis';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from "@/providers/points-provider";

interface ComposeBoxProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

export function ComposeBox({
  onSubmit,
  isSubmitting,
  placeholder = "What's happening?",
  maxLength = 280,
  autoFocus = false
}: ComposeBoxProps) {
  const [content, setContent] = useState('');
  const { address } = useAccount();
  const { toast } = useToast();
  const { actions } = usePoints();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-[#0C0A09] rounded-lg">
      <div className="flex gap-1 p-6 rounded-2x1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`} />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] resize-none bg-transparent border-none focus-visible:ring-0 p-0 placeholder:text-zinc-500"
            maxLength={maxLength}
            autoFocus={autoFocus}
            disabled={isSubmitting}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* ... your existing buttons ... */}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">
                {content.length}/{maxLength}
              </span>
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-primary hover:bg-zinc-200 text-zinc-900 h-8 px-4 text-sm rounded-full disabled:bg-zinc-100/10 disabled:text-zinc-500"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

