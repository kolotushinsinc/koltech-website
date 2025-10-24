import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { Play } from 'lucide-react';

interface VideoPreviewProps {
  src: string;
  poster?: string;
  className?: string;
  isHLS?: boolean;
  onClick?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  src, 
  poster, 
  className = '',
  isHLS = false,
  onClick 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPausedByModal, setIsPausedByModal] = useState(false);

  // Listen to global video playback events
  useEffect(() => {
    const handlePause = () => {
      setIsPausedByModal(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };

    const handleResume = () => {
      setIsPausedByModal(false);
      // Resume only if video is in view and loaded
      if (videoRef.current && isInView && isLoaded) {
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('pauseBackgroundVideos', handlePause);
    window.addEventListener('resumeBackgroundVideos', handleResume);

    return () => {
      window.removeEventListener('pauseBackgroundVideos', handlePause);
      window.removeEventListener('resumeBackgroundVideos', handleResume);
    };
  }, [isInView, isLoaded]);

  // Intersection Observer для автоплея когда видео в зоне видимости
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          
          // Only play if not paused by modal
          if (entry.isIntersecting && isLoaded && !isPausedByModal) {
            // Видео в зоне видимости - запускаем
            video.play().catch(() => {
              // Игнорируем ошибки автоплея
            });
          } else {
            // Видео вне зоны видимости - останавливаем
            video.pause();
          }
        });
      },
      {
        threshold: 0.5, // 50% видео должно быть видно
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isLoaded, isPausedByModal]);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        startLevel: -1, // Auto quality
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Найти самое низкое качество для превью
        const levels = hls.levels;
        const lowestQuality = levels.reduce((min, level, idx) => 
          level.height < levels[min].height ? idx : min, 0
        );
        
        // Установить самое низкое качество
        hls.currentLevel = lowestQuality;
        setIsLoaded(true);
        
        // Если видео в зоне видимости и не остановлено модальным окном, запустить
        if (isInView && !isPausedByModal) {
          video.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS Error:', data);
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsLoaded(true);
        if (isInView && !isPausedByModal) {
          video.play().catch(() => {});
        }
      });
    } else {
      // Regular video
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsLoaded(true);
        if (isInView && !isPausedByModal) {
          video.play().catch(() => {});
        }
      });
    }
  }, [src, isHLS, isInView, isPausedByModal]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Video Element - БЕЗ контролов, muted, loop */}
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Play Icon Overlay - показывается при наведении */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-black ml-1" fill="black" />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
