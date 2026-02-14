import { TopBar } from '@/components/layout/TopBar';
import { auditLog } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Search, Filter, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actionConfig = {
  reception: { label: 'Réception', className: 'bg-success/10 text-success' },
  expedition: { label: 'Expédition', className: 'bg-info/10 text-info' },
  adjustment: { label: 'Ajustement', className: 'bg-warning/10 text-warning' },
  order: { label: 'Commande', className: 'bg-accent text-accent-foreground' },
  scan: { label: 'Scan', className: 'bg-primary/10 text-primary' },
  transfer: { label: 'Transfert', className: 'bg-muted text-muted-foreground' },
};

export default function AuditTrailPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = auditLog.filter((entry) => {
    const matchSearch =
      entry.details.toLowerCase().includes(search.toLowerCase()) ||
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      (entry.productName || '').toLowerCase().includes(search.toLowerCase()) ||
      (entry.productCode || '').toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || entry.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div>
      <TopBar title="Journal d'audit" breadcrumb={['PharmaStock BI', 'Traçabilité', 'Audit Trail']} />
      <div className="p-6 space-y-4">
        {/* Header info */}
        <div className="bg-accent/30 rounded-xl border border-primary/10 p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Traçabilité réglementaire complète</p>
            <p className="text-xs text-muted-foreground">
              Chaque action est horodatée, signée par l'utilisateur et associée à une adresse IP. Conforme aux exigences BPD (Bonnes Pratiques de Distribution).
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans le journal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-card border-border text-sm"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes actions</SelectItem>
              {Object.entries(actionConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" /> Exporter
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">{filtered.length} entrée(s)</p>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border odoo-shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-xs font-semibold w-40">Horodatage</TableHead>
                <TableHead className="text-xs font-semibold w-28">Utilisateur</TableHead>
                <TableHead className="text-xs font-semibold w-24 text-center">Action</TableHead>
                <TableHead className="text-xs font-semibold w-24">Produit</TableHead>
                <TableHead className="text-xs font-semibold">Détails</TableHead>
                <TableHead className="text-xs font-semibold text-right w-20">Qté</TableHead>
                <TableHead className="text-xs font-semibold w-28">Adresse IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => {
                const config = actionConfig[entry.action];
                return (
                  <TableRow key={entry.id} className="hover:bg-secondary/30">
                    <TableCell className="text-xs font-mono text-muted-foreground">{entry.timestamp}</TableCell>
                    <TableCell className="text-sm font-medium">{entry.user}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={cn('text-[10px] font-medium border-0', config.className)}>{config.label}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{entry.productCode}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{entry.details}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{entry.quantity != null ? (entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity) : '—'}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{entry.ip}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
