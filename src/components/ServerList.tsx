import { useState } from 'react';
import { Server } from '@/types/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Server as ServerIcon, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { cn, getStatusBgColor } from '@/lib/utils';

interface ServerListProps {
  servers: Server[];
  selectedServerId: string | null;
  onSelectServer: (serverId: string) => void;
  onRefresh: () => void;
}

export function ServerList({ servers, selectedServerId, onSelectServer, onRefresh }: ServerListProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4" />;
      case 'offline':
        return <WifiOff className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ServerIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Discovered Servers</h2>
            <p className="text-sm text-muted-foreground">
              {servers.length} server{servers.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className={cn(refreshing && 'animate-pulse')}
        >
          <Activity className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="p-4 bg-muted rounded-full mb-4">
              <ServerIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Servers Found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Waiting for server announcements on the network. Make sure your servers are configured to broadcast discovery messages.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="w-4 h-4 animate-pulse-glow" />
              Scanning network...
            </div>
          </div>
        ) : (
          servers.map((server) => (
            <Card
              key={server.id}
              className={cn(
                'cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl',
                selectedServerId === server.id && 'ring-2 ring-primary shadow-xl'
              )}
              onClick={() => onSelectServer(server.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg border', getStatusBgColor(server.status))}>
                      {getStatusIcon(server.status)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{server.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {server.ip}:{server.port}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      server.status === 'online'
                        ? 'success'
                        : server.status === 'warning'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="capitalize"
                  >
                    {server.status}
                  </Badge>
                </div>
              </CardHeader>
              {server.metadata && Object.keys(server.metadata).length > 0 && (
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {server.metadata.version && (
                      <span className="px-2 py-1 bg-muted rounded">v{server.metadata.version}</span>
                    )}
                    {server.metadata.location && (
                      <span className="px-2 py-1 bg-muted rounded">{server.metadata.location}</span>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
