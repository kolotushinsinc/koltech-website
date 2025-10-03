import { Request, Response } from 'express';
import Project from '../models/Project';

interface ProjectRequest extends Request {
  body: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    category: string;
    mainImage?: string;
    previewImages?: string[];
    technologies: string[];
    link: string;
    rating: number;
    featured: boolean;
    status: 'active' | 'completed' | 'on_hold';
  };
  params: {
    id?: string;
  };
  query: {
    page?: string;
    limit?: string;
    category?: string;
  };
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

// Get all projects with pagination and filtering
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category;
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (category) {
      query.category = category;
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Project.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project by ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, shortDescription, fullDescription, category, technologies, link, rating, featured, status } = req.body;
    
    // Process main image if uploaded
    let mainImagePath = '';
    if (req.files && !Array.isArray(req.files) && req.files['mainImage'] && req.files['mainImage'].length > 0) {
      mainImagePath = `/uploads/${req.files['mainImage'][0].filename}`;
    }
    
    // Process preview images if uploaded
    const previewImagesPaths: string[] = [];
    if (req.files && !Array.isArray(req.files) && req.files['previewImages'] && req.files['previewImages'].length > 0) {
      req.files['previewImages'].forEach((file: Express.Multer.File) => {
        previewImagesPaths.push(`/uploads/${file.filename}`);
      });
    }
    
    const project = new Project({
      title,
      shortDescription,
      fullDescription,
      category,
      mainImage: mainImagePath,
      previewImages: previewImagesPaths,
      technologies,
      link,
      rating,
      featured,
      status
    });
    
    await project.save();
    
    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, shortDescription, fullDescription, category, technologies, link, rating, featured, status, removedPreviewImages } = req.body;
    
    // Get existing project
    const existingProject = await Project.findById(req.params.id);
    
    if (!existingProject) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    // Process main image if uploaded
    let mainImagePath = existingProject.mainImage;
    if (req.files && !Array.isArray(req.files) && req.files['mainImage'] && req.files['mainImage'].length > 0) {
      mainImagePath = `/uploads/${req.files['mainImage'][0].filename}`;
    }
    
    // Process preview images
    let previewImagesPaths = existingProject.previewImages || [];
    
    // Remove specified preview images
    if (removedPreviewImages) {
      try {
        const removedImages = JSON.parse(removedPreviewImages);
        previewImagesPaths = previewImagesPaths.filter((img: string) => !removedImages.includes(img.split('/').pop()));
      } catch (e) {
        console.error('Error parsing removedPreviewImages:', e);
      }
    }
    
    // Add new preview images if uploaded
    if (req.files && !Array.isArray(req.files) && req.files['previewImages'] && req.files['previewImages'].length > 0) {
      req.files['previewImages'].forEach((file: Express.Multer.File) => {
        previewImagesPaths.push(`/uploads/${file.filename}`);
      });
    }
    
    // Parse technologies if it's a string
    let parsedTechnologies = technologies;
    if (typeof technologies === 'string') {
      try {
        parsedTechnologies = JSON.parse(technologies);
      } catch (e) {
        console.error('Error parsing technologies:', e);
      }
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        shortDescription,
        fullDescription,
        category,
        mainImage: mainImagePath,
        previewImages: previewImagesPaths,
        technologies: parsedTechnologies,
        link,
        rating,
        featured,
        status
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};