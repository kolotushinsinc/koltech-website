import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  mainImage: string;
  previewImages: string[];
  technologies: string[];
  link: string;
  rating: number;
  featured: boolean;
  status: 'active' | 'completed' | 'on_hold';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Веб-разработка', 'Мобильная разработка', 'AI-решения']
  },
  mainImage: {
    type: String,
    required: true
  },
  previewImages: [{
    type: String
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  link: {
    type: String,
    default: '#'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed', 'on_hold'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model<IProject>('Project', ProjectSchema);