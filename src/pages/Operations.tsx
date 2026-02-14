import { TopBar } from '@/components/layout/TopBar';
import { Truck, PackageCheck, PackageX, RotateCcw } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';

export default function Operations() {
  return (
    <div>
      <TopBar title="Opérations" breadcrumb={['PharmaStock BI', 'Opérations']} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Réceptions en attente" value="8" change="3 en retard" changeType="negative" icon={Truck} variant="warning" />
          <KpiCard title="Expéditions du jour" value="14" change="2 en préparation" changeType="neutral" icon={PackageCheck} variant="primary" />
          <KpiCard title="Retours à traiter" value="3" change="Depuis la semaine dernière" changeType="neutral" icon={RotateCcw} />
          <KpiCard title="Produits périmés" value="5" change="À détruire" changeType="negative" icon={PackageX} variant="danger" />
        </div>

        <div className="bg-card rounded-xl border border-border p-8 odoo-shadow text-center">
          <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Module Opérations</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Gérez les réceptions, expéditions, retours et transferts inter-entrepôts.
            Ce module sera enrichi avec la connexion à votre base de données.
          </p>
        </div>
      </div>
    </div>
  );
}
