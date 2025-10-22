import { Request, Response, NextFunction } from 'express';
import Contact, { IContact } from '../models/Contact.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Send contact request
// @route   POST /api/contacts/request
// @access  Private
export const sendContactRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recipientId, note } = req.body;
    const requesterId = req.user!.id;

    if (requesterId === recipientId) {
      return next(new AppError('Cannot send contact request to yourself', 400));
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return next(new AppError('User not found', 404));
    }

    // Check if contact relationship already exists
    const existingContact = await Contact.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingContact) {
      let message = 'Contact relationship already exists';
      if (existingContact.status === 'pending') {
        message = 'Contact request already pending';
      } else if (existingContact.status === 'accepted') {
        message = 'You are already connected';
      } else if (existingContact.status === 'blocked') {
        message = 'Cannot send contact request';
      }
      return next(new AppError(message, 400));
    }

    // Create contact request
    const contactRequest = await Contact.create({
      requester: requesterId,
      recipient: recipientId,
      note: note || '',
      status: 'pending'
    });

    await contactRequest.populate('requester recipient', 'firstName lastName username avatar');

    // Create notification
    await (Notification as any).createContactRequestNotification(
      recipientId,
      requesterId,
      contactRequest._id.toString()
    );

    const response: ApiResponse<{ contact: IContact }> = {
      success: true,
      data: { contact: contactRequest },
      message: 'Contact request sent successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Respond to contact request
// @route   POST /api/contacts/:id/respond
// @access  Private
export const respondToContactRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action } = req.body; // 'accept' | 'decline' | 'block'
    const contactId = req.params.id;
    const userId = req.user!.id;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return next(new AppError('Contact request not found', 404));
    }

    // Check if user is the recipient
    if (contact.recipient.toString() !== userId) {
      return next(new AppError('Not authorized to respond to this request', 403));
    }

    if (contact.status !== 'pending') {
      return next(new AppError('Contact request already processed', 400));
    }

    // Update contact status
    if (action === 'accept') {
      (contact as any).accept();
    } else if (action === 'decline') {
      (contact as any).decline();
    } else if (action === 'block') {
      (contact as any).block(userId);
    } else {
      return next(new AppError('Invalid action', 400));
    }

    await contact.save();
    await contact.populate('requester recipient', 'firstName lastName username avatar');

    // Create notification if accepted
    if (action === 'accept') {
      await Notification.create({
        recipient: contact.requester,
        sender: userId,
        type: 'contact_accepted',
        title: 'Contact Request Accepted',
        message: 'Your contact request has been accepted',
        data: { contactId: contact._id.toString() }
      });
    }

    const response: ApiResponse<{ contact: IContact }> = {
      success: true,
      data: { contact },
      message: `Contact request ${action}ed successfully`
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get user's contacts
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status = 'accepted' } = req.query;

    let contacts;

    if (status === 'pending') {
      // Get pending requests received by the user
      contacts = await (Contact as any).findPendingRequests(userId);
    } else if (status === 'sent') {
      // Get requests sent by the user
      contacts = await (Contact as any).findSentRequests(userId);
    } else {
      // Get accepted contacts (friends)
      contacts = await (Contact as any).findFriends(userId);
    }

    const response: ApiResponse<{ contacts: IContact[] }> = {
      success: true,
      data: { contacts },
      message: 'Contacts retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Remove contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const removeContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactId = req.params.id;
    const userId = req.user!.id;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    // Check if user is part of this contact relationship
    const isAuthorized = contact.requester.toString() === userId || 
                        contact.recipient.toString() === userId;
    
    if (!isAuthorized) {
      return next(new AppError('Not authorized to remove this contact', 403));
    }

    await Contact.findByIdAndDelete(contactId);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Contact removed successfully' },
      message: 'Contact removed successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Block user
// @route   POST /api/contacts/block/:userId
// @access  Private
export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.userId;
    const userId = req.user!.id;

    if (userId === targetUserId) {
      return next(new AppError('Cannot block yourself', 400));
    }

    // Check if user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return next(new AppError('User not found', 404));
    }

    // Find existing contact or create new one for blocking
    let contact = await Contact.findOne({
      $or: [
        { requester: userId, recipient: targetUserId },
        { requester: targetUserId, recipient: userId }
      ]
    });

    if (contact) {
      (contact as any).block(userId);
      await contact.save();
    } else {
      contact = await Contact.create({
        requester: userId,
        recipient: targetUserId,
        status: 'blocked',
        blockedBy: userId
      });
    }

    const response: ApiResponse<{ contact: IContact }> = {
      success: true,
      data: { contact },
      message: 'User blocked successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Unblock user
// @route   POST /api/contacts/unblock/:userId
// @access  Private
export const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.userId;
    const userId = req.user!.id;

    const contact = await Contact.findOne({
      $or: [
        { requester: userId, recipient: targetUserId },
        { requester: targetUserId, recipient: userId }
      ],
      status: 'blocked',
      blockedBy: userId
    });

    if (!contact) {
      return next(new AppError('No blocked relationship found', 404));
    }

    await Contact.findByIdAndDelete(contact._id);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'User unblocked successfully' },
      message: 'User unblocked successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get contact status with another user
// @route   GET /api/contacts/status/:userId
// @access  Private
export const getContactStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.userId;
    const userId = req.user!.id;

    const status = await (Contact as any).getConnectionStatus(userId, targetUserId);

    const response: ApiResponse<{ status: string }> = {
      success: true,
      data: { status },
      message: 'Contact status retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Search users for contacts
// @route   GET /api/contacts/search
// @access  Private
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, limit = 20 } = req.query;
    const userId = req.user!.id;

    if (!query || (query as string).length < 2) {
      return next(new AppError('Search query must be at least 2 characters', 400));
    }

    // Search users by name, username, or email
    const users = await User.find({
      _id: { $ne: userId }, // Exclude current user
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
    .select('firstName lastName username avatar bio')
    .limit(Number(limit));

    // Get contact status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const status = await (Contact as any).getConnectionStatus(userId, user._id.toString());
        return {
          ...user.toObject(),
          contactStatus: status
        };
      })
    );

    const response: ApiResponse<{ users: any[] }> = {
      success: true,
      data: { users: usersWithStatus },
      message: 'Users found successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};