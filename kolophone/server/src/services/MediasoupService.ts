import * as mediasoup from 'mediasoup';
import * as mediasoupTypes from 'mediasoup/node/lib/types';
import { mediasoupConfig } from '../config/mediasoup';
import { Room, Peer } from '../types';

class MediasoupService {
  private workers: mediasoupTypes.Worker[] = [];
  private rooms: Map<string, Room> = new Map();
  private nextWorkerIndex = 0;

  async initialize(numWorkers: number = 1): Promise<void> {
    console.log(`🚀 Initializing ${numWorkers} mediasoup worker(s)...`);

    for (let i = 0; i < numWorkers; i++) {
      const worker = await mediasoup.createWorker(mediasoupConfig.worker);

      worker.on('died', () => {
        console.error(`❌ Mediasoup worker ${i} died, exiting...`);
        process.exit(1);
      });

      this.workers.push(worker);
      console.log(`✅ Mediasoup worker ${i} created [PID: ${worker.pid}]`);
    }
  }

  private getNextWorker(): mediasoupTypes.Worker {
    const worker = this.workers[this.nextWorkerIndex];
    this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.workers.length;
    return worker;
  }

  async createRoom(roomId: string): Promise<Room> {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId)!;
    }

    const worker = this.getNextWorker();
    const router = await worker.createRouter({
      mediaCodecs: mediasoupConfig.router.mediaCodecs,
    });

    const room: Room = {
      id: roomId,
      router,
      peers: new Map(),
      createdAt: new Date(),
    };

    this.rooms.set(roomId, room);
    console.log(`✅ Room created: ${roomId}`);

    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.router.close();
      this.rooms.delete(roomId);
      console.log(`🗑️  Room deleted: ${roomId}`);
    }
  }

  addPeer(roomId: string, peer: Peer): void {
    const room = this.rooms.get(roomId);
    if (room) {
      // Check if peer already exists
      if (room.peers.has(peer.id)) {
        console.log(`⚠️  Peer ${peer.id} already exists in room ${roomId}, skipping`);
        return;
      }
      room.peers.set(peer.id, peer);
      console.log(`👤 Peer ${peer.id} added to room ${roomId}`);
    }
  }

  removePeer(roomId: string, peerId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      const peer = room.peers.get(peerId);
      if (peer) {
        // Close all transports
        peer.transports.forEach((transport) => transport.close());
        room.peers.delete(peerId);
        console.log(`👤 Peer ${peerId} removed from room ${roomId}`);

        // Delete room if empty
        if (room.peers.size === 0) {
          this.deleteRoom(roomId);
        }
      }
    }
  }

  getPeer(roomId: string, peerId: string): Peer | undefined {
    const room = this.rooms.get(roomId);
    return room?.peers.get(peerId);
  }

  getRoomPeers(roomId: string): Peer[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.peers.values()) : [];
  }

  async createWebRtcTransport(
    roomId: string,
    peerId: string
  ): Promise<mediasoupTypes.WebRtcTransport> {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    const peer = room.peers.get(peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not found in room ${roomId}`);
    }

    const transport = await room.router.createWebRtcTransport(
      mediasoupConfig.webRtcTransport
    );

    peer.transports.set(transport.id, transport);
    console.log(`🚚 Transport ${transport.id} created for peer ${peerId}`);

    return transport;
  }

  getTransport(
    roomId: string,
    peerId: string,
    transportId: string
  ): mediasoupTypes.Transport | undefined {
    const peer = this.getPeer(roomId, peerId);
    return peer?.transports.get(transportId);
  }

  async createProducer(
    roomId: string,
    peerId: string,
    transportId: string,
    kind: mediasoupTypes.MediaKind,
    rtpParameters: mediasoupTypes.RtpParameters
  ): Promise<mediasoupTypes.Producer> {
    const peer = this.getPeer(roomId, peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not found in room ${roomId}`);
    }

    console.log(`🔍 Looking for transport ${transportId} for peer ${peerId}`);
    console.log(`📋 Peer has ${peer.transports.size} transports:`, Array.from(peer.transports.keys()));

    const transport = peer.transports.get(transportId);
    if (!transport) {
      throw new Error(`Transport ${transportId} not found for peer ${peerId}`);
    }

    // Check if transport has produce method (WebRtcTransport)
    if (!('produce' in transport)) {
      throw new Error(`Transport ${transportId} does not support producing`);
    }

    const producer = await transport.produce({
      kind,
      rtpParameters,
    });

    peer.producers.set(producer.id, producer);
    console.log(`✅ Producer ${producer.id} created (${kind})`);

    return producer;
  }

  async createConsumer(
    roomId: string,
    peerId: string,
    transportId: string,
    producerId: string,
    rtpCapabilities: mediasoupTypes.RtpCapabilities
  ): Promise<mediasoupTypes.Consumer> {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    // Log more details for debugging
    console.log(`Creating consumer for peer ${peerId} in room ${roomId}`);
    console.log(`Using transport ${transportId} for consuming producer ${producerId}`);
    
    const peer = this.getPeer(roomId, peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not found in room ${roomId}`);
    }
    
    // Find the receive transport for the peer - use the one provided in transportId
    let recvTransport: mediasoupTypes.WebRtcTransport | undefined;
    
    // First try to use the transport ID that was passed in
    const requestedTransport = peer.transports.get(transportId);
    if (requestedTransport && 
        requestedTransport.constructor.name === 'WebRtcTransport' && 
        'consume' in requestedTransport) {
      recvTransport = requestedTransport as mediasoupTypes.WebRtcTransport;
      console.log(`Using requested transport: ${transportId}`);
    } else {
      throw new Error(`Transport ${transportId} not found or cannot be used for consuming`);
    }

    // Check if router can consume
    if (!room.router.canConsume({ producerId, rtpCapabilities })) {
      throw new Error(`Router cannot consume producer ${producerId} with given RTP capabilities`);
    }

    // Find the producer
    let producer: mediasoupTypes.Producer | undefined;
    room.peers.forEach((p) => {
      if (p.producers.has(producerId)) {
        producer = p.producers.get(producerId);
      }
    });

    if (!producer) {
      throw new Error(`Producer ${producerId} not found in room ${roomId}`);
    }

    const consumer = await recvTransport.consume({
      producerId,
      rtpCapabilities,
      paused: true,
    });

    peer.consumers.set(consumer.id, consumer);
    console.log(`Consumer ${consumer.id} created for peer ${peerId} (${consumer.kind})`);

    return consumer;
  }

  getProducer(
    roomId: string,
    peerId: string,
    producerId: string
  ): mediasoupTypes.Producer | undefined {
    const peer = this.getPeer(roomId, peerId);
    return peer?.producers.get(producerId);
  }

  getAllProducers(roomId: string, excludePeerId?: string): mediasoupTypes.Producer[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    const producers: mediasoupTypes.Producer[] = [];
    room.peers.forEach((peer, peerId) => {
      if (peerId !== excludePeerId) {
        peer.producers.forEach((producer) => producers.push(producer));
      }
    });

    return producers;
  }
}

export default new MediasoupService();
