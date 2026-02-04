import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

export function validateIPAddress(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'online':
      return 'text-success';
    case 'offline':
      return 'text-muted-foreground';
    case 'warning':
      return 'text-warning';
    case 'error':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'online':
      return 'bg-success/10 border-success/20';
    case 'offline':
      return 'bg-muted border-border';
    case 'warning':
      return 'bg-warning/10 border-warning/20';
    case 'error':
      return 'bg-destructive/10 border-destructive/20';
    default:
      return 'bg-muted border-border';
  }
}
