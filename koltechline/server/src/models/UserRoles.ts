import mongoose, { Document, Schema } from 'mongoose';

/**
 * Интерфейс для ролей пользователя
 * Пользователь может иметь несколько ролей одновременно
 */
export interface IUserRoles extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Основные роли
  isFreelancer: boolean;
  isClient: boolean;
  isStartuper: boolean;
  isInvestor: boolean;
  
  // Профили для каждой роли
  freelancerProfile?: {
    skills: string[];
    hourlyRate?: number;
    experience?: string;
    portfolio?: string[];
    completedProjects?: number;
    rating?: number;
    specialization?: string[];
    availability?: 'full-time' | 'part-time' | 'weekends' | 'evenings';
  };
  
  clientProfile?: {
    industry?: string;
    companySize?: string;
    projectsPosted?: number;
    projectsCompleted?: number;
    budget?: {
      min: number;
      max: number;
      currency: string;
    };
    preferredSkills?: string[];
  };
  
  startuperProfile?: {
    startups?: mongoose.Types.ObjectId[];
    industry?: string;
    stage?: 'idea' | 'mvp' | 'early-growth' | 'scaling' | 'established';
    teamSize?: number;
    fundingGoal?: number;
    fundingRaised?: number;
    pitchDeck?: string;
    businessPlan?: string;
  };
  
  investorProfile?: {
    investmentFocus?: string[];
    portfolioSize?: number;
    averageInvestment?: number;
    totalInvested?: number;
    preferredStages?: ('idea' | 'mvp' | 'early-growth' | 'scaling' | 'established')[];
    successfulExits?: number;
  };
  
  // Метаданные
  createdAt: Date;
  updatedAt: Date;
}

const userRolesSchema = new Schema<IUserRoles>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Основные роли - по умолчанию все false
  isFreelancer: {
    type: Boolean,
    default: false
  },
  isClient: {
    type: Boolean,
    default: false
  },
  isStartuper: {
    type: Boolean,
    default: false
  },
  isInvestor: {
    type: Boolean,
    default: false
  },
  
  // Профиль фрилансера
  freelancerProfile: {
    skills: [{
      type: String,
      trim: true
    }],
    hourlyRate: {
      type: Number,
      min: 0
    },
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert', 'master']
    },
    portfolio: [{
      type: String
    }],
    completedProjects: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    specialization: [{
      type: String,
      trim: true
    }],
    availability: {
      type: String,
      enum: ['full-time', 'part-time', 'weekends', 'evenings']
    }
  },
  
  // Профиль заказчика
  clientProfile: {
    industry: {
      type: String,
      trim: true
    },
    companySize: {
      type: String,
      enum: ['solo', 'small', 'medium', 'large', 'enterprise']
    },
    projectsPosted: {
      type: Number,
      default: 0
    },
    projectsCompleted: {
      type: Number,
      default: 0
    },
    budget: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    preferredSkills: [{
      type: String,
      trim: true
    }]
  },
  
  // Профиль стартапера
  startuperProfile: {
    startups: [{
      type: Schema.Types.ObjectId,
      ref: 'Startup'
    }],
    industry: {
      type: String,
      trim: true
    },
    stage: {
      type: String,
      enum: ['idea', 'mvp', 'early-growth', 'scaling', 'established']
    },
    teamSize: {
      type: Number,
      min: 1
    },
    fundingGoal: {
      type: Number,
      min: 0
    },
    fundingRaised: {
      type: Number,
      default: 0
    },
    pitchDeck: {
      type: String
    },
    businessPlan: {
      type: String
    }
  },
  
  // Профиль инвестора
  investorProfile: {
    investmentFocus: [{
      type: String,
      trim: true
    }],
    portfolioSize: {
      type: Number,
      default: 0
    },
    averageInvestment: {
      type: Number,
      min: 0
    },
    totalInvested: {
      type: Number,
      default: 0
    },
    preferredStages: [{
      type: String,
      enum: ['idea', 'mvp', 'early-growth', 'scaling', 'established']
    }],
    successfulExits: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Индексы для быстрого поиска
userRolesSchema.index({ userId: 1 });
userRolesSchema.index({ isFreelancer: 1 });
userRolesSchema.index({ isClient: 1 });
userRolesSchema.index({ isStartuper: 1 });
userRolesSchema.index({ isInvestor: 1 });
userRolesSchema.index({ 'freelancerProfile.skills': 1 });
userRolesSchema.index({ 'startuperProfile.industry': 1 });
userRolesSchema.index({ 'investorProfile.investmentFocus': 1 });

// Виртуальное поле для получения активных ролей
userRolesSchema.virtual('activeRoles').get(function() {
  const roles = [];
  if (this.isFreelancer) roles.push('freelancer');
  if (this.isClient) roles.push('client');
  if (this.isStartuper) roles.push('startuper');
  if (this.isInvestor) roles.push('investor');
  return roles;
});

// Метод для проверки наличия роли
userRolesSchema.methods.hasRole = function(role: string): boolean {
  switch (role.toLowerCase()) {
    case 'freelancer': return this.isFreelancer;
    case 'client': return this.isClient;
    case 'startuper': return this.isStartuper;
    case 'investor': return this.isInvestor;
    default: return false;
  }
};

// Метод для добавления роли
userRolesSchema.methods.addRole = function(role: string): void {
  switch (role.toLowerCase()) {
    case 'freelancer': this.isFreelancer = true; break;
    case 'client': this.isClient = true; break;
    case 'startuper': this.isStartuper = true; break;
    case 'investor': this.isInvestor = true; break;
  }
};

// Метод для удаления роли
userRolesSchema.methods.removeRole = function(role: string): void {
  switch (role.toLowerCase()) {
    case 'freelancer': this.isFreelancer = false; break;
    case 'client': this.isClient = false; break;
    case 'startuper': this.isStartuper = false; break;
    case 'investor': this.isInvestor = false; break;
  }
};

export default mongoose.model<IUserRoles>('UserRoles', userRolesSchema);
