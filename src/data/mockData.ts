// Données simulées pour le système BI pharmaceutique

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  location: string;
  onHand: number;
  reserved: number;
  available: number;
  forecast: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  expiryDate: string;
  lastMovement: string;
  status: 'ok' | 'low' | 'critical' | 'overstock';
}

export interface Alert {
  id: string;
  type: 'rupture' | 'expiry' | 'overstock' | 'prediction';
  severity: 'high' | 'medium' | 'low';
  product: string;
  message: string;
  date: string;
}

export const products: Product[] = [
  { id: '1', code: 'MED-001', name: 'Paracétamol 500mg', category: 'Analgésiques', location: 'Zone A / Étagère 1', onHand: 1200, reserved: 200, available: 1000, forecast: -300, minStock: 500, maxStock: 5000, unitPrice: 2.50, supplier: 'Sanofi', expiryDate: '2026-08-15', lastMovement: '2026-02-12', status: 'ok' },
  { id: '2', code: 'MED-002', name: 'Amoxicilline 1g', category: 'Antibiotiques', location: 'Zone A / Étagère 2', onHand: 80, reserved: 50, available: 30, forecast: -120, minStock: 200, maxStock: 2000, unitPrice: 8.90, supplier: 'Pfizer', expiryDate: '2026-05-20', lastMovement: '2026-02-13', status: 'critical' },
  { id: '3', code: 'MED-003', name: 'Oméprazole 20mg', category: 'Gastro-entérologie', location: 'Zone B / Étagère 1', onHand: 450, reserved: 100, available: 350, forecast: -80, minStock: 300, maxStock: 3000, unitPrice: 5.60, supplier: 'AstraZeneca', expiryDate: '2026-11-30', lastMovement: '2026-02-10', status: 'ok' },
  { id: '4', code: 'MED-004', name: 'Insuline Lantus', category: 'Diabétologie', location: 'Zone C / Frigo 1', onHand: 150, reserved: 80, available: 70, forecast: -90, minStock: 100, maxStock: 500, unitPrice: 45.00, supplier: 'Sanofi', expiryDate: '2026-04-10', lastMovement: '2026-02-14', status: 'low' },
  { id: '5', code: 'MED-005', name: 'Doliprane 1000mg', category: 'Analgésiques', location: 'Zone A / Étagère 1', onHand: 3800, reserved: 200, available: 3600, forecast: 500, minStock: 500, maxStock: 3000, unitPrice: 3.20, supplier: 'Sanofi', expiryDate: '2027-01-15', lastMovement: '2026-02-11', status: 'overstock' },
  { id: '6', code: 'MED-006', name: 'Metformine 850mg', category: 'Diabétologie', location: 'Zone B / Étagère 3', onHand: 620, reserved: 150, available: 470, forecast: -200, minStock: 400, maxStock: 2500, unitPrice: 4.30, supplier: 'Merck', expiryDate: '2026-09-25', lastMovement: '2026-02-09', status: 'ok' },
  { id: '7', code: 'MED-007', name: 'Ibuprofène 400mg', category: 'Analgésiques', location: 'Zone A / Étagère 2', onHand: 95, reserved: 60, available: 35, forecast: -150, minStock: 300, maxStock: 2000, unitPrice: 3.80, supplier: 'Mylan', expiryDate: '2026-07-18', lastMovement: '2026-02-13', status: 'critical' },
  { id: '8', code: 'MED-008', name: 'Losartan 50mg', category: 'Cardiologie', location: 'Zone B / Étagère 2', onHand: 280, reserved: 50, available: 230, forecast: -60, minStock: 200, maxStock: 1500, unitPrice: 7.20, supplier: 'Teva', expiryDate: '2026-12-01', lastMovement: '2026-02-08', status: 'ok' },
  { id: '9', code: 'MED-009', name: 'Atorvastatine 20mg', category: 'Cardiologie', location: 'Zone B / Étagère 2', onHand: 190, reserved: 90, available: 100, forecast: -110, minStock: 150, maxStock: 1000, unitPrice: 12.50, supplier: 'Pfizer', expiryDate: '2026-06-30', lastMovement: '2026-02-12', status: 'low' },
  { id: '10', code: 'MED-010', name: 'Ventoline spray', category: 'Pneumologie', location: 'Zone C / Étagère 1', onHand: 340, reserved: 40, available: 300, forecast: -50, minStock: 200, maxStock: 1200, unitPrice: 6.90, supplier: 'GSK', expiryDate: '2027-03-15', lastMovement: '2026-02-07', status: 'ok' },
  { id: '11', code: 'MED-011', name: 'Clopidogrel 75mg', category: 'Cardiologie', location: 'Zone B / Étagère 3', onHand: 55, reserved: 30, available: 25, forecast: -80, minStock: 100, maxStock: 800, unitPrice: 15.40, supplier: 'Sanofi', expiryDate: '2026-10-20', lastMovement: '2026-02-14', status: 'critical' },
  { id: '12', code: 'MED-012', name: 'Lévothyroxine 100µg', category: 'Endocrinologie', location: 'Zone A / Étagère 3', onHand: 520, reserved: 100, available: 420, forecast: -70, minStock: 300, maxStock: 2000, unitPrice: 4.10, supplier: 'Merck', expiryDate: '2026-08-05', lastMovement: '2026-02-11', status: 'ok' },
];

export const alerts: Alert[] = [
  { id: '1', type: 'rupture', severity: 'high', product: 'Amoxicilline 1g', message: 'Stock critique — rupture prévue dans 2 jours', date: '2026-02-14' },
  { id: '2', type: 'rupture', severity: 'high', product: 'Ibuprofène 400mg', message: 'Stock sous le seuil minimum — commander immédiatement', date: '2026-02-14' },
  { id: '3', type: 'rupture', severity: 'high', product: 'Clopidogrel 75mg', message: 'Rupture imminente — stock insuffisant pour la demande', date: '2026-02-14' },
  { id: '4', type: 'prediction', severity: 'medium', product: 'Insuline Lantus', message: 'Prévision : stock insuffisant dans 5 jours selon le modèle prédictif', date: '2026-02-14' },
  { id: '5', type: 'prediction', severity: 'medium', product: 'Atorvastatine 20mg', message: 'Tendance baissière détectée — réapprovisionnement recommandé', date: '2026-02-13' },
  { id: '6', type: 'expiry', severity: 'medium', product: 'Insuline Lantus', message: 'Lot expirant le 10/04/2026 — 55 jours restants', date: '2026-02-14' },
  { id: '7', type: 'overstock', severity: 'low', product: 'Doliprane 1000mg', message: 'Surstock détecté — 800 unités au-dessus du seuil maximum', date: '2026-02-13' },
  { id: '8', type: 'expiry', severity: 'low', product: 'Amoxicilline 1g', message: 'Lot expirant le 20/05/2026 — 95 jours restants', date: '2026-02-12' },
];

export const stockTrendData = [
  { month: 'Sep', entrees: 4200, sorties: 3800, stock: 12400 },
  { month: 'Oct', entrees: 3900, sorties: 4100, stock: 12200 },
  { month: 'Nov', entrees: 4500, sorties: 4200, stock: 12500 },
  { month: 'Déc', entrees: 5200, sorties: 5800, stock: 11900 },
  { month: 'Jan', entrees: 4800, sorties: 4500, stock: 12200 },
  { month: 'Fév', entrees: 3600, sorties: 4000, stock: 11800 },
];

export const predictionData = [
  { day: '15/02', actual: 11800, predicted: 11800 },
  { day: '16/02', actual: null, predicted: 11650 },
  { day: '17/02', actual: null, predicted: 11480 },
  { day: '18/02', actual: null, predicted: 11350 },
  { day: '19/02', actual: null, predicted: 11200 },
  { day: '20/02', actual: null, predicted: 11100 },
  { day: '21/02', actual: null, predicted: 10950 },
];

export const categoryDistribution = [
  { name: 'Analgésiques', value: 5095, fill: 'hsl(174, 62%, 35%)' },
  { name: 'Cardiologie', value: 525, fill: 'hsl(210, 80%, 55%)' },
  { name: 'Diabétologie', value: 770, fill: 'hsl(38, 92%, 55%)' },
  { name: 'Antibiotiques', value: 80, fill: 'hsl(0, 72%, 55%)' },
  { name: 'Gastro', value: 450, fill: 'hsl(152, 60%, 42%)' },
  { name: 'Autres', value: 860, fill: 'hsl(200, 25%, 50%)' },
];

export const topMovingProducts = [
  { name: 'Paracétamol', sorties: 1800 },
  { name: 'Doliprane', sorties: 1500 },
  { name: 'Amoxicilline', sorties: 1200 },
  { name: 'Metformine', sorties: 950 },
  { name: 'Ibuprofène', sorties: 880 },
];
