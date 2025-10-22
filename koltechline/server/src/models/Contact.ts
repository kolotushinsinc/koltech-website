import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  _id: string;
  requester: mongoose.Schema.Types.ObjectId;
  recipient: mongoose.Schema.Types.ObjectId;
  status: 'pending' | 'accepted' | 'blocked' | 'declined';
  requestedAt: Date;
  respondedAt?: Date;
  blockedBy?: mongoose.Schema.Types.ObjectId;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked', 'declined'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date,
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  note: {
    type: String,
    maxlength: [200, 'Note cannot exceed 200 characters'],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure unique contact relationship
contactSchema.index({ requester: 1, recipient: 1 }, { unique: true });
contactSchema.index({ requester: 1, status: 1 });
contactSchema.index({ recipient: 1, status: 1 });

// Virtual to determine if users are friends
contactSchema.virtual('areFriends').get(function() {
  return this.status === 'accepted';
});

// Pre-save validation to prevent self-contact
contactSchema.pre('save', function(next) {
  if (this.requester.toString() === this.recipient.toString()) {
    return next(new Error('Cannot add yourself as a contact'));
  }
  next();
});

// Instance methods
contactSchema.methods.accept = function() {
  this.status = 'accepted';
  this.respondedAt = new Date();
};

contactSchema.methods.decline = function() {
  this.status = 'declined';
  this.respondedAt = new Date();
};

contactSchema.methods.block = function(blockedBy: string) {
  this.status = 'blocked';
  this.blockedBy = blockedBy;
  this.respondedAt = new Date();
};

// Static methods
contactSchema.statics.findFriends = function(userId: string) {
  return this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  }).populate('requester recipient', 'firstName lastName username avatar');
};

contactSchema.statics.findPendingRequests = function(userId: string) {
  return this.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'firstName lastName username avatar');
};

contactSchema.statics.findSentRequests = function(userId: string) {
  return this.find({
    requester: userId,
    status: 'pending'
  }).populate('recipient', 'firstName lastName username avatar');
};

contactSchema.statics.areConnected = function(userId1: string, userId2: string) {
  return this.findOne({
    $or: [
      { requester: userId1, recipient: userId2 },
      { requester: userId2, recipient: userId1 }
    ]
  });
};

contactSchema.statics.getConnectionStatus = async function(userId1: string, userId2: string) {
  const connection = await this.findOne({
    $or: [
      { requester: userId1, recipient: userId2 },
      { requester: userId2, recipient: userId1 }
    ]
  });
  if (!connection) return 'none';
  return connection.status;
};

export default mongoose.model<IContact>('Contact', contactSchema);