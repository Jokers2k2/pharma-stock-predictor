import { useState, useRef, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { products } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ScanLine, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanEntry {
  id: number;
  code: string;
  productName: string;
  quantity: number;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: string;
}

export default function SmartScanPage() {
  const { toast } = useToast();
  const [scanInput, setScanInput] = useState('');
  const [scanLog, setScanLog] = useState<ScanEntry[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);

  // Auto-focus on input for successive scanning
  useEffect(() => {
    if (isScanning) inputRef.current?.focus();
  }, [isScanning, scanLog]);

  const handleScan = (value: string) => {
    const code = value.trim().toUpperCase();
    if (!code) return;

    const product = products.find((p) => p.code === code || p.lotNumber === code);
    idCounter.current++;
    const now = new Date().toLocaleTimeString('fr-FR');

    if (!product) {
      const entry: ScanEntry = {
        id: idCounter.current,
        code,
        productName: 'Inconnu',
        quantity: 0,
        status: 'error',
        message: `Code "${code}" non trouvé dans la base`,
        timestamp: now,
      };
      setScanLog((prev) => [entry, ...prev]);
      toast({ title: '❌ Produit non trouvé', description: `Le code ${code} n'existe pas`, variant: 'destructive' });
    } else {
      const daysToExpiry = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const isExpiringSoon = daysToExpiry < 90;
      const entry: ScanEntry = {
        id: idCounter.current,
        code: product.code,
        productName: product.name,
        quantity: product.onHand,
        status: isExpiringSoon ? 'warning' : 'success',
        message: isExpiringSoon
          ? `⚠️ Péremption proche : ${daysToExpiry} jours — Lot ${product.lotNumber}`
          : `✅ Vérifié — Stock: ${product.onHand} — Lot ${product.lotNumber}`,
        timestamp: now,
      };
      setScanLog((prev) => [entry, ...prev]);
    }
    setScanInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan(scanInput);
  };

  const totalScanned = scanLog.length;
  const successCount = scanLog.filter((s) => s.status === 'success').length;
  const warningCount = scanLog.filter((s) => s.status === 'warning').length;
  const errorCount = scanLog.filter((s) => s.status === 'error').length;

  return (
    <div>
      <TopBar title="Smart Scanning" breadcrumb={['PharmaStock BI', 'Opérations', 'Smart Scan']} />
      <div className="p-6 space-y-6">
        {/* Scanner control */}
        <div className="bg-card rounded-xl border border-border p-6 odoo-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-primary" /> Mode scan successif
            </h3>
            <Button
              variant={isScanning ? 'destructive' : 'default'}
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => setIsScanning(!isScanning)}
            >
              {isScanning ? 'Arrêter le scan' : 'Démarrer le scan'}
            </Button>
          </div>

          {isScanning && (
            <div className="space-y-3">
              <div className="relative">
                <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-pulse" />
                <Input
                  ref={inputRef}
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scannez ou tapez le code produit / lot (Entrée pour valider)..."
                  className="pl-11 h-12 text-base border-primary/30 focus:border-primary"
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Scannez le code-barres ou tapez manuellement : <span className="font-mono">MED-001</span> à <span className="font-mono">MED-012</span> ou un n° de lot
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-xs">
          <span className="text-muted-foreground">{totalScanned} scan(s) effectué(s)</span>
          <span className="text-success font-medium">{successCount} ✓</span>
          <span className="text-warning font-medium">{warningCount} ⚠</span>
          <span className="text-destructive font-medium">{errorCount} ✗</span>
        </div>

        {/* Scan log */}
        {scanLog.length > 0 && (
          <div className="bg-card rounded-xl border border-border odoo-shadow overflow-hidden">
            <div className="divide-y divide-border">
              {scanLog.map((entry) => (
                <div key={entry.id} className={cn('flex items-center gap-4 px-5 py-3 transition-colors',
                  entry.status === 'error' && 'bg-destructive/5',
                  entry.status === 'warning' && 'bg-warning/5',
                )}>
                  {entry.status === 'success' && <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />}
                  {entry.status === 'warning' && <Volume2 className="w-5 h-5 text-warning flex-shrink-0" />}
                  {entry.status === 'error' && <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium">{entry.code}</span>
                      <span className="text-sm text-foreground">{entry.productName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{entry.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{entry.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {scanLog.length === 0 && isScanning && (
          <div className="text-center py-12 text-muted-foreground">
            <ScanLine className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">En attente de scan...</p>
          </div>
        )}
      </div>
    </div>
  );
}
