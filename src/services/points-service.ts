import { Orbis } from "@orbisclub/orbis-sdk";

export interface PointsAction {
  type: 'LIKE' | 'COMMENT' | 'POST' | 'SHARE';
  points: number;
}

export class PointsService {
  private static POINTS_CONFIG: Record<string, number> = {
    LIKE: 2,
    COMMENT: 5,
    POST: 10,
    SHARE: 3
  };

  private static orbis = new Orbis({
    useLit: false,
    node: "https://node2.orbis.club",
    PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
    CERAMIC_NODE: "https://node2.orbis.club"
  });

  static async addPoints(userId: string, postId: string, action: keyof typeof PointsService.POINTS_CONFIG) {
    try {
      const points = this.POINTS_CONFIG[action];
      
      const res = await this.orbis.createPost({
        body: JSON.stringify({
          points,
          action,
          timestamp: Date.now()
        }),
        context: 'youbuidl:points',
        tags: ['points', userId, postId, action.toLowerCase()]
      });

      if (res.status !== 200) {
        throw new Error('Failed to record points');
      }

      return {
        success: true,
        points,
        streamId: res.doc // Ceramic stream ID
      };
    } catch (error) {
      console.error(`Error adding ${action} points:`, error);
      throw error;
    }
  }

  static async getUserPoints(userId: string) {
    try {
      const { data, error } = await this.orbis.getPosts({
        context: 'youbuidl:points',
        tag: userId
      });

      if (error) throw error;

      const pointsSummary = data.reduce((summary, record) => {
        const content = JSON.parse(record.content.body);
        const action = content.action as keyof typeof PointsService.POINTS_CONFIG;
        
        summary.total += content.points || 0;
        summary.breakdown[action] = (summary.breakdown[action] || 0) + content.points;
        
        return summary;
      }, {
        total: 0,
        breakdown: {} as Record<string, number>
      });

      return pointsSummary;
    } catch (error) {
      console.error('Error fetching user points:', error);
      throw error;
    }
  }

  static async getLeaderboard(limit: number = 10) {
    try {
      const { data, error } = await this.orbis.getPosts({
        context: 'youbuidl:points',
        tag: 'points'
      });

      if (error) throw error;

      // Aggregate points by user
      const userPoints = data.reduce((acc, record) => {
        const content = JSON.parse(record.content.body);
        const userId = record.tags.find(tag => tag !== 'points' && !tag.includes('0x'))!;
        
        acc[userId] = (acc[userId] || 0) + (content.points || 0);
        return acc;
      }, {} as Record<string, number>);

      // Sort and get top users
      return Object.entries(userPoints)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([userId, points]) => ({ userId, points }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  static async getUserActionHistory(userId: string, action?: string) {
    try {
      const { data, error } = await this.orbis.getPosts({
        context: 'youbuidl:points',
        tag: userId
      });

      if (error) throw error;

      return data
        .map(record => {
          const content = JSON.parse(record.content.body);
          return {
            action: content.action,
            points: content.points,
            timestamp: content.timestamp,
            postId: record.tags.find(tag => tag.startsWith('0x')),
            streamId: record.stream_id
          };
        })
        .filter(item => !action || item.action === action)
        .sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw error;
    }
  }
}


