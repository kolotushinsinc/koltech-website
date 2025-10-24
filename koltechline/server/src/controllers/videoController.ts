import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import VideoProcessingService from '../services/VideoProcessingService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Store active uploads for cancellation
const activeUploads = new Map<string, { cancel: () => void }>();

// @desc    Upload and process video synchronously
// @route   POST /api/videos/upload
// @access  Private
export const uploadAndProcessVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    
    if (!file) {
      return next(new AppError('No video file provided', 400));
    }

    // Validate file type
    if (!file.mimetype.startsWith('video/')) {
      return next(new AppError('File must be a video', 400));
    }

    // Generate unique video ID
    const videoId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const videoPath = file.path;

    console.log(`🎬 Starting video processing: ${videoId}`);

    // Set up SSE for progress updates
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let cancelled = false;
    const cancelUpload = () => {
      cancelled = true;
      console.log(`❌ Upload cancelled: ${videoId}`);
    };

    activeUploads.set(videoId, { cancel: cancelUpload });

    try {
      // Send initial progress
      res.write(`data: ${JSON.stringify({ type: 'progress', percent: 0, status: 'Starting...' })}\n\n`);

      // Process video to HLS
      const hlsPath = await VideoProcessingService.processVideoToHLS(
        videoPath,
        videoId,
        (progress) => {
          if (cancelled) {
            throw new Error('Upload cancelled');
          }
          // Send progress update
          res.write(`data: ${JSON.stringify({ 
            type: 'progress', 
            percent: progress.percent || 0,
            status: progress.status || 'Processing...'
          })}\n\n`);
        }
      );

      if (cancelled) {
        throw new Error('Upload cancelled');
      }

      // Send completion
      res.write(`data: ${JSON.stringify({ 
        type: 'complete', 
        hlsPath,
        videoId,
        originalPath: `/uploads/videos/${path.basename(videoPath)}`
      })}\n\n`);
      
      res.end();

      console.log(`✅ Video processing complete: ${videoId}`);
    } catch (error: any) {
      console.error(`❌ Error processing video ${videoId}:`, error);
      
      // Clean up on error
      await VideoProcessingService.deleteHLSFiles(videoId);
      
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        message: error.message || 'Video processing failed'
      })}\n\n`);
      
      res.end();
    } finally {
      activeUploads.delete(videoId);
    }
  } catch (error: any) {
    console.error('Error in uploadAndProcessVideo:', error);
    next(new AppError(error.message || 'Failed to process video', 500));
  }
};

// @desc    Cancel video upload
// @route   DELETE /api/videos/upload/:videoId
// @access  Private
export const cancelVideoUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;

    const upload = activeUploads.get(videoId);
    if (upload) {
      upload.cancel();
      activeUploads.delete(videoId);
      
      // Clean up files
      await VideoProcessingService.deleteHLSFiles(videoId);
      
      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Upload cancelled successfully' },
        message: 'Upload cancelled'
      };
      
      res.status(200).json(response);
    } else {
      return next(new AppError('Upload not found or already completed', 404));
    }
  } catch (error: any) {
    console.error('Error cancelling upload:', error);
    next(new AppError(error.message || 'Failed to cancel upload', 500));
  }
};

// @desc    Extract video thumbnail
// @route   POST /api/videos/thumbnail
// @access  Private
export const extractThumbnail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    
    if (!file) {
      return next(new AppError('No video file provided', 400));
    }

    const thumbnailPath = await VideoProcessingService.extractThumbnail(file.path);
    
    const response: ApiResponse<{ thumbnailUrl: string }> = {
      success: true,
      data: { thumbnailUrl: thumbnailPath },
      message: 'Thumbnail extracted successfully'
    };
    
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error extracting thumbnail:', error);
    next(new AppError(error.message || 'Failed to extract thumbnail', 500));
  }
};
