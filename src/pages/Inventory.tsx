import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { products, Product } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Download, Plus, ChevronDown } from 'lucide-react';

const statusConfig: Record<Product['status'], { label: string; className: string }> = {
  ok: { label: 'Normal', className: 'bg-success/10 text-success' },
  low: { label: 'Bas', className: 'bg-warning/10 text-warning' },
  critical: { label: 'Critique', className: 'bg-destructive/10 text-destructive' },
  overstock: { label: 'Surstock', className: 'bg-info/10 text-info' },
};

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <TopBar title="Inventaire" breadcrumb={['PharmaStock BI', 'Produits', 'Inventaire']} />
      <div className="p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-card border-border text-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 h-9 text-sm">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Exporter
            </Button>
            <Button size="sm" className="text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Nouveau produit
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span>{filtered.length} produit(s) trouvé(s)</span>
          <span className="text-destructive font-medium">
            {filtered.filter((p) => p.status === 'critical').length} critique(s)
          </span>
          <span className="text-warning font-medium">
            {filtered.filter((p) => p.status === 'low').length} bas
          </span>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border odoo-shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-xs font-semibold w-24">Code</TableHead>
                <TableHead className="text-xs font-semibold">Produit</TableHead>
                <TableHead className="text-xs font-semibold">Catégorie</TableHead>
                <TableHead className="text-xs font-semibold">Emplacement</TableHead>
                <TableHead className="text-xs font-semibold text-right">En stock</TableHead>
                <TableHead className="text-xs font-semibold text-right">Réservé</TableHead>
                <TableHead className="text-xs font-semibold text-right">Disponible</TableHead>
                <TableHead className="text-xs font-semibold text-right">Prévision</TableHead>
                <TableHead className="text-xs font-semibold text-right">Min</TableHead>
                <TableHead className="text-xs font-semibold text-right">Max</TableHead>
                <TableHead className="text-xs font-semibold text-center">Statut</TableHead>
                <TableHead className="text-xs font-semibold">Fournisseur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const status = statusConfig[p.status];
                return (
                  <TableRow key={p.id} className="hover:bg-secondary/30 cursor-pointer">
                    <TableCell className="text-xs font-mono text-muted-foreground">{p.code}</TableCell>
                    <TableCell className="text-sm font-medium">{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.location}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{p.onHand}</TableCell>
                    <TableCell className="text-sm text-right text-muted-foreground">{p.reserved}</TableCell>
                    <TableCell className="text-sm text-right">{p.available}</TableCell>
                    <TableCell className={cn('text-sm text-right font-medium', p.forecast < 0 ? 'text-destructive' : 'text-success')}>
                      {p.forecast > 0 ? '+' : ''}{p.forecast}
                    </TableCell>
                    <TableCell className="text-xs text-right text-muted-foreground">{p.minStock}</TableCell>
                    <TableCell className="text-xs text-right text-muted-foreground">{p.maxStock}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={cn('text-[10px] font-medium border-0', status.className)}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.supplier}</TableCell>
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
