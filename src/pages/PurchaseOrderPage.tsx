import { useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { products, purchaseOrders } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, CheckCircle, FileText, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const orderLineSchema = z.object({
  productCode: z.string().min(1, 'Sélectionnez un produit'),
  quantity: z.coerce.number().min(1, 'Min. 1').max(99999, 'Max 99 999'),
  unitPrice: z.coerce.number().min(0.01, 'Prix min. 0.01').max(99999, 'Max 99 999'),
});

const orderSchema = z.object({
  supplier: z.string().min(1, 'Sélectionnez un fournisseur'),
  expectedDate: z.string().min(1, 'Date attendue obligatoire'),
  lines: z.array(orderLineSchema).min(1, 'Ajoutez au moins une ligne'),
});

type OrderForm = z.infer<typeof orderSchema>;
const suppliers = [...new Set(products.map((p) => p.supplier))];

const statusConfig = {
  draft: { label: 'Brouillon', className: 'bg-muted text-muted-foreground' },
  confirmed: { label: 'Confirmé', className: 'bg-info/10 text-info' },
  received: { label: 'Reçu', className: 'bg-success/10 text-success' },
  cancelled: { label: 'Annulé', className: 'bg-destructive/10 text-destructive' },
};

export default function PurchaseOrderPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      supplier: '',
      expectedDate: '',
      lines: [{ productCode: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lines' });

  const watchedLines = form.watch('lines');
  const total = watchedLines.reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0), 0);

  const handleProductSelect = (index: number, code: string) => {
    form.setValue(`lines.${index}.productCode`, code);
    const product = products.find((p) => p.code === code);
    if (product) form.setValue(`lines.${index}.unitPrice`, product.unitPrice);
  };

  const onSubmit = (data: OrderForm) => {
    toast({
      title: '✅ Bon de commande créé',
      description: `Commande pour ${data.supplier} — ${data.lines.length} ligne(s) — Total: ${total.toFixed(2)} €`,
    });
    setShowForm(false);
    form.reset();
  };

  return (
    <div>
      <TopBar title="Bons de commande" breadcrumb={['PharmaStock BI', 'Opérations', 'Commandes']} />
      <div className="p-6 space-y-6">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{purchaseOrders.length} bon(s) de commande</p>
          <Button size="sm" className="text-xs gap-1.5" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-3.5 h-3.5" /> Nouveau bon de commande
          </Button>
        </div>

        {/* New order form */}
        {showForm && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card rounded-xl border border-primary/20 p-6 odoo-shadow space-y-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Nouveau bon de commande
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="supplier" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Fournisseur *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Choisir..." /></SelectTrigger></FormControl>
                      <SelectContent>{suppliers.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="expectedDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Date de livraison prévue *</FormLabel>
                    <FormControl><Input {...field} type="date" className="h-9 text-sm" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Lines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Lignes de commande</span>
                  <Button type="button" variant="outline" size="sm" className="text-xs gap-1" onClick={() => append({ productCode: '', quantity: 1, unitPrice: 0 })}>
                    <Plus className="w-3 h-3" /> Ligne
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-end p-3 rounded-lg bg-secondary/30">
                    <FormField control={form.control} name={`lines.${index}.productCode`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Produit</FormLabel>
                        <Select onValueChange={(v) => handleProductSelect(index, v)} value={field.value}>
                          <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Produit..." /></SelectTrigger></FormControl>
                          <SelectContent>{products.map((p) => <SelectItem key={p.code} value={p.code}>{p.code} — {p.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`lines.${index}.quantity`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Quantité</FormLabel>
                        <FormControl><Input {...field} type="number" min={1} className="h-9 text-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`lines.${index}.unitPrice`} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Prix unitaire (€)</FormLabel>
                        <FormControl><Input {...field} type="number" step="0.01" min={0.01} className="h-9 text-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="text-sm font-medium text-right pb-2">
                      {((watchedLines[index]?.quantity || 0) * (watchedLines[index]?.unitPrice || 0)).toFixed(2)} €
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive" onClick={() => fields.length > 1 && remove(index)} disabled={fields.length <= 1}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-semibold">Total : {total.toFixed(2)} €</span>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => { setShowForm(false); form.reset(); }}>Annuler</Button>
                  <Button type="submit" size="sm" className="gap-1.5"><Send className="w-3.5 h-3.5" /> Créer le bon</Button>
                </div>
              </div>
            </form>
          </Form>
        )}

        {/* Existing orders table */}
        <div className="bg-card rounded-xl border border-border odoo-shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-xs font-semibold">Référence</TableHead>
                <TableHead className="text-xs font-semibold">Fournisseur</TableHead>
                <TableHead className="text-xs font-semibold">Date création</TableHead>
                <TableHead className="text-xs font-semibold">Date prévue</TableHead>
                <TableHead className="text-xs font-semibold">Produits</TableHead>
                <TableHead className="text-xs font-semibold text-right">Total</TableHead>
                <TableHead className="text-xs font-semibold text-center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => {
                const st = statusConfig[po.status];
                return (
                  <TableRow key={po.id} className="hover:bg-secondary/30">
                    <TableCell className="text-sm font-mono font-medium">{po.reference}</TableCell>
                    <TableCell className="text-sm">{po.supplier}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{po.createdAt}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{po.expectedDate}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{po.lines.map((l) => l.productName).join(', ')}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{po.total.toFixed(2)} €</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={cn('text-[10px] font-medium border-0', st.className)}>{st.label}</Badge>
                    </TableCell>
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
