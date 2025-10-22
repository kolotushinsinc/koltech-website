import mongoose, { Document, Schema } from 'mongoose';

export interface IWallJoinRequest extends Document {
  _id: string;
  user: mongoose.Schema.Types.ObjectId;
  wall: mongoose.Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  reviewedBy?: mongoose.Schema.Types.ObjectId;
  reviewedAt?: Date;
  reviewMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const wallJoinRequestSchema = new Schema<IWallJoinRequest>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  wall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wall',
    required: [true, 'Wall is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewMessage: {
    type: String,
    trim: true,
    maxlength: [500, 'Review message cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure unique requests
wallJoinRequestSchema.index({ user: 1, wall: 1 }, { unique: true });
wallJoinRequestSchema.index({ wall: 1, status: 1 });
wallJoinRequestSchema.index({ user: 1, status: 1 });

// Instance methods
wallJoinRequestSchema.methods.approve = function(reviewerId: string, reviewMessage?: string) {
  this.status = 'approved';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  if (reviewMessage) this.reviewMessage = reviewMessage;
};

wallJoinRequestSchema.methods.reject = function(reviewerId: string, reviewMessage?: string) {
  this.status = 'rejected';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  if (reviewMessage) this.reviewMessage = reviewMessage;
};

// Static methods
wallJoinRequestSchema.statics.findPendingForWall = function(wallId: string) {
  return this.find({ wall: wallId, status: 'pending' })
    .populate('user', 'firstName lastName username avatar bio')
    .sort({ createdAt: 1 });
};

wallJoinRequestSchema.statics.findUserRequests = function(userId: string) {
  return this.find({ user: userId })
    .populate('wall', 'name description category')
    .sort({ createdAt: -1 });
};

wallJoinRequestSchema.statics.hasExistingRequest = function(userId: string, wallId: string) {
  return this.findOne({ 
    user: userId, 
    wall: wallId,
    status: { $in: ['pending', 'approved'] }
  });
};

export default mongoose.model<IWallJoinRequest>('WallJoinRequest', wallJoinRequestSchema);