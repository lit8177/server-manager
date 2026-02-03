export {};

export interface ServerHistory {
  id: number;
  serverId: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  timestamp: number;
}

export interface DbStats {
  totalServers: number;
  activeServers: number;
  favoriteServers: number;
  totalHistory: number;
  dbPath: string;
}

declare global {
  interface Window {
    electronAPI: {
      getServers: () => Promise<any[]>;
      startDiscovery: () => Promise<{ success: boolean }>;
      stopDiscovery: () => Promise<{ success: boolean }>;
      onServersUpdated: (callback: (servers: any[]) => void) => () => void;
      updateServerIp: (serverId: string, newIp: string) => Promise<{ success: boolean; message: string }>;
      pingServer: (ip: string, port: number) => Promise<{ success: boolean; latency?: number }>;
      toggleFavorite: (serverId: string) => Promise<{ success: boolean; isFavorite: boolean }>;
      getFavoriteServers: () => Promise<any[]>;
      updateServerNotes: (serverId: string, notes: string) => Promise<{ success: boolean }>;
      getServerHistory: (serverId: string) => Promise<ServerHistory[]>;
      getAllHistory: () => Promise<ServerHistory[]>;
      deleteServer: (serverId: string) => Promise<{ success: boolean }>;
      getDbStats: () => Promise<DbStats>;
    };
  }
}
