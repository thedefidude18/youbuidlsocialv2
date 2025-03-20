// Mock user data
export const mockUsers = [
  {
    id: "user1",
    name: "Crypto Whale",
    username: "crypto_whale",
    avatar: "https://placekitten.com/107/107",
    verified: true,
    bio: "Web3 investor and enthusiast. Building the future of decentralized finance.",
    followers: 12400,
    following: 834,
  },
  {
    id: "user2",
    name: "Web3 Designer",
    username: "web3designer",
    avatar: "https://placekitten.com/108/108",
    verified: false,
    bio: "Creating beautiful interfaces for web3 projects. UI/UX specialist.",
    followers: 5200,
    following: 1245,
  },
  {
    id: "user3",
    name: "BlockchainDev",
    username: "blockchain_dev",
    avatar: "https://placekitten.com/109/109",
    verified: true,
    bio: "Full-stack blockchain developer. Contributing to open source projects.",
    followers: 8900,
    following: 567,
  },
  {
    id: "user4",
    name: "NFT Collector",
    username: "nft_collector",
    avatar: "https://placekitten.com/110/110",
    verified: false,
    bio: "Collecting rare digital art and NFTs. Supporting artists in the web3 space.",
    followers: 3400,
    following: 1123,
  },
  {
    id: "user5",
    name: "Base Builder",
    username: "base_builder",
    avatar: "https://placekitten.com/111/111",
    verified: true,
    bio: "Building on Base. Creating the next generation of dApps and tools.",
    followers: 7800,
    following: 352,
  },
];

// Mock posts data
export const mockPosts = [
  {
    id: "1",
    content: "Hello World!",
    transactionHash: "0x123...",
    author: {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      avatar: "",
      verified: true
    },
    timestamp: "2h",
    stats: {
      likes: 245,
      comments: 37,
      recasts: 52,
    },
    hashtags: ["defi", "base"],
  },
  {
    id: "post2",
    author: {
      id: "user2",
      name: "Web3 Designer",
      username: "web3designer",
      avatar: "https://placekitten.com/108/108",
    },
    content: "Working on a new UI for a Warpcast client. What features would you like to see? #design #ux #warpcast",
    timestamp: "5h",
    stats: {
      likes: 189,
      comments: 43,
      recasts: 18,
    },
    hashtags: ["design", "ux", "warpcast"],
  },
  {
    id: "post3",
    author: {
      id: "user3",
      name: "BlockchainDev",
      username: "blockchain_dev",
      avatar: "https://placekitten.com/109/109",
      verified: true,
      address: "0x1234567890123456789012345678901234567890",
    },
    content: "Just pushed an update to my Base SDK. Now it's 2x faster! Check it out on GitHub. #coding #base #opensource",
    timestamp: "1d",
    stats: {
      likes: 312,
      comments: 29,
      recasts: 64,
    },
    hashtags: ["coding", "base", "opensource"],
  },
  {
    id: "post4",
    author: {
      id: "user4",
      name: "NFT Collector",
      username: "nft_collector",
      avatar: "https://placekitten.com/110/110",
    },
    content: "Just minted this amazing NFT from @base_artist. Love the colors and composition! #NFT #art #digitalart",
    timestamp: "3d",
    stats: {
      likes: 156,
      comments: 14,
      recasts: 23,
    },
    hashtags: ["nft", "art", "digitalart"],
    images: ["https://placekitten.com/600/400"],
  },
  {
    id: "post5",
    author: {
      id: "user5",
      name: "Base Builder",
      username: "base_builder",
      avatar: "https://placekitten.com/111/111",
      verified: true,
      address: "0x1234567890123456789012345678901234567890",
    },
    content: "The Base ecosystem is growing so fast! Over 100 new projects launched in the past month. The future is bright! #base #web3 #crypto",
    timestamp: "6h",
    stats: {
      likes: 423,
      comments: 57,
      recasts: 94,
    },
    hashtags: ["base", "web3", "crypto"],
  },
];

// Mock topics (hashtags) data
export const mockTopics = [
  {
    id: "topic1",
    name: "base",
    postCount: 4562,
    description: "Discussion about Base, the Ethereum L2 built by Coinbase.",
  },
  {
    id: "topic2",
    name: "defi",
    postCount: 3214,
    description: "Decentralized Finance applications, protocols, and news.",
  },
  {
    id: "topic3",
    name: "nft",
    postCount: 2876,
    description: "Non-Fungible Tokens, digital art, and collectibles.",
  },
  {
    id: "topic4",
    name: "crypto",
    postCount: 5623,
    description: "Cryptocurrency discussion, price action, and news.",
  },
  {
    id: "topic5",
    name: "design",
    postCount: 1892,
    description: "UI/UX design, web design, and digital art creation.",
  },
  {
    id: "topic6",
    name: "coding",
    postCount: 2134,
    description: "Programming, development, and coding tutorials.",
  },
  {
    id: "topic7",
    name: "warpcast",
    postCount: 3456,
    description: "Discussion about Warpcast, Farcaster client apps, and ecosystem.",
  },
];

// Function to get mock search results based on query and filter
export function getMockSearchResults(query: string, filter: string) {
  const normalizedQuery = query.toLowerCase().trim();

  // Search in users
  if (filter === "people") {
    return mockUsers.filter(user =>
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.username.toLowerCase().includes(normalizedQuery) ||
      user.bio.toLowerCase().includes(normalizedQuery)
    );
  }

  // Search in posts with media
  if (filter === "media") {
    return mockPosts.filter(post =>
      (post.content.toLowerCase().includes(normalizedQuery) ||
       post.author.name.toLowerCase().includes(normalizedQuery) ||
       post.author.username.toLowerCase().includes(normalizedQuery) ||
       post.hashtags?.some(tag => tag.toLowerCase().includes(normalizedQuery))) &&
      post.images !== undefined
    );
  }

  // Search in topics
  if (filter === "topics") {
    return mockTopics.filter(topic =>
      topic.name.toLowerCase().includes(normalizedQuery) ||
      topic.description.toLowerCase().includes(normalizedQuery)
    );
  }

  // Search in latest posts
  if (filter === "latest") {
    return mockPosts
      .filter(post =>
        post.content.toLowerCase().includes(normalizedQuery) ||
        post.author.name.toLowerCase().includes(normalizedQuery) ||
        post.author.username.toLowerCase().includes(normalizedQuery) ||
        post.hashtags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
      )
      .sort((a, b) => {
        // Simple sorting by timestamp (in a real app this would be proper date comparison)
        if (a.timestamp.includes("m") && b.timestamp.includes("h")) return -1;
        if (a.timestamp.includes("h") && b.timestamp.includes("d")) return -1;
        if (a.timestamp.includes("m") && b.timestamp.includes("d")) return -1;
        return 0;
      });
  }

  // Default "top" filter - search in all content
  const userResults = mockUsers
    .filter(user =>
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.username.toLowerCase().includes(normalizedQuery) ||
      user.bio.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 2)
    .map(user => ({ ...user, type: 'user' }));

  const postResults = mockPosts
    .filter(post =>
      post.content.toLowerCase().includes(normalizedQuery) ||
      post.author.name.toLowerCase().includes(normalizedQuery) ||
      post.author.username.toLowerCase().includes(normalizedQuery) ||
      post.hashtags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
    )
    .sort((a, b) => (b.stats.likes + b.stats.recasts) - (a.stats.likes + a.stats.recasts))
    .slice(0, 3)
    .map(post => ({ ...post, type: 'post' }));

  const topicResults = mockTopics
    .filter(topic =>
      topic.name.toLowerCase().includes(normalizedQuery) ||
      topic.description.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 2)
    .map(topic => ({ ...topic, type: 'topic' }));

  return [...userResults, ...postResults, ...topicResults];
}
