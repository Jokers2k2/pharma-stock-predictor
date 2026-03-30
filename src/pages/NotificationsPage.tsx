import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Package, Clock, TrendingUp, Check, CheckCheck, Trash2, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'stock' | 'expiry' | 'order' | 'prediction';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'high' | 'medium' | 'low';
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'stock', title: 'Rupture imminente', message: 'Le stock d\'Amoxicilline 1g est tombé sous le seuil critique (30 unités restantes).', timestamp: '2026-03-30T08:15:00', read: false, severity: 'high' },
  { id: '2', type: 'expiry', title: 'Péremption proche', message: '150 boîtes d\'Insuline Lantus expirent dans 11 jours (2026-04-10).', timestamp: '2026-03-30T07:30:00', read: false, severity: 'high' },
  { id: '3', type: 'order', title: 'Commande confirmée', message: 'La commande PO-2026-042 (Pfizer) a été confirmée. Livraison prévue le 05/04/2026.', timestamp: '2026-03-29T16:45:00', read: false, severity: 'low' },
  { id: '4', type: 'prediction', title: 'Hausse de demande prévue', message: 'Les modèles prévoient une augmentation de 40% pour les antipaludéens la semaine prochaine (saison des pluies).', timestamp: '2026-03-29T14:00:00', read: true, severity: 'medium' },
  { id: '5', type: 'stock', title: 'Stock faible', message: 'Métformine 850mg : 120 unités restantes, seuil minimum à 200.', timestamp: '2026-03-29T11:20:00', read: true, severity: 'medium' },
  { id: '6', type: 'expiry', title: 'Lot à retirer', message: 'Le lot LOT-2025B042 d\'Amoxicilline expire le 20/05/2026. Action FEFO recommandée.', timestamp: '2026-03-28T09:00:00', read: true, severity: 'medium' },
  { id: '7', type: 'order', title: 'Réception effectuée', message: '500 unités de Paracétamol 500mg réceptionnées et enregistrées (Lot LOT-2026A012).', timestamp: '2026-03-28T08:00:00', read: true, severity: 'low' },
  { id: '8', type: 'prediction', title: 'Recommandation de commande', message: 'Commander 300 unités de Doliprane 1000mg avant le 02/04 pour couvrir la demande prévue.', timestamp: '2026-03-27T15:30:00', read: true, severity: 'low' },
];

const typeConfig = {
  stock: { icon: Package, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Stock' },
  expiry: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Péremption' },
  order: { icon: AlertTriangle, color: 'text-primary', bg: 'bg-primary/10', label: 'Commande' },
  prediction: { icon: TrendingUp, color: 'text-info', bg: 'bg-info/10', label: 'Prédiction' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [tab, setTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = tab === 'all' ? notifications : tab === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === tab);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
    if (diffH < 1) return 'À l\'instant';
    if (diffH < 24) return `Il y a ${diffH}h`;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Notifications" breadcrumb={['PharmaStock BI', 'Notifications']} />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Centre de notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">{unreadCount} non lues</Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="w-4 h-4" /> Tout marquer comme lu
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="expiry">Péremption</TabsTrigger>
            <TabsTrigger value="order">Commandes</TabsTrigger>
            <TabsTrigger value="prediction">Prédictions</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4 space-y-2">
            {filtered.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">Aucune notification dans cette catégorie</CardContent></Card>
            ) : (
              filtered.map(n => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                return (
                  <Card key={n.id} className={cn('transition-all', !n.read && 'border-l-4 border-l-primary bg-primary/5')}>
                    <CardContent className="flex items-start gap-4 py-4">
                      <div className={cn('p-2 rounded-lg mt-0.5', cfg.bg)}>
                        <Icon className={cn('w-4 h-4', cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">{n.title}</span>
                          <Badge variant="outline" className="text-[10px]">{cfg.label}</Badge>
                          {n.severity === 'high' && <Badge className="bg-destructive/10 text-destructive text-[10px] border-0">Urgent</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <span className="text-xs text-muted-foreground mt-1 block">{formatTime(n.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {!n.read && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markAsRead(n.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteNotif(n.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
