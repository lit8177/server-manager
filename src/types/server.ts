export interface Server {
  id: string;
  name: string;
  ip: string;
  port: number;
  status: 'online' | 'offline' | 'warning' | 'error';
  lastSeen: number;
  metadata?: {
    version?: string;
    location?: string;
    [key: string]: any;
  };
}

export interface ServerUpdateResult {
  success: boolean;
  message: string;
}

export interface PingResult {
  success: boolean;
  latency?: number;
}
