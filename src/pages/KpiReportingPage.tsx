import { TopBar } from '@/components/layout/TopBar';
import { products, alerts } from '@/data/mockData';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from 'recharts';
import {
  Target,
  TrendingDown,
  TrendingUp,
  Award,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

const monthlyKpis = [
  { month: 'Sep', rupturRate: 8.5, lostValue: 12400, forecastAccuracy: 88, autoOrders: 3 },
  { month: 'Oct', rupturRate: 7.2, lostValue: 9800, forecastAccuracy: 89, autoOrders: 4 },
  { month: 'Nov', rupturRate: 6.8, lostValue: 8200, forecastAccuracy: 91, autoOrders: 5 },
  { month: 'Déc', rupturRate: 9.1, lostValue: 14200, forecastAccuracy: 87, autoOrders: 6 },
  { month: 'Jan', rupturRate: 5.4, lostValue: 6100, forecastAccuracy: 92, autoOrders: 7 },
  { month: 'Fév', rupturRate: 4.2, lostValue: 4800, forecastAccuracy: 94, autoOrders: 8 },
];

const categoryPerf = [
  { category: 'Analgésiques', ruptures: 1, expirations: 0, valeurPerdue: 0, rotation: 5.2 },
  { category: 'Antibiotiques', ruptures: 3, expirations: 1, valeurPerdue: 2400, rotation: 3.8 },
  { category: 'Cardiologie', ruptures: 2, expirations: 0, valeurPerdue: 800, rotation: 4.1 },
  { category: 'Diabétologie', ruptures: 1, expirations: 1, valeurPerdue: 1200, rotation: 4.6 },
  { category: 'Gastro', ruptures: 0, expirations: 0, valeurPerdue: 0, rotation: 6.0 },
];

const radarData = [
  { metric: 'Précision prévision', current: 94, target: 95 },
  { metric: 'Taux de service', current: 96, target: 98 },
  { metric: 'Rotation stock', current: 78, target: 85 },
  { metric: 'Réduction ruptures', current: 82, target: 80 },
  { metric: 'Pertes évitées', current: 88, target: 90 },
  { metric: 'Automatisation', current: 65, target: 75 },
];

export default function KpiReportingPage() {
  const criticalCount = products.filter(p => p.status === 'critical').length;
  const lowCount = products.filter(p => p.status === 'low').length;
  const totalValue = products.reduce((s, p) => s + p.onHand * p.unitPrice, 0);
  const rupturRate = ((criticalCount + lowCount) / products.length * 100).toFixed(1);
  const alertsHigh = alerts.filter(a => a.severity === 'high').length;

  const currentMonth = monthlyKpis[monthlyKpis.length - 1];
  const prevMonth = monthlyKpis[monthlyKpis.length - 2];
  const ruptureReduction = (((prevMonth.rupturRate - currentMonth.rupturRate) / prevMonth.rupturRate) * 100).toFixed(0);
  const savingsVsBase = monthlyKpis[0].lostValue - currentMonth.lostValue;

  return (
    <div>
      <TopBar
        title="KPI & Reporting"
        breadcrumb={['PharmaStock BI', 'Analytique', 'KPI & Reporting']}
      />
      <div className="p-6 space-y-6">
        {/* Period & actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Fév 2026
            </Button>
            <Badge variant="secondary" className="text-[11px] bg-success/10 text-success gap-1">
              <TrendingDown className="w-3 h-3" />
              -{ruptureReduction}% de ruptures ce mois
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Exporter rapport PDF
          </Button>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Taux de rupture"
            value={`${rupturRate}%`}
            change={`-${ruptureReduction}% vs mois précédent`}
            changeType="positive"
            icon={TrendingDown}
            variant="primary"
          />
          <KpiCard
            title="Précision prévisions"
            value={`${currentMonth.forecastAccuracy}%`}
            change={`+${currentMonth.forecastAccuracy - prevMonth.forecastAccuracy}% ce mois`}
            changeType="positive"
            icon={Target}
          />
          <KpiCard
            title="Pertes évitées"
            value={`${savingsVsBase.toLocaleString('fr-FR')} €`}
            change="Depuis déploiement"
            changeType="positive"
            icon={Award}
            variant="primary"
          />
          <KpiCard
            title="Commandes auto"
            value={currentMonth.autoOrders}
            change={`+${currentMonth.autoOrders - prevMonth.autoOrders} vs mois dernier`}
            changeType="positive"
            icon={CheckCircle}
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Rupture rate trend */}
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Évolution du taux de rupture (%)</h3>
              <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">
                Tendance baissière ✓
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyKpis} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 12]} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  formatter={(v: number) => [`${v}%`, 'Taux de rupture']}
                />
                <Line
                  type="monotone"
                  dataKey="rupturRate"
                  stroke="hsl(174,62%,35%)"
                  strokeWidth={2.5}
                  dot={{ fill: 'hsl(174,62%,35%)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Lost value trend */}
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Valeur des pertes évitées (€)</h3>
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                Objectif atteint
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyKpis} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  formatter={(v: number) => [`${v.toLocaleString('fr-FR')} €`, 'Pertes']}
                />
                <Bar dataKey="lostValue" fill="hsl(0,72%,55%)" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Radar */}
          <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Performance globale du système</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(214,20%,90%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                <Radar name="Actuel" dataKey="current" stroke="hsl(174,62%,35%)" fill="hsl(174,62%,35%)" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Objectif" dataKey="target" stroke="hsl(38,92%,55%)" fill="hsl(38,92%,55%)" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 2" />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category performance */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 odoo-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Performance par catégorie thérapeutique</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Catégorie</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Ruptures</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Expirations</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Valeur perdue</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Rotation</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerf.map((cat) => (
                    <tr key={cat.category} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-2.5 font-medium text-foreground">{cat.category}</td>
                      <td className="py-2.5 text-center">
                        <span className={cn(
                          'font-semibold',
                          cat.ruptures > 2 ? 'text-destructive' : cat.ruptures > 0 ? 'text-warning' : 'text-success'
                        )}>
                          {cat.ruptures}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={cn('font-semibold', cat.expirations > 0 ? 'text-warning' : 'text-success')}>
                          {cat.expirations}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={cn('font-medium', cat.valeurPerdue > 0 ? 'text-destructive' : 'text-success')}>
                          {cat.valeurPerdue > 0 ? `-${cat.valeurPerdue.toLocaleString('fr-FR')} €` : '0 €'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-medium text-foreground">{cat.rotation}x</td>
                      <td className="py-2.5 text-center">
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px]',
                            cat.ruptures === 0 && cat.expirations === 0
                              ? 'bg-success/10 text-success'
                              : cat.ruptures <= 1
                              ? 'bg-warning/10 text-warning'
                              : 'bg-destructive/10 text-destructive'
                          )}
                        >
                          {cat.ruptures === 0 && cat.expirations === 0 ? 'Optimal' : cat.ruptures <= 1 ? 'À surveiller' : 'Critique'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Forecast accuracy + auto orders */}
        <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Précision des prévisions & Commandes automatisées</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyKpis} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={[80, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="left" dataKey="forecastAccuracy" name="Précision (%)" fill="hsl(174,62%,35%)" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
              <Bar yAxisId="right" dataKey="autoOrders" name="Commandes auto" fill="hsl(210,80%,55%)" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-success">Objectif atteint</p>
              <p className="text-xs text-muted-foreground">Réduction des ruptures de {ruptureReduction}% en 6 mois</p>
            </div>
          </div>
          <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-warning flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-warning">En progression</p>
              <p className="text-xs text-muted-foreground">Automatisation des commandes à améliorer (objectif 75%)</p>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">Performance modèle</p>
              <p className="text-xs text-muted-foreground">Précision ARIMA : 94.2% — record du système</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
