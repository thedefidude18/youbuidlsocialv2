// Points system for user engagement rewards
// This is a client-side mock implementation - in a real app this would be server-side

interface UserPoints {
  totalPoints: number;
  level: number;
  postPoints: number;
  likePoints: number;
  commentPoints: number;
  recastPoints: number;
  threadPoints: number;
  pollPoints: number;
  followPoints: number;
  dailyStreak: number;
  lastActivity: string; // ISO string date
  pointsHistory: PointsHistoryEntry[];
}

interface PointsHistoryEntry {
  timestamp: string; // ISO string date
  action: PointsAction;
  points: number;
  meta?: string;
}

export type PointsAction =
  | 'post'
  | 'like'
  | 'comment'
  | 'recast'
  | 'thread'
  | 'poll'
  | 'follow'
  | 'received_like'
  | 'received_comment'
  | 'received_recast'
  | 'received_follow'
  | 'daily_login'
  | 'level_up';

// Points values for different actions
export const POINTS_VALUES = {
  post: 10,
  like: 2,
  comment: 5,
  recast: 5,
  thread: 15, // Creating a thread
  poll: 20,   // Creating a poll
  follow: 3,  // Following a user
  received_like: 1,
  received_comment: 3,
  received_recast: 3,
  received_follow: 2,
  daily_login: 5,
  level_up_bonus: 50
};

// XP needed for each level
const LEVEL_THRESHOLDS = [
  0,      // Level 1: 0 points
  100,    // Level 2: 100 points
  300,    // Level 3: 300 points
  600,    // Level 4: 600 points
  1000,   // Level 5: 1000 points
  1500,   // Level 6: 1500 points
  2200,   // Level 7: 2200 points
  3000,   // Level 8: 3000 points
  4000,   // Level 9: 4000 points
  5500,   // Level 10: 5500 points
  7500,   // Level 11: 7500 points
  10000,  // Level 12: 10000 points
  15000,  // Level 13: 15000 points
  20000,  // Level 14: 20000 points
  30000,  // Level 15: 30000 points
];

// Storage key
const POINTS_STORAGE_KEY = 'warpcast_user_points';

// Mock database of all users' points
const userPointsDatabase: Record<string, UserPoints> = {};

/**
 * Initialize points for a new user
 */
export function initializeUserPoints(userId: string): UserPoints {
  if (userPointsDatabase[userId]) {
    return userPointsDatabase[userId];
  }

  const newUserPoints: UserPoints = {
    totalPoints: 0,
    level: 1,
    postPoints: 0,
    likePoints: 0,
    commentPoints: 0,
    recastPoints: 0,
    threadPoints: 0,
    pollPoints: 0,
    followPoints: 0,
    dailyStreak: 0,
    lastActivity: new Date().toISOString(),
    pointsHistory: []
  };

  userPointsDatabase[userId] = newUserPoints;
  savePointsToStorage();
  return newUserPoints;
}

/**
 * Add points for a user action
 */
export function addPoints(userId: string, action: PointsAction, meta?: string): number {
  if (!userId) return 0;

  // Make sure user exists in the database
  if (!userPointsDatabase[userId]) {
    initializeUserPoints(userId);
  }

  const userPoints = userPointsDatabase[userId];
  const pointsToAdd = POINTS_VALUES[action] || 0;

  userPoints.totalPoints += pointsToAdd;

  // Update specific action point counters
  switch (action) {
    case 'post':
      userPoints.postPoints += pointsToAdd;
      break;
    case 'like':
      userPoints.likePoints += pointsToAdd;
      break;
    case 'comment':
      userPoints.commentPoints += pointsToAdd;
      break;
    case 'recast':
      userPoints.recastPoints += pointsToAdd;
      break;
    case 'thread':
      userPoints.threadPoints += pointsToAdd;
      break;
    case 'poll':
      userPoints.pollPoints += pointsToAdd;
      break;
    case 'follow':
      userPoints.followPoints += pointsToAdd;
      break;
  }

  // Add to history
  userPoints.pointsHistory.push({
    timestamp: new Date().toISOString(),
    action,
    points: pointsToAdd,
    meta
  });

  // Limit history to last 100 events
  if (userPoints.pointsHistory.length > 100) {
    userPoints.pointsHistory = userPoints.pointsHistory.slice(-100);
  }

  // Update last activity
  userPoints.lastActivity = new Date().toISOString();

  // Check for level up
  const newLevel = calculateLevel(userPoints.totalPoints);
  if (newLevel > userPoints.level) {
    // Award level up bonus
    const levelUpBonus = POINTS_VALUES.level_up_bonus;
    userPoints.totalPoints += levelUpBonus;

    // Record the level up
    userPoints.pointsHistory.push({
      timestamp: new Date().toISOString(),
      action: 'level_up',
      points: levelUpBonus,
      meta: `Level ${newLevel}`
    });

    userPoints.level = newLevel;
  }

  // Save to storage
  savePointsToStorage();

  return pointsToAdd;
}

/**
 * Calculate level based on points
 */
function calculateLevel(points: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Get points for a specific user
 */
export function getUserPoints(userId: string): UserPoints | null {
  // Load from storage first
  loadPointsFromStorage();

  return userPointsDatabase[userId] || null;
}

/**
 * Get the next level threshold for a user
 */
export function getNextLevelThreshold(userId: string): { current: number, next: number, progress: number } {
  const userPoints = getUserPoints(userId);
  if (!userPoints) {
    return { current: 0, next: LEVEL_THRESHOLDS[0], progress: 0 };
  }

  const currentLevel = userPoints.level;
  const currentPoints = userPoints.totalPoints;

  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    // Max level reached
    return {
      current: currentPoints,
      next: currentPoints,
      progress: 100
    };
  }

  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1];
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel];
  const pointsInLevel = currentPoints - currentThreshold;
  const levelRange = nextThreshold - currentThreshold;
  const progress = Math.min(Math.round((pointsInLevel / levelRange) * 100), 100);

  return {
    current: currentThreshold,
    next: nextThreshold,
    progress
  };
}

/**
 * Get the leaderboard of users by points
 */
export function getLeaderboard(limit: number = 10): {userId: string, points: number, level: number}[] {
  loadPointsFromStorage();

  return Object.entries(userPointsDatabase)
    .map(([userId, points]) => ({
      userId,
      points: points.totalPoints,
      level: points.level
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

/**
 * Save points data to localStorage
 */
function savePointsToStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(userPointsDatabase));
  } catch (error) {
    console.error('Failed to save points to storage:', error);
  }
}

/**
 * Load points data from localStorage
 */
function loadPointsFromStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(POINTS_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      Object.assign(userPointsDatabase, data);
    }
  } catch (error) {
    console.error('Failed to load points from storage:', error);
  }
}

/**
 * Get total platform points
 */
export function getTotalPlatformPoints(): number {
  loadPointsFromStorage();
  
  return Object.values(userPointsDatabase)
    .reduce((total, user) => total + user.totalPoints, 0);
}
