import { Request, Response, NextFunction } from 'express';
import Wall, { IWall } from '../models/Wall.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import WallJoinRequest from '../models/WallJoinRequest.js';
import Notification from '../models/Notification.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Create a new wall
// @route   POST /api/walls
// @access  Private
export const createWall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      category,
      tags,
      isPublic,
      allowKolophone,
      allowMemberKolophone,
      settings
    } = req.body;

    // Check if wall name already exists
    const existingWall = await Wall.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingWall) {
      return next(new AppError('A wall with this name already exists', 400));
    }

    // Create wall
    const wall = await Wall.create({
      name,
      description,
      category: category || 'custom',
      tags: tags || [],
      creator: req.user?.id,
      isPublic: isPublic !== false,
      allowKolophone: allowKolophone !== false,
      allowMemberKolophone: allowMemberKolophone || false,
      settings: {
        requireApproval: settings?.requireApproval || false,
        allowInvites: settings?.allowInvites !== false,
        maxMembers: settings?.maxMembers || 200000,
        postPermissions: settings?.postPermissions || 'members',
        commentPermissions: settings?.commentPermissions || 'members'
      }
    });

    await wall.populate('creator', 'firstName lastName username avatar');

    const response: ApiResponse<{ wall: IWall }> = {
      success: true,
      data: { wall },
      message: 'Wall created successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get all walls with filtering
// @route   GET /api/walls
// @access  Public
export const getWalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      tags,
      search,
      isPublic,
      limit = 20,
      page = 1
    } = req.query;

    // Build query
    const query: any = { isActive: true };

    if (isPublic !== 'false') {
      query.isPublic = true;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const walls = await Wall.find(query)
      .populate('creator', 'firstName lastName username avatar')
      .populate('admins', 'firstName lastName username avatar')
      .sort({ memberCount: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Wall.countDocuments(query);

    const response: ApiResponse<{ walls: IWall[]; pagination: any }> = {
      success: true,
      data: {
        walls,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
          hasNext: skip + walls.length < total,
          hasPrev: Number(page) > 1
        }
      },
      message: 'Walls retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get single wall by ID
// @route   GET /api/walls/:id
// @access  Public
export const getWall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wall = await Wall.findById(req.params.id)
      .populate('creator', 'firstName lastName username avatar')
      .populate('admins', 'firstName lastName username avatar')
      .populate('members', 'firstName lastName username avatar');

    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    // Check if user can access this wall
    if (!wall.isPublic && req.user) {
      const isAuthorized = (wall as any).isMember(req.user.id) || (wall as any).isAdmin(req.user.id);
      if (!isAuthorized) {
        return next(new AppError('Access denied to this private wall', 403));
      }
    } else if (!wall.isPublic && !req.user) {
      return next(new AppError('Authentication required for private walls', 401));
    }

    const response: ApiResponse<{ wall: IWall }> = {
      success: true,
      data: { wall },
      message: 'Wall retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Join a wall
// @route   POST /api/walls/:id/join
// @access  Private
export const joinWall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wall = await Wall.findById(req.params.id);

    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    if ((wall as any).isMember(req.user!.id)) {
      return next(new AppError('You are already a member of this wall', 400));
    }

    // Check if wall has reached max members
    if (wall.members.length >= wall.settings.maxMembers) {
      return next(new AppError('Wall has reached maximum member limit', 400));
    }

    // For walls that require approval, create a join request
    if (wall.settings.requireApproval) {
      // Check if user already has a pending or approved request
      const existingRequest = await (WallJoinRequest as any).hasExistingRequest(req.user!.id, req.params.id);
      
      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          return next(new AppError('Join request already pending approval', 400));
        } else if (existingRequest.status === 'approved') {
          return next(new AppError('You are already a member of this wall', 400));
        }
      }

      // Create join request
      const joinRequest = await WallJoinRequest.create({
        user: req.user!.id,
        wall: req.params.id,
        message: req.body.message || ''
      });

      await joinRequest.populate('user wall', 'firstName lastName username avatar name');

      // Notify wall admins
      const notifications = wall.admins.map((adminId: any) => ({
        recipient: adminId,
        sender: req.user!.id,
        type: 'wall_invite',
        title: 'New Wall Join Request',
        message: `${req.user?.firstName} ${req.user?.lastName} wants to join ${wall.name}`,
        data: {
          wallId: wall._id.toString(),
          requestId: joinRequest._id.toString()
        },
        priority: 'normal'
      }));

      await Notification.insertMany(notifications);

      const response: ApiResponse<{ request: any }> = {
        success: true,
        data: { request: joinRequest },
        message: 'Join request submitted for approval'
      };

      return res.status(201).json(response);
    }

    (wall as any).addMember(req.user!.id);
    await wall.save();

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Successfully joined wall' },
      message: 'Joined wall successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Leave a wall
// @route   POST /api/walls/:id/leave
// @access  Private
export const leaveWall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wall = await Wall.findById(req.params.id);

    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    if (!(wall as any).isMember(req.user!.id)) {
      return next(new AppError('You are not a member of this wall', 400));
    }

    // Check if user is the creator
    if (wall.creator.toString() === req.user!.id) {
      return next(new AppError('Wall creator cannot leave the wall. Transfer ownership or delete the wall instead.', 400));
    }

    (wall as any).removeMember(req.user!.id);
    await wall.save();

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Successfully left wall' },
      message: 'Left wall successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Update wall
// @route   PUT /api/walls/:id
// @access  Private (Admin only)
export const updateWall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wall = await Wall.findById(req.params.id);

    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    // Check if user is admin
    if (!(wall as any).isAdmin(req.user!.id)) {
      return next(new AppError('Only wall admins can update the wall', 403));
    }

    const allowedUpdates = [
      'name', 'description', 'tags', 'isPublic', 'allowKolophone', 
      'allowMemberKolophone', 'settings', 'avatar', 'banner'
    ];
    
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return next(new AppError('Invalid updates', 400));
    }

    // Check if name change conflicts with existing wall
    if (req.body.name && req.body.name !== wall.name) {
      const existingWall = await Wall.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        _id: { $ne: wall._id }
      });

      if (existingWall) {
        return next(new AppError('A wall with this name already exists', 400));
      }
    }

    updates.forEach(update => {
      (wall as any)[update] = req.body[update];
    });

    await wall.save();
    await wall.populate('creator admins members', 'firstName lastName username avatar');

    const response: ApiResponse<{ wall: IWall }> = {
      success: true,
      data: { wall },
      message: 'Wall updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Delete wall
// @route   DELETE /api/walls/:id
// @access  Private (Creator only)
export const deleteWall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wall = await Wall.findById(req.params.id);

    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    // Only creator can delete wall
    if (wall.creator.toString() !== req.user!.id) {
      return next(new AppError('Only the wall creator can delete the wall', 403));
    }

    // Soft delete
    wall.isActive = false;
    await wall.save();

    // Soft delete all messages in this wall
    await Message.updateMany(
      { wall: wall._id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: req.user!.id
        }
      }
    );

    // Also remove any pending join requests
    await WallJoinRequest.deleteMany({ wall: wall._id, status: 'pending' });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Wall deleted successfully' },
      message: 'Wall deleted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get user's walls
// @route   GET /api/walls/my-walls
// @access  Private
export const getMyWalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type = 'member' } = req.query;

    let query: any = { isActive: true };

    if (type === 'created') {
      query.creator = req.user!.id;
    } else if (type === 'admin') {
      query.admins = req.user!.id;
    } else {
      query.members = req.user!.id;
    }

    const walls = await Wall.find(query)
      .populate('creator', 'firstName lastName username avatar')
      .sort({ createdAt: -1 });

    const response: ApiResponse<{ walls: IWall[] }> = {
      success: true,
      data: { walls },
      message: 'User walls retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Promote user to admin
// @route   POST /api/walls/:id/promote/:userId
// @access  Private (Admin only)
export const promoteToAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wall = await Wall.findById(req.params.id);
    const { userId } = req.params;

    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    if (!(wall as any).isAdmin(req.user!.id)) {
      return next(new AppError('Only wall admins can promote members', 403));
    }

    if (!(wall as any).isMember(userId)) {
      return next(new AppError('User must be a member to be promoted', 400));
    }

    if ((wall as any).isAdmin(userId)) {
      return next(new AppError('User is already an admin', 400));
    }

    (wall as any).addAdmin(userId);
    await wall.save();

    // Notify promoted user
    await Notification.create({
      recipient: userId,
      sender: req.user!.id,
      type: 'wall_admin',
      title: 'Promoted to Wall Admin',
      message: `You have been promoted to admin of ${wall.name}`,
      data: { wallId: wall._id.toString() }
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'User promoted to admin successfully' },
      message: 'User promoted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get wall join requests
// @route   GET /api/walls/:id/requests
// @access  Private (Admin only)
export const getWallJoinRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wall = await Wall.findById(req.params.id);

    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    if (!(wall as any).isAdmin(req.user!.id)) {
      return next(new AppError('Only wall admins can view join requests', 403));
    }

    const requests = await (WallJoinRequest as any).findPendingForWall(req.params.id);

    const response: ApiResponse<{ requests: any[] }> = {
      success: true,
      data: { requests },
      message: 'Join requests retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Approve/Reject join request
// @route   POST /api/walls/:id/requests/:requestId/respond
// @access  Private (Admin only)
export const respondToJoinRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action, reviewMessage } = req.body;
    const { id: wallId, requestId } = req.params;

    const wall = await Wall.findById(wallId);
    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    if (!(wall as any).isAdmin(req.user!.id)) {
      return next(new AppError('Only wall admins can respond to join requests', 403));
    }

    const joinRequest = await WallJoinRequest.findById(requestId);
    if (!joinRequest) {
      return next(new AppError('Join request not found', 404));
    }

    if (joinRequest.wall.toString() !== wallId) {
      return next(new AppError('Join request does not belong to this wall', 400));
    }

    if (joinRequest.status !== 'pending') {
      return next(new AppError('Join request already processed', 400));
    }

    if (action === 'approve') {
      (joinRequest as any).approve(req.user!.id, reviewMessage);
      
      // Add user to wall
      (wall as any).addMember(joinRequest.user.toString());
      await wall.save();

      // Notify user of approval
      await Notification.create({
        recipient: joinRequest.user,
        sender: req.user!.id,
        type: 'wall_invite',
        title: 'Wall Join Request Approved',
        message: `Your request to join ${wall.name} has been approved`,
        data: { wallId: wall._id.toString() }
      });

    } else if (action === 'reject') {
      (joinRequest as any).reject(req.user!.id, reviewMessage);

      // Notify user of rejection
      await Notification.create({
        recipient: joinRequest.user,
        sender: req.user!.id,
        type: 'wall_invite',
        title: 'Wall Join Request Rejected',
        message: `Your request to join ${wall.name} has been rejected`,
        data: {
          wallId: wall._id.toString(),
          reason: reviewMessage
        }
      });
    } else {
      return next(new AppError('Invalid action. Use "approve" or "reject"', 400));
    }

    await joinRequest.save();
    await joinRequest.populate('user wall', 'firstName lastName username avatar name');

    const response: ApiResponse<{ request: any }> = {
      success: true,
      data: { request: joinRequest },
      message: `Join request ${action}d successfully`
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Remove member from wall
// @route   DELETE /api/walls/:id/members/:userId
// @access  Private (Admin only)
export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: wallId, userId } = req.params;

    const wall = await Wall.findById(wallId);
    if (!wall || !wall.isActive) {
      return next(new AppError('Wall not found', 404));
    }

    if (!(wall as any).isAdmin(req.user!.id)) {
      return next(new AppError('Only wall admins can remove members', 403));
    }

    if (wall.creator.toString() === userId) {
      return next(new AppError('Cannot remove wall creator', 400));
    }

    if (!(wall as any).isMember(userId)) {
      return next(new AppError('User is not a member of this wall', 400));
    }

    (wall as any).removeMember(userId);
    await wall.save();

    // Notify removed user
    await Notification.create({
      recipient: userId,
      sender: req.user!.id,
      type: 'wall_admin',
      title: 'Removed from Wall',
      message: `You have been removed from ${wall.name}`,
      data: { wallId: wall._id.toString() }
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Member removed successfully' },
      message: 'Member removed successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};