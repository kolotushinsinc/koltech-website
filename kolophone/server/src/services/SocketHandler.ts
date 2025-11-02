import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import MediasoupService from './MediasoupService';
import RoomModel from '../models/Room';
import { Peer } from '../types';

export class SocketHandler {
  private io: Server;
  private rooms: Map<string, Set<string>> = new Map(); // roomId -> Set of peerIds

  constructor(io: Server) {
    this.io = io;
  }
  
  // Helper method to log all rooms and their peers
  private logRooms(): void {
    console.log('Current rooms:');
    this.rooms.forEach((peers, roomId) => {
      console.log(`Room ${roomId}: ${Array.from(peers).join(', ')}`);
    });
  }

  handleConnection(socket: Socket): void {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Log all rooms and their peers
    this.logRooms();

    // Get router RTP capabilities
    socket.on('getRouterRtpCapabilities', async ({ roomId }, callback) => {
      try {
        const room = await MediasoupService.createRoom(roomId);
        callback({ rtpCapabilities: room.router.rtpCapabilities });
      } catch (error: any) {
        console.error('Error getting router RTP capabilities:', error);
        callback({ error: error.message });
      }
    });

    // Join room
    socket.on('joinRoom', async ({ roomId, rtpCapabilities }, callback) => {
      try {
        const room = await MediasoupService.createRoom(roomId);
        
        // Store roomId in socket data
        socket.data.roomId = roomId;
        
        // Create peer
        const peer: Peer = {
          id: socket.id,
          socket,
          roomId,
          transports: new Map(),
          producers: new Map(),
          consumers: new Map(),
          rtpCapabilities,
        };

        MediasoupService.addPeer(roomId, peer);
        socket.join(roomId);

        // Update database
        await RoomModel.findOneAndUpdate(
          { roomId },
          { 
            $addToSet: { participants: socket.id },
            isActive: true 
          },
          { upsert: true, new: true }
        );

        // Add peer to room tracking
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId)!.add(socket.id);
        
        // Log room state
        console.log(`Room ${roomId} now has peers:`, Array.from(this.rooms.get(roomId)!));
        
        // Get existing peers and their producers
        const existingPeers = MediasoupService.getRoomPeers(roomId)
          .filter(p => p.id !== socket.id);
        
        console.log(`Sending existing peers to ${socket.id}:`, existingPeers.map(p => p.id));
        
        // Собираем информацию о продюсерах для каждого пира
        const peersWithProducers = existingPeers.map(p => {
          const producers = Array.from(p.producers.keys());
          console.log(`Peer ${p.id} has producers:`, producers);
          return {
            id: p.id,
            producers: producers,
          };
        });
        
        // Отправляем информацию о существующих пирах новому пиру
        if (typeof callback === 'function') {
          callback({
            peers: peersWithProducers,
          });
        }
        
        // Отправляем уведомление о новом пире немедленно
        // Notify ALL peers in the room, including the sender
        this.io.to(roomId).emit('newPeer', { peerId: socket.id });
        console.log(`📢 Broadcast newPeer event to all peers in room ${roomId}`);

        // Notify the new peer about existing producers
        existingPeers.forEach(peer => {
          peer.producers.forEach((producer, producerId) => {
            socket.emit('newProducer', {
              peerId: peer.id,
              producerId: producerId,
              kind: producer.kind,
            });
          });
        });

        // Broadcast to all peers in the room that a new peer has joined
        // This ensures all peers are aware of each other
        // Отправляем повторное уведомление для надежности
        this.io.to(roomId).emit('newPeer', { peerId: socket.id });
        
        console.log(`👤 Peer ${socket.id} joined room ${roomId}`);
      } catch (error: any) {
        console.error('Error joining room:', error);
        if (typeof callback === 'function') {
          callback({ error: error.message });
        }
      }
    });

    // Create WebRTC transport
    socket.on('createWebRtcTransport', async ({ roomId, direction }, callback) => {
      try {
        // Make sure the peer exists in the room
        let peer = MediasoupService.getPeer(roomId, socket.id);
        
        if (!peer) {
          // If peer doesn't exist yet, create it
          console.log(`Creating peer ${socket.id} for room ${roomId} on transport creation`);
          
          // Create peer
          peer = {
            id: socket.id,
            socket,
            roomId,
            transports: new Map(),
            producers: new Map(),
            consumers: new Map(),
            rtpCapabilities: {},
          };
          
          MediasoupService.addPeer(roomId, peer);
          socket.join(roomId);
        }
        
        const transport = await MediasoupService.createWebRtcTransport(roomId, socket.id);

        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
      } catch (error: any) {
        console.error('Error creating WebRTC transport:', error);
        callback({ error: error.message });
      }
    });

    // Connect transport
    socket.on('connectTransport', async ({ transportId, dtlsParameters }, callback) => {
      try {
        const peer = MediasoupService.getPeer(socket.data.roomId || '', socket.id);
        if (!peer) {
          throw new Error('Peer not found');
        }

        const transport = peer.transports.get(transportId);
        if (!transport) {
          throw new Error('Transport not found');
        }

        await transport.connect({ dtlsParameters });
        callback({ success: true });
      } catch (error: any) {
        console.error('Error connecting transport:', error);
        callback({ error: error.message });
      }
    });

    // Produce media
    socket.on('produce', async ({ roomId, transportId, kind, rtpParameters }, callback) => {
      try {
        const producer = await MediasoupService.createProducer(
          roomId,
          socket.id,
          transportId,
          kind,
          rtpParameters
        );

        // Получаем всех пиров в комнате для отправки уведомления
        const room = this.rooms.get(roomId);
        if (room) {
          console.log(`📢 Broadcasting newProducer event to all peers in room ${roomId}`);
          
          // Отправляем уведомление всем пирам в комнате, включая отправителя
          this.io.to(roomId).emit('newProducer', {
            peerId: socket.id,
            producerId: producer.id,
            kind: producer.kind,
          });
        } else {
          // Если комната не найдена, отправляем уведомление только другим пирам
          console.log(`⚠️ Room ${roomId} not found in tracking, using socket.to`);
          socket.to(roomId).emit('newProducer', {
            peerId: socket.id,
            producerId: producer.id,
            kind: producer.kind,
          });
        }

        callback({ id: producer.id });
        console.log(`🎥 Producer created: ${producer.id} (${kind})`);
      } catch (error: any) {
        console.error('Error producing:', error);
        callback({ error: error.message });
      }
    });

    // Consume media
    socket.on('consume', async ({ roomId, transportId, producerId, rtpCapabilities }, callback) => {
      try {
        const consumer = await MediasoupService.createConsumer(
          roomId,
          socket.id,
          transportId,
          producerId,
          rtpCapabilities
        );

        callback({
          id: consumer.id,
          producerId: consumer.producerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        });

        console.log(`📺 Consumer created: ${consumer.id}`);
      } catch (error: any) {
        console.error('Error consuming:', error);
        callback({ error: error.message });
      }
    });
    
    // Get producers for a specific peer
    socket.on('getProducers', async ({ peerId }, callback) => {
      try {
        const roomId = socket.data.roomId || '';
        const peer = MediasoupService.getPeer(roomId, peerId);
        
        if (!peer) {
          console.log(`⚠️ Peer ${peerId} not found in room ${roomId} when getting producers`);
          // Если пир не найден, возвращаем пустой массив продюсеров
          if (typeof callback === 'function') {
            callback({ producers: [] });
          }
          return;
        }
        
        const producers = Array.from(peer.producers.keys());
        console.log(`📋 Producers for peer ${peerId}:`, producers);
        
        // Если продюсеры найдены, отправляем их
        if (typeof callback === 'function') {
          callback({ producers });
        }
        
        // Дополнительно отправляем уведомление о пире всем участникам комнаты
        // для обеспечения того, что все пиры знают о существовании друг друга
        this.io.to(roomId).emit('newPeer', { peerId });
        console.log(`📢 Sent additional newPeer event for ${peerId} to all peers in room ${roomId}`);
      } catch (error: any) {
        console.error('Error getting producers:', error);
        if (typeof callback === 'function') {
          callback({ error: error.message });
        }
      }
    });

    // Resume consumer
    socket.on('resumeConsumer', async ({ consumerId }, callback) => {
      try {
        const peer = MediasoupService.getPeer(socket.data.roomId || '', socket.id);
        if (!peer) {
          throw new Error('Peer not found');
        }

        const consumer = peer.consumers.get(consumerId);
        if (!consumer) {
          throw new Error('Consumer not found');
        }

        await consumer.resume();
        if (typeof callback === 'function') {
          callback({ success: true });
        }
      } catch (error: any) {
        console.error('Error resuming consumer:', error);
        if (typeof callback === 'function') {
          callback({ error: error.message });
        }
      }
    });

    // Pause producer
    socket.on('pauseProducer', async ({ producerId }, callback) => {
      try {
        const peer = MediasoupService.getPeer(socket.data.roomId || '', socket.id);
        if (!peer) {
          throw new Error('Peer not found');
        }

        const producer = peer.producers.get(producerId);
        if (!producer) {
          throw new Error('Producer not found');
        }

        await producer.pause();
        
        // Notify ALL peers in the room, including the sender
        this.io.to(peer.roomId).emit('producerPaused', { peerId: socket.id, producerId });
        console.log(`📢 Broadcast producerPaused event to all peers in room ${peer.roomId}`);
        
        if (callback) callback({ success: true });
      } catch (error: any) {
        console.error('Error pausing producer:', error);
        if (callback) callback({ error: error.message });
      }
    });

    // Resume producer
    socket.on('resumeProducer', async ({ producerId }, callback) => {
      try {
        const peer = MediasoupService.getPeer(socket.data.roomId || '', socket.id);
        if (!peer) {
          throw new Error('Peer not found');
        }

        const producer = peer.producers.get(producerId);
        if (!producer) {
          throw new Error('Producer not found');
        }

        await producer.resume();
        
        // Notify ALL peers in the room, including the sender
        this.io.to(peer.roomId).emit('producerResumed', { peerId: socket.id, producerId });
        console.log(`📢 Broadcast producerResumed event to all peers in room ${peer.roomId}`);
        
        if (callback) callback({ success: true });
      } catch (error: any) {
        console.error('Error resuming producer:', error);
        if (callback) callback({ error: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);

      // Find and remove peer from all rooms
      const rooms = socket.rooms;
      for (const roomId of rooms) {
        if (roomId !== socket.id) {
          MediasoupService.removePeer(roomId, socket.id);
          // Notify ALL peers in the room, including the sender
          this.io.to(roomId).emit('peerLeft', { peerId: socket.id });
          console.log(`📢 Broadcast peerLeft event to all peers in room ${roomId}`);

          // Update our room tracking
          if (this.rooms.has(roomId)) {
            this.rooms.get(roomId)!.delete(socket.id);
            if (this.rooms.get(roomId)!.size === 0) {
              this.rooms.delete(roomId);
            }
          }

          // Update database
          await RoomModel.findOneAndUpdate(
            { roomId },
            { $pull: { participants: socket.id } }
          );
        }
      }
      
      // Log room state after disconnect
      this.logRooms();
    });
  }
}
