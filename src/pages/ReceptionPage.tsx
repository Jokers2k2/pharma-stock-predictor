import { useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { products } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, CheckCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const receptionLineSchema = z.object({
  productCode: z.string().min(1, 'Sélectionnez un produit'),
  quantity: z.coerce.number().min(1, 'Quantité min. 1').max(99999, 'Quantité max. 99 999'),
  lotNumber: z.string().min(3, 'N° lot obligatoire (min. 3 car.)').max(30, 'Max 30 caractères'),
  expiryDate: z.string().min(1, 'Date de péremption obligatoire'),
});

const receptionSchema = z.object({
  reference: z.string().min(3, 'Réf. min. 3 caractères').max(30, 'Max 30 caractères'),
  supplier: z.string().min(1, 'Sélectionnez un fournisseur'),
  deliveryNote: z.string().min(3, 'N° BL obligatoire').max(30, 'Max 30 caractères'),
  receptionDate: z.string().min(1, 'Date obligatoire'),
  notes: z.string().max(500, 'Max 500 caractères').optional(),
  lines: z.array(receptionLineSchema).min(1, 'Ajoutez au moins une ligne'),
});

type ReceptionForm = z.infer<typeof receptionSchema>;

const suppliers = [...new Set(products.map((p) => p.supplier))];

export default function ReceptionPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ReceptionForm>({
    resolver: zodResolver(receptionSchema),
    defaultValues: {
      reference: `REC-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      supplier: '',
      deliveryNote: '',
      receptionDate: new Date().toISOString().split('T')[0],
      notes: '',
      lines: [{ productCode: '', quantity: 1, lotNumber: '', expiryDate: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lines' });

  const onSubmit = (data: ReceptionForm) => {
    const totalQty = data.lines.reduce((s, l) => s + l.quantity, 0);
    toast({
      title: '✅ Réception enregistrée',
      description: `${data.reference} — ${totalQty} unités de ${data.lines.length} produit(s) reçues de ${data.supplier}`,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <TopBar title="Réception de marchandise" breadcrumb={['PharmaStock BI', 'Opérations', 'Réception']} />
      <div className="p-6 max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div className="bg-card rounded-xl border border-border p-6 odoo-shadow space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField control={form.control} name="reference" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Référence</FormLabel>
                    <FormControl><Input {...field} className="h-9 text-sm" readOnly /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
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
                <FormField control={form.control} name="deliveryNote" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">N° Bon de livraison *</FormLabel>
                    <FormControl><Input {...field} placeholder="BL-XXXX" className="h-9 text-sm" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="receptionDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Date de réception *</FormLabel>
                    <FormControl><Input {...field} type="date" className="h-9 text-sm" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Lines */}
            <div className="bg-card rounded-xl border border-border p-6 odoo-shadow space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Lignes de réception</h3>
                <Button type="button" variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => append({ productCode: '', quantity: 1, lotNumber: '', expiryDate: '' })}>
                  <Plus className="w-3.5 h-3.5" /> Ajouter ligne
                </Button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-end p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <FormField control={form.control} name={`lines.${index}.productCode`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Produit *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Sélectionner..." /></SelectTrigger></FormControl>
                        <SelectContent>{products.map((p) => <SelectItem key={p.code} value={p.code}>{p.code} — {p.name}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`lines.${index}.quantity`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Quantité *</FormLabel>
                      <FormControl><Input {...field} type="number" min={1} className="h-9 text-sm" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`lines.${index}.lotNumber`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">N° Lot *</FormLabel>
                      <FormControl><Input {...field} placeholder="LOT-XXXX" className="h-9 text-sm" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`lines.${index}.expiryDate`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Date péremption *</FormLabel>
                      <FormControl><Input {...field} type="date" className="h-9 text-sm" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive" onClick={() => fields.length > 1 && remove(index)} disabled={fields.length <= 1}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {form.formState.errors.lines?.message && (
                <p className="text-xs text-destructive">{form.formState.errors.lines.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="bg-card rounded-xl border border-border p-6 odoo-shadow">
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Notes / Observations</FormLabel>
                  <FormControl><textarea {...field} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Observations sur l'état de la livraison..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button type="submit" className="gap-1.5" disabled={submitted}>
                {submitted ? <><CheckCircle className="w-4 h-4" /> Enregistré</> : 'Valider la réception'}
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>Réinitialiser</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
