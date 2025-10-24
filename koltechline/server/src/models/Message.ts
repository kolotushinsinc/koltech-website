import mongoose, { Document, Schema } from 'mongoose';

export interface IAttachment {
  type: 'image' | 'video' | 'gif' | 'sticker' | 'file';
  url: string;
  filename?: string;
  size?: number;
  mimetype?: string;
  isHLS?: boolean;
}

export interface IReaction {
  emoji: string;
  users: mongoose.Schema.Types.ObjectId[];
  count: number;
}

export interface IMessage extends Document {
  _id: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  wall: mongoose.Schema.Types.ObjectId;
  parentMessage?: mongoose.Schema.Types.ObjectId;
  attachments: IAttachment[];
  tags: string[];
  likes: mongoose.Schema.Types.ObjectId[];
  likesCount: number;
  reactions: IReaction[];
  replies: mongoose.Schema.Types.ObjectId[];
  repliesCount: number;
  isEdited: boolean;
  editedAt?: Date;
  isReported: boolean;
  reportCount: number;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: mongoose.Schema.Types.ObjectId;
  isPinned: boolean;
  pinnedAt?: Date;
  pinnedBy?: mongoose.Schema.Types.ObjectId;
  visibility: 'public' | 'members' | 'admins';
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>({
type: {
    type: String,
    enum: ['image', 'video', 'gif', 'sticker', 'file'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  filename: String,
  size: Number,
  mimetype: String,
  isHLS: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const reactionSchema = new Schema<IReaction>({
  emoji: {
    type: String,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  count: {
    type: Number,
    default: 0
  }
}, { _id: false });

const messageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: false, // Allow empty content if attachments exist
    trim: true,
    maxlength: [5000, 'Message content cannot exceed 5000 characters'],
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message author is required']
  },
  wall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wall',
    required: [true, 'Wall is required']
  },
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  attachments: [attachmentSchema],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  reactions: [reactionSchema],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  repliesCount: {
    type: Number,
    default: 0
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isReported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  pinnedAt: Date,
  pinnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  visibility: {
    type: String,
    enum: ['public', 'members', 'admins'],
    default: 'members'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
messageSchema.index({ wall: 1, createdAt: -1 });
messageSchema.index({ author: 1, createdAt: -1 });
messageSchema.index({ parentMessage: 1 });
messageSchema.index({ tags: 1 });
messageSchema.index({ isDeleted: 1, wall: 1, createdAt: -1 });
messageSchema.index({ isPinned: 1, wall: 1 });
messageSchema.index({ content: 'text', tags: 'text' });

// Virtual to check if message is a reply
messageSchema.virtual('isReply').get(function() {
  return !!this.parentMessage;
});

// Pre-save middleware to update counts
messageSchema.pre('save', function(next) {
  try {
    // Ensure arrays exist and update counts
    this.likes = Array.isArray(this.likes) ? this.likes : [];
    this.replies = Array.isArray(this.replies) ? this.replies : [];
    this.attachments = Array.isArray(this.attachments) ? this.attachments : [];
    this.tags = Array.isArray(this.tags) ? this.tags : [];
    
    this.likesCount = this.likes.length;
    this.repliesCount = this.replies.length;
    
    if (this.isModified('content') && !this.isNew) {
      this.isEdited = true;
      this.editedAt = new Date();
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
messageSchema.methods.addLike = function(userId: string) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    this.likesCount = this.likes.length;
  }
};

messageSchema.methods.removeLike = function(userId: string) {
  this.likes = this.likes.filter((id: any) => id.toString() !== userId);
  this.likesCount = this.likes.length;
};

messageSchema.methods.hasLiked = function(userId: string) {
  return this.likes.some((id: any) => id.toString() === userId);
};

messageSchema.methods.addReply = function(replyId: string) {
  if (!this.replies.includes(replyId)) {
    this.replies.push(replyId);
    this.repliesCount = this.replies.length;
  }
};

messageSchema.methods.removeReply = function(replyId: string) {
  this.replies = this.replies.filter((id: any) => id.toString() !== replyId);
  this.repliesCount = this.replies.length;
};

messageSchema.methods.softDelete = function(deletedBy: string) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
};

messageSchema.methods.pin = function(pinnedBy: string) {
  this.isPinned = true;
  this.pinnedAt = new Date();
  this.pinnedBy = pinnedBy;
};

messageSchema.methods.unpin = function() {
  this.isPinned = false;
  this.pinnedAt = undefined;
  this.pinnedBy = undefined;
};

messageSchema.methods.report = function() {
  this.isReported = true;
  this.reportCount += 1;
};

// Reaction methods
messageSchema.methods.addReaction = function(userId: string, emoji: string) {
  if (!this.reactions) {
    this.reactions = [];
  }
  
  // Find existing reaction for this emoji
  let reaction = this.reactions.find((r: IReaction) => r.emoji === emoji);
  
  if (reaction) {
    // Check if user already reacted with this emoji
    const userIdStr = userId.toString();
    const hasReacted = reaction.users.some((id: any) => id.toString() === userIdStr);
    
    if (!hasReacted) {
      reaction.users.push(userId as any);
      reaction.count = reaction.users.length;
    }
  } else {
    // Create new reaction
    this.reactions.push({
      emoji,
      users: [userId as any],
      count: 1
    });
  }
  
  // Remove user from other reactions (user can only have one reaction per message)
  this.reactions.forEach((r: IReaction) => {
    if (r.emoji !== emoji) {
      const userIdStr = userId.toString();
      r.users = r.users.filter((id: any) => id.toString() !== userIdStr);
      r.count = r.users.length;
    }
  });
  
  // Remove reactions with 0 users
  this.reactions = this.reactions.filter((r: IReaction) => r.count > 0);
};

messageSchema.methods.removeReaction = function(userId: string, emoji: string) {
  if (!this.reactions) {
    return;
  }
  
  const reaction = this.reactions.find((r: IReaction) => r.emoji === emoji);
  
  if (reaction) {
    const userIdStr = userId.toString();
    reaction.users = reaction.users.filter((id: any) => id.toString() !== userIdStr);
    reaction.count = reaction.users.length;
    
    // Remove reaction if no users left
    if (reaction.count === 0) {
      this.reactions = this.reactions.filter((r: IReaction) => r.emoji !== emoji);
    }
  }
};

messageSchema.methods.getUserReaction = function(userId: string): string | null {
  if (!this.reactions) {
    return null;
  }
  
  const userIdStr = userId.toString();
  const reaction = this.reactions.find((r: IReaction) => 
    r.users.some((id: any) => id.toString() === userIdStr)
  );
  
  return reaction ? reaction.emoji : null;
};

messageSchema.methods.toggleReaction = function(userId: string, emoji: string) {
  const currentReaction = this.getUserReaction(userId);
  
  if (currentReaction === emoji) {
    // Remove reaction if clicking the same emoji
    this.removeReaction(userId, emoji);
  } else {
    // Add new reaction (will automatically remove old one)
    this.addReaction(userId, emoji);
  }
};

// Static methods
messageSchema.statics.findByWall = function(wallId: string, options: any = {}) {
  const query: any = { 
    wall: wallId, 
    isDeleted: false,
    parentMessage: null // Only get top-level messages, not replies
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName username avatar')
    .populate('wall', 'name')
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

messageSchema.statics.findReplies = function(messageId: string) {
  return this.find({ parentMessage: messageId, isDeleted: false })
    .populate('author', 'firstName lastName username avatar')
    .sort({ createdAt: 1 });
};

export default mongoose.model<IMessage>('Message', messageSchema);
