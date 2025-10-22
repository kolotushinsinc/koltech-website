import { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Project.js';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      description,
      category,
      type,
      tags,
      skills,
      images,
      videos,
      externalLinks,
      budget,
      timeline,
      funding,
      visibility,
      location,
      urgency,
      difficulty
    } = req.body;

    const projectData: any = {
      title,
      description,
      category,
      type: type || 'internal',
      owner: req.user?.id,
      tags: tags || [],
      skills: skills || [],
      images: images || [],
      videos: videos || [],
      externalLinks: externalLinks || [],
      visibility: visibility || 'public',
      location,
      urgency: urgency || 'medium',
      difficulty: difficulty || 'intermediate'
    };

    // Add budget if provided
    if (budget) {
      projectData.budget = budget;
    }

    // Add timeline if provided
    if (timeline) {
      projectData.timeline = timeline;
    }

    // Add funding info for crowdfunding projects
    if (type === 'crowdfunding' && funding) {
      projectData.funding = funding;
    }

    const project = await Project.create(projectData);
    
    // Populate owner data
    await project.populate('owner', 'firstName lastName username avatar profile.rating');

    const response: ApiResponse<{ project: IProject }> = {
      success: true,
      data: { project },
      message: 'Project created successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get user's projects
// @route   GET /api/projects/my
// @access  Private
export const getMyProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = { owner: req.user?.id };
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }

    const projects = await Project.find(query)
      .populate('owner', 'firstName lastName username avatar profile.rating')
      .populate('freelancer', 'firstName lastName username avatar profile.rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments(query);
    const pages = Math.ceil(total / Number(limit));

    const response: ApiResponse<{ projects: IProject[] }> = {
      success: true,
      data: { projects },
      message: 'Projects retrieved successfully',
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get all projects (public)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      type, 
      skills, 
      search,
      minBudget,
      maxBudget,
      urgency,
      difficulty 
    } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = {
      status: { $in: ['active', 'in_progress'] },
      isActive: true,
      visibility: 'public'
    };

    // Apply filters
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (urgency) {
      query.urgency = urgency;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray };
    }
    
    if (minBudget || maxBudget) {
      query['budget.amount'] = {};
      if (minBudget) query['budget.amount'].$gte = Number(minBudget);
      if (maxBudget) query['budget.amount'].$lte = Number(maxBudget);
    }

    let projects;
    
    if (search) {
      // Text search
      projects = await Project.find(
        { ...query, $text: { $search: search as string } },
        { score: { $meta: 'textScore' } }
      )
        .populate('owner', 'firstName lastName username avatar profile.rating')
        .populate('freelancer', 'firstName lastName username avatar profile.rating')
        .sort({ score: { $meta: 'textScore' }, isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    } else {
      // Regular query
      projects = await Project.find(query)
        .populate('owner', 'firstName lastName username avatar profile.rating')
        .populate('freelancer', 'firstName lastName username avatar profile.rating')
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    }

    const total = await Project.countDocuments(query);
    const pages = Math.ceil(total / Number(limit));

    const response: ApiResponse<{ projects: IProject[] }> = {
      success: true,
      data: { projects },
      message: 'Projects retrieved successfully',
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'firstName lastName username avatar profile.rating bio location')
      .populate('freelancer', 'firstName lastName username avatar profile.rating bio location')
      .populate('collaborators', 'firstName lastName username avatar profile.rating')
      .populate('applications.freelancer', 'firstName lastName username avatar profile.rating');

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Increment view count if not owner
    if (!req.user || project.owner._id.toString() !== req.user.id) {
      project.views += 1;
      await project.save();
    }

    const response: ApiResponse<{ project: IProject }> = {
      success: true,
      data: { project },
      message: 'Project retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check if user is project owner
    if (project.owner.toString() !== req.user?.id) {
      return next(new AppError('Not authorized to update this project', 403));
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName username avatar profile.rating');

    const response: ApiResponse<{ project: IProject }> = {
      success: true,
      data: { project: updatedProject! },
      message: 'Project updated successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check if user is project owner
    if (project.owner.toString() !== req.user?.id) {
      return next(new AppError('Not authorized to delete this project', 403));
    }

    await Project.findByIdAndDelete(req.params.id);

    const response: ApiResponse<{}> = {
      success: true,
      data: {},
      message: 'Project deleted successfully'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Like/unlike project
// @route   POST /api/projects/:id/like
// @access  Private
export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    const userId = req.user?.id;
    const likeIndex = project.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      project.likes.splice(likeIndex, 1);
    } else {
      // Like
      project.likes.push(userId);
    }

    await project.save();

    const response: ApiResponse<{ liked: boolean; likesCount: number }> = {
      success: true,
      data: { 
        liked: likeIndex === -1,
        likesCount: project.likesCount
      },
      message: likeIndex === -1 ? 'Project liked' : 'Project unliked'
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Apply to project
// @route   POST /api/projects/:id/apply
// @access  Private
export const applyToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { proposal, budget, timeline } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (!project.allowApplications) {
      return next(new AppError('This project is not accepting applications', 400));
    }

    // Check if user already applied
    const existingApplication = project.applications.find(
      app => app.freelancer.toString() === req.user?.id
    );

    if (existingApplication) {
      return next(new AppError('You have already applied to this project', 400));
    }

    // Add application
    project.applications.push({
      freelancer: req.user?.id as any,
      proposal,
      budget,
      timeline,
      status: 'pending',
      appliedAt: new Date()
    });

    await project.save();

    const response: ApiResponse<{ application: any }> = {
      success: true,
      data: { application: project.applications[project.applications.length - 1] },
      message: 'Application submitted successfully'
    };

    res.status(201).json(response);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};