import { Socket } from 'socket.io';
import * as mediasoupTypes from 'mediasoup/node/lib/types';

export interface Peer {
  id: string;
  socket: Socket;
  roomId: string;
  transports: Map<string, mediasoupTypes.Transport>;
  producers: Map<string, mediasoupTypes.Producer>;
  consumers: Map<string, mediasoupTypes.Consumer>;
  rtpCapabilities?: mediasoupTypes.RtpCapabilities;
}

export interface Room {
  id: string;
  router: mediasoupTypes.Router;
  peers: Map<string, Peer>;
  createdAt: Date;
}

export interface CreateRoomRequest {
  roomId?: string;
}

export interface JoinRoomRequest {
  roomId: string;
  rtpCapabilities: mediasoupTypes.RtpCapabilities;
}

export interface CreateTransportRequest {
  roomId: string;
  direction: 'send' | 'recv';
}

export interface ConnectTransportRequest {
  transportId: string;
  dtlsParameters: mediasoupTypes.DtlsParameters;
}

export interface ProduceRequest {
  transportId: string;
  kind: mediasoupTypes.MediaKind;
  rtpParameters: mediasoupTypes.RtpParameters;
}

export interface ConsumeRequest {
  producerId: string;
  rtpCapabilities: mediasoupTypes.RtpCapabilities;
}

export interface MediaState {
  audio: boolean;
  video: boolean;
}
