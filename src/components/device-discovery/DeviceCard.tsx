import { Monitor, Wifi, HardDrive, Server, Camera, Printer } from "lucide-react";

export interface Device {
  id: string;
  name: string;
  type: "computer" | "router" | "storage" | "server" | "camera" | "printer";
  ipAddress: string;
  macAddress: string;
  gateway?: string;
  dns?: string;
  subnetMask?: string;
  status: "online" | "offline" | "warning";
  lastSeen: string;
  firmware?: string;
}

interface DeviceCardProps {
  device: Device;
  onClick?: (device: Device) => void;
}

const deviceIcons = {
  computer: Monitor,
  router: Wifi,
  storage: HardDrive,
  server: Server,
  camera: Camera,
  printer: Printer,
};

const deviceTypeNames = {
  computer: "计算机",
  router: "路由器",
  storage: "存储设备",
  server: "服务器",
  camera: "摄像头",
  printer: "打印机",
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  warning: "bg-yellow-500",
};

const statusNames = {
  online: "在线",
  offline: "离线",
  warning: "警告",
};

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  const Icon = deviceIcons[device.type];
  
  return (
    <div
      onClick={() => onClick?.(device)}
      className={`bg-card border border-border rounded-lg p-5 transition-all ${
        onClick ? 'cursor-pointer hover:border-muted-foreground hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-md">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-card-foreground mb-1">{device.name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {deviceTypeNames[device.type]}
            </p>
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${statusColors[device.status]}`}
          title={statusNames[device.status]}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">IP 地址</span>
          <span className="text-sm text-card-foreground font-mono">
            {device.ipAddress}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">MAC 地址</span>
          <span className="text-sm text-card-foreground font-mono">
            {device.macAddress}
          </span>
        </div>

        {device.firmware && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">固件版本</span>
            <span className="text-sm text-card-foreground font-mono">
              {device.firmware}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">最后连接</span>
          <span className="text-sm text-card-foreground">
            {device.lastSeen}
          </span>
        </div>
      </div>
    </div>
  );
}
