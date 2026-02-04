import { useState } from "react";
import { DeviceDiscoveryHeader } from "./DeviceDiscoveryHeader";
import { DeviceCard, Device } from "./DeviceCard";
import { DeviceEditDialog } from "./DeviceEditDialog";
import { SearchOverlay } from "./SearchOverlay";

// Mock device data
const initialDevices: Device[] = [
  {
    id: "1",
    name: "工程工作站 01",
    type: "computer",
    ipAddress: "192.168.1.101",
    macAddress: "00:1B:63:84:45:E6",
    gateway: "192.168.1.1",
    dns: "8.8.8.8",
    subnetMask: "255.255.255.0",
    status: "online",
    lastSeen: "2分钟前",
    firmware: "v2.4.1",
  },
  {
    id: "2",
    name: "核心路由器",
    type: "router",
    ipAddress: "192.168.1.1",
    macAddress: "00:1A:2B:3C:4D:5E",
    gateway: "192.168.0.1",
    dns: "1.1.1.1",
    subnetMask: "255.255.255.0",
    status: "online",
    lastSeen: "1分钟前",
    firmware: "v5.2.8",
  },
  {
    id: "3",
    name: "NAS 存储单元",
    type: "storage",
    ipAddress: "192.168.1.150",
    macAddress: "00:50:56:A1:B2:C3",
    gateway: "192.168.1.1",
    dns: "8.8.8.8",
    subnetMask: "255.255.255.0",
    status: "online",
    lastSeen: "5分钟前",
    firmware: "v3.1.0",
  },
  {
    id: "4",
    name: "应用服务器",
    type: "server",
    ipAddress: "192.168.1.200",
    macAddress: "00:0C:29:4F:8A:1D",
    gateway: "192.168.1.1",
    dns: "8.8.4.4",
    subnetMask: "255.255.255.0",
    status: "warning",
    lastSeen: "15分钟前",
    firmware: "v4.0.2",
  },
  {
    id: "5",
    name: "安防摄像头 01",
    type: "camera",
    ipAddress: "192.168.1.50",
    macAddress: "00:12:17:A4:7B:9C",
    gateway: "192.168.1.1",
    dns: "8.8.8.8",
    subnetMask: "255.255.255.0",
    status: "online",
    lastSeen: "3分钟前",
  },
  {
    id: "6",
    name: "网络打印机",
    type: "printer",
    ipAddress: "192.168.1.75",
    macAddress: "00:1E:C9:3D:5F:2A",
    gateway: "192.168.1.1",
    dns: "8.8.8.8",
    subnetMask: "255.255.255.0",
    status: "offline",
    lastSeen: "2小时前",
    firmware: "v1.8.5",
  },
  {
    id: "7",
    name: "工程工作站 02",
    type: "computer",
    ipAddress: "192.168.1.102",
    macAddress: "00:1B:63:84:45:E7",
    gateway: "192.168.1.1",
    dns: "8.8.8.8",
    subnetMask: "255.255.255.0",
    status: "online",
    lastSeen: "1分钟前",
    firmware: "v2.4.1",
  },
  {
    id: "8",
    name: "备份服务器",
    type: "server",
    ipAddress: "192.168.1.201",
    macAddress: "00:0C:29:4F:8A:1E",
    gateway: "192.168.1.1",
    dns: "8.8.4.4",
    subnetMask: "255.255.255.0",
    status: "online",
    lastSeen: "4分钟前",
    firmware: "v4.0.2",
  },
  {
    id: "9",
    name: "安防摄像头 02",
    type: "camera",
    ipAddress: "192.168.1.51",
    macAddress: "00:12:17:A4:7B:9D",
    gateway: "192.168.1.1",
    dns: "8.8.8.8",
    subnetMask: "255.255.255.0",
    status: "online",
    lastSeen: "2分钟前",
  },
];

export function DeviceDiscovery() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [devicesFound, setDevicesFound] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDevices([...devices]);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setSearchProgress(0);
    setDevicesFound(0);
    setDevices([]);

    const totalDuration = 5000;
    const steps = 100;
    const stepDuration = totalDuration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;
      setSearchProgress(Math.min(progress, 100));

      if (currentStep === 20) setDevicesFound(1);
      if (currentStep === 30) setDevicesFound(2);
      if (currentStep === 45) setDevicesFound(3);
      if (currentStep === 55) setDevicesFound(4);
      if (currentStep === 65) setDevicesFound(5);
      if (currentStep === 75) setDevicesFound(6);
      if (currentStep === 82) setDevicesFound(7);
      if (currentStep === 90) setDevicesFound(8);
      if (currentStep === 95) setDevicesFound(9);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setDevices(initialDevices);
          setIsSearching(false);
          setSearchProgress(0);
          setDevicesFound(0);
        }, 500);
      }
    }, stepDuration);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setIsDialogOpen(true);
  };

  const handleSaveDevice = (updatedDevice: Device) => {
    setDevices(devices.map(d => 
      d.id === updatedDevice.id ? updatedDevice : d
    ));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDevice(null);
  };

  return (
    <div className={`h-screen flex flex-col bg-background ${isDarkMode ? 'dark' : ''}`}>
      <DeviceDiscoveryHeader 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onSearch={handleSearch}
        isSearching={isSearching}
      />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={handleDeviceClick}
            />
          ))}
        </div>
        
        {devices.length === 0 && !isSearching && (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              未发现设备。点击搜索设备按钮开始扫描。
            </p>
          </div>
        )}
      </main>

      <SearchOverlay
        isSearching={isSearching}
        progress={searchProgress}
        devicesFound={devicesFound}
      />

      <DeviceEditDialog
        device={selectedDevice}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveDevice}
      />
    </div>
  );
}
