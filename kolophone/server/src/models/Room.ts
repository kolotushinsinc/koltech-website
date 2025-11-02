import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomId: string;
  createdAt: Date;
  participants: string[];
  isActive: boolean;
}

const RoomSchema: Schema = new Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  participants: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model<IRoom>('Room', RoomSchema);
