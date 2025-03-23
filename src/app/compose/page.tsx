'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ComposeBox } from '@/components/compose-box';
import { X } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';

export default function ComposePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (content: string, images?: string[]) => {
    try {
      setIsSubmitting(true);
      // Your existing post creation logic here
      router.push('/'); // Redirect to home after successful post
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 bg-background z-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              onClick={() => document.querySelector('form')?.requestSubmit()}
            >
              Post
            </Button>
          </div>
          
          <div className="flex-1 p-4">
            <ComposeBox
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              placeholder="What's happening?"
              maxLength={280}
              autoFocus
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
