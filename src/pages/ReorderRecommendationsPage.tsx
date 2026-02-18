import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { products } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ShoppingCart,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  PackagePlus,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

interface Recommendation {
  productId: string;
  productName: string;
  productCode: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  recommendedQty: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  suggestedDate: string;
  estimatedCost: number;
  reason: string;
  daysOfStock: number;
  accepted?: boolean;
}

function generateRecommendations(): Recommendation[] {
  const urgencyMap = { critical: 0, high: 1, medium: 2, low: 3 };
  return products
    .filter((p) => p.available < p.minStock * 1.5)
    .map((p) => {
      const coverage = Math.round(p.available / Math.max(1, Math.abs(p.forecast) / 30));
      const gap = p.minStock - p.available;
      const recommended = Math.max(gap, Math.round(p.maxStock * 0.5));
      const urgency: Recommendation['urgency'] =
        p.status === 'critical' ? 'critical' :
        p.status === 'low' ? 'high' :
        coverage < 14 ? 'medium' : 'low';

      // Suggested date: critical = today+2, high = today+5, etc.
      const addDays = urgency === 'critical' ? 2 : urgency === 'high' ? 5 : urgency === 'medium' ? 10 : 20;
      const date = new Date(2026, 1, 14 + addDays);
      const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

      const reason =
        p.status === 'critical' ? 'Stock sous le seuil minimum — rupture imminente' :
        p.status === 'low' ? 'Stock insuffisant pour couvrir la demande prévisionnelle' :
        'Tendance baissière détectée par le modèle prédictif';

      return {
        productId: p.id,
        productName: p.name,
        productCode: p.code,
        supplier: p.supplier,
        currentStock: p.available,
        minStock: p.minStock,
        recommendedQty: recommended,
        urgency,
        suggestedDate: dateStr,
        estimatedCost: recommended * p.unitPrice,
        reason,
        daysOfStock: coverage,
      };
    })
    .sort((a, b) => urgencyMap[a.urgency] - urgencyMap[b.urgency]);
}

const urgencyConfig = {
  critical: { label: 'Critique', className: 'bg-destructive/10 text-destructive', icon: AlertTriangle },
  high: { label: 'Urgent', className: 'bg-warning/10 text-warning', icon: Clock },
  medium: { label: 'Recommandé', className: 'bg-info/10 text-info', icon: TrendingUp },
  low: { label: 'Planifié', className: 'bg-success/10 text-success', icon: CheckCircle },
};

export default function ReorderRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(generateRecommendations());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [acceptedAll, setAcceptedAll] = useState(false);

  const totalCost = recommendations.reduce((s, r) => s + r.estimatedCost, 0);
  const acceptedCost = recommendations.filter(r => r.accepted).reduce((s, r) => s + r.estimatedCost, 0);
  const criticalCount = recommendations.filter((r) => r.urgency === 'critical').length;

  const toggleAccept = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.productId === id ? { ...r, accepted: !r.accepted } : r))
    );
  };

  const acceptAll = () => {
    setRecommendations((prev) => prev.map((r) => ({ ...r, accepted: true })));
    setAcceptedAll(true);
  };

  return (
    <div>
      <TopBar
        title="Recommandations de réapprovisionnement"
        breadcrumb={['PharmaStock BI', 'Prédictions', 'Recommandations']}
      />
      <div className="p-6 space-y-6">
        {/* KPI bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 odoo-shadow">
            <p className="text-[11px] text-muted-foreground mb-1">Recommandations</p>
            <p className="text-2xl font-bold text-foreground">{recommendations.length}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{criticalCount} critiques</p>
          </div>
          <div className="bg-card rounded-xl border border-destructive/20 p-4 odoo-shadow">
            <p className="text-[11px] text-muted-foreground mb-1">Alertes critiques</p>
            <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Action immédiate requise</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 odoo-shadow">
            <p className="text-[11px] text-muted-foreground mb-1">Budget estimé</p>
            <p className="text-2xl font-bold text-foreground">{totalCost.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €</p>
            <p className="text-[11px] text-muted-foreground mt-1">Toutes commandes</p>
          </div>
          <div className="bg-card rounded-xl border border-success/20 p-4 odoo-shadow">
            <p className="text-[11px] text-muted-foreground mb-1">Sélectionné</p>
            <p className="text-2xl font-bold text-success">{recommendations.filter(r => r.accepted).length}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{acceptedCost.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[11px] bg-primary/10 text-primary gap-1">
              <Zap className="w-3 h-3" />
              Généré par modèle prédictif ARIMA
            </Badge>
            <span className="text-xs text-muted-foreground">— Mis à jour le 14/02/2026</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5" />
              Exporter en BC
            </Button>
            <Button size="sm" className="text-xs gap-1.5" onClick={acceptAll} disabled={acceptedAll}>
              <CheckCircle className="w-3.5 h-3.5" />
              {acceptedAll ? 'Toutes acceptées' : 'Tout accepter'}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border odoo-shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-xs font-semibold w-10"></TableHead>
                <TableHead className="text-xs font-semibold">Produit</TableHead>
                <TableHead className="text-xs font-semibold">Fournisseur</TableHead>
                <TableHead className="text-xs font-semibold text-center">Urgence</TableHead>
                <TableHead className="text-xs font-semibold text-right">Stock actuel</TableHead>
                <TableHead className="text-xs font-semibold text-right">Qté suggérée</TableHead>
                <TableHead className="text-xs font-semibold text-right">Coût estimé</TableHead>
                <TableHead className="text-xs font-semibold text-center">Date suggérée</TableHead>
                <TableHead className="text-xs font-semibold text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations.map((rec) => {
                const urg = urgencyConfig[rec.urgency];
                const isExpanded = expandedId === rec.productId;
                return (
                  <>
                    <TableRow
                      key={rec.productId}
                      className={cn(
                        'cursor-pointer hover:bg-secondary/30 transition-colors',
                        rec.accepted && 'bg-success/5'
                      )}
                      onClick={() => setExpandedId(isExpanded ? null : rec.productId)}
                    >
                      <TableCell className="text-center">
                        {isExpanded
                          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground mx-auto" />
                          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mx-auto" />
                        }
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{rec.productName}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{rec.productCode}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{rec.supplier}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={cn('text-[10px] gap-1', urg.className)}>
                          <urg.icon className="w-2.5 h-2.5" />
                          {urg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        <span className={cn(
                          'font-medium',
                          rec.currentStock < rec.minStock ? 'text-destructive' : 'text-foreground'
                        )}>
                          {rec.currentStock}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">/ min {rec.minStock}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-semibold text-primary">{rec.recommendedQty.toLocaleString('fr-FR')}</span>
                        <span className="text-[10px] text-muted-foreground block">{rec.daysOfStock}j de couverture</span>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-right">
                        {rec.estimatedCost.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs text-foreground">{rec.suggestedDate}</span>
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant={rec.accepted ? 'outline' : 'default'}
                          className={cn('text-[11px] h-7 px-3', rec.accepted && 'text-success border-success/40')}
                          onClick={() => toggleAccept(rec.productId)}
                        >
                          {rec.accepted ? (
                            <><CheckCircle className="w-3 h-3 mr-1" />Accepté</>
                          ) : (
                            <><PackagePlus className="w-3 h-3 mr-1" />Commander</>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${rec.productId}-expanded`} className="bg-accent/30">
                        <TableCell colSpan={9} className="py-3 px-6">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-foreground">Justification prédictive</p>
                              <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Couverture actuelle : <strong>{rec.daysOfStock} jours</strong> —
                                Quantité max recommandée : <strong>{rec.recommendedQty} unités</strong> —
                                Coût unitaire : <strong>{(rec.estimatedCost / rec.recommendedQty).toFixed(2)} €</strong>
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {recommendations.filter(r => r.accepted).length > 0 && (
          <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-semibold text-success">
                  {recommendations.filter(r => r.accepted).length} commande(s) prête(s) à être générée(s)
                </p>
                <p className="text-xs text-muted-foreground">Budget total sélectionné : {acceptedCost.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
              </div>
            </div>
            <Button className="text-sm gap-2">
              <ShoppingCart className="w-4 h-4" />
              Créer les bons de commande
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
