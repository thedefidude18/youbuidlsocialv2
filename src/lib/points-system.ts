import { PointsService } from '@/services/points-service';

type LeaderboardEntry = {
  userId: string;
  points: number;
  level: number;
};

// Calculate level based on points
export const calculateLevel = (points: number): number => {
  return Math.floor(Math.sqrt(points / 100)) + 1;
};

export const getLeaderboard = async (limit: number = 5): Promise<LeaderboardEntry[]> => {
  try {
    const leaderboardData = await PointsService.getLeaderboard(limit);
    
    return leaderboardData.map(entry => ({
      userId: entry.userId,
      points: entry.points,
      level: calculateLevel(entry.points)
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const getUserPoints = async (userId: string): Promise<number> => {
  try {
    const pointsData = await PointsService.getUserPoints(userId);
    return pointsData.total;
  } catch (error) {
    console.error('Error fetching user points:', error);
    return 0;
  }
};

export const getUserLevel = (points: number): number => {
  return calculateLevel(points);
};

export const getNextLevelThreshold = (currentLevel: number): number => {
  return (currentLevel * currentLevel) * 100;
};

export const getProgressToNextLevel = (points: number): number => {
  const currentLevel = calculateLevel(points);
  const currentLevelThreshold = ((currentLevel - 1) * (currentLevel - 1)) * 100;
  const nextLevelThreshold = (currentLevel * currentLevel) * 100;
  
  return ((points - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
};
