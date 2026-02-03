import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Server discovery
  getServers: () => ipcRenderer.invoke('get-servers'),
  startDiscovery: () => ipcRenderer.invoke('start-discovery'),
  stopDiscovery: () => ipcRenderer.invoke('stop-discovery'),
  onServersUpdated: (callback: (servers: any[]) => void) => {
    const subscription = (_event: any, servers: any[]) => callback(servers);
    ipcRenderer.on('servers-updated', subscription);
    return () => {
      ipcRenderer.removeListener('servers-updated', subscription);
    };
  },
  
  // Server management
  updateServerIp: (serverId: string, newIp: string) => 
    ipcRenderer.invoke('update-server-ip', { serverId, newIp }),
  pingServer: (ip: string, port: number) => 
    ipcRenderer.invoke('ping-server', { ip, port }),
  
  // Database operations
  toggleFavorite: (serverId: string) => 
    ipcRenderer.invoke('toggle-favorite', serverId),
  getFavoriteServers: () => ipcRenderer.invoke('get-favorite-servers'),
  updateServerNotes: (serverId: string, notes: string) => 
    ipcRenderer.invoke('update-server-notes', { serverId, notes }),
  getServerHistory: (serverId: string) => 
    ipcRenderer.invoke('get-server-history', serverId),
  getAllHistory: () => ipcRenderer.invoke('get-all-history'),
  deleteServer: (serverId: string) => 
    ipcRenderer.invoke('delete-server', serverId),
  getDbStats: () => ipcRenderer.invoke('get-db-stats'),
});

export type ServerHistory = {
  id: number;
  serverId: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  timestamp: number;
};

export type DbStats = {
  totalServers: number;
  activeServers: number;
  favoriteServers: number;
  totalHistory: number;
  dbPath: string;
};

export type ElectronAPI = {
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

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
