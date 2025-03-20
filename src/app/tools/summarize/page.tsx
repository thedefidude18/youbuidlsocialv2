"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ContentSummarizer, SummaryResult } from "@/components/content-summarizer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SummarizePage() {
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const router = useRouter();

  const handleSummaryComplete = (result: SummaryResult) => {
    setSummary(result);
  };

  // Create a post with the summary
  const shareAsCast = () => {
    if (!summary) return;

    // Format the summary for sharing
    const summaryText = `📋 ${summary.title}\n\n${summary.summary}\n\nKey points:\n${summary.keyPoints.map(point => `• ${point}`).join('\n')}\n\n${summary.sourceName ? `Source: ${summary.sourceName}` : ''}`;

    // Redirect to home with the summary as a new post
    const encodedSummary = encodeURIComponent(summaryText);
    router.push(`/?draft=${encodedSummary}`);
  };

  return (
    <MainLayout>
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-bold">Content Summarizer</h1>
          <p className="text-sm text-muted-foreground">
            Generate AI summaries of articles, long threads, or any web content
          </p>
        </div>

        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <ContentSummarizer onSummaryComplete={handleSummaryComplete} />

            {summary && (
              <div className="mt-6 flex justify-end">
                <Button onClick={shareAsCast} className="gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                  Share as Cast
                </Button>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">About this tool</h2>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The Content Summarizer uses AI to extract the key information from articles, long threads,
                  and other web content. This helps you save time and share valuable insights with your audience.
                </p>

                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-medium text-foreground">Features:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Summarize any URL or pasted text content</li>
                    <li>Extract key points from lengthy articles</li>
                    <li>Get estimated reading times</li>
                    <li>Share summaries directly as casts</li>
                    <li>Save time for you and your followers</li>
                  </ul>
                </div>

                <p>
                  This tool is especially useful for sharing in-depth articles or research with your followers
                  while providing them with a clear, concise overview of the content.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </MainLayout>
  );
}
