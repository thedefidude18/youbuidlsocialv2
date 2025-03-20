"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getMockSearchResults = exports.mockTopics = exports.mockPosts = exports.mockUsers = void 0;
// Mock user data
exports.mockUsers = [
    {
        id: "user1",
        name: "Crypto Whale",
        username: "crypto_whale",
        avatar: "https://placekitten.com/107/107",
        verified: true,
        bio: "Web3 investor and enthusiast. Building the future of decentralized finance.",
        followers: 12400,
        following: 834
    },
    {
        id: "user2",
        name: "Web3 Designer",
        username: "web3designer",
        avatar: "https://placekitten.com/108/108",
        verified: false,
        bio: "Creating beautiful interfaces for web3 projects. UI/UX specialist.",
        followers: 5200,
        following: 1245
    },
    {
        id: "user3",
        name: "BlockchainDev",
        username: "blockchain_dev",
        avatar: "https://placekitten.com/109/109",
        verified: true,
        bio: "Full-stack blockchain developer. Contributing to open source projects.",
        followers: 8900,
        following: 567
    },
    {
        id: "user4",
        name: "NFT Collector",
        username: "nft_collector",
        avatar: "https://placekitten.com/110/110",
        verified: false,
        bio: "Collecting rare digital art and NFTs. Supporting artists in the web3 space.",
        followers: 3400,
        following: 1123
    },
    {
        id: "user5",
        name: "Base Builder",
        username: "base_builder",
        avatar: "https://placekitten.com/111/111",
        verified: true,
        bio: "Building on Base. Creating the next generation of dApps and tools.",
        followers: 7800,
        following: 352
    },
];
// Mock posts data
exports.mockPosts = [
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
            recasts: 52
        },
        hashtags: ["defi", "base"]
    },
    {
        id: "post2",
        author: {
            id: "user2",
            name: "Web3 Designer",
            username: "web3designer",
            avatar: "https://placekitten.com/108/108"
        },
        content: "Working on a new UI for a Warpcast client. What features would you like to see? #design #ux #warpcast",
        timestamp: "5h",
        stats: {
            likes: 189,
            comments: 43,
            recasts: 18
        },
        hashtags: ["design", "ux", "warpcast"]
    },
    {
        id: "post3",
        author: {
            id: "user3",
            name: "BlockchainDev",
            username: "blockchain_dev",
            avatar: "https://placekitten.com/109/109",
            verified: true,
            address: "0x1234567890123456789012345678901234567890"
        },
        content: "Just pushed an update to my Base SDK. Now it's 2x faster! Check it out on GitHub. #coding #base #opensource",
        timestamp: "1d",
        stats: {
            likes: 312,
            comments: 29,
            recasts: 64
        },
        hashtags: ["coding", "base", "opensource"]
    },
    {
        id: "post4",
        author: {
            id: "user4",
            name: "NFT Collector",
            username: "nft_collector",
            avatar: "https://placekitten.com/110/110"
        },
        content: "Just minted this amazing NFT from @base_artist. Love the colors and composition! #NFT #art #digitalart",
        timestamp: "3d",
        stats: {
            likes: 156,
            comments: 14,
            recasts: 23
        },
        hashtags: ["nft", "art", "digitalart"],
        images: ["https://placekitten.com/600/400"]
    },
    {
        id: "post5",
        author: {
            id: "user5",
            name: "Base Builder",
            username: "base_builder",
            avatar: "https://placekitten.com/111/111",
            verified: true,
            address: "0x1234567890123456789012345678901234567890"
        },
        content: "The Base ecosystem is growing so fast! Over 100 new projects launched in the past month. The future is bright! #base #web3 #crypto",
        timestamp: "6h",
        stats: {
            likes: 423,
            comments: 57,
            recasts: 94
        },
        hashtags: ["base", "web3", "crypto"]
    },
];
// Mock topics (hashtags) data
exports.mockTopics = [
    {
        id: "topic1",
        name: "base",
        postCount: 4562,
        description: "Discussion about Base, the Ethereum L2 built by Coinbase."
    },
    {
        id: "topic2",
        name: "defi",
        postCount: 3214,
        description: "Decentralized Finance applications, protocols, and news."
    },
    {
        id: "topic3",
        name: "nft",
        postCount: 2876,
        description: "Non-Fungible Tokens, digital art, and collectibles."
    },
    {
        id: "topic4",
        name: "crypto",
        postCount: 5623,
        description: "Cryptocurrency discussion, price action, and news."
    },
    {
        id: "topic5",
        name: "design",
        postCount: 1892,
        description: "UI/UX design, web design, and digital art creation."
    },
    {
        id: "topic6",
        name: "coding",
        postCount: 2134,
        description: "Programming, development, and coding tutorials."
    },
    {
        id: "topic7",
        name: "warpcast",
        postCount: 3456,
        description: "Discussion about Warpcast, Farcaster client apps, and ecosystem."
    },
];
// Function to get mock search results based on query and filter
function getMockSearchResults(query, filter) {
    var normalizedQuery = query.toLowerCase().trim();
    // Search in users
    if (filter === "people") {
        return exports.mockUsers.filter(function (user) {
            return user.name.toLowerCase().includes(normalizedQuery) ||
                user.username.toLowerCase().includes(normalizedQuery) ||
                user.bio.toLowerCase().includes(normalizedQuery);
        });
    }
    // Search in posts with media
    if (filter === "media") {
        return exports.mockPosts.filter(function (post) {
            var _a;
            return (post.content.toLowerCase().includes(normalizedQuery) ||
                post.author.name.toLowerCase().includes(normalizedQuery) ||
                post.author.username.toLowerCase().includes(normalizedQuery) || ((_a = post.hashtags) === null || _a === void 0 ? void 0 : _a.some(function (tag) { return tag.toLowerCase().includes(normalizedQuery); }))) &&
                post.images !== undefined;
        });
    }
    // Search in topics
    if (filter === "topics") {
        return exports.mockTopics.filter(function (topic) {
            return topic.name.toLowerCase().includes(normalizedQuery) ||
                topic.description.toLowerCase().includes(normalizedQuery);
        });
    }
    // Search in latest posts
    if (filter === "latest") {
        return exports.mockPosts
            .filter(function (post) {
            var _a;
            return post.content.toLowerCase().includes(normalizedQuery) ||
                post.author.name.toLowerCase().includes(normalizedQuery) ||
                post.author.username.toLowerCase().includes(normalizedQuery) || ((_a = post.hashtags) === null || _a === void 0 ? void 0 : _a.some(function (tag) { return tag.toLowerCase().includes(normalizedQuery); }));
        })
            .sort(function (a, b) {
            // Simple sorting by timestamp (in a real app this would be proper date comparison)
            if (a.timestamp.includes("m") && b.timestamp.includes("h"))
                return -1;
            if (a.timestamp.includes("h") && b.timestamp.includes("d"))
                return -1;
            if (a.timestamp.includes("m") && b.timestamp.includes("d"))
                return -1;
            return 0;
        });
    }
    // Default "top" filter - search in all content
    var userResults = exports.mockUsers
        .filter(function (user) {
        return user.name.toLowerCase().includes(normalizedQuery) ||
            user.username.toLowerCase().includes(normalizedQuery) ||
            user.bio.toLowerCase().includes(normalizedQuery);
    })
        .slice(0, 2)
        .map(function (user) { return (__assign(__assign({}, user), { type: 'user' })); });
    var postResults = exports.mockPosts
        .filter(function (post) {
        var _a;
        return post.content.toLowerCase().includes(normalizedQuery) ||
            post.author.name.toLowerCase().includes(normalizedQuery) ||
            post.author.username.toLowerCase().includes(normalizedQuery) || ((_a = post.hashtags) === null || _a === void 0 ? void 0 : _a.some(function (tag) { return tag.toLowerCase().includes(normalizedQuery); }));
    })
        .sort(function (a, b) { return (b.stats.likes + b.stats.recasts) - (a.stats.likes + a.stats.recasts); })
        .slice(0, 3)
        .map(function (post) { return (__assign(__assign({}, post), { type: 'post' })); });
    var topicResults = exports.mockTopics
        .filter(function (topic) {
        return topic.name.toLowerCase().includes(normalizedQuery) ||
            topic.description.toLowerCase().includes(normalizedQuery);
    })
        .slice(0, 2)
        .map(function (topic) { return (__assign(__assign({}, topic), { type: 'topic' })); });
    return __spreadArrays(userResults, postResults, topicResults);
}
exports.getMockSearchResults = getMockSearchResults;
