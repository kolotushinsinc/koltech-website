import Message, { IMessage } from '../models/Message.js';
import { AppError } from '../middleware/errorHandler.js';
import NotificationService from './NotificationService.js';

interface ToggleReactionResult {
  item: IMessage;
  userReaction: string | null;
  reactions: any[];
  action: 'added' | 'removed';
}

class ReactionService {
  /**
   * Toggle reaction on any item (message or comment)
   */
  async toggleReaction(
    itemId: string,
    userId: string,
    emoji: string,
    itemType: 'message' | 'comment' = 'message'
  ): Promise<ToggleReactionResult> {
    if (!emoji || typeof emoji !== 'string') {
      throw new AppError('Emoji is required', 400);
    }

    const item = await Message.findById(itemId);
    if (!item || item.isDeleted) {
      throw new AppError(`${itemType} not found`, 404);
    }

    // For comments, verify it has a parent
    if (itemType === 'comment' && !item.parentMessage) {
      throw new AppError('This is not a comment', 400);
    }

    // Get current reaction before toggle
    const currentReaction = (item as any).getUserReaction(userId);

    // Toggle reaction
    (item as any).toggleReaction(userId, emoji);
    await item.save();

    // Get new reaction state
    const userReaction = (item as any).getUserReaction(userId);
    const action = userReaction ? 'added' : 'removed';

    // Create notification if adding reaction and not own item
    if (userReaction && item.author.toString() !== userId) {
      await NotificationService.createLikeNotification(
        item.author.toString(),
        userId,
        itemId,
        itemType
      );
    }

    return {
      item,
      userReaction,
      reactions: item.reactions || [],
      action
    };
  }

  /**
   * Add reaction to item
   */
  async addReaction(
    itemId: string,
    userId: string,
    emoji: string,
    itemType: 'message' | 'comment' = 'message'
  ): Promise<IMessage> {
    if (!emoji || typeof emoji !== 'string') {
      throw new AppError('Emoji is required', 400);
    }

    const item = await Message.findById(itemId);
    if (!item || item.isDeleted) {
      throw new AppError(`${itemType} not found`, 404);
    }

    // Add reaction
    (item as any).addReaction(userId, emoji);
    await item.save();

    // Create notification if not own item
    if (item.author.toString() !== userId) {
      await NotificationService.createLikeNotification(
        item.author.toString(),
        userId,
        itemId,
        itemType
      );
    }

    return item;
  }

  /**
   * Remove reaction from item
   */
  async removeReaction(
    itemId: string,
    userId: string,
    emoji: string,
    itemType: 'message' | 'comment' = 'message'
  ): Promise<IMessage> {
    if (!emoji || typeof emoji !== 'string') {
      throw new AppError('Emoji is required', 400);
    }

    const item = await Message.findById(itemId);
    if (!item || item.isDeleted) {
      throw new AppError(`${itemType} not found`, 404);
    }

    // Remove reaction
    (item as any).removeReaction(userId, emoji);
    await item.save();

    return item;
  }

  /**
   * Get user's reaction on an item
   */
  async getUserReaction(itemId: string, userId: string): Promise<string | null> {
    const item = await Message.findById(itemId);
    if (!item || item.isDeleted) {
      return null;
    }

    return (item as any).getUserReaction(userId);
  }

  /**
   * Get all reactions for an item
   */
  async getReactions(itemId: string): Promise<any[]> {
    const item = await Message.findById(itemId);
    if (!item || item.isDeleted) {
      throw new AppError('Item not found', 404);
    }

    return item.reactions || [];
  }

  /**
   * Get reaction statistics for an item
   */
  async getReactionStats(itemId: string): Promise<{
    total: number;
    byEmoji: { [emoji: string]: number };
    topReactions: Array<{ emoji: string; count: number }>;
  }> {
    const item = await Message.findById(itemId);
    if (!item || item.isDeleted) {
      throw new AppError('Item not found', 404);
    }

    const reactions = item.reactions || [];
    const total = reactions.reduce((sum, r) => sum + r.count, 0);
    
    const byEmoji: { [emoji: string]: number } = {};
    reactions.forEach(r => {
      byEmoji[r.emoji] = r.count;
    });

    const topReactions = reactions
      .map(r => ({ emoji: r.emoji, count: r.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      byEmoji,
      topReactions
    };
  }

  /**
   * Check if user has reacted to an item
   */
  async hasUserReacted(itemId: string, userId: string): Promise<boolean> {
    const reaction = await this.getUserReaction(itemId, userId);
    return reaction !== null;
  }

  /**
   * Get all users who reacted with a specific emoji
   */
  async getUsersByReaction(itemId: string, emoji: string): Promise<string[]> {
    const item = await Message.findById(itemId);
    if (!item || item.isDeleted) {
      throw new AppError('Item not found', 404);
    }

    const reaction = item.reactions?.find(r => r.emoji === emoji);
    if (!reaction) {
      return [];
    }

    return reaction.users.map(id => id.toString());
  }

  /**
   * Batch get user reactions for multiple items
   */
  async getBatchUserReactions(
    itemIds: string[],
    userId: string
  ): Promise<Map<string, string | null>> {
    const items = await Message.find({
      _id: { $in: itemIds },
      isDeleted: false
    });

    const reactionsMap = new Map<string, string | null>();

    items.forEach(item => {
      const userReaction = (item as any).getUserReaction(userId);
      reactionsMap.set(item._id.toString(), userReaction);
    });

    // Fill in null for items not found
    itemIds.forEach(id => {
      if (!reactionsMap.has(id)) {
        reactionsMap.set(id, null);
      }
    });

    return reactionsMap;
  }
}

export default new ReactionService();
