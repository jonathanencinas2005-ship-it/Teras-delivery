export function formatRupiah(value) {
  const n = Math.round(Number(value) || 0);
  const formatted = Math.abs(n).toLocaleString('id-ID', { maximumFractionDigits: 0 });
  return `${n < 0 ? '-' : ''}Rp${formatted}`;
}

export function parseRupiahInput(str) {
  if (str === null || str === undefined) return 0;
  const cleaned = String(str).replace(/[^0-9]/g, '');
  return cleaned === '' ? 0 : parseInt(cleaned, 10);
}
