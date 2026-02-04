interface SearchOverlayProps {
  isSearching: boolean;
  progress: number;
  devicesFound: number;
}

export function SearchOverlay({ isSearching, progress, devicesFound }: SearchOverlayProps) {
  if (!isSearching) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-card-foreground mb-2">正在搜索设备</h3>
          <p className="text-sm text-muted-foreground">
            扫描网络中的所有设备...
          </p>
        </div>

        {/* Radar Animation */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Radar circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute w-full h-full border-2 border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
            />
            <div
              className="absolute w-full h-full border-2 border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="absolute w-full h-full border-2 border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute w-full h-full border-2 border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
              style={{ animationDelay: '1.5s' }}
            />
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full" />
          </div>

          {/* Scanning beam */}
          <div
            className="absolute top-1/2 left-1/2 w-1 h-24 -translate-x-1/2 origin-bottom animate-[spin_2s_linear_infinite]"
            style={{
              background: "linear-gradient(to top, hsl(var(--primary) / 0.8), transparent)",
            }}
          />

          {/* Device indicator dots */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const radius = 70;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-green-500 rounded-full transition-all duration-300 ${
                  i < devicesFound ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                  transitionDelay: `${i * 0.3}s`,
                }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">进度</span>
          <span className="text-card-foreground font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">已发现设备</span>
          <span className="text-card-foreground font-mono">{devicesFound} 台</span>
        </div>
      </div>
    </div>
  );
}
