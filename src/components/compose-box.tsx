import { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAccount } from 'wagmi';
import { Image, Play, X, Loader2, Code, FileText, Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPost } from '@/lib/orbis';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from "@/providers/points-provider";

interface ComposeBoxProps {
  onSubmit: (content: string, media?: File | null) => Promise<void>;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [showEmbedInput, setShowEmbedInput] = useState(false);
  const [isDirectIframe, setIsDirectIframe] = useState(false); // New state for iframe switch
  const { address } = useAccount();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Function to convert URL to iframe embed code
  const generateEmbedCode = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.hostname.includes('youtu.be') 
          ? urlObj.pathname.slice(1)
          : urlObj.searchParams.get('v');
        if (videoId) {
          return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
      }
      
      // Twitter/X
      if (urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com')) {
        return `<iframe src="https://twitframe.com/show?url=${encodeURIComponent(url)}" width="550" height="300" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
      }

      // Default iframe for other URLs
      return `<iframe src="${url}" width="100%" height="400" frameborder="0"></iframe>`;
    } catch (error) {
      return null;
    }
  };

  const testGameUrls = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.error('Game URL not accessible:', error);
      return false;
    }
  };

  const handleEmbedSubmit = async () => {
    if (!embedUrl.trim()) return;

    let embedCode: string | null = null;
    
    if (isDirectIframe) {
      // Direct iframe code input
      if (!embedUrl.includes('<iframe') || !embedUrl.includes('</iframe>')) {
        toast({
          title: "Invalid iframe",
          description: "Please enter a valid iframe HTML code",
          variant: "destructive"
        });
        return;
      }
      const urlMatch = embedUrl.match(/src="([^"]+)"/);
      if (urlMatch && urlMatch[1]) {
        const isAccessible = await testGameUrls(urlMatch[1]);
        if (!isAccessible) {
          toast({
            title: "Game not accessible",
            description: "The game URL might be unavailable or blocked",
            variant: "destructive"
          });
          return;
        }
      }
      embedCode = embedUrl;
    } else {
      // URL to iframe conversion
      embedCode = generateEmbedCode(embedUrl);
    }

    if (!embedCode) {
      toast({
        title: "Invalid input",
        description: isDirectIframe ? "Please enter valid iframe code" : "Please enter a valid URL to embed",
        variant: "destructive"
      });
      return;
    }

    setContent(prev => {
      const newContent = prev + '\n' + embedCode;
      return newContent;
    });
    setEmbedUrl('');
    setShowEmbedInput(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only JPEG, PNG, GIF, and WebP files are allowed",
          variant: "destructive"
        });
        return;
      }

      // Preview validation
      try {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          setSelectedImage(file);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          toast({
            title: "Error",
            description: "Invalid image file",
            variant: "destructive"
          });
        };
        img.src = objectUrl;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;
    
    try {
      setIsUploading(true);
      await onSubmit(content, selectedImage);
      setContent('');
      setSelectedImage(null);
      setEmbedUrl('');
      setShowEmbedInput(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-background rounded-lg border border-border">
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
            className="min-h-[100px] resize-none bg-transparent border-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground"
            maxLength={maxLength}
            autoFocus={autoFocus}
            disabled={isSubmitting}
          />

          {selectedImage && (
            <div className="relative w-full">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="max-h-[300px] rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={removeImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
          )}

          {showEmbedInput && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Switch
                  checked={isDirectIframe}
                  onCheckedChange={setIsDirectIframe}
                  id="iframe-mode"
                />
                <label htmlFor="iframe-mode" className="text-sm text-muted-foreground">
                  Direct iframe code
                </label>
              </div>
              
              <div className="flex gap-2">
                <textarea
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder={
                    isDirectIframe
                      ? "Paste iframe HTML code here"
                      : "Enter URL to embed (YouTube, Twitter, etc.)"
                  }
                  className="flex-1 bg-transparent border rounded-md px-3 py-2 text-sm min-h-[60px]"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleEmbedSubmit}
                    className="text-primary"
                  >
                    Embed
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowEmbedInput(false);
                      setEmbedUrl('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={handleImageClick}
                disabled={isUploading}
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                  showEmbedInput && "bg-accent text-primary border-primary"
                )}
                onClick={() => setShowEmbedInput(!showEmbedInput)}
                aria-pressed={showEmbedInput}
              >
                <Link className={cn(
                  "h-5 w-5",
                  showEmbedInput && "text-primary"
                )} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Code className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Play className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {content.length}/{maxLength}
              </span>
              <Button 
                type="submit" 
                disabled={(!content.trim() && !selectedImage) || isSubmitting || isUploading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-sm rounded-full disabled:bg-muted disabled:text-muted-foreground"
              >
                {(isSubmitting || isUploading) && <Loader2 className="h-3 w-3 animate-spin" />}
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}










