"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ContentSummarizerProps {
  onSummaryComplete: (summary: SummaryResult) => void;
}

export interface SummaryResult {
  title: string;
  summary: string;
  keyPoints: string[];
  sourceName?: string;
  sourceUrl?: string;
  estimatedReadTime?: number;
}

// Sample domain authorities for known crypto/web3 sites
const DOMAIN_AUTHORITIES: Record<string, number> = {
  "coindesk.com": 92,
  "theblock.co": 88,
  "decrypt.co": 86,
  "cointelegraph.com": 85,
  "defiant.io": 83,
  "warpcast.com": 80,
  "ethereum.org": 95,
  "base.org": 90,
  "optimism.io": 89,
  "github.com": 94,
  "medium.com": 80,
};

export function ContentSummarizer({ onSummaryComplete }: ContentSummarizerProps) {
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [inputType, setInputType] = useState<"url" | "text">("url");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const getDomainFromUrl = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      const domainParts = hostname.split('.');
      if (domainParts.length >= 2) {
        return `${domainParts[domainParts.length - 2]}.${domainParts[domainParts.length - 1]}`;
      }
      return hostname;
    } catch (e) {
      return "";
    }
  };

  const getDomainAuthority = (domain: string): number => {
    for (const [key, value] of Object.entries(DOMAIN_AUTHORITIES)) {
      if (domain.includes(key)) {
        return value;
      }
    }
    return 70; // Default value for unknown domains
  };

  const generateSummary = () => {
    if (!inputValue.trim()) return;

    setIsProcessing(true);

    // Simulate API call delay
    setTimeout(() => {
      let summary: SummaryResult;

      if (inputType === "url") {
        // Extract domain to personalize summary based on the source
        const domain = getDomainFromUrl(inputValue);
        const domainAuthority = getDomainAuthority(domain);

        // Mock summaries based on URL patterns
        if (inputValue.includes("nft") || inputValue.includes("collect")) {
          summary = generateNftArticleSummary(inputValue, domain, domainAuthority);
        } else if (inputValue.includes("defi") || inputValue.includes("finance")) {
          summary = generateDefiArticleSummary(inputValue, domain, domainAuthority);
        } else if (inputValue.includes("base") || inputValue.includes("optimism") || inputValue.includes("ethereum")) {
          summary = generateL2ArticleSummary(inputValue, domain, domainAuthority);
        } else {
          summary = generateGenericArticleSummary(inputValue, domain, domainAuthority);
        }
      } else {
        // Text summarization
        summary = generateTextSummary(inputValue);
      }

      setSummaryResult(summary);
      onSummaryComplete(summary);
      setIsProcessing(false);
    }, 2000);
  };

  const generateNftArticleSummary = (url: string, domain: string, authority: number): SummaryResult => {
    return {
      title: "NFT Market Analysis and Collection Trends",
      summary: "The article discusses recent trends in the NFT marketplace, highlighting significant collections gaining traction and new features being introduced by platforms to enhance creator capabilities. There's a focus on the shift from pure collectibles to utility-driven NFTs that offer tangible benefits for holders.",
      keyPoints: [
        "Trading volume has increased 37% month-over-month for profile picture NFTs",
        "Platforms are implementing more creator-friendly royalty structures",
        "Hybrid on-chain/off-chain experiences are gaining popularity",
        "Upcoming collections are focusing on long-term utility and community benefits"
      ],
      sourceName: domain,
      sourceUrl: url,
      estimatedReadTime: 6
    };
  };

  const generateDefiArticleSummary = (url: string, domain: string, authority: number): SummaryResult => {
    return {
      title: "DeFi Protocol Innovations and Market Updates",
      summary: "This article examines recent DeFi protocol developments and market conditions. It highlights innovative yield strategies, security improvements, and the evolution of lending markets across multiple blockchain ecosystems. The data suggests growing institutional interest despite market volatility.",
      keyPoints: [
        "Total Value Locked (TVL) has stabilized at $42B across major protocols",
        "New real-world asset (RWA) integrations are expanding DeFi use cases",
        "Cross-chain liquidity solutions are reducing fragmentation issues",
        "Regulatory clarity in certain regions is driving institutional adoption"
      ],
      sourceName: domain,
      sourceUrl: url,
      estimatedReadTime: 8
    };
  };

  const generateL2ArticleSummary = (url: string, domain: string, authority: number): SummaryResult => {
    return {
      title: "Layer 2 Scaling Solutions: Adoption and Development",
      summary: "The article provides an in-depth look at Ethereum Layer 2 scaling solutions, with particular focus on optimistic rollups and zero-knowledge proofs. Transaction volume data shows significant growth in adoption, while developer activity indicates a maturing ecosystem with improved tooling and infrastructure.",
      keyPoints: [
        "Base and Optimism have seen 150% growth in daily active addresses",
        "Gas fees on L2s are averaging 95% lower than Ethereum mainnet",
        "Developer frameworks have reduced deployment complexity by 60%",
        "New cross-L2 bridging solutions promise better capital efficiency"
      ],
      sourceName: domain,
      sourceUrl: url,
      estimatedReadTime: 10
    };
  };

  const generateGenericArticleSummary = (url: string, domain: string, authority: number): SummaryResult => {
    return {
      title: "Web3 Ecosystem Developments and Market Insights",
      summary: "This article covers recent developments across the Web3 ecosystem, including technological advances, market trends, and evolving user behaviors. The data indicates growing mainstream interest in decentralized applications alongside infrastructure improvements that address previous user experience challenges.",
      keyPoints: [
        "Web3 social platforms like Farcaster have seen 200% user growth in Q1",
        "Browser wallet adoption has surpassed 50 million monthly active users",
        "Cross-chain interoperability solutions are reducing friction for users",
        "Regulatory frameworks in major markets are becoming more defined"
      ],
      sourceName: domain,
      sourceUrl: url,
      estimatedReadTime: 7
    };
  };

  const generateTextSummary = (text: string): SummaryResult => {
    // In reality, this would use an AI model to generate a real summary
    // Here we're creating a mock summary based on text length and some keyword detection

    const words = text.split(/\s+/);
    const wordCount = words.length;

    const title = wordCount > 100
      ? words.slice(0, 5).join(" ") + "..."
      : "Thread Summary";

    const estimatedReadTime = Math.max(1, Math.floor(wordCount / 200));

    // Extract some "key points" by finding sentences that might be important
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyPoints = sentences
      .filter((s, i) => i === 0 || s.includes("important") || s.includes("key") || i === sentences.length - 1)
      .slice(0, 4)
      .map(s => s.trim());

    // Generate a condensed summary
    const summary = wordCount > 200
      ? text.substring(0, 200) + "..."
      : text;

    return {
      title,
      summary,
      keyPoints: keyPoints.length ? keyPoints : ["No key points were identified in this text"],
      estimatedReadTime
    };
  };

  // Reset the summarizer
  const handleReset = () => {
    setInputValue("");
    setSummaryResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Content Summarizer
        </CardTitle>
        <CardDescription>
          Generate AI summaries of articles, long threads, or any web content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!summaryResult ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={inputType === "url" ? "default" : "outline"}
                onClick={() => setInputType("url")}
                className="w-full"
              >
                Summarize URL
              </Button>
              <Button
                variant={inputType === "text" ? "default" : "outline"}
                onClick={() => setInputType("text")}
                className="w-full"
              >
                Summarize Text
              </Button>
            </div>

            {inputType === "url" ? (
              <Input
                placeholder="Paste an article URL..."
                value={inputValue}
                onChange={handleInputChange}
              />
            ) : (
              <Textarea
                placeholder="Paste the text content to summarize..."
                value={inputValue}
                onChange={handleInputChange}
                rows={5}
              />
            )}

            <Button
              onClick={generateSummary}
              disabled={!inputValue.trim() || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {summaryResult.sourceName && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">{summaryResult.sourceName}</Badge>
                {summaryResult.estimatedReadTime && (
                  <span className="text-xs text-muted-foreground">
                    {summaryResult.estimatedReadTime} min read
                  </span>
                )}
              </div>
            )}

            <h3 className="font-semibold text-lg">{summaryResult.title}</h3>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Summary</h4>
              <p className="text-sm">{summaryResult.summary}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Key Points</h4>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {summaryResult.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className={!summaryResult ? "hidden" : "flex justify-between"}>
        <Button variant="outline" onClick={handleReset}>
          New Summary
        </Button>
        {summaryResult?.sourceUrl && (
          <Button variant="secondary" onClick={() => window.open(summaryResult.sourceUrl, "_blank")}>
            Read Original
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
