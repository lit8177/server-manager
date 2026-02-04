import { Server as ServerIcon } from 'lucide-react';
import { Server } from '@/types/server';

interface ServerCardProps {
  server: Server;
  onClick?: (server: Server) => void;
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const statusNames = {
  online: '在线',
  offline: '离线',
  warning: '警告',
  error: '错误',
};

export function ServerCard({ server, onClick }: ServerCardProps) {
  const Icon = ServerIcon;
  
  return (
    <div
      onClick={() => onClick?.(server)}
      className={`bg-card border border-border rounded-lg p-5 transition-all hover:shadow-lg ${
        onClick ? 'cursor-pointer hover:border-primary/50 hover:shadow-primary/10' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-md">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-card-foreground font-medium mb-1">{server.name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              服务器
            </p>
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${statusColors[server.status]}`}
          title={statusNames[server.status]}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">IP 地址</span>
          <span className="text-sm text-card-foreground font-mono">
            {server.ip}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">端口</span>
          <span className="text-sm text-card-foreground font-mono">
            {server.port}
          </span>
        </div>

        {server.metadata?.version && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">版本</span>
            <span className="text-sm text-card-foreground font-mono">
              {server.metadata.version}
            </span>
          </div>
        )}

        {server.metadata?.location && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">位置</span>
            <span className="text-sm text-card-foreground">
              {server.metadata.location}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">最后在线</span>
          <span className="text-sm text-card-foreground">
            {new Date(server.lastSeen).toLocaleTimeString('zh-CN')}
          </span>
        </div>
      </div>
    </div>
  );
}
