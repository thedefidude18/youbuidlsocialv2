"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AiAssistantProps {
  content: string;
  onSuggestionApply: (suggestion: string) => void;
  onHashtagsApply: (hashtags: string[]) => void;
}

type SuggestionType = "improvement" | "engagement" | "clarity" | "tone";

interface ContentSuggestion {
  type: SuggestionType;
  original?: string;
  suggestion: string;
  reason: string;
}

interface HashtagSuggestion {
  tag: string;
  relevance: "high" | "medium" | "low";
  reason: string;
}

// Mock common topics for the Warpcast/crypto/Web3 space
const COMMON_TOPICS = [
  "defi", "nft", "crypto", "web3", "blockchain", "ethereum", "bitcoin", "base",
  "optimism", "solana", "dao", "farcaster", "warpcast", "frames", "zk", "gamefi",
  "metaverse", "airdrop", "trading", "development", "coding", "design", "tokens",
  "wallet", "security", "privacy", "community", "governance", "staking", "yield",
];

export function AiAssistant({ content, onSuggestionApply, onHashtagsApply }: AiAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [hashtags, setHashtags] = useState<HashtagSuggestion[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Reset state when content changes significantly
  useEffect(() => {
    if (hasGenerated && content.length < 5) {
      setSuggestions([]);
      setHashtags([]);
      setHasGenerated(false);
    }
  }, [content, hasGenerated]);

  // Mock AI analysis of content - in a real app, this would call an API
  const analyzeContent = () => {
    if (!content.trim() || content.length < 5) return;

    setIsAnalyzing(true);
    setIsOpen(true);

    // Simulate API delay
    setTimeout(() => {
      // Generate content improvement suggestions
      const generatedSuggestions = generateMockSuggestions(content);
      setSuggestions(generatedSuggestions);

      // Generate hashtag suggestions
      const generatedHashtags = generateMockHashtags(content);
      setHashtags(generatedHashtags);

      setIsAnalyzing(false);
      setHasGenerated(true);
    }, 1200);
  };

  // Mock function to generate content suggestions
  const generateMockSuggestions = (text: string): ContentSuggestion[] => {
    const mockSuggestions: ContentSuggestion[] = [];

    // Simple content length check
    if (text.length < 30 && text.length > 5) {
      mockSuggestions.push({
        type: "engagement",
        suggestion: text + " What are your thoughts on this?",
        reason: "Adding a question increases engagement by 55%"
      });
    }

    // Check for overly complex sentences
    if (text.length > 100 && !text.includes("?")) {
      const sentences = text.split(/[.!?]+/);
      if (sentences.some(s => s.length > 80)) {
        mockSuggestions.push({
          type: "clarity",
          suggestion: text.replace(/([.!?])\s+/g, "$1\n\n"),
          reason: "Breaking up long text into smaller paragraphs improves readability"
        });
      }
    }

    // Check for weak language
    const weakWords = ["maybe", "just", "kind of", "sort of"];
    for (const word of weakWords) {
      if (text.toLowerCase().includes(word)) {
        const stronger = text.replace(new RegExp(word, "gi"), "");
        mockSuggestions.push({
          type: "tone",
          original: text,
          suggestion: stronger,
          reason: "Removing qualifier words makes your post more assertive"
        });
        break;
      }
    }

    // If no suggestions yet, provide a generic one
    if (mockSuggestions.length === 0) {
      mockSuggestions.push({
        type: "improvement",
        suggestion: text + (text.endsWith(" ") ? "" : " ") + "🔥",
        reason: "Posts with emojis see 17% higher engagement rates"
      });
    }

    return mockSuggestions;
  };

  // Mock function to generate hashtag suggestions
  const generateMockHashtags = (text: string): HashtagSuggestion[] => {
    const words = text.toLowerCase().split(/\W+/);
    const result: HashtagSuggestion[] = [];

    // Find matching topics from our list
    for (const topic of COMMON_TOPICS) {
      // Direct match in the text
      if (words.includes(topic)) {
        result.push({
          tag: topic,
          relevance: "high",
          reason: `Directly mentioned in your post`
        });
      }
      // Related terms for some topics
      else if (
        (topic === "defi" && (text.toLowerCase().includes("finance") || text.toLowerCase().includes("yield"))) ||
        (topic === "nft" && (text.toLowerCase().includes("collect") || text.toLowerCase().includes("art"))) ||
        (topic === "web3" && (text.toLowerCase().includes("decentralized") || text.toLowerCase().includes("crypto")))
      ) {
        result.push({
          tag: topic,
          relevance: "medium",
          reason: `Related to concepts in your post`
        });
      }
    }

    // Always suggest some popular tags to reach more people
    const popularTags = ["crypto", "web3", "farcaster"];
    for (const tag of popularTags) {
      if (!result.some(r => r.tag === tag)) {
        result.push({
          tag: tag,
          relevance: "low",
          reason: "Popular hashtag that could increase visibility"
        });
      }
    }

    // Limit to 5 hashtags max
    return result.slice(0, 5);
  };

  const applyHashtags = () => {
    const tags = hashtags.map(h => h.tag);
    onHashtagsApply(tags);
    setIsOpen(false);
  };

  // If content is empty, don't render the assistant
  if (!content.trim()) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1 text-primary"
          onClick={analyzeContent}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <span>AI Enhance</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">AI Post Enhancement</h3>
            {isAnalyzing && (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs">Analyzing...</span>
              </div>
            )}
          </div>

          {isAnalyzing ? (
            <div className="space-y-2 py-2">
              <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-11/12 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Content suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Suggestions</h4>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, i) => (
                      <div key={i} className="border border-border rounded-md p-3 text-xs">
                        <div className="flex justify-between mb-1">
                          <Badge variant="outline" className="capitalize text-[10px]">
                            {suggestion.type}
                          </Badge>
                        </div>
                        <p className="mb-2">{suggestion.suggestion}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{suggestion.reason}</span>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => onSuggestionApply(suggestion.suggestion)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtag suggestions */}
              {hashtags.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Suggested Hashtags</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hashtags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant={tag.relevance === "high" ? "default" : "secondary"}
                        className="cursor-pointer"
                      >
                        #{tag.tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={applyHashtags}>
                      Add Hashtags
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 text-xs text-muted-foreground border-t border-border">
            AI-powered suggestions based on post content and engagement patterns
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
