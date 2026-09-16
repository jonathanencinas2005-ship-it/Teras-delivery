export function filterByPeriod(transactions, period) {
  const { mode } = period;
  if (mode === 'date') {
    return transactions.filter((t) => t.tanggalIso === period.date);
  }
  if (mode === 'month') {
    return transactions.filter((t) => t.tanggalIso && t.tanggalIso.startsWith(period.month));
  }
  if (mode === 'range') {
    return transactions.filter((t) => t.tanggalIso >= period.start && t.tanggalIso <= period.end);
  }
  return transactions;
}

export function aggregate(transactions) {
  return transactions.reduce(
    (acc, t) => ({
      count: acc.count + 1,
      barang: acc.barang + (t.barang || 0),
      ongkir: acc.ongkir + (t.ongkir || 0),
      layanan: acc.layanan + (t.biayaLayanan || 0),
      bedaToko: acc.bedaToko + (t.bedaToko || 0),
      parkir: acc.parkir + (t.parkir || 0),
      total: acc.total + (t.total || 0)
    }),
    { count: 0, barang: 0, ongkir: 0, layanan: 0, bedaToko: 0, parkir: 0, total: 0 }
  );
}
