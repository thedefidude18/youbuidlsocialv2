import { OrbisDB } from '@orbisdb/orbis-sdk';

export class InteractionService {
  private orbisDB: OrbisDB;
  
  constructor() {
    this.orbisDB = new OrbisDB({
      project: "your-project",
      network: "optimism-sepolia"
    });
  }

  async likePost(postId: string, userId: string) {
    await this.orbisDB.interactions.create({
      type: 'like',
      post_id: postId,
      user_id: userId,
      timestamp: Date.now()
    });
  }

  async getPostWithSocial(postId: string) {
    // Get base post data
    const post = await this.orbisDB.posts
      .findOne({ transaction_hash: postId })
      .include(['likes', 'comments']);
  }
}
