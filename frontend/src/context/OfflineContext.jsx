import React, { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext(null);

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    const saved = localStorage.getItem('rms_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('rms_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Allow manual toggle for demonstration of the SRS offline capability
  const toggleSimulation = () => {
    setIsOnline((prev) => !prev);
  };

  const queueRequest = (requestData) => {
    const item = {
      id: `offline-${Date.now()}`,
      ...requestData,
      timestamp: new Date().toISOString(),
      synced: false,
    };
    setOfflineQueue((prev) => [item, ...prev]);
    return item;
  };

  const syncQueue = async (onSyncItem) => {
    if (offlineQueue.length === 0) return;

    for (const item of offlineQueue) {
      if (onSyncItem) {
        await onSyncItem(item);
      }
    }

    setOfflineQueue([]);
    setLastSyncTime(new Date());
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        toggleSimulation,
        offlineQueue,
        queueRequest,
        syncQueue,
        lastSyncTime,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);

