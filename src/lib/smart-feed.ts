interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    likes: number;
    comments: number;
    recasts: number;
  };
  hashtags?: string[];
  images?: string[];
  poll?: {
    options: {
      text: string;
      votes: number;
    }[];
    totalVotes: number;
    endsAt: Date;
  };
  isThreadStart?: boolean;
  isThreadPart?: boolean;
  threadId?: string;
  threadIndex?: number;
}

interface UserProfile {
  id: string;
  following: string[]; // IDs of users being followed
  engagementHistory: UserEngagement[];
  topicPreferences: TopicPreference[];
}

interface UserEngagement {
  postId: string;
  authorId: string;
  action: "like" | "comment" | "recast" | "view";
  timestamp: Date;
  hashtags?: string[];
}

interface TopicPreference {
  topic: string;
  weight: number; // 0-10, where 10 is highest preference
}

// Function to rank posts for a personalized feed
export function rankPostsForUser(posts: Post[], userProfile: UserProfile): Post[] {
  if (!posts.length || !userProfile) {
    return posts;
  }

  // Create a map for quick access to following status
  const followingMap = new Set(userProfile.following);

  // Create a map for topic preferences
  const topicPreferences = new Map<string, number>();
  userProfile.topicPreferences.forEach(pref => {
    topicPreferences.set(pref.topic, pref.weight);
  });

  // Create engagement score map for authors
  const authorEngagementScore = new Map<string, number>();
  userProfile.engagementHistory.forEach(engagement => {
    const currentScore = authorEngagementScore.get(engagement.authorId) || 0;
    // Weight different engagement types differently
    let engagementValue = 1;
    if (engagement.action === "like") engagementValue = 2;
    if (engagement.action === "comment") engagementValue = 3;
    if (engagement.action === "recast") engagementValue = 4;

    // More recent engagements have higher weight
    const daysSinceEngagement = Math.max(1, Math.floor((Date.now() - engagement.timestamp.getTime()) / (1000 * 60 * 60 * 24)));
    const recencyFactor = 1 / Math.sqrt(daysSinceEngagement);

    authorEngagementScore.set(
      engagement.authorId,
      currentScore + (engagementValue * recencyFactor)
    );
  });

  // Calculate scores for posts
  const scoredPosts = posts.map(post => {
    let score = 0;

    // Base score calculation factors

    // 1. Following status (highest priority)
    if (followingMap.has(post.author.id)) {
      score += 100;
    }

    // 2. Previous engagement with author
    const authorScore = authorEngagementScore.get(post.author.id) || 0;
    score += authorScore * 10;

    // 3. Topic preference based on hashtags
    if (post.hashtags && post.hashtags.length > 0) {
      post.hashtags.forEach(tag => {
        const tagPreference = topicPreferences.get(tag) || 0;
        score += tagPreference * 5;
      });
    }

    // 4. Content quality signals
    const engagementRatio = (post.stats.likes + post.stats.comments * 2 + post.stats.recasts * 3) /
                            Math.max(1, getMinutesSincePost(post.timestamp));
    score += engagementRatio * 20;

    // 5. Content type bonuses
    if (post.images && post.images.length > 0) {
      score += 15; // Images tend to get more engagement
    }

    if (post.poll) {
      score += 25; // Polls are highly interactive
    }

    if (post.isThreadStart) {
      score += 10; // Thread starters are important
    }

    // Add a small random factor to prevent feeds from being too deterministic
    score += Math.random() * 5;

    return {
      post,
      score
    };
  });

  // Sort posts by score, descending
  scoredPosts.sort((a, b) => b.score - a.score);

  // Return sorted posts without the score
  return scoredPosts.map(item => item.post);
}

// Function to extract user engagement patterns from history
export function analyzeUserEngagementPatterns(userProfile: UserProfile): {
  favoriteAuthors: string[];
  favoriteTopics: string[];
  activeHours: number[];
  engagementFrequency: "high" | "medium" | "low";
} {
  // Track authors the user has engaged with
  const authorEngagement = new Map<string, number>();

  // Track topics the user has engaged with
  const topicEngagement = new Map<string, number>();

  // Track hours of day when user is active
  const hourCounts = Array(24).fill(0);

  // Count engagements for frequency analysis
  let totalEngagements = 0;

  userProfile.engagementHistory.forEach(engagement => {
    // Count author engagements
    const authorCount = authorEngagement.get(engagement.authorId) || 0;
    authorEngagement.set(engagement.authorId, authorCount + 1);

    // Count topic engagements
    if (engagement.hashtags) {
      engagement.hashtags.forEach(tag => {
        const tagCount = topicEngagement.get(tag) || 0;
        topicEngagement.set(tag, tagCount + 1);
      });
    }

    // Count hour of day
    const hour = engagement.timestamp.getHours();
    hourCounts[hour]++;

    totalEngagements++;
  });

  // Find top authors by engagement
  const favoriteAuthors = [...authorEngagement.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);

  // Find top topics by engagement
  const favoriteTopics = [...topicEngagement.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);

  // Find top 3 active hours
  const activeHours = hourCounts
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(entry => entry.hour);

  // Determine engagement frequency
  let engagementFrequency: "high" | "medium" | "low" = "low";
  const engagementsPerDay = totalEngagements / 30; // Assuming a month of data

  if (engagementsPerDay > 10) {
    engagementFrequency = "high";
  } else if (engagementsPerDay > 3) {
    engagementFrequency = "medium";
  }

  return {
    favoriteAuthors,
    favoriteTopics,
    activeHours,
    engagementFrequency
  };
}

// Function to generate content recommendations based on user patterns
export function generateContentRecommendations(
  posts: Post[],
  userProfile: UserProfile,
  count: number = 5
): Post[] {
  const patterns = analyzeUserEngagementPatterns(userProfile);
  const rankedPosts = rankPostsForUser(posts, userProfile);

  // Calculate diversity score to ensure we're not showing too similar content
  const selectedPosts: Post[] = [];
  const selectedAuthors = new Set<string>();
  const selectedTopics = new Set<string>();

  // Get the top posts but enforce diversity
  for (const post of rankedPosts) {
    // Skip if we've already selected enough posts
    if (selectedPosts.length >= count) break;

    // Enforce author diversity (don't show too many posts from the same author)
    if (selectedAuthors.has(post.author.id) && selectedAuthors.size < count / 2) {
      // Skip this post to ensure diversity, unless we have very few authors
      continue;
    }

    // Enforce topic diversity
    const hasOverlappingTopics = post.hashtags &&
      post.hashtags.some(tag => selectedTopics.has(tag)) &&
      selectedTopics.size < count * 2;

    if (hasOverlappingTopics) {
      // Skip if we already have posts with similar topics, unless we have very few topics
      continue;
    }

    // Add this post to our recommendations
    selectedPosts.push(post);

    // Update tracking sets
    selectedAuthors.add(post.author.id);
    if (post.hashtags) {
      post.hashtags.forEach(tag => selectedTopics.add(tag));
    }
  }

  // If we don't have enough posts after enforcing diversity, just add top ranked posts
  if (selectedPosts.length < count) {
    for (const post of rankedPosts) {
      if (!selectedPosts.includes(post) && selectedPosts.length < count) {
        selectedPosts.push(post);
      }
    }
  }

  return selectedPosts;
}

// Helper function to estimate minutes since post based on timestamp string
function getMinutesSincePost(timestamp: string): number {
  if (timestamp === "now") return 1;

  if (timestamp.includes("m")) {
    return parseInt(timestamp.replace("m", ""));
  }

  if (timestamp.includes("h")) {
    return parseInt(timestamp.replace("h", "")) * 60;
  }

  if (timestamp.includes("d")) {
    return parseInt(timestamp.replace("d", "")) * 60 * 24;
  }

  return 1000; // Default for old posts
}

// Function to update user preferences based on new engagement
export function updateUserPreferences(
  userProfile: UserProfile,
  engagement: UserEngagement
): UserProfile {
  const newProfile = { ...userProfile };

  // Add the new engagement to history
  newProfile.engagementHistory = [
    engagement,
    ...userProfile.engagementHistory
  ].slice(0, 100); // Keep last 100 engagements

  // Update topic preferences
  if (engagement.hashtags) {
    const existingTopics = new Map(userProfile.topicPreferences.map(p => [p.topic, p]));

    engagement.hashtags.forEach(tag => {
      const currentPref = existingTopics.get(tag);

      if (currentPref) {
        // Increase weight for existing topic
        currentPref.weight = Math.min(10, currentPref.weight + 1);
      } else {
        // Add new topic preference
        existingTopics.set(tag, { topic: tag, weight: 1 });
      }
    });

    // Convert map back to array
    newProfile.topicPreferences = Array.from(existingTopics.values());
  }

  return newProfile;
}

