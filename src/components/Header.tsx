
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-primary to-primary/60 rounded-lg shadow-lg">
          <svg
            className="w-6 h-6 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Server Manager
          </h1>
          <p className="text-xs text-muted-foreground">Network Discovery & Configuration</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme('light')}
            className={cn(
              'rounded-md transition-all',
              theme === 'light' && 'bg-background shadow-sm'
            )}
          >
            <Sun className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme('dark')}
            className={cn(
              'rounded-md transition-all',
              theme === 'dark' && 'bg-background shadow-sm'
            )}
          >
            <Moon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme('system')}
            className={cn(
              'rounded-md transition-all',
              theme === 'system' && 'bg-background shadow-sm'
            )}
          >
            <Monitor className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
