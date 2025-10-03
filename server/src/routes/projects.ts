import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { uploadProjectImages } from '../middleware/upload';

const router = Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', getProjectById);

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', authenticate, uploadProjectImages, createProject);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', authenticate, uploadProjectImages, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', authenticate, deleteProject);

export default router;