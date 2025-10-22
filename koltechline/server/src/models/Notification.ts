import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  recipient: mongoose.Schema.Types.ObjectId;
  sender?: mongoose.Schema.Types.ObjectId;
  type: 'wall_post' | 'wall_author_post' | 'comment' | 'reply' | 'like' | 'contact_request' | 'contact_accepted' | 'wall_invite' | 'wall_admin' | 'kolophone_call' | 'private_message' | 'group_message' | 'report_resolved';
  title: string;
  message: string;
  data: {
    wallId?: string;
    messageId?: string;
    contactId?: string;
    kolophoneId?: string;
    chatId?: string;
    url?: string;
    [key: string]: any;
  };
  isRead: boolean;
  readAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['wall_post', 'wall_author_post', 'comment', 'reply', 'like', 'contact_request', 'contact_accepted', 'wall_invite', 'wall_admin', 'kolophone_call', 'private_message', 'group_message', 'report_resolved'],
    required: [true, 'Notification type is required']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    wallId: String,
    messageId: String,
    contactId: String,
    kolophoneId: String,
    chatId: String,
    url: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  expiresAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual to check if notification is fresh (within 24 hours)
notificationSchema.virtual('isFresh').get(function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
};

notificationSchema.methods.markAsDelivered = function() {
  this.isDelivered = true;
  this.deliveredAt = new Date();
};

// Static methods
notificationSchema.statics.createNotification = async function(data: Partial<INotification>) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

notificationSchema.statics.findUnreadByUser = function(userId: string, limit: number = 50) {
  return this.find({ recipient: userId, isRead: false })
    .populate('sender', 'firstName lastName username avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

notificationSchema.statics.findByUser = function(userId: string, options: any = {}) {
  const query: any = { recipient: userId };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.isRead !== undefined) {
    query.isRead = options.isRead;
  }
  
  return this.find(query)
    .populate('sender', 'firstName lastName username avatar')
    .sort({ createdAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

notificationSchema.statics.markAllAsRead = function(userId: string) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

notificationSchema.statics.getUnreadCount = function(userId: string) {
  return this.countDocuments({ recipient: userId, isRead: false });
};

// Helper function to create different types of notifications
notificationSchema.statics.createWallPostNotification = async function(recipientId: string, senderId: string, wallId: string, messageId: string) {
  const notification = new this({
    recipient: recipientId,
    sender: senderId,
    type: 'wall_post',
    title: 'New Post in Wall',
    message: 'There\'s a new post in a wall you follow',
    data: { wallId, messageId, url: `/koltech-line?wall=${wallId}` }
  });
  return await notification.save();
};

notificationSchema.statics.createLikeNotification = async function(recipientId: string, senderId: string, messageId: string) {
  const notification = new this({
    recipient: recipientId,
    sender: senderId,
    type: 'like',
    title: 'Someone liked your post',
    message: 'Your post received a new like',
    data: { messageId }
  });
  return await notification.save();
};

notificationSchema.statics.createCommentNotification = async function(recipientId: string, senderId: string, messageId: string, parentMessageId: string) {
  const notification = new this({
    recipient: recipientId,
    sender: senderId,
    type: 'comment',
    title: 'New comment on your post',
    message: 'Someone commented on your post',
    data: { messageId, parentMessageId: parentMessageId }
  });
  return await notification.save();
};

notificationSchema.statics.createContactRequestNotification = async function(recipientId: string, senderId: string, contactId: string) {
  const notification = new this({
    recipient: recipientId,
    sender: senderId,
    type: 'contact_request',
    title: 'New Contact Request',
    message: 'Someone wants to connect with you',
    data: { contactId, url: '/contacts' },
    priority: 'high'
  });
  return await notification.save();
};

export default mongoose.model<INotification>('Notification', notificationSchema);