import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Kolophone, { IKolophone } from '../models/Kolophone.js';
import Wall from '../models/Wall.js';
import Chat from '../models/Chat.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { io } from '../index.js';

// @desc    Start Kolophone call
// @route   POST /api/kolophone/start
// @access  Private
export const startKolophoneCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, targetId, participants, settings } = req.body;
    const userId = req.user!.id;

    // Validate call type and permissions
    if (type === 'wall') {
      const wall = await Wall.findById(targetId);
      if (!wall || !wall.isActive) {
        return next(new AppError('Wall not found', 404));
      }

      if (!wall.allowKolophone) {
        return next(new AppError('Kolophone calls are disabled for this wall', 403));
      }

      // Check if user can start calls in this wall
      if (!wall.allowMemberKolophone && !(wall as any).isAdmin(userId)) {
        return next(new AppError('Only wall admins can start Kolophone calls', 403));
      }

      // Check if user is member
      if (!(wall as any).isMember(userId)) {
        return next(new AppError('You must be a member to start calls in this wall', 403));
      }
    } else if (type === 'private') {
      // For private calls, targetId is the other user's ID
      const connectionStatus = await (Contact as any).getConnectionStatus(userId, targetId);
      if (connectionStatus !== 'accepted') {
        return next(new AppError('Can only call connected contacts', 403));
      }
    } else if (type === 'group') {
      const chat = await Chat.findById(targetId);
      if (!chat || !chat.isActive) {
        return next(new AppError('Chat not found', 404));
      }

      if (!(chat as any).isParticipant(userId)) {
        return next(new AppError('You must be a participant to start calls', 403));
      }

      if (!chat.settings.allowKolophone) {
        return next(new AppError('Kolophone calls are disabled for this chat', 403));
      }
    }

    // Create the call
    const call = await (Kolophone as any).createCall({
      type,
      targetId,
      initiator: userId,
      participants: participants || [],
      settings
    });

    await call.populate('initiator participants.user', 'firstName lastName username avatar');

    // Notify participants
    let notificationPromises: Promise<any>[] = [];
    let socketRooms: string[] = [];

    if (type === 'wall') {
      socketRooms = [`wall_${targetId}`];
      // Don't send individual notifications for wall calls
    } else if (type === 'private') {
      socketRooms = [`user_${targetId}`];
      notificationPromises.push(
        Notification.create({
          recipient: targetId,
          sender: userId,
          type: 'kolophone_call',
          title: 'Incoming Kolophone Call',
          message: 'You have an incoming video call',
          data: { callId: call.callId, type: 'private' }
        })
      );
    } else if (type === 'group') {
      const chat = await Chat.findById(targetId);
      if (chat) {
        const otherParticipants = chat.participants.filter(
          (pid: any) => pid.toString() !== userId
        );
        
        socketRooms = [`chat_${targetId}`];
        notificationPromises = otherParticipants.map((participantId: any) =>
          Notification.create({
            recipient: participantId,
            sender: userId,
            type: 'kolophone_call',
            title: 'Group Call Started',
            message: `${req.user?.firstName} started a Kolophone call`,
            data: { callId: call.callId, type: 'group', chatId: targetId }
          })
        );
      }
    }

    // Send notifications
    await Promise.all(notificationPromises);

    // Emit socket events
    socketRooms.forEach(room => {
      io.to(room).emit('kolophone_call_started', {
        callId: call.callId,
        type,
        targetId,
        initiator: {
          id: userId,
          name: `${req.user?.firstName} ${req.user?.lastName}`,
          username: req.user?.username,
          avatar: req.user?.avatar
        },
        settings: call.settings
      });
    });

    const response: ApiResponse<{ call: IKolophone }> = {
      success: true,
      data: { call },
      message: 'Kolophone call started successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Join Kolophone call
// @route   POST /api/kolophone/:callId/join
// @access  Private
export const joinKolophoneCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;
    const userId = req.user!.id;

    const call = await Kolophone.findOne({ callId })
      .populate('initiator participants.user', 'firstName lastName username avatar');

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    if (call.status === 'ended') {
      return next(new AppError('Call has ended', 400));
    }

    if (!(call as any).canJoin(userId)) {
      return next(new AppError('Cannot join this call', 403));
    }

    // Add user to call if not already a participant
    (call as any).addParticipant(userId);
    (call as any).joinCall(userId);

    await call.save();

    // Emit to other call participants
    io.to(`kolophone_${callId}`).emit('kolophone_user_joined', {
      callId,
      user: {
        id: userId,
        name: `${req.user?.firstName} ${req.user?.lastName}`,
        username: req.user?.username,
        avatar: req.user?.avatar
      }
    });

    const response: ApiResponse<{ call: IKolophone }> = {
      success: true,
      data: { call },
      message: 'Joined call successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Leave Kolophone call
// @route   POST /api/kolophone/:callId/leave
// @access  Private
export const leaveKolophoneCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;
    const userId = req.user!.id;

    const call = await Kolophone.findOne({ callId });

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    (call as any).leaveCall(userId);
    await call.save();

    // Emit to other call participants
    io.to(`kolophone_${callId}`).emit('kolophone_user_left', {
      callId,
      userId
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Left call successfully' },
      message: 'Left call successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    End Kolophone call
// @route   POST /api/kolophone/:callId/end
// @access  Private
export const endKolophoneCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;
    const userId = req.user!.id;

    const call = await Kolophone.findOne({ callId });

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    // Only initiator or admin can end the call
    if (call.initiator.toString() !== userId) {
      return next(new AppError('Only call initiator can end the call', 403));
    }

    (call as any).endCall();
    await call.save();

    // Emit to all call participants
    io.to(`kolophone_${callId}`).emit('kolophone_call_ended', {
      callId,
      endedBy: userId,
      duration: call.metadata.duration
    });

    // Remove all sockets from the call room
    io.in(`kolophone_${callId}`).socketsLeave(`kolophone_${callId}`);

    const response: ApiResponse<{ call: IKolophone }> = {
      success: true,
      data: { call },
      message: 'Call ended successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get call details
// @route   GET /api/kolophone/:callId
// @access  Private
export const getKolophoneCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;
    const userId = req.user!.id;

    const call = await Kolophone.findOne({ callId })
      .populate('initiator participants.user', 'firstName lastName username avatar');

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    // Check if user is participant
    const isParticipant = call.participants.some(
      (p: any) => p.user._id.toString() === userId
    );

    if (!isParticipant) {
      return next(new AppError('Not authorized to view this call', 403));
    }

    const response: ApiResponse<{ call: IKolophone }> = {
      success: true,
      data: { call },
      message: 'Call details retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get user's active calls
// @route   GET /api/kolophone/active
// @access  Private
export const getActiveCalls = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const activeCalls = await (Kolophone as any).findActiveCallsForUser(userId);

    const response: ApiResponse<{ calls: IKolophone[] }> = {
      success: true,
      data: { calls: activeCalls },
      message: 'Active calls retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get call history
// @route   GET /api/kolophone/history
// @access  Private
export const getCallHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { limit = 20 } = req.query;

    const callHistory = await (Kolophone as any).findCallHistory(userId, Number(limit));

    const response: ApiResponse<{ calls: IKolophone[] }> = {
      success: true,
      data: { calls: callHistory },
      message: 'Call history retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Update call settings
// @route   PUT /api/kolophone/:callId/settings
// @access  Private
export const updateCallSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;
    const userId = req.user!.id;
    const { settings } = req.body;

    const call = await Kolophone.findOne({ callId });

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    // Only initiator can update settings
    if (call.initiator.toString() !== userId) {
      return next(new AppError('Only call initiator can update settings', 403));
    }

    if (call.status === 'ended') {
      return next(new AppError('Cannot update settings for ended call', 400));
    }

    // Update settings
    Object.assign(call.settings, settings);
    await call.save();

    // Emit settings update to all participants
    io.to(`kolophone_${callId}`).emit('kolophone_settings_updated', {
      callId,
      settings: call.settings
    });

    const response: ApiResponse<{ call: IKolophone }> = {
      success: true,
      data: { call },
      message: 'Call settings updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get call statistics
// @route   GET /api/kolophone/stats
// @access  Private
export const getCallStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const stats = await Kolophone.aggregate([
      {
        $match: {
          'participants.user': new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          totalDuration: { $sum: '$metadata.duration' },
          callsAsInitiator: {
            $sum: {
              $cond: [{ $eq: ['$initiator', new mongoose.Types.ObjectId(userId)] }, 1, 0]
            }
          },
          averageDuration: { $avg: '$metadata.duration' },
          callsByType: {
            $push: '$type'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalCalls: 1,
          totalDuration: 1,
          callsAsInitiator: 1,
          averageDuration: { $round: ['$averageDuration', 0] },
          callsByType: 1
        }
      }
    ]);

    const response: ApiResponse<{ stats: any }> = {
      success: true,
      data: { stats: stats[0] || {} },
      message: 'Call statistics retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};