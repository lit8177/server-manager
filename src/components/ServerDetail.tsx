import { useState, useEffect } from 'react';
import { Server } from '@/types/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Edit2,
  Save,
  X,
  Wifi,
  Clock,
  MapPin,
  PackageOpen,
  RefreshCw,
} from 'lucide-react';
import { cn, formatDate, validateIPAddress, getStatusBgColor } from '@/lib/utils';

interface ServerDetailProps {
  server: Server | null;
  onUpdateIp: (serverId: string, newIp: string) => Promise<{ success: boolean; message: string }>;
  onPingServer: (ip: string, port: number) => Promise<{ success: boolean; latency?: number }>;
}

export function ServerDetail({ server, onUpdateIp, onPingServer }: ServerDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIp, setEditedIp] = useState('');
  const [saving, setSaving] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; latency?: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (server) {
      setEditedIp(server.ip);
      setIsEditing(false);
      setError('');
      setPingResult(null);
    }
  }, [server?.id]);

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="p-4 bg-muted rounded-full mb-4">
          <Activity className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Server Selected</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Select a server from the list to view details and manage its configuration.
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!validateIPAddress(editedIp)) {
      setError('Invalid IP address format');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const result = await onUpdateIp(server.id, editedIp);
      if (result.success) {
        setIsEditing(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update IP address');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedIp(server.ip);
    setIsEditing(false);
    setError('');
  };

  const handlePing = async () => {
    setPinging(true);
    setPingResult(null);
    try {
      const result = await onPingServer(server.ip, server.port);
      setPingResult(result);
    } catch (err) {
      setPingResult({ success: false });
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn('p-3 rounded-xl border-2', getStatusBgColor(server.status))}>
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{server.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">Server Configuration</p>
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
            className="capitalize text-sm px-3 py-1"
          >
            {server.status}
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* IP Configuration Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>IP Configuration</CardTitle>
                <CardDescription>Manage server network address</CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">IP Address</label>
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editedIp}
                    onChange={(e) => {
                      setEditedIp(e.target.value);
                      setError('');
                    }}
                    placeholder="192.168.1.100"
                    className={cn(error && 'border-destructive focus-visible:ring-destructive')}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={saving}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <code className="text-lg font-mono font-semibold">{server.ip}</code>
                  <span className="text-muted-foreground">:</span>
                  <code className="text-lg font-mono font-semibold">{server.port}</code>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePing}
                disabled={pinging}
                className="w-full"
              >
                <RefreshCw className={cn('w-4 h-4 mr-2', pinging && 'animate-spin')} />
                {pinging ? 'Pinging...' : 'Test Connection'}
              </Button>
              {pingResult && (
                <div
                  className={cn(
                    'mt-3 p-3 rounded-lg border',
                    pingResult.success
                      ? 'bg-success/10 border-success/20 text-success'
                      : 'bg-destructive/10 border-destructive/20 text-destructive'
                  )}
                >
                  <p className="text-sm font-medium">
                    {pingResult.success
                      ? `Connection successful • ${pingResult.latency}ms`
                      : 'Connection failed'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Server Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Server Information</CardTitle>
            <CardDescription>Additional server details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Last Seen</span>
                </div>
                <p className="text-sm font-medium">{formatDate(server.lastSeen)}</p>
              </div>

              {server.metadata?.version && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PackageOpen className="w-4 h-4" />
                    <span>Version</span>
                  </div>
                  <p className="text-sm font-medium">v{server.metadata.version}</p>
                </div>
              )}

              {server.metadata?.location && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                  <p className="text-sm font-medium">{server.metadata.location}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span>Server ID</span>
                </div>
                <p className="text-sm font-mono text-xs">{server.id}</p>
              </div>
            </div>

            {server.metadata && Object.keys(server.metadata).length > 2 && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-3">Additional Metadata</h4>
                <div className="space-y-2">
                  {Object.entries(server.metadata)
                    .filter(([key]) => !['version', 'location'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
