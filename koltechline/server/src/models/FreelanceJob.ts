import mongoose, { Document, Schema } from 'mongoose';

/**
 * Интерфейс для заказов фрилансерам
 */
export interface IFreelanceJob extends Document {
  title: string;
  description: string;
  clientId: mongoose.Types.ObjectId;
  assignedFreelancerId?: mongoose.Types.ObjectId;
  
  // Категории и навыки
  category: string;
  skills: string[];
  
  // Бюджет и сроки
  budget: {
    min?: number;
    max?: number;
    fixed?: number;
    hourlyRate?: number;
    currency: string;
  };
  deadline?: Date;
  estimatedDuration?: {
    value: number;
    unit: 'hours' | 'days' | 'weeks' | 'months';
  };
  
  // Статус заказа
  status: 'draft' | 'open' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  
  // Заявки от фрилансеров
  proposals: [{
    freelancerId: mongoose.Types.ObjectId;
    coverLetter: string;
    price: number;
    estimatedTime: {
      value: number;
      unit: 'hours' | 'days' | 'weeks' | 'months';
    };
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
  }];
  
  // Вложения и файлы
  attachments?: [{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }];
  
  // Результаты работы
  deliverables?: [{
    title: string;
    description: string;
    attachments: [{
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      url: string;
    }];
    submittedAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
    feedback?: string;
  }];
  
  // Отзывы и рейтинги
  reviews?: {
    clientReview?: {
      rating: number;
      comment: string;
      createdAt: Date;
    };
    freelancerReview?: {
      rating: number;
      comment: string;
      createdAt: Date;
    };
  };
  
  // Платежи
  payments?: [{
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'refunded';
    type: 'deposit' | 'milestone' | 'final';
    description?: string;
    createdAt: Date;
  }];
  
  // Метаданные
  visibility: 'public' | 'private' | 'invite_only';
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

const freelanceJobSchema = new Schema<IFreelanceJob>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client ID is required']
  },
  assignedFreelancerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Категории и навыки
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  
  // Бюджет и сроки
  budget: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    },
    fixed: {
      type: Number,
      min: 0
    },
    hourlyRate: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'RUB', 'CNY']
    }
  },
  deadline: {
    type: Date
  },
  estimatedDuration: {
    value: {
      type: Number,
      min: 1
    },
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months']
    }
  },
  
  // Статус заказа
  status: {
    type: String,
    enum: ['draft', 'open', 'in_progress', 'review', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Заявки от фрилансеров
  proposals: [{
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverLetter: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Cover letter cannot be more than 1000 characters']
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedTime: {
      value: {
        type: Number,
        required: true,
        min: 1
      },
      unit: {
        type: String,
        required: true,
        enum: ['hours', 'days', 'weeks', 'months']
      }
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Вложения и файлы
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
  
  // Результаты работы
  deliverables: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
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
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    feedback: {
      type: String,
      trim: true
    }
  }],
  
  // Отзывы и рейтинги
  reviews: {
    clientReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    freelancerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  
  // Платежи
  payments: [{
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
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
    },
    type: {
      type: String,
      required: true,
      enum: ['deposit', 'milestone', 'final']
    },
    description: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Метаданные
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite_only'],
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
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы для быстрого поиска
freelanceJobSchema.index({ title: 'text', description: 'text' });
freelanceJobSchema.index({ clientId: 1 });
freelanceJobSchema.index({ assignedFreelancerId: 1 });
freelanceJobSchema.index({ category: 1 });
freelanceJobSchema.index({ skills: 1 });
freelanceJobSchema.index({ status: 1 });
freelanceJobSchema.index({ 'budget.fixed': 1 });
freelanceJobSchema.index({ 'budget.hourlyRate': 1 });
freelanceJobSchema.index({ createdAt: -1 });

// Виртуальные поля
freelanceJobSchema.virtual('client', {
  ref: 'User',
  localField: 'clientId',
  foreignField: '_id',
  justOne: true
});

freelanceJobSchema.virtual('assignedFreelancer', {
  ref: 'User',
  localField: 'assignedFreelancerId',
  foreignField: '_id',
  justOne: true
});

freelanceJobSchema.virtual('proposalsCount').get(function() {
  return this.proposals ? this.proposals.length : 0;
});

// Методы
freelanceJobSchema.methods.isClientOrFreelancer = function(userId: mongoose.Types.ObjectId): boolean {
  return (
    this.clientId.toString() === userId.toString() ||
    (this.assignedFreelancerId && this.assignedFreelancerId.toString() === userId.toString())
  );
};

freelanceJobSchema.methods.hasProposalFrom = function(freelancerId: mongoose.Types.ObjectId): boolean {
  return this.proposals.some(
    (proposal: any) => proposal.freelancerId.toString() === freelancerId.toString()
  );
};

export default mongoose.model<IFreelanceJob>('FreelanceJob', freelanceJobSchema);
