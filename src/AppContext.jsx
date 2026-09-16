import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { KEYS, loadJSON, saveJSON, loadString, saveString } from './utils/storage.js';
import { buildDefaultRegions } from './data/defaultRegions.js';
import { DEFAULT_SETTINGS, DEFAULT_RECEIPT_TEMPLATE } from './data/defaultSettings.js';
import { formatTransactionNumber } from './utils/id.js';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [driverName, setDriverNameState] = useState(() => loadString(KEYS.DRIVER, ''));
  const [transactions, setTransactions] = useState(() => loadJSON(KEYS.TRANSACTIONS, []));
  const [lastNumber, setLastNumber] = useState(() => loadJSON(KEYS.LAST_NUMBER, 0));
  const [regions, setRegions] = useState(() => {
    const saved = loadJSON(KEYS.REGIONS, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    const def = buildDefaultRegions();
    saveJSON(KEYS.REGIONS, def);
    return def;
  });
  const [settings, setSettings] = useState(() => loadJSON(KEYS.SETTINGS, DEFAULT_SETTINGS));
  const [receiptTemplate, setReceiptTemplate] = useState(() =>
    loadJSON(KEYS.RECEIPT_TEMPLATE, DEFAULT_RECEIPT_TEMPLATE)
  );

  useEffect(() => { saveJSON(KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { saveJSON(KEYS.LAST_NUMBER, lastNumber); }, [lastNumber]);
  useEffect(() => { saveJSON(KEYS.REGIONS, regions); }, [regions]);
  useEffect(() => { saveJSON(KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { saveJSON(KEYS.RECEIPT_TEMPLATE, receiptTemplate); }, [receiptTemplate]);

  function setDriverName(name) {
    setDriverNameState(name);
    saveString(KEYS.DRIVER, name);
  }

  function addTransaction(txData) {
    const nextNumber = lastNumber + 1;
    const tx = {
      ...txData,
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      nomor: formatTransactionNumber(nextNumber),
      nomorUrut: nextNumber
    };
    setTransactions((prev) => [tx, ...prev]);
    setLastNumber(nextNumber);
    return tx;
  }

  function updateTransaction(id, patch) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, id: t.id, nomor: t.nomor, createdAt: t.createdAt } : t))
    );
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function addRegion(region) {
    setRegions((prev) => [...prev, region]);
  }

  function updateRegion(id, patch) {
    setRegions((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function deleteRegion(id) {
    setRegions((prev) => prev.filter((r) => r.id !== id));
  }

  function updateSettings(patch) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function updateReceiptTemplate(patch) {
    setReceiptTemplate((prev) => ({ ...prev, ...patch }));
  }

  function exportAllData() {
    return {
      exportedAt: new Date().toISOString(),
      app: 'teras-delivery',
      version: 1,
      driverName,
      transactions,
      lastNumber,
      regions,
      settings,
      receiptTemplate
    };
  }

  function importAllData(data) {
    if (!data || typeof data !== 'object') throw new Error('File data tidak valid');
    if (Array.isArray(data.transactions)) setTransactions(data.transactions);
    if (typeof data.lastNumber === 'number') setLastNumber(data.lastNumber);
    if (Array.isArray(data.regions) && data.regions.length > 0) setRegions(data.regions);
    if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
    if (data.receiptTemplate) setReceiptTemplate((prev) => ({ ...prev, ...data.receiptTemplate }));
    if (typeof data.driverName === 'string' && data.driverName) setDriverName(data.driverName);
  }

  function resetAllData() {
    setTransactions([]);
    setLastNumber(0);
    const def = buildDefaultRegions();
    setRegions(def);
    setSettings(DEFAULT_SETTINGS);
    setReceiptTemplate(DEFAULT_RECEIPT_TEMPLATE);
  }

  const value = useMemo(
    () => ({
      driverName,
      setDriverName,
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      regions,
      addRegion,
      updateRegion,
      deleteRegion,
      settings,
      updateSettings,
      receiptTemplate,
      updateReceiptTemplate,
      exportAllData,
      importAllData,
      resetAllData
    }),
    [driverName, transactions, regions, settings, receiptTemplate]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp harus dipakai di dalam AppProvider');
  return ctx;
}
