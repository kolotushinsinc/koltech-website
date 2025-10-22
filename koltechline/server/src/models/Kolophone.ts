import mongoose, { Document, Schema } from 'mongoose';

export interface IKolophone extends Document {
  _id: string;
  callId: string;
  type: 'wall' | 'private' | 'group';
  targetId: string; // wallId, chatId, or userId for private
  initiator: mongoose.Schema.Types.ObjectId;
  participants: {
    user: mongoose.Schema.Types.ObjectId;
    joinedAt: Date;
    leftAt?: Date;
    status: 'invited' | 'joined' | 'left' | 'declined';
  }[];
  status: 'pending' | 'active' | 'ended';
  maxParticipants: number;
  settings: {
    videoEnabled: boolean;
    audioEnabled: boolean;
    screenShareEnabled: boolean;
    chatEnabled: boolean;
    recordingEnabled: boolean;
    waitingRoom: boolean;
  };
  metadata: {
    duration?: number; // in seconds
    participantCount: number;
    peakParticipants: number;
  };
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const kolophoneSchema = new Schema<IKolophone>({
  callId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['wall', 'private', 'group'],
    required: true
  },
  targetId: {
    type: String,
    required: true
  },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date,
    status: {
      type: String,
      enum: ['invited', 'joined', 'left', 'declined'],
      default: 'invited'
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'ended'],
    default: 'pending'
  },
  maxParticipants: {
    type: Number,
    default: 50,
    max: 100
  },
  settings: {
    videoEnabled: {
      type: Boolean,
      default: true
    },
    audioEnabled: {
      type: Boolean,
      default: true
    },
    screenShareEnabled: {
      type: Boolean,
      default: true
    },
    chatEnabled: {
      type: Boolean,
      default: true
    },
    recordingEnabled: {
      type: Boolean,
      default: false
    },
    waitingRoom: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    duration: Number,
    participantCount: {
      type: Number,
      default: 0
    },
    peakParticipants: {
      type: Number,
      default: 0
    }
  },
  startedAt: Date,
  endedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
kolophoneSchema.index({ callId: 1 });
kolophoneSchema.index({ targetId: 1, type: 1 });
kolophoneSchema.index({ initiator: 1, createdAt: -1 });
kolophoneSchema.index({ status: 1, createdAt: -1 });

// Virtual for call duration
kolophoneSchema.virtual('callDuration').get(function() {
  if (this.startedAt && this.endedAt) {
    return Math.floor((this.endedAt.getTime() - this.startedAt.getTime()) / 1000);
  }
  return 0;
});

// Virtual for active participants
kolophoneSchema.virtual('activeParticipants').get(function() {
  return this.participants.filter(p => p.status === 'joined').length;
});

// Instance methods
kolophoneSchema.methods.addParticipant = function(userId: string) {
  const existingParticipant = this.participants.find(
    (p: any) => p.user.toString() === userId
  );

  if (!existingParticipant) {
    this.participants.push({
      user: userId,
      status: 'invited',
      joinedAt: new Date()
    });
  }

  this.metadata.participantCount = this.participants.length;
};

kolophoneSchema.methods.joinCall = function(userId: string) {
  const participant = this.participants.find(
    (p: any) => p.user.toString() === userId
  );

  if (participant) {
    participant.status = 'joined';
    participant.joinedAt = new Date();
    
    // Update peak participants
    const activeCount = this.participants.filter((p: any) => p.status === 'joined').length;
    if (activeCount > this.metadata.peakParticipants) {
      this.metadata.peakParticipants = activeCount;
    }
  }

  // Start call if it's the first participant joining
  if (this.status === 'pending') {
    this.status = 'active';
    this.startedAt = new Date();
  }
};

kolophoneSchema.methods.leaveCall = function(userId: string) {
  const participant = this.participants.find(
    (p: any) => p.user.toString() === userId
  );

  if (participant && participant.status === 'joined') {
    participant.status = 'left';
    participant.leftAt = new Date();
  }

  // End call if no active participants left
  const activeParticipants = this.participants.filter((p: any) => p.status === 'joined');
  if (activeParticipants.length === 0 && this.status === 'active') {
    this.endCall();
  }
};

kolophoneSchema.methods.endCall = function() {
  this.status = 'ended';
  this.endedAt = new Date();
  
  if (this.startedAt && this.endedAt) {
    this.metadata.duration = Math.floor(
      (this.endedAt.getTime() - this.startedAt.getTime()) / 1000
    );
  }

  // Mark all joined participants as left
  this.participants.forEach((participant: any) => {
    if (participant.status === 'joined') {
      participant.status = 'left';
      participant.leftAt = new Date();
    }
  });
};

kolophoneSchema.methods.canJoin = function(userId: string) {
  if (this.status === 'ended') return false;
  if (this.participants.length >= this.maxParticipants) return false;
  
  const participant = this.participants.find(
    (p: any) => p.user.toString() === userId
  );
  
  return !participant || participant.status !== 'declined';
};

// Static methods
kolophoneSchema.statics.createCall = async function(data: {
  type: 'wall' | 'private' | 'group';
  targetId: string;
  initiator: string;
  participants?: string[];
  settings?: any;
}) {
  const callId = `kolophone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const participants = [data.initiator];
  if (data.participants) {
    participants.push(...data.participants.filter(id => id !== data.initiator));
  }

  const call = new this({
    callId,
    type: data.type,
    targetId: data.targetId,
    initiator: data.initiator,
    participants: participants.map(userId => ({
      user: userId,
      status: userId === data.initiator ? 'joined' : 'invited'
    })),
    settings: {
      videoEnabled: true,
      audioEnabled: true,
      screenShareEnabled: true,
      chatEnabled: true,
      recordingEnabled: false,
      waitingRoom: false,
      ...data.settings
    },
    maxParticipants: data.type === 'private' ? 2 : 50
  });

  return await call.save();
};

kolophoneSchema.statics.findActiveCallsForUser = function(userId: string) {
  return this.find({
    'participants.user': userId,
    'participants.status': 'joined',
    status: 'active'
  }).populate('initiator participants.user', 'firstName lastName username avatar');
};

kolophoneSchema.statics.findCallHistory = function(userId: string, limit: number = 20) {
  return this.find({
    'participants.user': userId,
    status: 'ended'
  })
  .populate('initiator participants.user', 'firstName lastName username avatar')
  .sort({ endedAt: -1 })
  .limit(limit);
};

export default mongoose.model<IKolophone>('Kolophone', kolophoneSchema);