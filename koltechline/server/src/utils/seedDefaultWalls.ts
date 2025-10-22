import Wall from '../models/Wall.js';
import User from '../models/User.js';

export const createDefaultWalls = async () => {
  try {
    // Check if default walls already exist
    const existingWalls = await Wall.find({ isDefault: true });
    if (existingWalls.length > 0) {
      console.log('✅ Default walls already exist');
      return;
    }

    // Create a system user for default walls
    let systemUser = await User.findOne({ username: 'koltech_system' });
    
    if (!systemUser) {
      systemUser = await User.create({
        firstName: 'KolTech',
        lastName: 'System',
        username: 'koltech_system',
        email: 'system@koltech.com',
        password: 'system123',
        role: 'admin',
        isEmailVerified: true,
        bio: 'Official KolTech system account for managing default walls and platform features.'
      });
    }

    const defaultWalls = [
      {
        name: 'Freelance Hub',
        description: 'Connect with top developers, designers, and freelancers. Share opportunities, collaborate on projects, and build your professional network in the freelancing community.',
        category: 'freelance',
        tags: ['freelance', 'development', 'design', 'projects', 'remote', 'contractors'],
        creator: systemUser._id,
        isDefault: true,
        isPublic: true,
        allowKolophone: true,
        allowMemberKolophone: true,
        settings: {
          requireApproval: false,
          allowInvites: true,
          maxMembers: 50000,
          postPermissions: 'members',
          commentPermissions: 'members'
        }
      },
      {
        name: 'Startup Valley',
        description: 'The ultimate community for entrepreneurs, startup founders, and innovators. Share your startup journey, find co-founders, pitch ideas, and connect with investors.',
        category: 'startups',
        tags: ['startup', 'entrepreneur', 'innovation', 'funding', 'mvp', 'business', 'crowdfunding'],
        creator: systemUser._id,
        isDefault: true,
        isPublic: true,
        allowKolophone: true,
        allowMemberKolophone: true,
        settings: {
          requireApproval: false,
          allowInvites: true,
          maxMembers: 75000,
          postPermissions: 'members',
          commentPermissions: 'members'
        }
      },
      {
        name: 'Investment Zone',
        description: 'Professional network for investors, VCs, angel investors, and entrepreneurs seeking funding. Discover investment opportunities, share market insights, and build valuable connections.',
        category: 'investments',
        tags: ['investment', 'venture-capital', 'angel-investor', 'funding', 'portfolio', 'market-analysis'],
        creator: systemUser._id,
        isDefault: true,
        isPublic: true,
        allowKolophone: true,
        allowMemberKolophone: false, // Only admins can start calls in investment discussions
        settings: {
          requireApproval: true, // Investment discussions require approval
          allowInvites: true,
          maxMembers: 25000,
          postPermissions: 'members',
          commentPermissions: 'members'
        }
      }
    ];

    const createdWalls = await Wall.insertMany(defaultWalls);
    
    console.log(`✅ Created ${createdWalls.length} default walls:`);
    createdWalls.forEach(wall => {
      console.log(`   • ${wall.name} (${wall.category})`);
    });

    return createdWalls;
  } catch (error) {
    console.error('❌ Error creating default walls:', error);
    throw error;
  }
};

export const getDefaultWalls = async () => {
  try {
    const walls = await Wall.find({ isDefault: true, isActive: true })
      .populate('creator', 'firstName lastName username')
      .sort({ category: 1 });
    
    return walls;
  } catch (error) {
    console.error('❌ Error fetching default walls:', error);
    throw error;
  }
};

export const ensureDefaultWallsExist = async () => {
  try {
    const defaultWalls = await getDefaultWalls();
    
    if (defaultWalls.length === 0) {
      console.log('🔄 No default walls found, creating them...');
      await createDefaultWalls();
    } else {
      console.log(`✅ Found ${defaultWalls.length} default walls`);
    }
    
    return defaultWalls;
  } catch (error) {
    console.error('❌ Error ensuring default walls exist:', error);
    throw error;
  }
};

// Advanced filtering for IT freelance subcategories
export const createFreelanceSubcategories = async () => {
  try {
    const systemUser = await User.findOne({ username: 'koltech_system' });
    if (!systemUser) {
      throw new Error('System user not found');
    }

    const freelanceSubWalls = [
      {
        name: 'Frontend Development',
        description: 'React, Vue, Angular, and modern frontend technologies. Share projects, find clients, and collaborate with other frontend developers.',
        category: 'freelance',
        tags: ['frontend', 'react', 'vue', 'angular', 'javascript', 'typescript', 'ui', 'responsive'],
        creator: systemUser._id,
        isPublic: true,
        settings: {
          maxMembers: 15000,
          postPermissions: 'members',
          commentPermissions: 'members'
        }
      },
      {
        name: 'Backend Development',
        description: 'Node.js, Python, Java, .NET, and server-side technologies. API development, database design, and backend architecture discussions.',
        category: 'freelance',
        tags: ['backend', 'nodejs', 'python', 'java', 'api', 'database', 'server', 'microservices'],
        creator: systemUser._id,
        isPublic: true,
        settings: {
          maxMembers: 15000,
          postPermissions: 'members',
          commentPermissions: 'members'
        }
      },
      {
        name: 'Mobile Development',
        description: 'iOS, Android, React Native, Flutter, and cross-platform mobile development opportunities and collaboration.',
        category: 'freelance',
        tags: ['mobile', 'ios', 'android', 'react-native', 'flutter', 'swift', 'kotlin', 'cross-platform'],
        creator: systemUser._id,
        isPublic: true,
        settings: {
          maxMembers: 12000,
          postPermissions: 'members',
          commentPermissions: 'members'
        }
      },
      {
        name: 'DevOps & Cloud',
        description: 'AWS, Azure, GCP, Docker, Kubernetes, and infrastructure automation. Connect with DevOps professionals and cloud specialists.',
        category: 'freelance',
        tags: ['devops', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci-cd', 'infrastructure'],
        creator: systemUser._id,
        isPublic: true,
        settings: {
          maxMembers: 10000,
          postPermissions: 'members',
          commentPermissions: 'members'
        }
      }
    ];

    const existingSubWalls = await Wall.find({ 
      name: { $in: freelanceSubWalls.map(w => w.name) } 
    });

    if (existingSubWalls.length === 0) {
      const createdSubWalls = await Wall.insertMany(freelanceSubWalls);
      console.log(`✅ Created ${createdSubWalls.length} freelance subcategory walls`);
      return createdSubWalls;
    } else {
      console.log('✅ Freelance subcategory walls already exist');
      return existingSubWalls;
    }
  } catch (error) {
    console.error('❌ Error creating freelance subcategories:', error);
    throw error;
  }
};