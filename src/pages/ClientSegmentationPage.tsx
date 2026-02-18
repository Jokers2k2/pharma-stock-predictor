import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { products } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Building2,
  Stethoscope,
  ShoppingBag,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Package,
  ArrowRight,
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy';
  priority: 'P1' | 'P2' | 'P3';
  city: string;
  pendingOrders: number;
  totalValue: number;
  criticalNeed: boolean;
  products: string[];
}

const clients: Client[] = [
  { id: '1', name: 'CHU Bordeaux', type: 'hospital', priority: 'P1', city: 'Bordeaux', pendingOrders: 3, totalValue: 12450, criticalNeed: true, products: ['Amoxicilline 1g', 'Insuline Lantus', 'Clopidogrel 75mg'] },
  { id: '2', name: 'Hôpital Saint-Jean', type: 'hospital', priority: 'P1', city: 'Toulouse', pendingOrders: 2, totalValue: 8320, criticalNeed: true, products: ['Ibuprofène 400mg', 'Paracétamol 500mg'] },
  { id: '3', name: 'Clinique du Parc', type: 'clinic', priority: 'P2', city: 'Lyon', pendingOrders: 1, totalValue: 3200, criticalNeed: false, products: ['Losartan 50mg', 'Atorvastatine 20mg'] },
  { id: '4', name: 'Clinique Médipôle', type: 'clinic', priority: 'P2', city: 'Montpellier', pendingOrders: 2, totalValue: 4100, criticalNeed: true, products: ['Metformine 850mg', 'Insuline Lantus'] },
  { id: '5', name: 'Pharmacie Centrale', type: 'pharmacy', priority: 'P3', city: 'Paris', pendingOrders: 1, totalValue: 1850, criticalNeed: false, products: ['Doliprane 1000mg', 'Ventoline spray'] },
  { id: '6', name: 'Pharmacie du Marché', type: 'pharmacy', priority: 'P3', city: 'Marseille', pendingOrders: 1, totalValue: 920, criticalNeed: false, products: ['Paracétamol 500mg'] },
  { id: '7', name: 'Polyclinique Atlantique', type: 'clinic', priority: 'P2', city: 'Nantes', pendingOrders: 3, totalValue: 5600, criticalNeed: true, products: ['Clopidogrel 75mg', 'Amoxicilline 1g'] },
  { id: '8', name: 'Pharmacie Saint-Michel', type: 'pharmacy', priority: 'P3', city: 'Bordeaux', pendingOrders: 2, totalValue: 1200, criticalNeed: false, products: ['Ibuprofène 400mg'] },
];

const typeConfig = {
  hospital: { label: 'Hôpital', icon: Building2, className: 'bg-destructive/10 text-destructive', priority: 'P1' },
  clinic: { label: 'Clinique', icon: Stethoscope, className: 'bg-warning/10 text-warning', priority: 'P2' },
  pharmacy: { label: 'Pharmacie', icon: ShoppingBag, className: 'bg-info/10 text-info', priority: 'P3' },
};

const priorityConfig = {
  P1: { label: 'Priorité 1', className: 'bg-destructive text-destructive-foreground' },
  P2: { label: 'Priorité 2', className: 'bg-warning text-warning-foreground' },
  P3: { label: 'Priorité 3', className: 'bg-muted text-muted-foreground' },
};

interface DeliveryPlan {
  clientId: string;
  product: string;
  allocatedQty: number;
  priority: 'P1' | 'P2' | 'P3';
}

function generateAllocationPlan(): DeliveryPlan[] {
  const criticalProduct = products.find(p => p.code === 'MED-002'); // Amoxicilline
  if (!criticalProduct) return [];

  let remaining = criticalProduct.available;
  const plans: DeliveryPlan[] = [];

  // P1 first
  const p1Clients = clients.filter(c => c.priority === 'P1' && c.products.includes('Amoxicilline 1g'));
  p1Clients.forEach(c => {
    const alloc = Math.min(remaining, 15);
    if (alloc > 0) {
      plans.push({ clientId: c.id, product: 'Amoxicilline 1g', allocatedQty: alloc, priority: 'P1' });
      remaining -= alloc;
    }
  });

  // P2
  const p2Clients = clients.filter(c => c.priority === 'P2' && c.products.includes('Amoxicilline 1g'));
  p2Clients.forEach(c => {
    const alloc = Math.min(remaining, 8);
    if (alloc > 0) {
      plans.push({ clientId: c.id, product: 'Amoxicilline 1g', allocatedQty: alloc, priority: 'P2' });
      remaining -= alloc;
    }
  });

  return plans;
}

export default function ClientSegmentationPage() {
  const [filter, setFilter] = useState<'all' | 'hospital' | 'clinic' | 'pharmacy'>('all');
  const [showPlan, setShowPlan] = useState(false);
  const allocationPlan = generateAllocationPlan();

  const criticalProducts = products.filter(p => p.status === 'critical');
  const filteredClients = clients.filter(c => filter === 'all' || c.type === filter);
  const totalValue = clients.reduce((s, c) => s + c.totalValue, 0);
  const criticalClients = clients.filter(c => c.criticalNeed).length;

  return (
    <div>
      <TopBar
        title="Segmentation clients"
        breadcrumb={['PharmaStock BI', 'Analytique', 'Segmentation clients']}
      />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 odoo-shadow">
            <Users className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{clients.length}</p>
            <p className="text-xs text-muted-foreground">Clients actifs</p>
          </div>
          <div className="bg-card rounded-xl border border-destructive/20 p-4 odoo-shadow">
            <AlertTriangle className="w-5 h-5 text-destructive mb-2" />
            <p className="text-2xl font-bold text-destructive">{criticalClients}</p>
            <p className="text-xs text-muted-foreground">Besoins critiques</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 odoo-shadow">
            <TrendingUp className="w-5 h-5 text-success mb-2" />
            <p className="text-2xl font-bold text-foreground">{totalValue.toLocaleString('fr-FR')} €</p>
            <p className="text-xs text-muted-foreground">Valeur des commandes</p>
          </div>
          <div className="bg-card rounded-xl border border-warning/20 p-4 odoo-shadow">
            <Package className="w-5 h-5 text-warning mb-2" />
            <p className="text-2xl font-bold text-warning">{criticalProducts.length}</p>
            <p className="text-xs text-muted-foreground">Produits en tension</p>
          </div>
        </div>

        {/* Stock critique + Plan de rationnement */}
        {criticalProducts.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Stock limité — Plan de rationnement activé</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {criticalProducts.map(p => p.name).join(', ')} — allocation prioritaire selon criticité client (P1 &gt; P2 &gt; P3)
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-destructive/40 text-destructive hover:bg-destructive/10 flex-shrink-0"
                onClick={() => setShowPlan(!showPlan)}
              >
                {showPlan ? 'Masquer' : 'Voir le plan'}
              </Button>
            </div>

            {showPlan && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-foreground">Plan d'allocation — Amoxicilline 1g (30 unités disponibles)</p>
                {allocationPlan.map((plan, i) => {
                  const client = clients.find(c => c.id === plan.clientId);
                  const pConf = priorityConfig[plan.priority];
                  return (
                    <div key={i} className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
                      <Badge className={cn('text-[10px] flex-shrink-0', pConf.className)}>{plan.priority}</Badge>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs font-medium flex-1">{client?.name}</span>
                      <span className="text-xs text-primary font-semibold">{plan.allocatedQty} unités</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(['all', 'hospital', 'clinic', 'pharmacy'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              )}
            >
              {f === 'all' ? 'Tous' : f === 'hospital' ? 'Hôpitaux' : f === 'clinic' ? 'Cliniques' : 'Pharmacies'}
            </button>
          ))}
          <span className="text-xs text-muted-foreground ml-2">{filteredClients.length} client(s)</span>
        </div>

        {/* Client grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients
            .sort((a, b) => a.priority.localeCompare(b.priority))
            .map((client) => {
              const tConf = typeConfig[client.type];
              const pConf = priorityConfig[client.priority];
              return (
                <div
                  key={client.id}
                  className={cn(
                    'bg-card rounded-xl border p-5 odoo-shadow transition-all hover:border-primary/30',
                    client.criticalNeed ? 'border-destructive/30' : 'border-border'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', tConf.className)}>
                        <tConf.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{client.name}</p>
                        <p className="text-[11px] text-muted-foreground">{client.city} — {tConf.label}</p>
                      </div>
                    </div>
                    <Badge className={cn('text-[10px]', pConf.className)}>{client.priority}</Badge>
                  </div>

                  {client.criticalNeed && (
                    <div className="flex items-center gap-1.5 text-destructive bg-destructive/5 rounded-lg px-2.5 py-1.5 mb-3">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      <span className="text-[11px] font-medium">Besoin critique actif</span>
                    </div>
                  )}

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Commandes en attente</span>
                      <span className="font-medium text-foreground">{client.pendingOrders}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Valeur totale</span>
                      <span className="font-medium text-foreground">{client.totalValue.toLocaleString('fr-FR')} €</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-[11px] text-muted-foreground mb-1.5">Produits commandés</p>
                    <div className="flex flex-wrap gap-1">
                      {client.products.map((prod) => {
                        const isCritical = criticalProducts.some(p => p.name === prod);
                        return (
                          <Badge
                            key={prod}
                            variant="secondary"
                            className={cn(
                              'text-[10px]',
                              isCritical ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'
                            )}
                          >
                            {isCritical && <AlertTriangle className="w-2.5 h-2.5 mr-1" />}
                            {prod.split(' ')[0]}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                      Voir commandes
                    </Button>
                    <Button size="sm" className="flex-1 text-xs h-7 gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Prioriser
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
