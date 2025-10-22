import { Request, Response, NextFunction } from 'express';
import Tag, { ITag } from '../models/Tag.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get popular tags
// @route   GET /api/tags/popular
// @access  Public
export const getPopularTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, limit = 20 } = req.query;

    const tags = await (Tag as any).getPopularTags(category as string, Number(limit));

    const response: ApiResponse<{ tags: ITag[] }> = {
      success: true,
      data: { tags },
      message: 'Popular tags retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get trending tags
// @route   GET /api/tags/trending
// @access  Public
export const getTrendingTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 10 } = req.query;

    const tags = await (Tag as any).getTrendingTags(Number(limit));

    const response: ApiResponse<{ tags: ITag[] }> = {
      success: true,
      data: { tags },
      message: 'Trending tags retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Search tags
// @route   GET /api/tags/search
// @access  Public
export const searchTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || (q as string).length < 2) {
      return next(new AppError('Search query must be at least 2 characters', 400));
    }

    const tags = await (Tag as any).searchTags(q as string, Number(limit));

    const response: ApiResponse<{ tags: ITag[] }> = {
      success: true,
      data: { tags },
      message: 'Tag search results retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get related tags
// @route   POST /api/tags/related
// @access  Public
export const getRelatedTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tags, limit = 10 } = req.body;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return next(new AppError('Tags array is required', 400));
    }

    const relatedTags = await (Tag as any).getRelatedTags(tags, Number(limit));

    const response: ApiResponse<{ tags: ITag[] }> = {
      success: true,
      data: { tags: relatedTags },
      message: 'Related tags retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get tag statistics
// @route   GET /api/tags/stats
// @access  Public
export const getTagStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;

    const stats = await (Tag as any).getTagStats(category as string);

    const response: ApiResponse<{ stats: any[] }> = {
      success: true,
      data: { stats },
      message: 'Tag statistics retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Create or update tag
// @route   POST /api/tags
// @access  Private
export const createOrUpdateTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, description, color, aliases, relatedTags } = req.body;
    const userId = req.user!.id;

    const tag = await (Tag as any).findOrCreate(name, category, userId);

    // Update additional properties if provided
    if (description) tag.description = description;
    if (color) tag.color = color;
    if (aliases && Array.isArray(aliases)) {
      aliases.forEach((alias: string) => tag.addAlias(alias));
    }
    if (relatedTags && Array.isArray(relatedTags)) {
      relatedTags.forEach((relatedTag: string) => tag.addRelatedTag(relatedTag));
    }

    // Increment usage
    (tag as any).incrementUsage();
    await tag.save();

    const response: ApiResponse<{ tag: ITag }> = {
      success: true,
      data: { tag },
      message: 'Tag created/updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Update trending tags (Admin only)
// @route   POST /api/tags/update-trending
// @access  Private (Admin)
export const updateTrendingTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new AppError('Access denied. Admin privileges required.', 403));
    }

    const trendingTags = await (Tag as any).updateTrendingTags();

    const response: ApiResponse<{ tags: ITag[]; count: number }> = {
      success: true,
      data: { 
        tags: trendingTags, 
        count: trendingTags.length 
      },
      message: 'Trending tags updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get tag by name/slug
// @route   GET /api/tags/:identifier
// @access  Public
export const getTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier } = req.params;

    const tag = await Tag.findOne({
      $or: [
        { name: identifier.toLowerCase() },
        { slug: identifier.toLowerCase() },
        { aliases: identifier.toLowerCase() }
      ]
    });

    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    const response: ApiResponse<{ tag: ITag }> = {
      success: true,
      data: { tag },
      message: 'Tag retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Update tag (Admin only)
// @route   PUT /api/tags/:id
// @access  Private (Admin)
export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new AppError('Access denied. Admin privileges required.', 403));
    }

    const { id } = req.params;
    const updates = req.body;

    const allowedUpdates = [
      'description', 'category', 'color', 'isOfficial', 
      'relatedTags', 'aliases'
    ];
    
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return next(new AppError('Invalid updates', 400));
    }

    const tag = await Tag.findById(id);
    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    updateKeys.forEach(update => {
      (tag as any)[update] = updates[update];
    });

    await tag.save();

    const response: ApiResponse<{ tag: ITag }> = {
      success: true,
      data: { tag },
      message: 'Tag updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Delete tag (Admin only)
// @route   DELETE /api/tags/:id
// @access  Private (Admin)
export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new AppError('Access denied. Admin privileges required.', 403));
    }

    const { id } = req.params;

    const tag = await Tag.findById(id);
    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    // Check if tag is being used
    if (tag.usageCount > 0) {
      return next(new AppError('Cannot delete tag that is currently in use', 400));
    }

    await Tag.findByIdAndDelete(id);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Tag deleted successfully' },
      message: 'Tag deleted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get all tags with pagination
// @route   GET /api/tags
// @access  Public
export const getAllTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      isOfficial,
      sortBy = 'usageCount',
      order = 'desc',
      limit = 50,
      page = 1,
      search
    } = req.query;

    // Build query
    const query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (isOfficial !== undefined) {
      query.isOfficial = isOfficial === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { aliases: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: any = {};
    sort[sortBy as string] = sortOrder;

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const tags = await Tag.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip(skip)
      .populate('creator', 'firstName lastName username');

    const total = await Tag.countDocuments(query);

    const response: ApiResponse<{ 
      tags: ITag[]; 
      pagination: any;
      total: number;
    }> = {
      success: true,
      data: {
        tags,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
          hasNext: skip + tags.length < total,
          hasPrev: Number(page) > 1
        },
        total
      },
      message: 'Tags retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Helper function to process tags from content
export const processTagsFromContent = async (tags: string[], userId?: string) => {
  const processedTags = [];
  
  for (const tagName of tags) {
    try {
      const tag = await (Tag as any).findOrCreate(tagName.toLowerCase().trim(), 'general', userId);
      (tag as any).incrementUsage();
      await tag.save();
      processedTags.push(tag);
    } catch (error) {
      console.error(`Error processing tag ${tagName}:`, error);
    }
  }
  
  return processedTags;
};