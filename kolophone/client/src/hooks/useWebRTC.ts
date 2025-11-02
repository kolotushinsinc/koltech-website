import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';

// Используем window.location.hostname вместо жестко заданного IP для лучшей совместимости
// Это позволит работать как на локальной машине, так и при деплое
const SERVER_URL = `http://${window.location.hostname}:3001`;

type Device = mediasoupClient.types.Device;
type Transport = mediasoupClient.types.Transport;
type Producer = mediasoupClient.types.Producer;
type Consumer = mediasoupClient.types.Consumer;

interface Peer {
  id: string;
  videoElement?: HTMLVideoElement;
  audioProducer?: Producer;
  videoProducer?: Producer;
  consumers: Map<string, Consumer>;
  recvTransport?: Transport;
}

export const useWebRTC = (roomId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [peers, setPeers] = useState<Map<string, Peer>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioProducerRef = useRef<Producer | null>(null);
  const videoProducerRef = useRef<Producer | null>(null);
  const consumedProducersRef = useRef<Set<string>>(new Set());

  // Initialize socket connection
  useEffect(() => {
    console.log('🔌 Connecting to server at:', SERVER_URL);
    const socket = io(SERVER_URL, {
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 10,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true,
      timeout: 20000 // Увеличиваем таймаут для соединения
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to server with ID:', socket.id);
      setIsConnected(true);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err.message);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });
    
    // Добавляем обработчик для отладки всех входящих событий
    socket.onAny((event, ...args) => {
      console.log(`🔔 Socket event received: ${event}`, args);
    });

    socket.on('newPeer', ({ peerId }) => {
      console.log('👤 New peer joined:', peerId);
      
      // Игнорируем уведомления о самом себе
      if (peerId === socket.id) {
        console.log(`⏭️ Ignoring newPeer event for self (${peerId})`);
        return;
      }
      
      // Обновляем список пиров при подключении нового участника
      setPeers((prev) => {
        const newPeers = new Map(prev);
        if (!newPeers.has(peerId)) {
          newPeers.set(peerId, { id: peerId, consumers: new Map() });
          console.log(`✨ Added new peer ${peerId} to peers list`);
          console.log(`Current peers after adding:`, Array.from(newPeers.keys()));
        }
        return newPeers;
      });
      
      // Запрашиваем информацию о продюсерах нового пира
      // Уменьшаем задержку для более быстрого получения информации о продюсерах
      setTimeout(() => {
        console.log(`🔍 Requesting producers for peer ${peerId}`);
        socketRef.current?.emit('getProducers', { peerId }, (response: any) => {
          if (response.error) {
            console.error(`❌ Error getting producers for peer ${peerId}:`, response.error);
            return;
          }
          
          if (response.producers && response.producers.length > 0) {
            console.log(`✅ Received producers for peer ${peerId}:`, response.producers);
            response.producers.forEach((producerId: string) => {
              // Уменьшаем задержку для более быстрого потребления медиа
              consumeMedia(peerId, producerId).catch(err => {
                console.error(`Error consuming media for producer ${producerId}:`, err);
              });
            });
          } else {
            console.log(`⚠️ No producers found for peer ${peerId}`);
            
            // Если продюсеры не найдены, повторяем запрос через короткий интервал
            // Это может помочь в случае, если продюсеры еще не были созданы
            setTimeout(() => {
              console.log(`🔄 Retrying to get producers for peer ${peerId}`);
              socketRef.current?.emit('getProducers', { peerId });
            }, 1000);
          }
        });
      }, 500); // Уменьшено с 1500 до 500 мс
    });

    socket.on('peerLeft', ({ peerId }) => {
      console.log('👋 Peer left:', peerId);
      setPeers((prev) => {
        const newPeers = new Map(prev);
        const peer = newPeers.get(peerId);
        
        // Close peer's transport and remove consumed producer IDs
        if (peer) {
          peer.recvTransport?.close();
          peer.consumers.forEach((consumer) => {
            consumedProducersRef.current.delete(consumer.producerId);
          });
        }
        
        newPeers.delete(peerId);
        return newPeers;
      });
    });

    socket.on('newProducer', async ({ peerId, producerId, kind }) => {
      console.log(`📺 New producer from ${peerId}:`, producerId, kind);
      
      // Игнорируем уведомления о своих собственных продюсерах
      if (peerId === socket.id) {
        console.log(`⏭️ Ignoring newProducer event for self (${peerId})`);
        return;
      }
      
      // Добавляем пира в список, если его еще нет
      setPeers((prev) => {
        const newPeers = new Map(prev);
        if (!newPeers.has(peerId)) {
          console.log(`✨ Adding new peer ${peerId} to peers list from newProducer event`);
          newPeers.set(peerId, { id: peerId, consumers: new Map() });
        }
        return newPeers;
      });
      
      // Немедленно потребляем медиа без задержки
      try {
        console.log(`🔄 Consuming media for producer ${producerId} from peer ${peerId}`);
        await consumeMedia(peerId, producerId);
      } catch (err) {
        console.error('Error consuming media after newProducer event:', err);
        
        // В случае ошибки повторяем попытку через короткий интервал
        setTimeout(async () => {
          try {
            console.log(`🔄 Retrying to consume media for producer ${producerId} from peer ${peerId}`);
            await consumeMedia(peerId, producerId);
          } catch (retryErr) {
            console.error('Error on retry consuming media:', retryErr);
          }
        }, 1000);
      }
    });

    socket.on('producerPaused', ({ peerId, producerId }) => {
      console.log(`⏸️  Producer paused: ${peerId}/${producerId}`);
    });

    socket.on('producerResumed', ({ peerId, producerId }) => {
      console.log(`▶️  Producer resumed: ${peerId}/${producerId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Get user media
  const getUserMedia = useCallback(async () => {
    try {
      // Get audio and video, but start with them disabled
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      
      // Disable tracks by default
      stream.getAudioTracks().forEach(track => track.enabled = false);
      stream.getVideoTracks().forEach(track => track.enabled = false);
      
      setLocalStream(stream);
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error getting user media:', error);
      throw error;
    }
  }, []);

  // Initialize device
  const initializeDevice = useCallback(async () => {
    if (!socketRef.current) return;

    return new Promise<void>((resolve, reject) => {
      socketRef.current!.emit(
        'getRouterRtpCapabilities',
        { roomId },
        async ({ rtpCapabilities, error }: any) => {
          if (error) {
            reject(error);
            return;
          }

          try {
            const device = new mediasoupClient.Device();
            await device.load({ routerRtpCapabilities: rtpCapabilities });
            deviceRef.current = device;
            console.log('✅ Device initialized');
            resolve();
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }, [roomId]);

  // Create send transport
  const createSendTransport = useCallback(async () => {
    if (!socketRef.current || !deviceRef.current) return;

    return new Promise<Transport>((resolve, reject) => {
      socketRef.current!.emit(
        'createWebRtcTransport',
        { roomId, direction: 'send' },
        async ({ id, iceParameters, iceCandidates, dtlsParameters, error }: any) => {
          if (error) {
            reject(error);
            return;
          }

          try {
            const transport = deviceRef.current!.createSendTransport({
              id,
              iceParameters,
              iceCandidates,
              dtlsParameters,
            });

            transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
              socketRef.current!.emit(
                'connectTransport',
                { transportId: transport.id, dtlsParameters },
                ({ error }: any) => {
                  if (error) errback(error);
                  else callback();
                }
              );
            });

            transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
              socketRef.current!.emit(
                'produce',
                { roomId, transportId: transport.id, kind, rtpParameters },
                ({ id, error }: any) => {
                  if (error) errback(error);
                  else callback({ id });
                }
              );
            });

            sendTransportRef.current = transport;
            resolve(transport);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }, [roomId]);

  // Create receive transport for a specific peer
  const createRecvTransportForPeer = useCallback(async (peerId: string) => {
    if (!socketRef.current || !deviceRef.current) return;

    return new Promise<Transport>((resolve, reject) => {
      socketRef.current!.emit(
        'createWebRtcTransport',
        { roomId, direction: 'recv' },
        async ({ id, iceParameters, iceCandidates, dtlsParameters, error }: any) => {
          if (error) {
            reject(error);
            return;
          }

          try {
            const transport = deviceRef.current!.createRecvTransport({
              id,
              iceParameters,
              iceCandidates,
              dtlsParameters,
            });

            // Connect the transport immediately
            await new Promise<void>((resolveConnect, rejectConnect) => {
              transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                socketRef.current!.emit(
                  'connectTransport',
                  { transportId: transport.id, dtlsParameters },
                  ({ error }: any) => {
                    if (error) {
                      errback(error);
                      rejectConnect(error);
                    } else {
                      callback();
                      resolveConnect();
                    }
                  }
                );
              });
            });

            console.log(`✅ Created and connected receive transport for peer ${peerId}`);
            resolve(transport);
          } catch (err) {
            console.error(`❌ Error creating receive transport:`, err);
            reject(err);
          }
        }
      );
    });
  }, [roomId]);

  // Produce media
  const produceMedia = useCallback(async (stream: MediaStream) => {
    if (!sendTransportRef.current) return;

    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    if (audioTrack) {
      const audioProducer = await sendTransportRef.current.produce({
        track: audioTrack,
      });
      audioProducerRef.current = audioProducer;
      console.log('🎤 Audio producer created');
    }

    if (videoTrack) {
      const videoProducer = await sendTransportRef.current.produce({
        track: videoTrack,
      });
      videoProducerRef.current = videoProducer;
      console.log('🎥 Video producer created');
    }
  }, []);

  // Consume media
  const consumeMedia = useCallback(async (peerId: string, producerId: string) => {
    if (!socketRef.current || !deviceRef.current) {
      console.log('⚠️  Socket or device not ready');
      return;
    }
    
    // Check if already consumed
    if (consumedProducersRef.current.has(producerId)) {
      console.log(`⏭️  Already consumed producer ${producerId}, skipping`);
      return;
    }

    // Mark as consumed immediately
    consumedProducersRef.current.add(producerId);
    console.log(`🎯 Starting to consume producer ${producerId} from peer ${peerId}`);
    
    // Добавляем дополнительное логирование
    console.log(`Current peers before consuming:`, Array.from(peers.keys()));

    try {
      // Create a single receive transport for the peer if it doesn't exist
      let peer: Peer | undefined;
      let recvTransport: Transport | undefined;
      
      // Get current peers state
      const currentPeers = new Map(peers);
      peer = currentPeers.get(peerId);
      
      if (peer?.recvTransport) {
        recvTransport = peer.recvTransport;
        console.log(`🔄 Using existing transport for peer ${peerId}: ${recvTransport.id}`);
      } else {
        // Create a new transport
        console.log(`🚀 Creating receive transport for peer ${peerId}`);
        recvTransport = await createRecvTransportForPeer(peerId);
        
        if (!recvTransport) {
          console.error('❌ Failed to create receive transport');
          consumedProducersRef.current.delete(producerId);
          return;
        }
        
        // Create or update peer with the new transport
        if (!peer) {
          peer = { id: peerId, consumers: new Map() };
          currentPeers.set(peerId, peer);
          console.log(`✨ Creating new peer entry for ${peerId}`);
        }
        
        peer.recvTransport = recvTransport;
        setPeers(currentPeers);
        console.log(`✅ Receive transport created for peer ${peerId}: ${recvTransport.id}`);
        
        // Wait a moment for the transport to be registered on the server
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Request to consume
      console.log(`📡 Requesting to consume producer ${producerId} using transport ${recvTransport.id}`);
      const response = await new Promise<any>((resolve, reject) => {
        socketRef.current!.emit(
          'consume',
          {
            roomId,
            transportId: recvTransport!.id,
            producerId,
            rtpCapabilities: deviceRef.current!.rtpCapabilities,
          },
          (data: any) => {
            if (data.error) {
              reject(new Error(data.error));
            } else {
              resolve(data);
            }
          }
        );
      });

      const { id, kind, rtpParameters } = response;
      console.log(`✅ Consume response received: ${id} (${kind})`);

      // Create consumer
      const consumer = await recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });
      console.log(`✅ Consumer created: ${consumer.id} (${kind})`);

      // Resume consumer
      socketRef.current!.emit('resumeConsumer', { consumerId: consumer.id });
      console.log(`▶️  Resuming consumer ${consumer.id}`);
      
      // Принудительно запускаем воспроизведение трека
      if (kind === 'video' && consumer.track) {
        console.log(`🎬 Enabling video track for consumer ${consumer.id}`);
        consumer.track.enabled = true;
      }
      if (kind === 'audio' && consumer.track) {
        console.log(`🔊 Enabling audio track for consumer ${consumer.id}`);
        consumer.track.enabled = true;
      }

      // Update peers state with new consumer
      setPeers((prev) => {
        const newPeers = new Map(prev);
        let peer = newPeers.get(peerId);
        if (!peer) {
          peer = { id: peerId, consumers: new Map(), recvTransport };
          newPeers.set(peerId, peer);
          console.log(`✨ Created new peer entry for ${peerId} during consumer creation`);
        }
        peer.consumers.set(consumer.id, consumer);
        console.log(`✅ Consumer added to peer ${peerId}. Total consumers: ${peer.consumers.size}`);
        console.log(`Updated peers list:`, Array.from(newPeers.keys()));
        return newPeers;
      });

      console.log(`🎉 Successfully consumed ${kind} from peer ${peerId}`);
    } catch (err) {
      console.error('❌ Error in consumeMedia:', err);
      consumedProducersRef.current.delete(producerId);
    }
  }, [roomId, createRecvTransportForPeer]);

  // Join room
  const joinRoom = useCallback(async () => {
    try {
      if (!socketRef.current || !socketRef.current.connected) {
        console.log('⚠️ Socket not connected, reconnecting...');
        socketRef.current = io(SERVER_URL, {
          reconnectionDelayMax: 10000,
          reconnectionAttempts: 10,
          transports: ['websocket', 'polling'],
          // Увеличиваем таймаут для более стабильного соединения
          timeout: 30000
        });
        
        // Wait for connection
        if (!socketRef.current.connected) {
          await new Promise<void>((resolve) => {
            const connectTimeout = setTimeout(() => {
              console.log('⚠️ Connection timeout, trying to reconnect...');
              socketRef.current?.disconnect();
              socketRef.current?.connect();
            }, 5000);
            
            socketRef.current!.on('connect', () => {
              clearTimeout(connectTimeout);
              console.log('✅ Reconnected to server');
              setIsConnected(true);
              resolve();
            });
          });
        }
      }
      
      console.log('🚀 Starting room join process...');
      const stream = await getUserMedia();
      await initializeDevice();

      console.log('🔑 Joining room:', roomId);
      // First join room to register the peer
      await new Promise<void>((resolve, reject) => {
        socketRef.current!.emit(
          'joinRoom',
          { roomId, rtpCapabilities: deviceRef.current!.rtpCapabilities },
          ({ peers, error }: any) => {
            if (error) {
              console.error('❌ Error joining room:', error);
              reject(error);
            } else {
              console.log('✅ Joined room, existing peers:', peers);
              
              // Добавляем существующих пиров в состояние
              if (peers && peers.length > 0) {
                console.log('🔄 Adding existing peers to state:', peers);
                setPeers((prev) => {
                  const newPeers = new Map(prev);
                  peers.forEach((peer: any) => {
                    if (!newPeers.has(peer.id)) {
                      newPeers.set(peer.id, { 
                        id: peer.id, 
                        consumers: new Map() 
                      });
                      console.log(`✨ Added existing peer ${peer.id} to peers list`);
                    }
                  });
                  return newPeers;
                });
                
                // Запрашиваем потребление медиа для существующих продюсеров
                peers.forEach((peer: any) => {
                  if (peer.producers && peer.producers.length > 0) {
                    console.log(`🔄 Processing producers for peer ${peer.id}:`, peer.producers);
                    peer.producers.forEach((producerId: string) => {
                      // Немедленно потребляем медиа без задержки
                      console.log(`🔄 Consuming media for producer ${producerId} from peer ${peer.id}`);
                      consumeMedia(peer.id, producerId).catch(err => {
                        console.error(`Error consuming media for producer ${producerId}:`, err);
                        
                        // В случае ошибки повторяем попытку через короткий интервал
                        setTimeout(() => {
                          console.log(`🔄 Retrying to consume media for producer ${producerId} from peer ${peer.id}`);
                          consumeMedia(peer.id, producerId).catch(retryErr => {
                            console.error(`Error on retry consuming media for producer ${producerId}:`, retryErr);
                          });
                        }, 1000);
                      });
                    });
                  }
                });
              }
              
              resolve();
            }
          }
        );
      });

      // Уменьшаем задержку для более быстрой регистрации пира
      console.log('⏳ Waiting for peer registration...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then create send transport
      console.log('🚚 Creating send transport...');
      await createSendTransport();
      
      // Уменьшаем задержку для более быстрого создания транспорта
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Finally produce media
      console.log('🎬 Producing media...');
      await produceMedia(stream);

      console.log('✅ Successfully joined room');
      
      // Отправляем дополнительное уведомление о присоединении к комнате
      // для обеспечения того, что все пиры знают о нашем присутствии
      setTimeout(() => {
        console.log('🔄 Sending additional room presence notification');
        socketRef.current?.emit('joinRoom', { 
          roomId, 
          rtpCapabilities: deviceRef.current!.rtpCapabilities 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }, [roomId, getUserMedia, initializeDevice, createSendTransport, produceMedia]);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (!localStream) return;
    
    const audioTrack = localStream.getAudioTracks()[0];
    if (!audioTrack) return;
    
    if (isAudioEnabled) {
      audioTrack.enabled = false;
      if (audioProducerRef.current) {
        await audioProducerRef.current.pause();
        socketRef.current?.emit('pauseProducer', { producerId: audioProducerRef.current.id });
        console.log('⏸️  Audio muted');
      }
      setIsAudioEnabled(false);
    } else {
      audioTrack.enabled = true;
      if (audioProducerRef.current && !audioProducerRef.current.closed) {
        await audioProducerRef.current.resume();
        socketRef.current?.emit('resumeProducer', { producerId: audioProducerRef.current.id });
        console.log('🎤 Audio unmuted');
      }
      setIsAudioEnabled(true);
    }
  }, [isAudioEnabled, localStream]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (!localStream) return;
    
    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return;
    
    if (isVideoEnabled) {
      videoTrack.enabled = false;
      if (videoProducerRef.current) {
        await videoProducerRef.current.pause();
        socketRef.current?.emit('pauseProducer', { producerId: videoProducerRef.current.id });
        console.log('⏸️  Video disabled');
      }
      setIsVideoEnabled(false);
    } else {
      videoTrack.enabled = true;
      if (videoProducerRef.current && !videoProducerRef.current.closed) {
        await videoProducerRef.current.resume();
        socketRef.current?.emit('resumeProducer', { producerId: videoProducerRef.current.id });
        console.log('🎥 Video enabled');
      }
      setIsVideoEnabled(true);
    }
  }, [isVideoEnabled, localStream]);

  // Leave room
  const leaveRoom = useCallback(() => {
    console.log('🚪 Leaving room...');
    
    if (audioProducerRef.current) {
      audioProducerRef.current.close();
      audioProducerRef.current = null;
    }
    if (videoProducerRef.current) {
      videoProducerRef.current.close();
      videoProducerRef.current = null;
    }

    peers.forEach((peer) => {
      peer.recvTransport?.close();
      peer.consumers.forEach((consumer) => consumer.close());
    });

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`� Stopped track: ${track.kind}`);
      });
    }

    if (sendTransportRef.current) {
      sendTransportRef.current.close();
      sendTransportRef.current = null;
    }

    deviceRef.current = null;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    consumedProducersRef.current.clear();
    
    setLocalStream(null);
    setPeers(new Map());
    setIsAudioEnabled(true);
    setIsVideoEnabled(true);
    
    console.log('✅ Left room successfully');
  }, [localStream, peers]);

  return {
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
  };
};
