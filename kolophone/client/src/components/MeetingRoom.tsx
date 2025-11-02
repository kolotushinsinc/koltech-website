import { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users, MessageSquare, Share2, Settings, Grid3x3, User } from 'lucide-react';
import { useWebRTC } from '../hooks/useWebRTC';

interface MeetingRoomProps {
  roomId: string;
  onLeave: () => void;
}

export default function MeetingRoom({ roomId, onLeave }: MeetingRoomProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  
  const {
    isConnected,
    peers,
    localStream,
    localVideoRef,
    isAudioEnabled,
    isVideoEnabled,
    joinRoom,
    leaveRoom,
    toggleAudio,
    toggleVideo,
  } = useWebRTC(roomId);

  const peerVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Join room on mount
  useEffect(() => {
    joinRoom();
    return () => {
      leaveRoom();
    };
  }, []);

  // Update peer video elements when peers or their consumers change
  useEffect(() => {
    console.log('🔄 Updating peer video elements, peers count:', peers.size);
    console.log('Current peers:', Array.from(peers.keys()));
    
    peers.forEach((peer, peerId) => {
      console.log(`Processing peer ${peerId} with ${peer.consumers.size} consumers`);
      
      // Ensure we have a video element for this peer
      let videoElement = peerVideoRefs.current.get(peerId);
      if (!videoElement) {
        console.log(`⚠️  Creating new video element for peer ${peerId}`);
        // Create a new video element if it doesn't exist
        videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        peerVideoRefs.current.set(peerId, videoElement);
      }

      // Get current stream or create new one
      let stream = videoElement.srcObject as MediaStream;
      if (!stream) {
        stream = new MediaStream();
        videoElement.srcObject = stream;
        console.log(`🆕 Created new MediaStream for peer ${peerId}`);
      }
      
      // Find video consumer
      const videoConsumer = Array.from(peer.consumers.values()).find(
        (c) => c.kind === 'video'
      );
      
      // Find audio consumer
      const audioConsumer = Array.from(peer.consumers.values()).find(
        (c) => c.kind === 'audio'
      );
      
      console.log(`Peer ${peerId} consumers: video=${!!videoConsumer}, audio=${!!audioConsumer}`);
      
      // Add video track if not already present
      if (videoConsumer && videoConsumer.track) {
        const existingVideoTrack = stream.getVideoTracks()[0];
        if (!existingVideoTrack || existingVideoTrack.id !== videoConsumer.track.id) {
          // Remove old video tracks
          stream.getVideoTracks().forEach(track => stream.removeTrack(track));
          // Add new video track
          stream.addTrack(videoConsumer.track);
          console.log(`✅ Added video track for peer ${peerId}`);
        }
      } else {
        console.log(`⚠️  No video consumer for peer ${peerId}`);
      }
      
      // Add audio track if not already present
      if (audioConsumer && audioConsumer.track) {
        const existingAudioTrack = stream.getAudioTracks()[0];
        if (!existingAudioTrack || existingAudioTrack.id !== audioConsumer.track.id) {
          // Remove old audio tracks
          stream.getAudioTracks().forEach(track => stream.removeTrack(track));
          // Add new audio track
          stream.addTrack(audioConsumer.track);
          console.log(`✅ Added audio track for peer ${peerId}`);
        }
      } else {
        console.log(`⚠️  No audio consumer for peer ${peerId}`);
      }
      
      // Play video if not already playing
      if (videoElement.paused && stream.getTracks().length > 0) {
        videoElement.play().catch(err => {
          // Ignore AbortError as it's expected when tracks are being updated
          if (err.name !== 'AbortError') {
            console.error('Error playing video:', err);
          }
        });
        console.log(`✅ Updated video element for peer ${peerId} with ${stream.getTracks().length} tracks`);
      }
    });
  }, [peers]);

  const handleLeave = () => {
    leaveRoom();
    onLeave();
  };

  const copyMeetingLink = () => {
    // Create a shareable link with the room ID as a query parameter
    const baseUrl = window.location.origin;
    // Use just the query parameter without the path
    const shareableLink = `${baseUrl}?room=${roomId}`;
    
    console.log('Copying meeting link:', shareableLink);
    navigator.clipboard.writeText(shareableLink);
    setLinkCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  const peersArray = Array.from(peers.values());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Kolophone</h1>
              <p className="text-xs text-slate-400">Комната: {roomId}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm font-medium">{isConnected ? 'Подключено' : 'Отключено'}</span>
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Video Grid */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-2">
            {/* Local Video */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-400/20 aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Participant Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="font-medium text-sm">Вы</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="bg-slate-800/80 p-1.5 rounded-md">
                      {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Indicator */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium border border-slate-700/50">
                HD
              </div>

              {/* Video Off Overlay */}
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl">
                    ВЫ
                  </div>
                </div>
              )}
            </div>

            {/* Remote Peers */}
            {peersArray.map((peer) => (
              <div
                key={peer.id}
                className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700/50 aspect-video"
              >
                <video
                  ref={(el) => {
                    if (el) peerVideoRefs.current.set(peer.id, el);
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Participant Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                      <span className="font-medium text-sm">Участник {peer.id.substring(0, 6)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="bg-slate-800/80 p-1.5 rounded-md">
                        <Mic className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Indicator */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium border border-slate-700/50">
                  HD
                </div>

                {/* Placeholder if no video */}
                {peer.consumers.size === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl">
                      {peer.id.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Empty state if no peers */}
            {peersArray.length === 0 && (
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700/50 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Ожидание участников...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Control Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-2">
              <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all hover:scale-105 border border-slate-700/50">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all hover:scale-105 border border-slate-700/50">
                <Users className="w-5 h-5" />
              </button>
            </div>

            {/* Center Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-xl transition-all hover:scale-105 border ${
                  !isAudioEnabled
                    ? 'bg-red-500 hover:bg-red-600 border-red-400'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700/50'
                }`}
              >
                {!isAudioEnabled ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-4 rounded-xl transition-all hover:scale-105 border ${
                  !isVideoEnabled
                    ? 'bg-red-500 hover:bg-red-600 border-red-400'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700/50'
                }`}
              >
                {!isVideoEnabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={handleLeave}
                className="px-6 py-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-500/30 border border-red-400/50 flex items-center space-x-2 font-medium"
              >
                <PhoneOff className="w-5 h-5" />
                <span>Завершить</span>
              </button>

              <div className="relative">
                <button 
                  onClick={copyMeetingLink}
                  className={`p-4 rounded-xl transition-all hover:scale-105 border ${
                    linkCopied
                      ? 'bg-green-500 hover:bg-green-600 border-green-400'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700/50'
                  }`}
                  title="Скопировать ссылку на встречу"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                
                {/* Tooltip when link is copied */}
                {linkCopied && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-green-500 text-white text-xs rounded-md whitespace-nowrap">
                    Ссылка скопирована!
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium">{peersArray.length + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
