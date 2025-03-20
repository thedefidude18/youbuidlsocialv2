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
exports.updateUserPreferences = exports.generateContentRecommendations = exports.analyzeUserEngagementPatterns = exports.rankPostsForUser = void 0;
// Function to rank posts for a personalized feed
function rankPostsForUser(posts, userProfile) {
    if (!posts.length || !userProfile) {
        return posts;
    }
    // Create a map for quick access to following status
    var followingMap = new Set(userProfile.following);
    // Create a map for topic preferences
    var topicPreferences = new Map();
    userProfile.topicPreferences.forEach(function (pref) {
        topicPreferences.set(pref.topic, pref.weight);
    });
    // Create engagement score map for authors
    var authorEngagementScore = new Map();
    userProfile.engagementHistory.forEach(function (engagement) {
        var currentScore = authorEngagementScore.get(engagement.authorId) || 0;
        // Weight different engagement types differently
        var engagementValue = 1;
        if (engagement.action === "like")
            engagementValue = 2;
        if (engagement.action === "comment")
            engagementValue = 3;
        if (engagement.action === "recast")
            engagementValue = 4;
        // More recent engagements have higher weight
        var daysSinceEngagement = Math.max(1, Math.floor((Date.now() - engagement.timestamp.getTime()) / (1000 * 60 * 60 * 24)));
        var recencyFactor = 1 / Math.sqrt(daysSinceEngagement);
        authorEngagementScore.set(engagement.authorId, currentScore + (engagementValue * recencyFactor));
    });
    // Calculate scores for posts
    var scoredPosts = posts.map(function (post) {
        var score = 0;
        // Base score calculation factors
        // 1. Following status (highest priority)
        if (followingMap.has(post.author.id)) {
            score += 100;
        }
        // 2. Previous engagement with author
        var authorScore = authorEngagementScore.get(post.author.id) || 0;
        score += authorScore * 10;
        // 3. Topic preference based on hashtags
        if (post.hashtags && post.hashtags.length > 0) {
            post.hashtags.forEach(function (tag) {
                var tagPreference = topicPreferences.get(tag) || 0;
                score += tagPreference * 5;
            });
        }
        // 4. Content quality signals
        var engagementRatio = (post.stats.likes + post.stats.comments * 2 + post.stats.recasts * 3) /
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
            post: post,
            score: score
        };
    });
    // Sort posts by score, descending
    scoredPosts.sort(function (a, b) { return b.score - a.score; });
    // Return sorted posts without the score
    return scoredPosts.map(function (item) { return item.post; });
}
exports.rankPostsForUser = rankPostsForUser;
// Function to extract user engagement patterns from history
function analyzeUserEngagementPatterns(userProfile) {
    // Track authors the user has engaged with
    var authorEngagement = new Map();
    // Track topics the user has engaged with
    var topicEngagement = new Map();
    // Track hours of day when user is active
    var hourCounts = Array(24).fill(0);
    // Count engagements for frequency analysis
    var totalEngagements = 0;
    userProfile.engagementHistory.forEach(function (engagement) {
        // Count author engagements
        var authorCount = authorEngagement.get(engagement.authorId) || 0;
        authorEngagement.set(engagement.authorId, authorCount + 1);
        // Count topic engagements
        if (engagement.hashtags) {
            engagement.hashtags.forEach(function (tag) {
                var tagCount = topicEngagement.get(tag) || 0;
                topicEngagement.set(tag, tagCount + 1);
            });
        }
        // Count hour of day
        var hour = engagement.timestamp.getHours();
        hourCounts[hour]++;
        totalEngagements++;
    });
    // Find top authors by engagement
    var favoriteAuthors = __spreadArrays(authorEngagement.entries()).sort(function (a, b) { return b[1] - a[1]; })
        .slice(0, 5)
        .map(function (entry) { return entry[0]; });
    // Find top topics by engagement
    var favoriteTopics = __spreadArrays(topicEngagement.entries()).sort(function (a, b) { return b[1] - a[1]; })
        .slice(0, 10)
        .map(function (entry) { return entry[0]; });
    // Find top 3 active hours
    var activeHours = hourCounts
        .map(function (count, hour) { return ({ hour: hour, count: count }); })
        .sort(function (a, b) { return b.count - a.count; })
        .slice(0, 3)
        .map(function (entry) { return entry.hour; });
    // Determine engagement frequency
    var engagementFrequency = "low";
    var engagementsPerDay = totalEngagements / 30; // Assuming a month of data
    if (engagementsPerDay > 10) {
        engagementFrequency = "high";
    }
    else if (engagementsPerDay > 3) {
        engagementFrequency = "medium";
    }
    return {
        favoriteAuthors: favoriteAuthors,
        favoriteTopics: favoriteTopics,
        activeHours: activeHours,
        engagementFrequency: engagementFrequency
    };
}
exports.analyzeUserEngagementPatterns = analyzeUserEngagementPatterns;
// Function to generate content recommendations based on user patterns
function generateContentRecommendations(posts, userProfile, count) {
    if (count === void 0) { count = 5; }
    var patterns = analyzeUserEngagementPatterns(userProfile);
    var rankedPosts = rankPostsForUser(posts, userProfile);
    // Calculate diversity score to ensure we're not showing too similar content
    var selectedPosts = [];
    var selectedAuthors = new Set();
    var selectedTopics = new Set();
    // Get the top posts but enforce diversity
    for (var _i = 0, rankedPosts_1 = rankedPosts; _i < rankedPosts_1.length; _i++) {
        var post = rankedPosts_1[_i];
        // Skip if we've already selected enough posts
        if (selectedPosts.length >= count)
            break;
        // Enforce author diversity (don't show too many posts from the same author)
        if (selectedAuthors.has(post.author.id) && selectedAuthors.size < count / 2) {
            // Skip this post to ensure diversity, unless we have very few authors
            continue;
        }
        // Enforce topic diversity
        var hasOverlappingTopics = post.hashtags &&
            post.hashtags.some(function (tag) { return selectedTopics.has(tag); }) &&
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
            post.hashtags.forEach(function (tag) { return selectedTopics.add(tag); });
        }
    }
    // If we don't have enough posts after enforcing diversity, just add top ranked posts
    if (selectedPosts.length < count) {
        for (var _a = 0, rankedPosts_2 = rankedPosts; _a < rankedPosts_2.length; _a++) {
            var post = rankedPosts_2[_a];
            if (!selectedPosts.includes(post) && selectedPosts.length < count) {
                selectedPosts.push(post);
            }
        }
    }
    return selectedPosts;
}
exports.generateContentRecommendations = generateContentRecommendations;
// Helper function to estimate minutes since post based on timestamp string
function getMinutesSincePost(timestamp) {
    if (timestamp === "now")
        return 1;
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
function updateUserPreferences(userProfile, engagement) {
    var newProfile = __assign({}, userProfile);
    // Add the new engagement to history
    newProfile.engagementHistory = __spreadArrays([
        engagement
    ], userProfile.engagementHistory).slice(0, 100); // Keep last 100 engagements
    // Update topic preferences
    if (engagement.hashtags) {
        var existingTopics_1 = new Map(userProfile.topicPreferences.map(function (p) { return [p.topic, p]; }));
        engagement.hashtags.forEach(function (tag) {
            var currentPref = existingTopics_1.get(tag);
            if (currentPref) {
                // Increase weight for existing topic
                currentPref.weight = Math.min(10, currentPref.weight + 1);
            }
            else {
                // Add new topic preference
                existingTopics_1.set(tag, { topic: tag, weight: 1 });
            }
        });
        // Convert map back to array
        newProfile.topicPreferences = Array.from(existingTopics_1.values());
    }
    return newProfile;
}
exports.updateUserPreferences = updateUserPreferences;
