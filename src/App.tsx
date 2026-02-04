import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/Header';
import { ServerList } from '@/components/ServerList';
import { ServerDetail } from '@/components/ServerDetail';
import { ServerCard } from '@/components/ServerCard';
import { SearchOverlay } from '@/components/SearchOverlay';
import { Server } from '@/types/server';

function App() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [serversFound, setServersFound] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        {
          id: '3',
          name: 'Database Server',
          ip: '192.168.1.102',
          port: 5432,
          status: 'online',
          lastSeen: Date.now() - 10000,
          metadata: {
            version: '14.5',
            location: 'Local',
          },
        },
        {
          id: '4',
          name: 'API Gateway',
          ip: '192.168.1.103',
          port: 4000,
          status: 'warning',
          lastSeen: Date.now() - 30000,
          metadata: {
            version: '1.8.2',
            location: 'Cloud',
          },
        },
      ];
      setServers(mockServers);
    }
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    setSearchProgress(0);
    setServersFound(0);

    // Simulate device discovery process
    const totalDuration = 5000; // 5 seconds
    const steps = 100;
    const stepDuration = totalDuration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;
      setSearchProgress(Math.min(progress, 100));

      // Simulate finding servers at different stages
      if (currentStep === 20) setServersFound(1);
      if (currentStep === 35) setServersFound(2);
      if (currentStep === 50) setServersFound(3);
      if (currentStep === 70) setServersFound(4);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSearching(false);
          setSearchProgress(0);
          setServersFound(0);
          handleRefresh();
        }, 500);
      }
    }, stepDuration);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (window.electronAPI) {
      await window.electronAPI.stopDiscovery();
      await window.electronAPI.startDiscovery();
      const updatedServers = await window.electronAPI.getServers();
      setServers(updatedServers);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
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

  const handleServerClick = (server: Server) => {
    setSelectedServerId(server.id);
    if (viewMode === 'grid') {
      // In grid mode, we could open a modal instead of switching views
      // For now, we'll just switch to list view to show details
      setViewMode('list');
    }
  };

  const selectedServer = servers.find((s) => s.id === selectedServerId) || null;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="server-manager-theme">
      <div className="h-screen flex flex-col overflow-hidden">
        <Header 
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          isSearching={isSearching}
          isRefreshing={isRefreshing}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        {viewMode === 'list' ? (
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
        ) : (
          <main className="flex-1 overflow-auto p-6 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {servers.map((server) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  onClick={handleServerClick}
                />
              ))}
            </div>
            
            {servers.length === 0 && !isSearching && (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">
                  未发现服务器。点击搜索服务器按钮开始扫描。
                </p>
              </div>
            )}
          </main>
        )}

        <SearchOverlay
          isSearching={isSearching}
          progress={searchProgress}
          serversFound={serversFound}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
