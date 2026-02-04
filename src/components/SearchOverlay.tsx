import { motion } from 'motion/react';

interface SearchOverlayProps {
  isSearching: boolean;
  progress: number;
  serversFound: number;
}

export function SearchOverlay({ isSearching, progress, serversFound }: SearchOverlayProps) {
  if (!isSearching) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-2">正在搜索服务器</h3>
          <p className="text-sm text-muted-foreground">
            扫描网络中的所有服务器...
          </p>
        </div>

        {/* Radar Animation */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Radar circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="absolute w-full h-full border-2 border-primary/20 rounded-full"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute w-full h-full border-2 border-primary/20 rounded-full"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute w-full h-full border-2 border-primary/20 rounded-full"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                delay: 1,
              }}
            />
            <motion.div
              className="absolute w-full h-full border-2 border-primary/20 rounded-full"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                delay: 1.5,
              }}
            />
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full" />
          </div>

          {/* Scanning beam */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-1 h-24 -translate-x-1/2 origin-bottom"
            style={{
              background: 'linear-gradient(to top, hsl(var(--primary) / 0.8), transparent)',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Server indicator dots */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const radius = 70;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-500 rounded-full"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: i < serversFound ? 1 : 0,
                  opacity: i < serversFound ? 1 : 0,
                }}
                transition={{
                  delay: i * 0.3,
                  duration: 0.3,
                }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">进度</span>
          <span className="text-card-foreground font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">已发现服务器</span>
          <span className="text-card-foreground font-mono">{serversFound} 台</span>
        </div>
      </div>
    </div>
  );
}
