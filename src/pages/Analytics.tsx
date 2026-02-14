import { TopBar } from '@/components/layout/TopBar';
import { StockTrendChart } from '@/components/dashboard/StockTrendChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { PredictionChart } from '@/components/dashboard/PredictionChart';

export default function Analytics() {
  return (
    <div>
      <TopBar title="Analytique BI" breadcrumb={['PharmaStock BI', 'Analytique']} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Flux de stock — Entrées vs Sorties</h3>
            <StockTrendChart />
          </div>
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Prévision stock global</h3>
            <PredictionChart />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Répartition par catégorie thérapeutique</h3>
            <CategoryChart />
          </div>
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Produits à plus forte rotation</h3>
            <TopProductsChart />
          </div>
        </div>
      </div>
    </div>
  );
}
