import mongoose, { Document, Schema } from 'mongoose';

export interface IReaction {
  user: mongoose.Types.ObjectId;
  type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
  createdAt: Date;
}

export interface IPost extends Document {
  _id: string;
  author: mongoose.Types.ObjectId;
  content?: string;
  images?: string[];
  videos?: string[];
  documents?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
  type: 'post' | 'project_update' | 'achievement' | 'announcement';
  tags?: string[];
  reactions: IReaction[];
  reactionsCount: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
    total: number;
  };
  comments: mongoose.Types.ObjectId[];
  commentsCount: number;
  shares: mongoose.Types.ObjectId[];
  sharesCount: number;
  views: mongoose.Types.ObjectId[]; // Unique user views
  viewsCount: number;
  visibility: 'public' | 'followers' | 'private';
  isActive: boolean;
  isPinned: boolean;
  metadata?: {
    projectId?: mongoose.Types.ObjectId;
    location?: string;
    linkedUrl?: string;
    mentions?: mongoose.Types.ObjectId[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const reactionSchema = new Schema<IReaction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new Schema<IPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author'],
    index: true
  },
  content: {
    type: String,
    trim: true,
    maxlength: [2000, 'Post content cannot exceed 2000 characters']
  },
  images: [{
    type: String
  }],
  videos: [{
    type: String
  }],
  documents: [{
    filename: String,
    url: String,
    type: String,
    size: Number
  }],
  type: {
    type: String,
    enum: ['post', 'project_update', 'achievement', 'announcement'],
    default: 'post'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  reactions: [reactionSchema],
  reactionsCount: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    haha: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  shares: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  sharesCount: {
    type: Number,
    default: 0
  },
  views: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  viewsCount: {
    type: Number,
    default: 0
  },
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  metadata: {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    linkedUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Invalid URL format']
    },
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ visibility: 1, isActive: 1, createdAt: -1 });
postSchema.index({ content: 'text', tags: 'text' });

// Virtual for engagement rate
postSchema.virtual('engagementRate').get(function() {
  const total = this.reactionsCount.total + this.commentsCount + this.sharesCount;
  return total;
});

// Pre-save middleware to update counts
postSchema.pre('save', function(next) {
  // Update reaction counts
  const reactionCounts = {
    like: 0,
    love: 0,
    haha: 0,
    wow: 0,
    sad: 0,
    angry: 0,
    total: 0
  };

  this.reactions.forEach((reaction: IReaction) => {
    reactionCounts[reaction.type]++;
    reactionCounts.total++;
  });

  this.reactionsCount = reactionCounts;
  this.commentsCount = this.comments ? this.comments.length : 0;
  this.sharesCount = this.shares ? this.shares.length : 0;
  this.viewsCount = this.views ? this.views.length : 0;
  
  next();
});

// Validation to ensure at least one content type exists
postSchema.pre('validate', function(next) {
  const hasContent = this.content && this.content.trim().length > 0;
  const hasImages = this.images && this.images.length > 0;
  const hasVideos = this.videos && this.videos.length > 0;
  const hasDocuments = this.documents && this.documents.length > 0;

  if (!hasContent && !hasImages && !hasVideos && !hasDocuments) {
    return next(new Error('Post must have at least one of: content, images, videos, or documents'));
  }

  next();
});

// Static methods
postSchema.statics.getPublicPosts = function(page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;
  const query = {
    visibility: 'public',
    isActive: true,
    ...filters
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName username avatar profile.rating')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

postSchema.statics.getUserFeed = function(userId: string, following: string[], page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const query = {
    $or: [
      { author: userId },
      { author: { $in: following }, visibility: { $in: ['public', 'followers'] } }
    ],
    isActive: true
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName username avatar profile.rating')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.model<IPost>('Post', postSchema);