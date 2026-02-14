import { TopBar } from '@/components/layout/TopBar';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { alerts } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Alerts() {
  const ruptures = alerts.filter((a) => a.type === 'rupture');
  const predictions = alerts.filter((a) => a.type === 'prediction');
  const expiries = alerts.filter((a) => a.type === 'expiry');
  const overstocks = alerts.filter((a) => a.type === 'overstock');

  return (
    <div>
      <TopBar title="Alertes" breadcrumb={['PharmaStock BI', 'Alertes']} />
      <div className="p-6 space-y-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Toutes ({alerts.length})</TabsTrigger>
            <TabsTrigger value="rupture">Ruptures ({ruptures.length})</TabsTrigger>
            <TabsTrigger value="prediction">Prédictions ({predictions.length})</TabsTrigger>
            <TabsTrigger value="expiry">Péremptions ({expiries.length})</TabsTrigger>
            <TabsTrigger value="overstock">Surstocks ({overstocks.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
              <AlertsList alerts={alerts} />
            </div>
          </TabsContent>
          <TabsContent value="rupture" className="mt-4">
            <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
              <AlertsList alerts={ruptures} />
            </div>
          </TabsContent>
          <TabsContent value="prediction" className="mt-4">
            <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
              <AlertsList alerts={predictions} />
            </div>
          </TabsContent>
          <TabsContent value="expiry" className="mt-4">
            <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
              <AlertsList alerts={expiries} />
            </div>
          </TabsContent>
          <TabsContent value="overstock" className="mt-4">
            <div className="bg-card rounded-xl border border-border p-5 odoo-shadow">
              <AlertsList alerts={overstocks} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
