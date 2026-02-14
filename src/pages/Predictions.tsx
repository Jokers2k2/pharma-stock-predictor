import { TopBar } from '@/components/layout/TopBar';
import { PredictionChart } from '@/components/dashboard/PredictionChart';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { alerts } from '@/data/mockData';
import { Brain, TrendingDown, Target, Zap } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';

export default function Predictions() {
  const predictionAlerts = alerts.filter((a) => a.type === 'prediction' || a.type === 'rupture');

  return (
    <div>
      <TopBar title="Modèle prédictif" breadcrumb={['PharmaStock BI', 'Prédictions']} />
      <div className="p-6 space-y-6">
        {/* Model KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Précision du modèle" value="94.2%" change="ARIMA + ML hybride" changeType="positive" icon={Brain} variant="primary" />
          <KpiCard title="Ruptures évitées" value="12" change="Ce mois-ci" changeType="positive" icon={Target} />
          <KpiCard title="Ruptures prévues" value="3" change="Dans les 7 prochains jours" changeType="negative" icon={TrendingDown} variant="danger" />
          <KpiCard title="Réappros suggérés" value="5" change="Actions en attente" changeType="neutral" icon={Zap} variant="warning" />
        </div>

        {/* Main prediction chart */}
        <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Prévision du stock global — 7 jours</h3>
              <p className="text-xs text-muted-foreground mt-1">Basé sur les données historiques de 6 mois et le modèle ARIMA saisonnier</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-accent text-accent-foreground font-medium">Intervalle de confiance : 95%</span>
          </div>
          <PredictionChart />
        </div>

        {/* Alerts from predictions */}
        <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
          <h3 className="text-sm font-semibold text-foreground mb-4">Alertes prédictives et ruptures</h3>
          <AlertsList alerts={predictionAlerts} />
        </div>
      </div>
    </div>
  );
}
