import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage {
  _id?: string;
  author: mongoose.Schema.Types.ObjectId;
  content: string;
  attachments?: {
    type: 'image' | 'video' | 'file' | 'gif' | 'sticker';
    url: string;
    filename?: string;
    size?: number;
  }[];
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  readBy: {
    user: mongoose.Schema.Types.ObjectId;
    readAt: Date;
  }[];
  createdAt: Date;
}

export interface IChat extends Document {
  _id: string;
  type: 'private' | 'group';
  name?: string;
  description?: string;
  avatar?: string;
  participants: mongoose.Schema.Types.ObjectId[];
  admins: mongoose.Schema.Types.ObjectId[];
  creator: mongoose.Schema.Types.ObjectId;
  messages: IChatMessage[];
  lastMessage?: IChatMessage;
  lastActivity: Date;
  isActive: boolean;
  settings: {
    maxParticipants: number;
    allowInvites: boolean;
    requireApproval: boolean;
    allowFileSharing: boolean;
    allowKolophone: boolean;
  };
  metadata: {
    messageCount: number;
    participantCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'file', 'gif', 'sticker'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    size: Number
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const chatSchema = new Schema<IChat>({
  type: {
    type: String,
    enum: ['private', 'group'],
    required: [true, 'Chat type is required']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Chat name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  avatar: String,
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  messages: [chatMessageSchema],
  lastMessage: chatMessageSchema,
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    maxParticipants: {
      type: Number,
      default: 200000
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    allowKolophone: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    messageCount: {
      type: Number,
      default: 0
    },
    participantCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
chatSchema.index({ participants: 1, lastActivity: -1 });
chatSchema.index({ type: 1, isActive: 1 });
chatSchema.index({ creator: 1 });
chatSchema.index({ 'messages.author': 1, 'messages.createdAt': -1 });

// Method to get unread message count for a user
chatSchema.methods.getUnreadCount = function(userId: string) {
  if (!this.messages) return 0;
  
  const userReadStatus = this.messages.filter((msg: IChatMessage) => {
    const hasRead = msg.readBy.some((read: any) => read.user.toString() === userId);
    return !hasRead && msg.author.toString() !== userId;
  });
  
  return userReadStatus.length;
};

// Pre-save middleware
chatSchema.pre('save', function(next) {
  this.metadata.participantCount = this.participants.length;
  this.metadata.messageCount = this.messages.length;
  
  // For private chats, ensure name is set based on participants
  if (this.type === 'private' && !this.name && this.participants.length === 2) {
    this.name = 'Private Chat';
  }
  
  // Ensure creator is in participants and admins for group chats
  if (this.type === 'group') {
    if (!this.participants.includes(this.creator)) {
      this.participants.push(this.creator);
    }
    if (!this.admins.includes(this.creator)) {
      this.admins.push(this.creator);
    }
  }
  
  next();
});

// Instance methods
chatSchema.methods.addMessage = function(messageData: Partial<IChatMessage>) {
  const message = {
    ...messageData,
    _id: new mongoose.Types.ObjectId(),
    createdAt: new Date(),
    isEdited: false,
    isDeleted: false,
    readBy: [{
      user: messageData.author,
      readAt: new Date()
    }]
  };
  
  this.messages.push(message);
  this.lastMessage = message;
  this.lastActivity = new Date();
  this.metadata.messageCount = this.messages.length;
  
  return message;
};

chatSchema.methods.addParticipant = function(userId: string) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    this.metadata.participantCount = this.participants.length;
  }
};

chatSchema.methods.removeParticipant = function(userId: string) {
  this.participants = this.participants.filter((id: any) => id.toString() !== userId);
  this.admins = this.admins.filter((id: any) => id.toString() !== userId);
  this.metadata.participantCount = this.participants.length;
};

chatSchema.methods.addAdmin = function(userId: string) {
  if (!this.admins.includes(userId)) {
    this.admins.push(userId);
  }
  this.addParticipant(userId);
};

chatSchema.methods.isParticipant = function(userId: string) {
  return this.participants.some((id: any) => id.toString() === userId);
};

chatSchema.methods.isAdmin = function(userId: string) {
  return this.admins.some((id: any) => id.toString() === userId);
};

chatSchema.methods.markAsRead = function(userId: string, messageId?: string) {
  if (messageId) {
    const message = this.messages.id(messageId);
    if (message && !message.readBy.some((read: any) => read.user.toString() === userId)) {
      message.readBy.push({ user: userId as any, readAt: new Date() });
    }
  } else {
    // Mark all messages as read
    this.messages.forEach((message: IChatMessage) => {
      if (!message.readBy.some((read: any) => read.user.toString() === userId)) {
        message.readBy.push({ user: userId as any, readAt: new Date() });
      }
    });
  }
};

// Static methods
chatSchema.statics.findByParticipant = function(userId: string, options: any = {}) {
  const query: any = { 
    participants: userId, 
    isActive: true 
  };
  
  if (options.type) {
    query.type = options.type;
  }
  
  return this.find(query)
    .populate('participants', 'firstName lastName username avatar')
    .populate('creator', 'firstName lastName username avatar')
    .sort({ lastActivity: -1 })
    .limit(options.limit || 50);
};

chatSchema.statics.findPrivateChat = function(userId1: string, userId2: string) {
  return this.findOne({
    type: 'private',
    participants: { $all: [userId1, userId2] },
    isActive: true
  }).populate('participants', 'firstName lastName username avatar');
};

chatSchema.statics.createPrivateChat = async function(userId1: string, userId2: string) {
  console.log('🔍 Looking for existing private chat between:', userId1, 'and', userId2);
  
  try {
    const existingChat = await this.findOne({
      type: 'private',
      participants: { $all: [userId1, userId2] },
      isActive: true
    }).populate('participants', 'firstName lastName username avatar');
    
    if (existingChat) {
      console.log('✅ Found existing chat:', existingChat._id);
      return existingChat;
    }
    
    console.log('🆕 Creating new private chat...');
    const chat = new this({
      type: 'private',
      participants: [userId1, userId2],
      creator: userId1,
      admins: [userId1, userId2],
      messages: [],
      settings: {
        maxParticipants: 2,
        allowInvites: false,
        requireApproval: false,
        allowFileSharing: true,
        allowKolophone: true
      }
    });
    
    const savedChat = await chat.save();
    console.log('✅ Private chat created:', savedChat._id);
    
    // Populate after saving
    await savedChat.populate('participants', 'firstName lastName username avatar');
    return savedChat;
  } catch (error) {
    console.error('❌ Error in createPrivateChat:', error);
    throw error;
  }
};

export default mongoose.model<IChat>('Chat', chatSchema);