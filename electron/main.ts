import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as dgram from 'dgram';
import { getDatabase, closeDatabase } from './database';

let mainWindow: BrowserWindow | null = null;

// Server discovery state
const discoveredServers = new Map<string, any>();
let discoverySocket: dgram.Socket | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0f172a',
    titleBarStyle: 'default',
    show: false,
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Server discovery using UDP multicast
function startServerDiscovery() {
  if (discoverySocket) {
    return;
  }

  discoverySocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

  const MULTICAST_ADDR = '239.255.255.250';
  const MULTICAST_PORT = 9876;

  discoverySocket.on('message', (msg, rinfo) => {
    try {
      const data = JSON.parse(msg.toString());
      
      if (data.type === 'server-announce') {
        const db = getDatabase();
        const now = Date.now();
        
        const serverInfo = {
          id: data.serverId || rinfo.address,
          name: data.name || 'Unknown Server',
          ip: data.ip || rinfo.address,
          port: data.port || rinfo.port,
          version: data.metadata?.version,
          location: data.metadata?.location,
          type: data.metadata?.type,
          lastSeen: now,
          isFavorite: false,
        };

        // Save to database
        const savedServer = db.upsertServer(serverInfo);
        
        // Update in-memory cache
        discoveredServers.set(savedServer.id, {
          ...savedServer,
          status: 'online',
          metadata: data.metadata || {},
        });
        
        // Send update to renderer
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('servers-updated', Array.from(discoveredServers.values()));
        }
      }
    } catch (error) {
      console.error('Error parsing discovery message:', error);
    }
  });

  discoverySocket.on('error', (err) => {
    console.error('Discovery socket error:', err);
  });

  discoverySocket.bind(MULTICAST_PORT, () => {
    discoverySocket?.addMembership(MULTICAST_ADDR);
    console.log(`Listening for server announcements on ${MULTICAST_ADDR}:${MULTICAST_PORT}`);
  });

  // Send discovery request every 5 seconds
  setInterval(() => {
    const message = JSON.stringify({
      type: 'discovery-request',
      timestamp: Date.now(),
    });
    
    discoverySocket?.send(message, 0, message.length, MULTICAST_PORT, MULTICAST_ADDR, (err) => {
      if (err) console.error('Error sending discovery request:', err);
    });

    // Clean up stale servers (not seen in 15 seconds)
    const now = Date.now();
    for (const [id, server] of discoveredServers.entries()) {
      if (now - server.lastSeen > 15000) {
        discoveredServers.delete(id);
      }
    }

    // Send updated list
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('servers-updated', Array.from(discoveredServers.values()));
    }
  }, 5000);
}

function stopServerDiscovery() {
  if (discoverySocket) {
    discoverySocket.close();
    discoverySocket = null;
  }
  discoveredServers.clear();
}

// IPC Handlers
ipcMain.handle('get-servers', async () => {
  const db = getDatabase();
  const allServers = db.getAllServers();
  
  // Merge with active discovery data
  return allServers.map(server => {
    const activeServer = discoveredServers.get(server.id);
    return {
      ...server,
      status: activeServer ? 'online' : 'offline',
      metadata: activeServer?.metadata || {},
    };
  });
});

ipcMain.handle('start-discovery', async () => {
  startServerDiscovery();
  return { success: true };
});

ipcMain.handle('stop-discovery', async () => {
  stopServerDiscovery();
  return { success: true };
});

ipcMain.handle('update-server-ip', async (_event, { serverId, newIp }) => {
  const db = getDatabase();
  const server = db.getServerById(serverId);
  
  if (server) {
    // Update in database
    db.updateServerIP(serverId, newIp);
    
    // Update in-memory cache
    const cachedServer = discoveredServers.get(serverId);
    if (cachedServer) {
      cachedServer.ip = newIp;
      discoveredServers.set(serverId, cachedServer);
    }
    
    console.log(`Updated server ${serverId} IP to ${newIp}`);
    
    // Send updated list
    if (mainWindow && !mainWindow.isDestroyed()) {
      const allServers = db.getAllServers().map(s => ({
        ...s,
        status: discoveredServers.has(s.id) ? 'online' : 'offline',
        metadata: discoveredServers.get(s.id)?.metadata || {},
      }));
      mainWindow.webContents.send('servers-updated', allServers);
    }
    
    return { success: true, message: 'IP updated successfully' };
  }
  
  return { success: false, message: 'Server not found' };
});

ipcMain.handle('ping-server', async (event, { ip, port }) => {
  // Simulate server ping
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, latency: Math.floor(Math.random() * 50) + 10 });
    }, 100);
  });
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  startServerDiscovery();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopServerDiscovery();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopServerDiscovery();
  closeDatabase();
});

// Additional IPC handlers for database operations
ipcMain.handle('toggle-favorite', async (_event, serverId: string) => {
  const db = getDatabase();
  const newState = db.toggleFavorite(serverId);
  
  // Send updated list
  if (mainWindow && !mainWindow.isDestroyed()) {
    const allServers = db.getAllServers().map(s => ({
      ...s,
      status: discoveredServers.has(s.id) ? 'online' : 'offline',
      metadata: discoveredServers.get(s.id)?.metadata || {},
    }));
    mainWindow.webContents.send('servers-updated', allServers);
  }
  
  return { success: true, isFavorite: newState };
});

ipcMain.handle('get-favorite-servers', async () => {
  const db = getDatabase();
  const favorites = db.getFavoriteServers();
  return favorites.map(server => ({
    ...server,
    status: discoveredServers.has(server.id) ? 'online' : 'offline',
    metadata: discoveredServers.get(server.id)?.metadata || {},
  }));
});

ipcMain.handle('update-server-notes', async (_event, { serverId, notes }: { serverId: string; notes: string }) => {
  const db = getDatabase();
  const success = db.updateServerNotes(serverId, notes);
  return { success };
});

ipcMain.handle('get-server-history', async (_event, serverId: string) => {
  const db = getDatabase();
  return db.getServerHistory(serverId);
});

ipcMain.handle('get-all-history', async () => {
  const db = getDatabase();
  return db.getAllHistory();
});

ipcMain.handle('delete-server', async (_event, serverId: string) => {
  const db = getDatabase();
  const success = db.deleteServer(serverId);
  
  // Remove from cache
  discoveredServers.delete(serverId);
  
  // Send updated list
  if (mainWindow && !mainWindow.isDestroyed()) {
    const allServers = db.getAllServers().map(s => ({
      ...s,
      status: discoveredServers.has(s.id) ? 'online' : 'offline',
      metadata: discoveredServers.get(s.id)?.metadata || {},
    }));
    mainWindow.webContents.send('servers-updated', allServers);
  }
  
  return { success };
});

ipcMain.handle('get-db-stats', async () => {
  const db = getDatabase();
  return db.getStats();
});
