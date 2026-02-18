import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { products } from '@/data/mockData';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  FlaskConical,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  Truck,
  ShoppingCart,
  RefreshCcw,
} from 'lucide-react';

interface Scenario {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const scenarios: Scenario[] = [
  {
    id: 'supplier_delay',
    label: 'Retard fournisseur',
    icon: Truck,
    color: 'text-destructive',
    description: 'Simuler un retard de livraison du fournisseur principal',
  },
  {
    id: 'demand_surge',
    label: 'Hausse de demande',
    icon: TrendingUp,
    color: 'text-warning',
    description: 'Simuler une hausse soudaine de la demande (épidémie, saison)',
  },
  {
    id: 'price_increase',
    label: 'Hausse des prix',
    icon: ShoppingCart,
    color: 'text-info',
    description: 'Simuler une augmentation des prix fournisseurs',
  },
  {
    id: 'combined',
    label: 'Scénario combiné',
    icon: FlaskConical,
    color: 'text-primary',
    description: 'Combiner retard fournisseur ET hausse de la demande',
  },
];

function generateSimulationData(
  scenarioId: string,
  delayDays: number,
  demandIncrease: number,
  priceIncrease: number
) {
  const baseStock = 11800;
  const baseConsumption = 200;
  const days = 14;

  return Array.from({ length: days }, (_, i) => {
    const day = i + 15;
    const label = `${day}/02`;

    // Scénario de base
    const baselineFinal = Math.max(0, baseStock - baseConsumption * i);

    // Impact retard fournisseur
    const supplierImpact = scenarioId === 'supplier_delay' || scenarioId === 'combined'
      ? (i >= delayDays ? 0 : -baseConsumption * Math.min(i, delayDays) * 0.3)
      : 0;

    // Impact hausse de demande
    const demandImpact = scenarioId === 'demand_surge' || scenarioId === 'combined'
      ? -baseConsumption * i * (demandIncrease / 100)
      : 0;

    const simulatedFinal = Math.max(0, baselineFinal + supplierImpact + demandImpact);
    const criticalThreshold = 8000;

    return {
      label,
      baseline: Math.round(baselineFinal),
      simulated: Math.round(simulatedFinal),
      critical: criticalThreshold,
    };
  });
}

export default function WhatIfPage() {
  const [activeScenario, setActiveScenario] = useState('supplier_delay');
  const [delayDays, setDelayDays] = useState(15);
  const [demandIncrease, setDemandIncrease] = useState(30);
  const [priceIncrease, setPriceIncrease] = useState(20);

  const data = generateSimulationData(activeScenario, delayDays, demandIncrease, priceIncrease);
  const minSimulated = Math.min(...data.map((d) => d.simulated));
  const minBaseline = Math.min(...data.map((d) => d.baseline));
  const stockImpact = minBaseline - minSimulated;
  const daysToRupture = data.findIndex((d) => d.simulated < 8000);
  const criticalProducts = products.filter((p) => p.status === 'critical' || p.status === 'low');
  const financialLoss = activeScenario === 'price_increase'
    ? Math.round(products.reduce((s, p) => s + p.onHand * p.unitPrice, 0) * (priceIncrease / 100))
    : Math.round(stockImpact * 4.5);

  return (
    <div>
      <TopBar
        title="Simulation What-If"
        breadcrumb={['PharmaStock BI', 'Prédictions', 'Simulation What-If']}
      />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Moteur de simulation de scénarios</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Testez des scénarios hypothétiques pour anticiper les risques et préparer des plans de contingence.
                Ajustez les paramètres et observez l'impact en temps réel sur votre stock.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario selection */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenario(s.id)}
              className={cn(
                'text-left p-4 rounded-xl border transition-all duration-200',
                activeScenario === s.id
                  ? 'border-primary bg-accent shadow-sm'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50'
              )}
            >
              <s.icon className={cn('w-5 h-5 mb-2', activeScenario === s.id ? 'text-primary' : s.color)} />
              <p className={cn('text-sm font-semibold', activeScenario === s.id ? 'text-primary' : 'text-foreground')}>
                {s.label}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parameters panel */}
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow space-y-6">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-primary" />
              Paramètres du scénario
            </h3>

            {(activeScenario === 'supplier_delay' || activeScenario === 'combined') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Retard fournisseur</label>
                  <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">
                    {delayDays} jours
                  </Badge>
                </div>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  value={[delayDays]}
                  onValueChange={([v]) => setDelayDays(v)}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1 jour</span>
                  <span>30 jours</span>
                </div>
              </div>
            )}

            {(activeScenario === 'demand_surge' || activeScenario === 'combined') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Hausse de demande</label>
                  <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">
                    +{demandIncrease}%
                  </Badge>
                </div>
                <Slider
                  min={5}
                  max={100}
                  step={5}
                  value={[demandIncrease]}
                  onValueChange={([v]) => setDemandIncrease(v)}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>+5%</span>
                  <span>+100%</span>
                </div>
              </div>
            )}

            {activeScenario === 'price_increase' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Hausse des prix</label>
                  <Badge variant="secondary" className="text-xs bg-info/10 text-info">
                    +{priceIncrease}%
                  </Badge>
                </div>
                <Slider
                  min={1}
                  max={50}
                  step={1}
                  value={[priceIncrease]}
                  onValueChange={([v]) => setPriceIncrease(v)}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>+1%</span>
                  <span>+50%</span>
                </div>
              </div>
            )}

            {/* Products at risk */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3">Produits les plus exposés</p>
              <div className="space-y-2">
                {criticalProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-xs text-foreground truncate flex-1">{p.name}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-[10px] ml-2 flex-shrink-0',
                        p.status === 'critical' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                      )}
                    >
                      {p.available} dispo.
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full text-sm gap-2" size="sm">
              <FlaskConical className="w-4 h-4" />
              Exporter le rapport
            </Button>
          </div>

          {/* Simulation chart */}
          <div className="lg:col-span-2 space-y-4">
            {/* Impact KPIs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card rounded-xl border border-destructive/20 p-4 odoo-shadow text-center">
                <p className="text-[11px] text-muted-foreground mb-1">Impact stock</p>
                <p className="text-xl font-bold text-destructive">-{stockImpact.toLocaleString('fr-FR')}</p>
                <p className="text-[10px] text-muted-foreground">unités perdues</p>
              </div>
              <div className={cn(
                'bg-card rounded-xl border p-4 odoo-shadow text-center',
                daysToRupture >= 0 ? 'border-warning/20' : 'border-success/20'
              )}>
                <p className="text-[11px] text-muted-foreground mb-1">Jours avant rupture</p>
                <p className={cn('text-xl font-bold', daysToRupture >= 0 ? 'text-warning' : 'text-success')}>
                  {daysToRupture >= 0 ? `J+${daysToRupture}` : 'Aucun'}
                </p>
                <p className="text-[10px] text-muted-foreground">seuil critique</p>
              </div>
              <div className="bg-card rounded-xl border border-info/20 p-4 odoo-shadow text-center">
                <p className="text-[11px] text-muted-foreground mb-1">Impact financier</p>
                <p className="text-xl font-bold text-info">
                  {financialLoss > 0 ? `+${financialLoss.toLocaleString('fr-FR')} €` : '0 €'}
                </p>
                <p className="text-[10px] text-muted-foreground">coût estimé</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Impact sur le stock global — 14 jours</h3>
                {daysToRupture >= 0 && (
                  <Badge variant="secondary" className="text-[10px] bg-destructive/10 text-destructive gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Rupture à J+{daysToRupture}
                  </Badge>
                )}
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174,62%,35%)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(174,62%,35%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="simulatedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0,72%,55%)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(0,72%,55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(214,20%,90%)' }}
                    formatter={(val: number, name: string) => [
                      val.toLocaleString('fr-FR') + ' u.',
                      name === 'baseline' ? 'Scénario de base' : 'Scénario simulé',
                    ]}
                  />
                  <Legend
                    formatter={(val) => val === 'baseline' ? 'Scénario de base' : 'Scénario simulé'}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <ReferenceLine
                    y={8000}
                    stroke="hsl(38,92%,55%)"
                    strokeDasharray="5 5"
                    label={{ value: 'Seuil critique', position: 'right', fontSize: 10, fill: 'hsl(38,92%,55%)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="hsl(174,62%,35%)"
                    strokeWidth={2}
                    fill="url(#baselineGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="simulated"
                    stroke="hsl(0,72%,55%)"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    fill="url(#simulatedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recommendation */}
            <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-warning">Plan de contingence recommandé</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeScenario === 'supplier_delay'
                      ? `Commander ${Math.round(delayDays * 200 * 1.2).toLocaleString('fr-FR')} unités supplémentaires en stock de sécurité. Identifier 2 fournisseurs alternatifs pour les produits critiques.`
                      : activeScenario === 'demand_surge'
                      ? `Augmenter les commandes de ${demandIncrease}% pour les produits à forte rotation. Déclencher une alerte préventive sur les 3 produits les plus exposés.`
                      : activeScenario === 'price_increase'
                      ? `Négocier des contrats à prix fixe avec les fournisseurs. Constituer un stock de sécurité avant la hausse prévue.`
                      : `Activer le plan de gestion de crise : stock de sécurité urgence + fournisseurs alternatifs + rationnement préventif.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
