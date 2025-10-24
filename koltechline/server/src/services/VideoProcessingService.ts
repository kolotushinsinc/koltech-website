import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath.path);

interface VideoQuality {
  name: string;
  width: number;
  height: number;
  bitrate: string;
}

const VIDEO_QUALITIES: VideoQuality[] = [
  { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' },
  { name: '720p', width: 1280, height: 720, bitrate: '3000k' },
  { name: '480p', width: 854, height: 480, bitrate: '1500k' },
  { name: '360p', width: 640, height: 360, bitrate: '800k' }
];

export class VideoProcessingService {
  private uploadsDir: string;
  private hlsDir: string;

  constructor() {
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.hlsDir = path.join(__dirname, '../../uploads/hls');
  }

  /**
   * Process uploaded video into HLS format with multiple qualities
   */
  async processVideoToHLS(
    videoPath: string, 
    videoId: string,
    onProgress?: (progress: { percent?: number; status?: string }) => void
  ): Promise<string> {
    try {
      // Create HLS directory for this video
      const videoHLSDir = path.join(this.hlsDir, videoId);
      await fs.mkdir(videoHLSDir, { recursive: true });

      // Get video metadata
      const metadata = await this.getVideoMetadata(videoPath);
      const originalHeight = metadata.height;

      // Filter qualities based on original video resolution
      const availableQualities = VIDEO_QUALITIES.filter(q => q.height <= originalHeight);

      if (availableQualities.length === 0) {
        // If video is smaller than 360p, just use original
        availableQualities.push({
          name: 'original',
          width: metadata.width,
          height: metadata.height,
          bitrate: '800k'
        });
      }

      // Process each quality with progress
      let completedQualities = 0;
      const totalQualities = availableQualities.length;
      
      for (const quality of availableQualities) {
        if (onProgress) {
          onProgress({
            percent: (completedQualities / totalQualities) * 100,
            status: `Processing ${quality.name}...`
          });
        }
        
        await this.createQualityPlaylist(videoPath, videoHLSDir, quality, 0);
        completedQualities++;
      }

      // Create master playlist
      await this.createMasterPlaylist(videoHLSDir, availableQualities);

      // Return path to master playlist
      return `/uploads/hls/${videoId}/master.m3u8`;
    } catch (error) {
      console.error('Error processing video to HLS:', error);
      throw error;
    }
  }

  /**
   * Get video metadata
   */
  private getVideoMetadata(videoPath: string): Promise<{ width: number; height: number; duration: number }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        if (!videoStream) {
          reject(new Error('No video stream found'));
          return;
        }

        resolve({
          width: videoStream.width || 0,
          height: videoStream.height || 0,
          duration: metadata.format.duration || 0
        });
      });
    });
  }

  /**
   * Create HLS playlist for specific quality
   */
  private createQualityPlaylist(
    inputPath: string,
    outputDir: string,
    quality: VideoQuality,
    index: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const qualityDir = path.join(outputDir, quality.name);
      
      // Create quality directory
      if (!existsSync(qualityDir)) {
        mkdirSync(qualityDir, { recursive: true });
      }

      const outputPath = path.join(qualityDir, 'playlist.m3u8');

      ffmpeg(inputPath)
        .outputOptions([
          '-c:v libx264',           // Video codec
          '-c:a aac',               // Audio codec
          '-b:v ' + quality.bitrate, // Video bitrate
          '-b:a 128k',              // Audio bitrate
          `-s ${quality.width}x${quality.height}`, // Resolution
          '-profile:v main',        // H.264 profile
          '-level 4.0',             // H.264 level
          '-start_number 0',        // Start segment numbering at 0
          '-hls_time 6',            // Segment duration (6 seconds)
          '-hls_list_size 0',       // Keep all segments in playlist
          '-hls_segment_filename', path.join(qualityDir, 'segment%d.ts'), // Segment naming
          '-f hls'                  // Output format
        ])
        .output(outputPath)
        .on('end', () => {
          console.log(`Created ${quality.name} playlist`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`Error creating ${quality.name} playlist:`, err);
          reject(err);
        })
        .on('progress', (progress) => {
          console.log(`Processing ${quality.name}: ${progress.percent?.toFixed(2)}%`);
        })
        .run();
    });
  }

  /**
   * Create master playlist that references all quality playlists
   */
  private async createMasterPlaylist(outputDir: string, qualities: VideoQuality[]): Promise<void> {
    const masterPlaylistPath = path.join(outputDir, 'master.m3u8');
    
    let masterContent = '#EXTM3U\n#EXT-X-VERSION:3\n\n';

    qualities.forEach((quality) => {
      const bandwidth = parseInt(quality.bitrate) * 1000; // Convert to bps
      masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${quality.width}x${quality.height}\n`;
      masterContent += `${quality.name}/playlist.m3u8\n\n`;
    });

    await fs.writeFile(masterPlaylistPath, masterContent);
    console.log('Created master playlist');
  }

  /**
   * Delete HLS files for a video
   */
  async deleteHLSFiles(videoId: string): Promise<void> {
    try {
      const videoHLSDir = path.join(this.hlsDir, videoId);
      if (existsSync(videoHLSDir)) {
        await fs.rm(videoHLSDir, { recursive: true, force: true });
        console.log(`Deleted HLS files for video ${videoId}`);
      }
    } catch (error) {
      console.error('Error deleting HLS files:', error);
      throw error;
    }
  }

  /**
   * Check if HLS files exist for a video
   */
  async hlsFilesExist(videoId: string): Promise<boolean> {
    const masterPlaylistPath = path.join(this.hlsDir, videoId, 'master.m3u8');
    return existsSync(masterPlaylistPath);
  }

  /**
   * Extract thumbnail from video
   */
  async extractThumbnail(videoPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const thumbnailDir = path.join(this.uploadsDir, 'thumbnails');
      const thumbnailFilename = `thumb-${Date.now()}.jpg`;
      const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

      // Create thumbnails directory if it doesn't exist
      if (!existsSync(thumbnailDir)) {
        mkdirSync(thumbnailDir, { recursive: true });
      }

      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['00:00:01'],
          filename: thumbnailFilename,
          folder: thumbnailDir,
          size: '320x240'
        })
        .on('end', () => {
          resolve(`/uploads/thumbnails/${thumbnailFilename}`);
        })
        .on('error', (err) => {
          console.error('Error extracting thumbnail:', err);
          reject(err);
        });
    });
  }
}

export default new VideoProcessingService();
