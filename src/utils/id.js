export function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatTransactionNumber(n) {
  return `TD-${String(n).padStart(4, '0')}`;
}
