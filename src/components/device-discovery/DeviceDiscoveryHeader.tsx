import { RefreshCw, Moon, Sun, Search } from "lucide-react";

interface DeviceDiscoveryHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSearch: () => void;
  isSearching?: boolean;
}

export function DeviceDiscoveryHeader({ 
  onRefresh, 
  isRefreshing = false, 
  isDarkMode, 
  onToggleTheme, 
  onSearch, 
  isSearching = false 
}: DeviceDiscoveryHeaderProps) {
  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">设备发现</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onSearch}
            disabled={isSearching}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="搜索设备"
          >
            <Search 
              className={`w-4 h-4 ${isSearching ? 'animate-pulse' : ''}`} 
            />
            <span>{isSearching ? '搜索中...' : '搜索设备'}</span>
          </button>
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent transition-colors"
            aria-label="切换主题"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            <span>{isDarkMode ? '浅色' : '深色'}</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="刷新设备列表"
          >
            <RefreshCw 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
            <span>刷新</span>
          </button>
        </div>
      </div>
    </header>
  );
}
