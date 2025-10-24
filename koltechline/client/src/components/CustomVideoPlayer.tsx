import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward
} from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  qualities?: { label: string; src: string }[]; // Optional: different quality sources
  autoPlay?: boolean; // Auto-play when loaded
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ src, poster, className = '', qualities, autoPlay = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'speed' | 'quality'>('speed');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentQuality, setCurrentQuality] = useState(2); // Start with 360p (index 2)
  const [buffered, setBuffered] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<{ height: number; bitrate: number; index: number }[]>([]);
  const [isHLS, setIsHLS] = useState(false);
  const [actualQuality, setActualQuality] = useState<number | null>(null); // Current playing quality

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if source is HLS (.m3u8)
    const isHLSSource = src.endsWith('.m3u8');
    setIsHLS(isHLSSource);

    if (isHLSSource && Hls.isSupported()) {
      // Initialize HLS.js
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      // Handle quality levels
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels.map((level, index) => ({
          height: level.height,
          bitrate: level.bitrate,
          index
        }));
        setAvailableQualities(levels);
        
        // Find 360p quality (lowest quality for preview)
        const quality360Index = levels.findIndex(l => l.height === 360);
        if (quality360Index !== -1) {
          hls.currentLevel = quality360Index;
          setCurrentQuality(quality360Index);
        } else {
          // Fallback to lowest quality
          const lowestQuality = levels.reduce((min, level, idx) => 
            level.height < levels[min].height ? idx : min, 0
          );
          hls.currentLevel = lowestQuality;
          setCurrentQuality(lowestQuality);
        }
      });

      // Track actual quality being played
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setActualQuality(data.level);
      });

      // Error handling
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, cannot recover');
              hls.destroy();
              break;
          }
        }
      });

      // Start loading
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('HLS media attached, loading...');
        if (autoPlay && video) {
          video.muted = false; // Unmute for modal
          video.play().then(() => {
            setIsPlaying(true);
          }).catch((error) => {
            console.log('Autoplay failed:', error);
          });
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    } else if (isHLSSource && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
    } else {
      // Regular video
      video.src = src;
    }
  }, [src]);

  // Handle time update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Update buffered
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Seek video
  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, pos));
    videoRef.current.currentTime = clampedPos * duration;
  };

  // Handle mouse down on progress bar
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);
  };

  // Handle mouse move while dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleSeek(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration]);

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  // Change quality
  const changeQuality = (index: number) => {
    if (isHLS && hlsRef.current) {
      // HLS quality switching
      if (index === -1) {
        // Auto quality
        hlsRef.current.currentLevel = -1;
      } else {
        hlsRef.current.currentLevel = index;
      }
      setCurrentQuality(index);
      setShowSettings(false);
    } else if (qualities && videoRef.current) {
      // Manual quality switching (multiple sources)
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      
      setCurrentQuality(index);
      videoRef.current.src = qualities[index].src;
      videoRef.current.currentTime = currentTime;
      
      if (wasPlaying) {
        videoRef.current.play();
      }
      
      setShowSettings(false);
    }
  };

  // Get quality label
  const getQualityLabel = (height: number) => {
    if (height >= 2160) return '4K';
    if (height >= 1440) return '1440p';
    if (height >= 1080) return '1080p';
    if (height >= 720) return '720p';
    if (height >= 480) return '480p';
    if (height >= 360) return '360p';
    return `${height}p`;
  };

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: number;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative bg-black group rounded-xl overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full rounded-xl"
        onClick={togglePlay}
        playsInline
        preload="metadata"
      />

      {/* Play Button Overlay (center) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-24 h-24 bg-black/70 hover:bg-primary-500 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl"
          >
            <Play className="w-12 h-12 text-white ml-2" fill="white" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="px-5 pt-3">
          <div
            ref={progressBarRef}
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/progress hover:h-2 transition-all"
            onMouseDown={handleMouseDown}
          >
            {/* Buffered */}
            <div
              className="absolute h-full bg-white/40 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            
            {/* Progress */}
            <div
              className="absolute h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            
            {/* Scrubber */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"
              style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between px-5 py-4">
          {/* Left Controls */}
          <div className="flex items-center space-x-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" fill="white" />
              ) : (
                <Play className="w-7 h-7 ml-0.5" fill="white" />
              )}
            </button>

            {/* Skip Backward */}
            <button
              onClick={() => skip(-10)}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2 group/volume ml-2">
              <button
                onClick={toggleMute}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              
              {/* Volume Slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-24 transition-all opacity-0 group-hover/volume:opacity-100 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                  [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm font-medium ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
              >
                <Settings className="w-6 h-6" />
              </button>

              {/* Settings Menu */}
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-3 bg-black/95 backdrop-blur-sm rounded-xl p-3 min-w-[200px] shadow-2xl border border-white/10">
                  {/* Tabs */}
                  <div className="flex space-x-2 mb-3 border-b border-white/10 pb-2">
                    <button
                      onClick={() => setSettingsTab('quality')}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        settingsTab === 'quality'
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Quality
                    </button>
                    <button
                      onClick={() => setSettingsTab('speed')}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        settingsTab === 'speed'
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Speed
                    </button>
                  </div>

                  {/* Quality Settings */}
                  {settingsTab === 'quality' && (
                    <div>
                      {isHLS && availableQualities.length > 0 ? (
                        <>
                          {/* Auto quality */}
                          <button
                            onClick={() => changeQuality(-1)}
                            className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all ${
                              currentQuality === -1
                                ? 'bg-primary-500 text-white font-medium'
                                : 'text-white/90 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>Auto</span>
                              {currentQuality === -1 && actualQuality !== null && availableQualities[actualQuality] && (
                                <span className="text-xs text-white/70">
                                  ({getQualityLabel(availableQualities[actualQuality].height)})
                                </span>
                              )}
                            </div>
                          </button>
                          
                          {/* Manual qualities */}
                          {availableQualities
                            .sort((a, b) => b.height - a.height)
                            .map((quality) => (
                              <button
                                key={quality.index}
                                onClick={() => changeQuality(quality.index)}
                                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all ${
                                  currentQuality === quality.index
                                    ? 'bg-primary-500 text-white font-medium'
                                    : 'text-white/90 hover:bg-white/10'
                                }`}
                              >
                                {getQualityLabel(quality.height)}
                              </button>
                            ))}
                        </>
                      ) : qualities && qualities.length > 0 ? (
                        qualities.map((quality, index) => (
                          <button
                            key={index}
                            onClick={() => changeQuality(index)}
                            className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all ${
                              currentQuality === index
                                ? 'bg-primary-500 text-white font-medium'
                                : 'text-white/90 hover:bg-white/10'
                            }`}
                          >
                            {quality.label}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2.5 text-sm text-white/90">
                          <div className="flex items-center justify-between">
                            <span>Auto</span>
                            <span className="text-xs text-white/60">(Current)</span>
                          </div>
                          <p className="text-xs text-white/50 mt-1">
                            Quality switching available with HLS (.m3u8) or multiple sources
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Speed Settings */}
                  {settingsTab === 'speed' && (
                    <div>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all ${
                            playbackRate === rate
                              ? 'bg-primary-500 text-white font-medium'
                              : 'text-white/90 hover:bg-white/10'
                          }`}
                        >
                          {rate === 1 ? 'Normal' : `${rate}x`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
            >
              {isFullscreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
