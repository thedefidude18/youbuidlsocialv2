"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import Link from "next/link";
import { getMockSearchResults } from "@/lib/mock-data";

type SearchFilterType = "top" | "latest" | "people" | "media" | "topics";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>("top");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    if (!mounted) return;

    const savedHistory = localStorage.getItem("search-history");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory).slice(0, 5));
      } catch (e) {
        // If parsing fails, just use an empty array
        setSearchHistory([]);
      }
    }
  }, [mounted]);

  // Save search history to localStorage
  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim() || !mounted) return;

    const newHistory = [
      searchTerm,
      ...searchHistory.filter(item => item !== searchTerm)
    ].slice(0, 5);

    setSearchHistory(newHistory);
    localStorage.setItem("search-history", JSON.stringify(newHistory));
  };

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 1) {
      // Generate search suggestions based on input
      generateSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Generate search suggestions
  const generateSuggestions = (input: string) => {
    // In a real app, this would come from an API
    const dummySuggestions = [
      `${input} in base`,
      `${input} news`,
      `${input} people`,
      `${input.charAt(0).toUpperCase() + input.slice(1)}`,
      `#${input}`,
    ];
    setSuggestions(dummySuggestions);
  };

  // Handle search submission
  const handleSearch = (searchTerm: string = query) => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);
    saveToHistory(searchTerm);
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);

    // In a real app, this would be an API call
    setTimeout(() => {
      performSearch(searchTerm);
      setIsSearching(false);
    }, 500);
  };

  // Handle key press (Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Perform search (mock implementation)
  const performSearch = useCallback((searchTerm: string) => {
    setIsSearching(true);
    
    try {
      const results = getMockSearchResults(searchTerm, activeFilter);
      
      // Add timestamps for sorting
      const processedResults = results.map(result => ({
        ...result,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
      }));

      // Sort by relevance and recency
      processedResults.sort((a, b) => {
        if (activeFilter === 'latest') {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        // Default sorting by engagement
        const aEngagement = (a.stats?.likes || 0) + (a.stats?.recasts || 0);
        const bEngagement = (b.stats?.likes || 0) + (b.stats?.recasts || 0);
        return bEngagement - aEngagement;
      });

      setSearchResults(processedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [activeFilter]);

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setActiveFilter(value as SearchFilterType);
    if (query) {
      performSearch(query);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Initial search if query is provided in URL
  useEffect(() => {
    if (initialQuery && mounted) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery, mounted]);

  // Render search content based on state
  const renderSearchContent = () => {
    if (!mounted) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-40"></div>
            <div className="h-4 bg-muted rounded w-52"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      );
    }

    if (isSearching) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-2 border-t-primary border-primary/30 rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Searching...</p>
          </div>
        </div>
      );
    }

    if (searchResults.length === 0) {
      if (query) {
        return (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-medium mb-1">No results found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any results for "{query}". Try using different keywords or filters.
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="p-4">
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Recent searches</h3>
              <div className="space-y-2">
                {searchHistory.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-secondary cursor-pointer"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                      </svg>
                      <span>{term}</span>
                    </div>
                    <button
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchHistory(prev => prev.filter((_, i) => i !== index));
                        localStorage.setItem("search-history", JSON.stringify(
                          searchHistory.filter((_, i) => i !== index)
                        ));
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending searches */}
          <div>
            <h3 className="text-base font-medium mb-2">Trending searches</h3>
            <div className="space-y-2">
              {["base", "defi", "nft collections", "crypto news", "warpcast update"].map((term, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 rounded-md hover:bg-secondary cursor-pointer"
                  onClick={() => handleSuggestionClick(term)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-none w-5 text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span>{term}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 10) + 1}k searches
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="divide-y divide-border">
        {/* Users */}
        {activeFilter === "people" || activeFilter === "top" ?
          searchResults
            .filter(result => result.type === 'user' || (activeFilter === "people" && result.username))
            .map((user) => (
              <div key={user.id} className="p-4 flex items-start gap-3 hover:bg-secondary/30">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{user.name}</span>
                    {user.verified && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="text-muted-foreground">@{user.username}</div>
                  {user.bio && <div className="mt-1 text-sm">{user.bio}</div>}
                  <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                    <span><strong className="text-foreground">{user.following}</strong> Following</span>
                    <span><strong className="text-foreground">{user.followers}</strong> Followers</span>
                  </div>
                </div>
                <Button size="sm" className="rounded-full">Follow</Button>
              </div>
            ))
          : null
        }

        {/* Posts */}
        {activeFilter === "top" || activeFilter === "latest" || activeFilter === "media" ?
          searchResults
            .filter(result => {
              if (activeFilter === "media") return result.type === 'post' && result.images;
              return result.type === 'post' || (!result.type && result.content);
            })
            .map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          : null
        }

        {/* Topics */}
        {activeFilter === "topics" || activeFilter === "top" ?
          searchResults
            .filter(result => result.type === 'topic' || (activeFilter === "topics" && result.name && result.postCount))
            .map((topic) => (
              <div key={topic.id} className="p-4 hover:bg-secondary/30">
                <Link href={`/hashtag/${topic.name}`} className="block">
                  <div className="text-lg font-semibold">#{topic.name}</div>
                  <div className="text-sm text-muted-foreground">{topic.postCount} posts</div>
                  {topic.description && <div className="mt-1">{topic.description}</div>}
                </Link>
              </div>
            ))
          : null
        }
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="flex-1 min-h-0 flex flex-col pb-16 md:pb-0">
        <div className="border-b border-border p-4">
          <div className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search posts, users, and topics"
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            {/* Search suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border border-border rounded-md shadow-md">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-secondary cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {query && (
          <Tabs
            value={activeFilter}
            onValueChange={handleFilterChange}
            className="w-full"
          >
            <ScrollArea className="w-full border-b border-border">
              <TabsList className="h-12 px-4 w-[500px]">
                <TabsTrigger
                  value="top"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full"
                >
                  Top
                </TabsTrigger>
                <TabsTrigger
                  value="latest"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full"
                >
                  Latest
                </TabsTrigger>
                <TabsTrigger
                  value="people"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full"
                >
                  People
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger
                  value="topics"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none h-full"
                >
                  Topics
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </Tabs>
        )}

        <ScrollArea className="flex-1">
          {renderSearchContent()}
        </ScrollArea>
      </div>
    </MainLayout>
  );
}
