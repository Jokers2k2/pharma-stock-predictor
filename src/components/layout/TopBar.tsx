import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { alerts } from '@/data/mockData';

interface TopBarProps {
  title: string;
  breadcrumb?: string[];
}

export function TopBar({ title, breadcrumb }: TopBarProps) {
  const criticalAlerts = alerts.filter((a) => a.severity === 'high').length;

  return (
    <header className="h-[var(--topbar-height)] bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          {breadcrumb && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
              {breadcrumb.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span>/</span>}
                  <span>{item}</span>
                </span>
              ))}
            </div>
          )}
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-9 w-64 h-9 bg-secondary border-0 text-sm"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          {criticalAlerts > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground border-0">
              {criticalAlerts}
            </Badge>
          )}
        </button>

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
}
