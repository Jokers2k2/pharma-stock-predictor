import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSync, setShowSync] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      // Sync pending data
      const pending = JSON.parse(localStorage.getItem('pharma_pending_sync') || '[]');
      if (pending.length > 0) {
        setShowSync(true);
        setPendingCount(pending.length);
        // Simulate sync
        setTimeout(() => {
          localStorage.setItem('pharma_pending_sync', '[]');
          setShowSync(false);
          setPendingCount(0);
        }, 2000);
      }
    };
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (isOnline && !showSync) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all duration-300',
        !isOnline
          ? 'bg-destructive text-destructive-foreground'
          : 'bg-primary text-primary-foreground'
      )}
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Mode hors-ligne — Les données seront synchronisées au retour du réseau</span>
        </>
      ) : showSync ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Synchronisation de {pendingCount} éléments…</span>
        </>
      ) : null}
    </div>
  );
}
