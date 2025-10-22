import mongoose, { Document, Schema } from 'mongoose';

/**
 * Интерфейс для стартап-проектов
 */
export interface IStartup extends Document {
  name: string;
  tagline: string;
  description: string;
  founderId: mongoose.Types.ObjectId;
  
  // Команда
  team: [{
    userId: mongoose.Types.ObjectId;
    role: string;
    equity?: number;
    joinedAt: Date;
  }];
  
  // Основная информация
  industry: string;
  stage: 'idea' | 'mvp' | 'early-growth' | 'scaling' | 'established';
  foundedAt: Date;
  website?: string;
  logo?: string;
  coverImage?: string;
  location?: string;
  
  // Финансы
  funding: {
    goal?: number;
    raised?: number;
    currency: string;
    valuation?: number;
    equityOffered?: number;
    minInvestment?: number;
  };
  
  // Бизнес-модель
  businessModel?: string;
  revenueStreams?: string[];
  targetMarket?: string;
  competitors?: string[];
  
  // Метрики
  metrics?: {
    users?: number;
    revenue?: number;
    growth?: number;
    churn?: number;
    cac?: number;
    ltv?: number;
    customMetrics?: {
      name: string;
      value: number;
      unit?: string;
    }[];
  };
  
  // Материалы
  pitchDeck?: string;
  businessPlan?: string;
  financialProjections?: string;
  demoVideo?: string;
  
  // Инвестиции
  investments: [{
    investorId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    equityGiven: number;
    date: Date;
    status: 'pending' | 'completed' | 'rejected';
    notes?: string;
  }];
  
  // Интерес инвесторов
  investorInterest: [{
    investorId: mongoose.Types.ObjectId;
    message?: string;
    amount?: number;
    status: 'interested' | 'contacted' | 'negotiating' | 'invested' | 'declined';
    createdAt: Date;
    updatedAt: Date;
  }];
  
  // Вакансии
  jobs: [{
    title: string;
    description: string;
    skills: string[];
    type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'equity';
    location: string;
    remote: boolean;
    salary?: {
      min?: number;
      max?: number;
      currency: string;
    };
    equity?: {
      min?: number;
      max?: number;
    };
    status: 'open' | 'closed' | 'filled';
    createdAt: Date;
    updatedAt: Date;
  }];
  
  // Обновления и новости
  updates: [{
    title: string;
    content: string;
    attachments?: [{
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      url: string;
    }];
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
  }];
  
  // Метаданные
  status: 'active' | 'inactive' | 'funded' | 'acquired' | 'closed';
  visibility: 'public' | 'private' | 'investors_only';
  featured: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const startupSchema = new Schema<IStartup>({
  name: {
    type: String,
    required: [true, 'Startup name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  tagline: {
    type: String,
    required: [true, 'Tagline is required'],
    trim: true,
    maxlength: [200, 'Tagline cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [10000, 'Description cannot be more than 10000 characters']
  },
  founderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Founder ID is required']
  },
  
  // Команда
  team: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    equity: {
      type: Number,
      min: 0,
      max: 100
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Основная информация
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  stage: {
    type: String,
    required: [true, 'Stage is required'],
    enum: ['idea', 'mvp', 'early-growth', 'scaling', 'established'],
    default: 'idea'
  },
  foundedAt: {
    type: Date,
    default: Date.now
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  logo: {
    type: String
  },
  coverImage: {
    type: String
  },
  location: {
    type: String,
    trim: true
  },
  
  // Финансы
  funding: {
    goal: {
      type: Number,
      min: 0
    },
    raised: {
      type: Number,
      min: 0,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'RUB', 'CNY']
    },
    valuation: {
      type: Number,
      min: 0
    },
    equityOffered: {
      type: Number,
      min: 0,
      max: 100
    },
    minInvestment: {
      type: Number,
      min: 0
    }
  },
  
  // Бизнес-модель
  businessModel: {
    type: String,
    trim: true
  },
  revenueStreams: [{
    type: String,
    trim: true
  }],
  targetMarket: {
    type: String,
    trim: true
  },
  competitors: [{
    type: String,
    trim: true
  }],
  
  // Метрики
  metrics: {
    users: {
      type: Number,
      min: 0
    },
    revenue: {
      type: Number,
      min: 0
    },
    growth: {
      type: Number
    },
    churn: {
      type: Number,
      min: 0
    },
    cac: {
      type: Number,
      min: 0
    },
    ltv: {
      type: Number,
      min: 0
    },
    customMetrics: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        trim: true
      }
    }]
  },
  
  // Материалы
  pitchDeck: {
    type: String
  },
  businessPlan: {
    type: String
  },
  financialProjections: {
    type: String
  },
  demoVideo: {
    type: String
  },
  
  // Инвестиции
  investments: [{
    investorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'RUB', 'CNY']
    },
    equityGiven: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'rejected'],
      default: 'pending'
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
  // Интерес инвесторов
  investorInterest: [{
    investorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      enum: ['interested', 'contacted', 'negotiating', 'invested', 'declined'],
      default: 'interested'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Вакансии
  jobs: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    skills: [{
      type: String,
      trim: true
    }],
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'equity'],
      default: 'full-time'
    },
    location: {
      type: String,
      trim: true
    },
    remote: {
      type: Boolean,
      default: false
    },
    salary: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'RUB', 'CNY']
      }
    },
    equity: {
      min: {
        type: Number,
        min: 0,
        max: 100
      },
      max: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'filled'],
      default: 'open'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Обновления и новости
  updates: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    attachments: [{
      filename: {
        type: String,
        required: true
      },
      originalName: {
        type: String,
        required: true
      },
      mimeType: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }],
    isPublic: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Метаданные
  status: {
    type: String,
    enum: ['active', 'inactive', 'funded', 'acquired', 'closed'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'investors_only'],
    default: 'public'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы для быстрого поиска
startupSchema.index({ name: 'text', tagline: 'text', description: 'text' });
startupSchema.index({ founderId: 1 });
startupSchema.index({ industry: 1 });
startupSchema.index({ stage: 1 });
startupSchema.index({ status: 1 });
startupSchema.index({ 'funding.goal': 1 });
startupSchema.index({ 'funding.raised': 1 });
startupSchema.index({ createdAt: -1 });

// Виртуальные поля
startupSchema.virtual('founder', {
  ref: 'User',
  localField: 'founderId',
  foreignField: '_id',
  justOne: true
});

startupSchema.virtual('teamMembers', {
  ref: 'User',
  localField: 'team.userId',
  foreignField: '_id'
});

startupSchema.virtual('investors', {
  ref: 'User',
  localField: 'investments.investorId',
  foreignField: '_id'
});

startupSchema.virtual('interestedInvestors', {
  ref: 'User',
  localField: 'investorInterest.investorId',
  foreignField: '_id'
});

startupSchema.virtual('teamSize').get(function() {
  return this.team ? this.team.length + 1 : 1; // +1 for founder
});

startupSchema.virtual('fundingProgress').get(function() {
  if (!this.funding.goal || this.funding.goal === 0) return 0;
  return (this.funding.raised || 0) / this.funding.goal * 100;
});

// Методы
startupSchema.methods.isTeamMember = function(userId: mongoose.Types.ObjectId): boolean {
  if (this.founderId.toString() === userId.toString()) return true;
  return this.team.some(
    (member: any) => member.userId.toString() === userId.toString()
  );
};

startupSchema.methods.isInvestor = function(userId: mongoose.Types.ObjectId): boolean {
  return this.investments.some(
    (investment: any) => 
      investment.investorId.toString() === userId.toString() && 
      investment.status === 'completed'
  );
};

startupSchema.methods.getTotalEquityDistributed = function(): number {
  let total = 0;
  
  // Founder equity (assumed to be the remainder)
  const founderEquity = 100 - this.team.reduce((sum: number, member: any) => sum + (member.equity || 0), 0);
  total += founderEquity;
  
  // Team equity
  this.team.forEach((member: any) => {
    total += member.equity || 0;
  });
  
  // Investor equity
  this.investments.forEach((investment: any) => {
    if (investment.status === 'completed') {
      total += investment.equityGiven || 0;
    }
  });
  
  return total;
};

export default mongoose.model<IStartup>('Startup', startupSchema);
