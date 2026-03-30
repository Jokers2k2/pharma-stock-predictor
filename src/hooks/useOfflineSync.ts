import { useCallback } from 'react';

const PENDING_KEY = 'pharma_pending_sync';
const CACHE_PREFIX = 'pharma_cache_';

export function useOfflineSync() {
  const queueAction = useCallback((action: { type: string; payload: any; timestamp: string }) => {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
    pending.push(action);
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  }, []);

  const cacheData = useCallback((key: string, data: any) => {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, cachedAt: new Date().toISOString() }));
  }, []);

  const getCachedData = useCallback(<T,>(key: string): T | null => {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw).data as T;
  }, []);

  const getPendingCount = useCallback(() => {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]').length;
  }, []);

  return { queueAction, cacheData, getCachedData, getPendingCount };
}
