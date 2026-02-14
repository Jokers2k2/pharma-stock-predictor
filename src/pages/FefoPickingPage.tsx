import { TopBar } from '@/components/layout/TopBar';
import { products } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { MapPin, ArrowRight, Clock, Package, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// FEFO: First Expired, First Out — sorted by expiry date
function generatePickingPath() {
  const sortedByExpiry = [...products]
    .filter((p) => p.available > 0)
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  // Group by zone for optimized path
  const zones: Record<string, typeof products> = {};
  sortedByExpiry.forEach((p) => {
    const zone = p.location.split('/')[0].trim();
    if (!zones[zone]) zones[zone] = [];
    zones[zone].push(p);
  });

  // Ordered zone path: Zone A → Zone B → Zone C (warehouse layout)
  const orderedZones = Object.keys(zones).sort();
  return orderedZones.map((zone) => ({
    zone,
    products: zones[zone],
  }));
}

export default function FefoPickingPage() {
  const [pickedItems, setPickedItems] = useState<Set<string>>(new Set());
  const path = generatePickingPath();
  const totalItems = path.reduce((s, z) => s + z.products.length, 0);
  const pickedCount = pickedItems.size;

  const togglePicked = (id: string) => {
    setPickedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <TopBar title="Picking FEFO" breadcrumb={['PharmaStock BI', 'Opérations', 'Picking FEFO']} />
      <div className="p-6 space-y-6">
        {/* Progress */}
        <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Parcours de picking optimisé (FEFO)</h3>
            <span className="text-xs text-muted-foreground">{pickedCount} / {totalItems} prélevé(s)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="kpi-gradient h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalItems > 0 ? (pickedCount / totalItems) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            🔬 Algorithme FEFO : les produits à péremption la plus courte sont prélevés en priorité, ordonnés par trajet optimisé dans l'entrepôt.
          </p>
        </div>

        {/* Picking path */}
        <div className="space-y-4">
          {path.map((zone, zi) => (
            <div key={zone.zone} className="space-y-2">
              <div className="flex items-center gap-2">
                {zi > 0 && <ArrowRight className="w-4 h-4 text-primary" />}
                <MapPin className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">{zone.zone}</h4>
                <Badge variant="secondary" className="text-[10px]">{zone.products.length} produit(s)</Badge>
              </div>

              <div className="ml-6 space-y-2">
                {zone.products.map((product, pi) => {
                  const daysToExpiry = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isPicked = pickedItems.has(product.id);
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        'flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer',
                        isPicked
                          ? 'bg-success/5 border-success/30 opacity-60'
                          : 'bg-card border-border hover:border-primary/30 hover:odoo-shadow'
                      )}
                      onClick={() => togglePicked(product.id)}
                    >
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                        isPicked ? 'bg-success text-success-foreground' : 'bg-primary/10 text-primary'
                      )}>
                        {isPicked ? <CheckCircle className="w-4 h-4" /> : pi + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{product.code}</span>
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{product.location} — Lot {product.lotNumber}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium">{product.available} dispo.</p>
                        <p className={cn('text-xs font-medium', daysToExpiry < 60 ? 'text-destructive' : daysToExpiry < 120 ? 'text-warning' : 'text-muted-foreground')}>
                          <Clock className="w-3 h-3 inline mr-0.5" />
                          Exp. {daysToExpiry}j
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {pickedCount === totalItems && totalItems > 0 && (
          <div className="text-center py-6 bg-success/10 rounded-xl border border-success/20">
            <CheckCircle className="w-10 h-10 text-success mx-auto mb-2" />
            <p className="text-sm font-semibold text-success">Picking terminé — Tous les produits ont été prélevés</p>
          </div>
        )}
      </div>
    </div>
  );
}
