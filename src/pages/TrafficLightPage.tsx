import { TopBar } from '@/components/layout/TopBar';
import { products } from '@/data/mockData';
import { cn } from '@/lib/utils';

function getTrafficLight(product: typeof products[0]) {
  const daysToExpiry = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const stockRatio = product.onHand / product.minStock;

  // Red: critical stock or expiring < 60 days
  if (product.status === 'critical' || daysToExpiry < 60) return 'red';
  // Yellow: low stock or expiring < 120 days
  if (product.status === 'low' || daysToExpiry < 120) return 'yellow';
  // Green
  return 'green';
}

const lightStyles = {
  red: { bg: 'bg-destructive', ring: 'ring-destructive/30', pulse: 'animate-pulse', text: 'text-destructive', label: 'Critique' },
  yellow: { bg: 'bg-warning', ring: 'ring-warning/30', pulse: '', text: 'text-warning', label: 'Attention' },
  green: { bg: 'bg-success', ring: 'ring-success/30', pulse: '', text: 'text-success', label: 'Normal' },
};

export default function TrafficLightPage() {
  const enriched = products.map((p) => ({ ...p, light: getTrafficLight(p) }));
  const red = enriched.filter((p) => p.light === 'red');
  const yellow = enriched.filter((p) => p.light === 'yellow');
  const green = enriched.filter((p) => p.light === 'green');

  const ProductCard = ({ product, light }: { product: typeof enriched[0]; light: 'red' | 'yellow' | 'green' }) => {
    const style = lightStyles[light];
    const daysToExpiry = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (
      <div className={cn('bg-card rounded-xl border p-4 odoo-shadow hover:odoo-shadow-md transition-all', light === 'red' ? 'border-destructive/30' : light === 'yellow' ? 'border-warning/30' : 'border-border')}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-mono text-muted-foreground">{product.code}</p>
            <p className="text-sm font-semibold text-foreground">{product.name}</p>
          </div>
          <div className={cn('w-4 h-4 rounded-full ring-4', style.bg, style.ring, style.pulse)} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Stock</span>
            <p className={cn('font-semibold', product.onHand < product.minStock ? 'text-destructive' : 'text-foreground')}>{product.onHand} / {product.minStock} min</p>
          </div>
          <div>
            <span className="text-muted-foreground">Péremption</span>
            <p className={cn('font-semibold', daysToExpiry < 60 ? 'text-destructive' : daysToExpiry < 120 ? 'text-warning' : 'text-foreground')}>{daysToExpiry}j restants</p>
          </div>
          <div>
            <span className="text-muted-foreground">Emplacement</span>
            <p className="text-foreground">{product.location}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Fournisseur</span>
            <p className="text-foreground">{product.supplier}</p>
          </div>
        </div>
      </div>
    );
  };

  const Section = ({ title, items, light, count }: { title: string; items: typeof enriched; light: 'red' | 'yellow' | 'green'; count: number }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={cn('w-3 h-3 rounded-full', lightStyles[light].bg)} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className={cn('text-xs font-medium', lightStyles[light].text)}>({count})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((p) => <ProductCard key={p.id} product={p} light={light} />)}
      </div>
    </div>
  );

  return (
    <div>
      <TopBar title="Tableau Trafic Light" breadcrumb={['PharmaStock BI', 'Surveillance', 'Trafic Light']} />
      <div className="p-6 space-y-8">
        {/* Summary bar */}
        <div className="flex items-center gap-6 bg-card rounded-xl border border-border p-4 odoo-shadow">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-semibold text-destructive">{red.length} critique(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-warning" />
            <span className="text-sm font-semibold text-warning">{yellow.length} attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-success" />
            <span className="text-sm font-semibold text-success">{green.length} normal</span>
          </div>
        </div>

        {red.length > 0 && <Section title="🔴 Zone critique — Action immédiate requise" items={red} light="red" count={red.length} />}
        {yellow.length > 0 && <Section title="🟡 Zone d'attention — Surveillance renforcée" items={yellow} light="yellow" count={yellow.length} />}
        {green.length > 0 && <Section title="🟢 Zone normale — Stock conforme" items={green} light="green" count={green.length} />}
      </div>
    </div>
  );
}
