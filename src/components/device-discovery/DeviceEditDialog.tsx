import { useState } from "react";
import { X } from "lucide-react";
import { Device } from "./DeviceCard";

interface DeviceEditDialogProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: Device) => void;
}

export function DeviceEditDialog({ device, isOpen, onClose, onSave }: DeviceEditDialogProps) {
  const [formData, setFormData] = useState<Partial<Device>>({});

  // Update form data when device changes
  useState(() => {
    if (device) {
      setFormData({
        ipAddress: device.ipAddress,
        gateway: device.gateway,
        dns: device.dns,
        subnetMask: device.subnetMask,
      });
    }
  });

  if (!isOpen || !device) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedDevice: Device = {
      ...device,
      ipAddress: formData.ipAddress || device.ipAddress,
      gateway: formData.gateway || device.gateway,
      dns: formData.dns || device.dns,
      subnetMask: formData.subnetMask || device.subnetMask,
    };
    
    onSave(updatedDevice);
    onClose();
  };

  const handleChange = (field: keyof Device, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-background border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-card-foreground mb-1">编辑网络配置</h2>
            <p className="text-sm text-muted-foreground">{device.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm mb-2 text-card-foreground">
              IP 地址
            </label>
            <input
              type="text"
              value={formData.ipAddress || device.ipAddress}
              onChange={(e) => handleChange('ipAddress', e.target.value)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              placeholder="192.168.1.100"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-card-foreground">
              子网掩码
            </label>
            <input
              type="text"
              value={formData.subnetMask || device.subnetMask || ''}
              onChange={(e) => handleChange('subnetMask', e.target.value)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              placeholder="255.255.255.0"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-card-foreground">
              网关
            </label>
            <input
              type="text"
              value={formData.gateway || device.gateway || ''}
              onChange={(e) => handleChange('gateway', e.target.value)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              placeholder="192.168.1.1"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-card-foreground">
              DNS 服务器
            </label>
            <input
              type="text"
              value={formData.dns || device.dns || ''}
              onChange={(e) => handleChange('dns', e.target.value)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              placeholder="8.8.8.8"
            />
          </div>

          {/* MAC Address (read-only) */}
          <div>
            <label className="block text-sm mb-2 text-card-foreground">
              MAC 地址
            </label>
            <input
              type="text"
              value={device.macAddress}
              disabled
              className="w-full px-3 py-2 bg-muted border border-border rounded-md font-mono text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              保存配置
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
