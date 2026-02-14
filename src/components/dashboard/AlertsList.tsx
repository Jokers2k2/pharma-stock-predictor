import { AlertTriangle, Clock, TrendingDown, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert } from '@/data/mockData';

interface AlertsListProps {
  alerts: Alert[];
  limit?: number;
}

const typeConfig = {
  rupture: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  expiry: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  overstock: { icon: Package, color: 'text-info', bg: 'bg-info/10' },
  prediction: { icon: TrendingDown, color: 'text-warning', bg: 'bg-warning/10' },
};

const severityBadge = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-info/10 text-info',
};

export function AlertsList({ alerts, limit }: AlertsListProps) {
  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  return (
    <div className="space-y-2">
      {displayAlerts.map((alert) => {
        const config = typeConfig[alert.type];
        const Icon = config.icon;
        return (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
              <Icon className={cn('w-4 h-4', config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-foreground truncate">{alert.product}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', severityBadge[alert.severity])}>
                  {alert.severity === 'high' ? 'Urgent' : alert.severity === 'medium' ? 'Moyen' : 'Faible'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{alert.message}</p>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.date}</span>
          </div>
        );
      })}
    </div>
  );
}
