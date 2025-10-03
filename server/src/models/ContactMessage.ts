import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  company: {
    type: String,
    default: '',
    trim: true
  },
  service: {
    type: String,
    required: true,
    enum: ['web-development', 'mobile-development', 'ai-solutions', 'business-accelerator', 'consulting', 'other']
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);