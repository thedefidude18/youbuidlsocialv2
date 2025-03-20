import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Link2, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  content: string;
  author: {
    username: string;
  };
}

export function ShareModal({ open, onOpenChange, postId, content, author }: ShareModalProps) {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  const postUrl = `${window.location.origin}/post/${postId}`;
  const shareText = `Check out @${author.username}'s post: ${content}`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    email: `mailto:?subject=Check out this post&body=${encodeURIComponent(`${shareText}\n\n${postUrl}`)}`,
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Share Post",
        text: shareText,
        url: postUrl,
      });
      toast({
        title: "Shared successfully",
        description: "The post has been shared.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(postUrl);
      toast({
        title: "Link copied",
        description: "Post link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCopying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {/* Native Share API button (mobile) */}
          {navigator.share && (
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={handleNativeShare}
            >
              Share via...
            </Button>
          )}

          {/* Social Media Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(shareLinks.twitter, '_blank')}
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(shareLinks.facebook, '_blank')}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(shareLinks.linkedin, '_blank')}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(shareLinks.email, '_blank')}
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>

          {/* Copy Link Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 flex items-center gap-2"
              onClick={copyToClipboard}
              disabled={copying}
            >
              <Link2 className="h-4 w-4" />
              {copying ? "Copying..." : "Copy Link"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}