"use client";

import { useState } from "react";
import { createPost } from "@/lib/orbis";
import { useToast } from "@/hooks/use-toast";

export function EnhancedComposeBox() {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const handlePost = async () => {
    if (!content.trim()) return;
    
    setIsPosting(true);
    try {
      const result = await createPost(content);
      
      // Check both status and success properties as Orbis might return either
      if (result && (result.status === 200 || result.success)) {
        setContent("");
        toast({
          title: "Success",
          description: "Post created successfully!",
        });
      } else {
        throw new Error(result?.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full min-h-[100px] p-2 border rounded"
        disabled={isPosting}
      />
      <button
        onClick={handlePost}
        disabled={isPosting || !content.trim()}
        className="mt-2 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        {isPosting ? "Posting..." : "Post"}
      </button>
    </div>
  );
}

