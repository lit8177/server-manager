import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/Header';
import { ServerList } from '@/components/ServerList';
import { ServerDetail } from '@/components/ServerDetail';
import { Server } from '@/types/server';

function App() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  useEffect(() => {
    // Start discovery when app loads
    if (window.electronAPI) {
      window.electronAPI.startDiscovery();

      // Listen for server updates
      const unsubscribe = window.electronAPI.onServersUpdated((updatedServers) => {
        setServers(updatedServers);
      });

      // Load initial servers
      window.electronAPI.getServers().then(setServers);

      return () => {
        unsubscribe();
      };
    } else {
      // Mock data for development
      const mockServers: Server[] = [
        {
          id: '1',
          name: 'Production Server',
          ip: '192.168.1.100',
          port: 8080,
          status: 'online',
          lastSeen: Date.now(),
          metadata: {
            version: '2.1.0',
            location: 'US East',
          },
        },
        {
          id: '2',
          name: 'Development Server',
          ip: '192.168.1.101',
          port: 3000,
          status: 'online',
          lastSeen: Date.now() - 5000,
          metadata: {
            version: '2.0.5',
            location: 'Local',
          },
        },
      ];
      setServers(mockServers);
    }
  }, []);

  const handleRefresh = async () => {
    if (window.electronAPI) {
      await window.electronAPI.stopDiscovery();
      await window.electronAPI.startDiscovery();
      const updatedServers = await window.electronAPI.getServers();
      setServers(updatedServers);
    }
  };

  const handleUpdateIp = async (serverId: string, newIp: string) => {
    if (window.electronAPI) {
      return await window.electronAPI.updateServerIp(serverId, newIp);
    }
    // Mock implementation
    return { success: true, message: 'IP updated successfully' };
  };

  const handlePingServer = async (ip: string, port: number) => {
    if (window.electronAPI) {
      return await window.electronAPI.pingServer(ip, port);
    }
    // Mock implementation
    return { success: true, latency: Math.floor(Math.random() * 50) + 10 };
  };

  const selectedServer = servers.find((s) => s.id === selectedServerId) || null;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="server-manager-theme">
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <div className="w-96 border-r border-border bg-background overflow-hidden">
            <ServerList
              servers={servers}
              selectedServerId={selectedServerId}
              onSelectServer={setSelectedServerId}
              onRefresh={handleRefresh}
            />
          </div>
          <div className="flex-1 bg-background overflow-hidden">
            <ServerDetail
              server={selectedServer}
              onUpdateIp={handleUpdateIp}
              onPingServer={handlePingServer}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
