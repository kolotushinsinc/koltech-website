import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category: 'freelance' | 'startups' | 'investments' | 'technology' | 'general';
  color?: string;
  usageCount: number;
  isOfficial: boolean;
  creator?: mongoose.Schema.Types.ObjectId;
  relatedTags: string[];
  aliases: string[];
  metadata: {
    firstUsed: Date;
    lastUsed: Date;
    popularityScore: number;
    trending: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag name cannot exceed 50 characters'],
    minlength: [2, 'Tag name must be at least 2 characters']
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: ['freelance', 'startups', 'investments', 'technology', 'general'],
    default: 'general'
  },
  color: {
    type: String,
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedTags: [{
    type: String,
    lowercase: true
  }],
  aliases: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  metadata: {
    firstUsed: {
      type: Date,
      default: Date.now
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    popularityScore: {
      type: Number,
      default: 0
    },
    trending: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
tagSchema.index({ name: 1 });
tagSchema.index({ slug: 1 }, { unique: true });
tagSchema.index({ category: 1, usageCount: -1 });
tagSchema.index({ usageCount: -1 });
tagSchema.index({ 'metadata.trending': 1, usageCount: -1 });
tagSchema.index({ name: 'text', description: 'text', aliases: 'text' });

// Virtual for display name (capitalized)
tagSchema.virtual('displayName').get(function() {
  return this.name.charAt(0).toUpperCase() + this.name.slice(1);
});

// Pre-save middleware to generate slug
tagSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

// Instance methods
tagSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.metadata.lastUsed = new Date();
  
  // Update popularity score based on recent usage
  const now = Date.now();
  const timeSinceCreation = now - this.metadata.firstUsed.getTime();
  const recentUsageWeight = Math.max(0, 1 - (now - this.metadata.lastUsed.getTime()) / (7 * 24 * 60 * 60 * 1000)); // 7 days decay
  
  this.metadata.popularityScore = this.usageCount * (1 + recentUsageWeight);
};

tagSchema.methods.addRelatedTag = function(tagName: string) {
  if (!this.relatedTags.includes(tagName.toLowerCase()) && tagName.toLowerCase() !== this.name) {
    this.relatedTags.push(tagName.toLowerCase());
  }
};

tagSchema.methods.addAlias = function(alias: string) {
  const aliasLower = alias.toLowerCase().trim();
  if (!this.aliases.includes(aliasLower) && aliasLower !== this.name) {
    this.aliases.push(aliasLower);
  }
};

// Static methods
tagSchema.statics.findOrCreate = async function(tagName: string, category?: string, creatorId?: string) {
  const normalizedName = tagName.toLowerCase().trim();
  
  // First try to find by name or alias
  let tag = await this.findOne({
    $or: [
      { name: normalizedName },
      { aliases: normalizedName }
    ]
  });

  if (!tag) {
    // Create new tag
    tag = new this({
      name: normalizedName,
      category: category || 'general',
      creator: creatorId,
      metadata: {
        firstUsed: new Date(),
        lastUsed: new Date(),
        popularityScore: 1,
        trending: false
      }
    });
    await tag.save();
  }

  return tag;
};

tagSchema.statics.getPopularTags = function(category?: string, limit: number = 20) {
  const query: any = {};
  if (category && category !== 'all') {
    query.category = category;
  }

  return this.find(query)
    .sort({ usageCount: -1, 'metadata.popularityScore': -1 })
    .limit(limit)
    .select('name displayName usageCount category color isOfficial');
};

tagSchema.statics.getTrendingTags = function(limit: number = 10) {
  return this.find({ 'metadata.trending': true })
    .sort({ 'metadata.popularityScore': -1, usageCount: -1 })
    .limit(limit)
    .select('name displayName usageCount category color');
};

tagSchema.statics.searchTags = function(query: string, limit: number = 20) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { aliases: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  })
  .sort({ usageCount: -1 })
  .limit(limit)
  .select('name displayName usageCount category color description');
};

tagSchema.statics.getRelatedTags = async function(tagNames: string[], limit: number = 10) {
  const tags = await this.find({ name: { $in: tagNames } });
  const relatedTagNames = new Set<string>();

  tags.forEach((tag: any) => {
    tag.relatedTags.forEach((relatedTag: string) => {
      if (!tagNames.includes(relatedTag)) {
        relatedTagNames.add(relatedTag);
      }
    });
  });

  return this.find({ name: { $in: Array.from(relatedTagNames) } })
    .sort({ usageCount: -1 })
    .limit(limit)
    .select('name displayName usageCount category color');
};

tagSchema.statics.updateTrendingTags = async function() {
  // Calculate trending tags based on recent usage growth
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // Reset all trending flags
  await this.updateMany({}, { 'metadata.trending': false });
  
  // Find tags that have been used recently and have growing popularity
  const trendingTags = await this.find({
    'metadata.lastUsed': { $gte: oneWeekAgo },
    usageCount: { $gte: 5 } // Minimum usage threshold
  }).sort({ 'metadata.popularityScore': -1 }).limit(20);

  // Mark top trending tags
  const trendingIds = trendingTags.map((tag: any) => tag._id);
  await this.updateMany(
    { _id: { $in: trendingIds } },
    { 'metadata.trending': true }
  );

  return trendingTags;
};

tagSchema.statics.getTagStats = async function(category?: string) {
  const matchStage: any = {};
  if (category && category !== 'all') {
    matchStage.category = category;
  }

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        totalTags: { $sum: 1 },
        totalUsage: { $sum: '$usageCount' },
        averageUsage: { $avg: '$usageCount' },
        officialTags: {
          $sum: { $cond: ['$isOfficial', 1, 0] }
        }
      }
    },
    {
      $sort: { totalUsage: -1 }
    }
  ]);

  return stats;
};

// Middleware to update related tags
tagSchema.post('save', async function(doc) {
  // This could be used to automatically suggest related tags
  // based on co-occurrence in messages/walls
});

export default mongoose.model<ITag>('Tag', tagSchema);