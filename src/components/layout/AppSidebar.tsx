import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Pill,
  ScanLine,
  TrafficCone,
  ClipboardList,
  FileText,
  MapPin,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/traffic-light', icon: TrafficCone, label: 'Trafic Light' },
  { to: '/inventory', icon: Package, label: 'Inventaire' },
  { to: '/predictions', icon: TrendingUp, label: 'Prédictions' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alertes' },
  { to: '/analytics', icon: BarChart3, label: 'Analytique BI' },
  { to: '/reception', icon: ClipboardList, label: 'Réception' },
  { to: '/purchase-orders', icon: FileText, label: 'Bons de commande' },
  { to: '/smart-scan', icon: ScanLine, label: 'Smart Scan' },
  { to: '/fefo-picking', icon: MapPin, label: 'Picking FEFO' },
  { to: '/audit-trail', icon: Shield, label: 'Audit Trail' },
  { to: '/operations', icon: Truck, label: 'Opérations' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'sidebar-gradient h-screen flex flex-col border-r border-sidebar-border transition-all duration-300 fixed left-0 top-0 z-30',
        collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[var(--topbar-height)] border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg kpi-gradient flex items-center justify-center flex-shrink-0">
          <Pill className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-semibold text-sidebar-primary-foreground tracking-tight truncate">
              PharmaStock BI
            </h1>
            <p className="text-[10px] text-sidebar-muted truncate">Gestion prédictive</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive && 'text-sidebar-primary')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Settings + Collapse */}
      <div className="px-2 pb-4 space-y-1 border-t border-sidebar-border pt-4">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Paramètres</span>}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-muted hover:text-sidebar-foreground transition-colors w-full"
        >
          {collapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
          {!collapsed && <span>Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
