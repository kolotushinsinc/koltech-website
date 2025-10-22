import mongoose, { Document, Schema } from 'mongoose';

export interface IWall extends Document {
  _id: string;
  name: string;
  description: string;
  category: 'freelance' | 'startups' | 'investments' | 'technology' | 'custom';
  tags: string[];
  creator: mongoose.Schema.Types.ObjectId;
  admins: mongoose.Schema.Types.ObjectId[];
  members: mongoose.Schema.Types.ObjectId[];
  isDefault: boolean;
  isActive: boolean;
  isPublic: boolean;
  allowKolophone: boolean;
  allowMemberKolophone: boolean;
  memberCount: number;
  settings: {
    requireApproval: boolean;
    allowInvites: boolean;
    maxMembers: number;
    postPermissions: 'all' | 'admins' | 'members';
    commentPermissions: 'all' | 'members';
  };
  avatar?: string;
  banner?: string;
  createdAt: Date;
  updatedAt: Date;
}

const wallSchema = new Schema<IWall>({
  name: {
    type: String,
    required: [true, 'Wall name is required'],
    trim: true,
    maxlength: [100, 'Wall name cannot exceed 100 characters'],
    minlength: [3, 'Wall name must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Wall description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['freelance', 'startups', 'investments', 'technology', 'custom'],
    required: [true, 'Category is required'],
    default: 'custom'
  },
  tags: {
    type: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    default: []
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  admins: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  members: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  allowKolophone: {
    type: Boolean,
    default: true
  },
  allowMemberKolophone: {
    type: Boolean,
    default: false
  },
  memberCount: {
    type: Number,
    default: 0
  },
  settings: {
    requireApproval: {
      type: Boolean,
      default: false
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    maxMembers: {
      type: Number,
      default: 200000
    },
    postPermissions: {
      type: String,
      enum: ['all', 'admins', 'members'],
      default: 'members'
    },
    commentPermissions: {
      type: String,
      enum: ['all', 'members'],
      default: 'members'
    }
  },
  avatar: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
wallSchema.index({ category: 1, isActive: 1 });
wallSchema.index({ tags: 1 });
wallSchema.index({ creator: 1 });
wallSchema.index({ members: 1 });
wallSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for total member count including admins
wallSchema.virtual('totalMembers').get(function() {
  const membersLength = Array.isArray(this.members) ? this.members.length : 0;
  const adminsLength = Array.isArray(this.admins) ? this.admins.length : 0;
  return membersLength + adminsLength;
});

// Pre-save middleware to ensure creator is admin
wallSchema.pre('save', function(next) {
  // Ensure arrays exist
  this.admins = Array.isArray(this.admins) ? this.admins : [];
  this.members = Array.isArray(this.members) ? this.members : [];
  
  if (this.isNew && !this.admins.includes(this.creator)) {
    this.admins.push(this.creator);
  }
  if (this.isNew && !this.members.includes(this.creator)) {
    this.members.push(this.creator);
  }
  this.memberCount = this.members.length;
  next();
});

// Instance methods
wallSchema.methods.addMember = function(userId: string) {
  this.members = Array.isArray(this.members) ? this.members : [];
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    this.memberCount = this.members.length;
  }
};

wallSchema.methods.removeMember = function(userId: string) {
  this.members = Array.isArray(this.members) ? this.members : [];
  this.members = this.members.filter((id: any) => id.toString() !== userId);
  this.memberCount = this.members.length;
};

wallSchema.methods.addAdmin = function(userId: string) {
  this.admins = Array.isArray(this.admins) ? this.admins : [];
  if (!this.admins.includes(userId)) {
    this.admins.push(userId);
  }
  this.addMember(userId);
};

wallSchema.methods.removeAdmin = function(userId: string) {
  this.admins = Array.isArray(this.admins) ? this.admins : [];
  this.admins = this.admins.filter((id: any) => id.toString() !== userId);
};

wallSchema.methods.isMember = function(userId: string) {
  this.members = Array.isArray(this.members) ? this.members : [];
  return this.members.some((id: any) => id.toString() === userId);
};

wallSchema.methods.isAdmin = function(userId: string) {
  this.admins = Array.isArray(this.admins) ? this.admins : [];
  return this.admins.some((id: any) => id.toString() === userId);
};

export default mongoose.model<IWall>('Wall', wallSchema);