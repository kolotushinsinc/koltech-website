import { Request, Response, NextFunction } from 'express';
import Wall from '../models/Wall.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import Chat from '../models/Chat.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Global search across all entities
// @route   GET /api/search/global
// @access  Public
export const globalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      q, 
      category, 
      limit = 20, 
      page = 1,
      sortBy = 'relevance',
      dateFrom,
      dateTo,
      includeEntities = 'all'
    } = req.query;

    if (!q || (q as string).length < 2) {
      return next(new AppError('Search query must be at least 2 characters', 400));
    }

    const searchQuery = q as string;
    const skip = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    // Build search regex
    const searchRegex = { $regex: searchQuery, $options: 'i' };

    const results: any = {
      walls: [],
      messages: [],
      users: [],
      tags: [],
      chats: [],
      total: 0
    };

    const entityTypes = includeEntities === 'all' 
      ? ['walls', 'messages', 'users', 'tags', 'chats']
      : (includeEntities as string).split(',');

    // Search walls
    if (entityTypes.includes('walls')) {
      const wallQuery: any = {
        isActive: true,
        isPublic: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ]
      };

      if (category && category !== 'all') {
        wallQuery.category = category;
      }

      const walls = await Wall.find(wallQuery)
        .populate('creator', 'firstName lastName username avatar')
        .sort(sortBy === 'date' ? { createdAt: -1 } : { memberCount: -1 })
        .limit(limitNum)
        .skip(skip);

      results.walls = walls.map(wall => ({
        ...wall.toObject(),
        type: 'wall',
        relevanceScore: calculateRelevanceScore(searchQuery, [wall.name, wall.description, ...(wall.tags || [])])
      }));
    }

    // Search messages
    if (entityTypes.includes('messages')) {
      const messageQuery: any = {
        isDeleted: false,
        $or: [
          { content: searchRegex },
          { tags: searchRegex }
        ]
      };

      if (dateFrom || dateTo) {
        messageQuery.createdAt = {};
        if (dateFrom) messageQuery.createdAt.$gte = new Date(dateFrom as string);
        if (dateTo) messageQuery.createdAt.$lte = new Date(dateTo as string);
      }

      const messages = await Message.find(messageQuery)
        .populate('author', 'firstName lastName username avatar')
        .populate('wall', 'name isPublic')
        .sort(sortBy === 'date' ? { createdAt: -1 } : { likesCount: -1 })
        .limit(limitNum)
        .skip(skip);

      // Filter out messages from private walls for unauthenticated users
      const filteredMessages = messages.filter(message => 
        message.wall && (message.wall as any).isPublic
      );

      results.messages = filteredMessages.map(message => ({
        ...message.toObject(),
        type: 'message',
        relevanceScore: calculateRelevanceScore(searchQuery, [message.content, ...(message.tags || [])])
      }));
    }

    // Search users
    if (entityTypes.includes('users')) {
      const userQuery: any = {
        isActive: true,
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { username: searchRegex },
          { bio: searchRegex },
          { skills: searchRegex }
        ]
      };

      const users = await User.find(userQuery)
        .select('firstName lastName username avatar bio skills location role')
        .sort(sortBy === 'date' ? { createdAt: -1 } : { 'profile.followers': -1 })
        .limit(limitNum)
        .skip(skip);

      results.users = users.map(user => ({
        ...user.toObject(),
        type: 'user',
        relevanceScore: calculateRelevanceScore(searchQuery, [
          user.firstName || '', 
          user.lastName || '', 
          user.username || '', 
          user.bio || '',
          ...(user.skills || [])
        ])
      }));
    }

    // Search tags
    if (entityTypes.includes('tags')) {
      const tags = await (Tag as any).searchTags(searchQuery, limitNum);
      results.tags = tags.map((tag: any) => ({
        ...tag.toObject(),
        type: 'tag',
        relevanceScore: calculateRelevanceScore(searchQuery, [tag.name, tag.description || '', ...(tag.aliases || [])])
      }));
    }

    // Search chats (only for authenticated users)
    if (entityTypes.includes('chats') && req.user) {
      const chatQuery: any = {
        isActive: true,
        participants: req.user.id,
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      };

      const chats = await Chat.find(chatQuery)
        .populate('participants creator', 'firstName lastName username avatar')
        .sort({ lastActivity: -1 })
        .limit(limitNum)
        .skip(skip);

      results.chats = chats.map(chat => ({
        ...chat.toObject(),
        type: 'chat',
        relevanceScore: calculateRelevanceScore(searchQuery, [chat.name || '', chat.description || ''])
      }));
    }

    // Calculate total results
    results.total = results.walls.length + results.messages.length + 
                   results.users.length + results.tags.length + results.chats.length;

    // Sort all results by relevance if requested
    if (sortBy === 'relevance') {
      const allResults = [
        ...results.walls,
        ...results.messages,
        ...results.users,
        ...results.tags,
        ...results.chats
      ].sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Redistribute sorted results
      results.mixed = allResults.slice(0, limitNum);
    }

    const response: ApiResponse<any> = {
      success: true,
      data: results,
      message: `Found ${results.total} results for "${searchQuery}"`
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Advanced search with filters
// @route   POST /api/search/advanced
// @access  Public
export const advancedSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      query,
      entityTypes = ['walls', 'messages', 'users'],
      filters = {},
      sortBy = 'relevance',
      limit = 20,
      page = 1
    } = req.body;

    if (!query || query.length < 2) {
      return next(new AppError('Search query must be at least 2 characters', 400));
    }

    const skip = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);
    const results: any = {};

    // Advanced search for walls
    if (entityTypes.includes('walls')) {
      const wallQuery: any = {
        isActive: true,
        isPublic: true,
        $text: { $search: query }
      };

      // Apply filters
      if (filters.category) wallQuery.category = filters.category;
      if (filters.tags) wallQuery.tags = { $in: filters.tags };
      if (filters.minMembers) wallQuery.memberCount = { $gte: filters.minMembers };
      if (filters.maxMembers) {
        wallQuery.memberCount = wallQuery.memberCount || {};
        wallQuery.memberCount.$lte = filters.maxMembers;
      }
      if (filters.dateFrom || filters.dateTo) {
        wallQuery.createdAt = {};
        if (filters.dateFrom) wallQuery.createdAt.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) wallQuery.createdAt.$lte = new Date(filters.dateTo);
      }

      const walls = await Wall.find(wallQuery, { score: { $meta: 'textScore' } })
        .populate('creator', 'firstName lastName username avatar')
        .sort(sortBy === 'relevance' ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .limit(limitNum)
        .skip(skip);

      results.walls = walls;
    }

    // Advanced search for messages
    if (entityTypes.includes('messages')) {
      const messageQuery: any = {
        isDeleted: false,
        $text: { $search: query }
      };

      // Apply filters
      if (filters.wallId) messageQuery.wall = filters.wallId;
      if (filters.userId) messageQuery.author = filters.userId;
      if (filters.tags) messageQuery.tags = { $in: filters.tags };
      if (filters.hasAttachments) messageQuery.attachments = { $exists: true, $ne: [] };
      if (filters.minLikes) messageQuery.likesCount = { $gte: filters.minLikes };
      if (filters.dateFrom || filters.dateTo) {
        messageQuery.createdAt = {};
        if (filters.dateFrom) messageQuery.createdAt.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) messageQuery.createdAt.$lte = new Date(filters.dateTo);
      }

      const messages = await Message.find(messageQuery, { score: { $meta: 'textScore' } })
        .populate('author', 'firstName lastName username avatar')
        .populate('wall', 'name isPublic')
        .sort(sortBy === 'relevance' ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .limit(limitNum)
        .skip(skip);

      // Filter out messages from private walls
      results.messages = messages.filter(message => 
        message.wall && (message.wall as any).isPublic
      );
    }

    // Advanced search for users
    if (entityTypes.includes('users')) {
      const userQuery: any = {
        isActive: true,
        $text: { $search: query }
      };

      // Apply filters
      if (filters.role) userQuery.role = filters.role;
      if (filters.location) userQuery.location = { $regex: filters.location, $options: 'i' };
      if (filters.skills) userQuery.skills = { $in: filters.skills };
      if (filters.minRating) userQuery['profile.rating'] = { $gte: filters.minRating };
      if (filters.verified) userQuery.isEmailVerified = filters.verified;

      const users = await User.find(userQuery, { score: { $meta: 'textScore' } })
        .select('firstName lastName username avatar bio skills location role profile')
        .sort(sortBy === 'relevance' ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .limit(limitNum)
        .skip(skip);

      results.users = users;
    }

    const totalResults = Object.values(results).reduce((sum: number, arr: any) => sum + (arr?.length || 0), 0);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        ...results,
        total: totalResults,
        query,
        filters,
        pagination: {
          current: Number(page),
          limit: limitNum,
          total: totalResults
        }
      },
      message: `Advanced search completed with ${totalResults} results`
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || (q as string).length < 1) {
      return next(new AppError('Query parameter is required', 400));
    }

    const searchQuery = q as string;
    const limitNum = Number(limit);
    const suggestions: any[] = [];

    // Get wall suggestions
    const walls = await Wall.find({
      isActive: true,
      isPublic: true,
      name: { $regex: searchQuery, $options: 'i' }
    })
    .select('name category')
    .sort({ memberCount: -1 })
    .limit(limitNum);

    walls.forEach(wall => {
      suggestions.push({
        type: 'wall',
        text: wall.name,
        category: wall.category,
        icon: 'walls'
      });
    });

    // Get tag suggestions
    const tags = await Tag.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { aliases: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .select('name category usageCount')
    .sort({ usageCount: -1 })
    .limit(limitNum);

    tags.forEach(tag => {
      suggestions.push({
        type: 'tag',
        text: tag.name,
        category: tag.category,
        icon: 'tag',
        usageCount: tag.usageCount
      });
    });

    // Get user suggestions
    const users = await User.find({
      isActive: true,
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .select('firstName lastName username avatar')
    .sort({ 'profile.followers': -1 })
    .limit(limitNum);

    users.forEach(user => {
      suggestions.push({
        type: 'user',
        text: `${user.firstName} ${user.lastName}`.trim() || user.username,
        username: user.username,
        avatar: user.avatar,
        icon: 'user'
      });
    });

    // Sort suggestions by relevance and remove duplicates
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        self.findIndex(s => s.text === suggestion.text && s.type === suggestion.type) === index
      )
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.text.toLowerCase() === searchQuery.toLowerCase() ? 1 : 0;
        const bExact = b.text.toLowerCase() === searchQuery.toLowerCase() ? 1 : 0;
        
        if (aExact !== bExact) return bExact - aExact;
        
        // Then by usage/popularity
        const aUsage = a.usageCount || a.memberCount || 0;
        const bUsage = b.usageCount || b.memberCount || 0;
        
        return bUsage - aUsage;
      })
      .slice(0, limitNum);

    const response: ApiResponse<{ suggestions: any[] }> = {
      success: true,
      data: { suggestions: uniqueSuggestions },
      message: `Found ${uniqueSuggestions.length} suggestions`
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get trending searches
// @route   GET /api/search/trending
// @access  Public
export const getTrendingSearches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 10 } = req.query;

    // Get trending tags as search terms
    const trendingTags = await (Tag as any).getTrendingTags(Number(limit));
    
    // Get popular walls
    const popularWalls = await Wall.find({ 
      isActive: true, 
      isPublic: true 
    })
    .select('name category memberCount')
    .sort({ memberCount: -1 })
    .limit(Number(limit));

    const trending = [
      ...trendingTags.map((tag: any) => ({
        term: tag.name,
        type: 'tag',
        category: tag.category,
        popularity: tag.usageCount
      })),
      ...popularWalls.map(wall => ({
        term: wall.name,
        type: 'wall',
        category: wall.category,
        popularity: wall.memberCount
      }))
    ]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, Number(limit));

    const response: ApiResponse<{ trending: any[] }> = {
      success: true,
      data: { trending },
      message: 'Trending searches retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Helper function to calculate relevance score
const calculateRelevanceScore = (query: string, fields: string[]): number => {
  const queryLower = query.toLowerCase();
  let score = 0;

  fields.forEach(field => {
    if (!field) return;
    
    const fieldLower = field.toLowerCase();
    
    // Exact match gets highest score
    if (fieldLower === queryLower) {
      score += 100;
    }
    // Starts with query gets high score
    else if (fieldLower.startsWith(queryLower)) {
      score += 75;
    }
    // Contains query gets medium score
    else if (fieldLower.includes(queryLower)) {
      score += 50;
    }
    // Fuzzy match gets lower score
    else {
      const words = queryLower.split(' ');
      let wordMatches = 0;
      words.forEach(word => {
        if (fieldLower.includes(word)) {
          wordMatches++;
        }
      });
      score += (wordMatches / words.length) * 25;
    }
  });

  return score;
};