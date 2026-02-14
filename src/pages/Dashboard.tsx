import { Package, AlertTriangle, TrendingDown, ArrowUpDown, RefreshCcw, Calendar } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { StockTrendChart } from '@/components/dashboard/StockTrendChart';
import { PredictionChart } from '@/components/dashboard/PredictionChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { alerts, products } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const totalStock = products.reduce((sum, p) => sum + p.onHand, 0);
  const criticalCount = products.filter((p) => p.status === 'critical').length;
  const lowCount = products.filter((p) => p.status === 'low').length;
  const totalValue = products.reduce((sum, p) => sum + p.onHand * p.unitPrice, 0);

  return (
    <div>
      <TopBar title="Tableau de bord" breadcrumb={['PharmaStock BI', 'Vue d\'ensemble']} />
      <div className="p-6 space-y-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Février 2026
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <RefreshCcw className="w-3.5 h-3.5" />
              Actualiser
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Dernière mise à jour : 14/02/2026, 09:45</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Stock total"
            value={totalStock.toLocaleString('fr-FR')}
            change="+2.3% vs mois dernier"
            changeType="positive"
            icon={Package}
            variant="primary"
          />
          <KpiCard
            title="Alertes critiques"
            value={criticalCount}
            change={`${lowCount} produits en stock bas`}
            changeType="negative"
            icon={AlertTriangle}
            variant="danger"
          />
          <KpiCard
            title="Taux de rotation"
            value="4.2x"
            change="-0.3 vs mois dernier"
            changeType="negative"
            icon={ArrowUpDown}
          />
          <KpiCard
            title="Valeur du stock"
            value={`${(totalValue / 1000).toFixed(1)}K €`}
            change="+1.8% vs mois dernier"
            changeType="positive"
            icon={TrendingDown}
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Mouvements de stock (6 mois)</h3>
            <StockTrendChart />
          </div>
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Prévision stock global (7 jours)</h3>
              <span className="text-[10px] px-2 py-1 rounded-full bg-warning/10 text-warning font-medium">Modèle ARIMA</span>
            </div>
            <PredictionChart />
          </div>
        </div>

        {/* Charts row 2 + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Répartition par catégorie</h3>
            <CategoryChart />
          </div>
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Top 5 — Produits les plus demandés</h3>
            <TopProductsChart />
          </div>
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Alertes récentes</h3>
              <span className="text-xs text-primary cursor-pointer hover:underline">Voir tout</span>
            </div>
            <AlertsList alerts={alerts} limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
