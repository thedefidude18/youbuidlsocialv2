"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { PostCard } from "@/components/post-card";
import { usePostInteractions } from "@/hooks/use-post-interactions";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";  // Fixed import path

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchPost } = usePostInteractions(id as string);

  useEffect(() => {
    async function loadPost() {
      try {
        const postData = await fetchPost();
        setPost(postData);
      } catch (err) {
        setError("Failed to load post");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id, fetchPost]);

  if (loading) {
    return (
      <MainLayout showHeader={false}>
        <PageHeader title="Post" showBackButton={true} />
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout showHeader={false}>
        <PageHeader title="Post" showBackButton={true} />
        <Card className="p-8 text-center text-muted-foreground">
          {error || "Post not found"}
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={false}>
      <PageHeader title="Post" showBackButton={true} />
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <PostCard post={post} />
          
          <div className="border-t border-border">
            {post.comments?.length > 0 ? (
              <div className="space-y-4 p-4">
                {post.comments.map((comment: any) => (
                  <PostCard key={comment.id} post={comment} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No comments yet
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}









