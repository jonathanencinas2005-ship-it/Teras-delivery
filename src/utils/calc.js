// Semua perhitungan transaksi HARUS lewat fungsi-fungsi ini,
// supaya preview, struk, riwayat, dan laporan selalu punya angka yang sama.

export function itemSubtotal(item) {
  const harga = Number(item.harga) || 0;
  const jumlah = Number(item.jumlah) || 0;
  return harga * jumlah;
}

export function storeSubtotal(store) {
  return (store.items || []).reduce((sum, it) => sum + itemSubtotal(it), 0);
}

export function goodsTotal(stores) {
  return (stores || []).reduce((sum, s) => sum + storeSubtotal(s), 0);
}

// ATURAN WAJIB biaya beda toko: flat Rp3.000 jika toko > 1, selain itu Rp0.
// Tidak pernah dikalikan jumlah toko tambahan.
export function bedaTokoFee(storeCount) {
  return storeCount > 1 ? 3000 : 0;
}

export function computeTotals({ stores, ongkir, biayaLayanan, parkir }) {
  const storeCount = (stores || []).filter((s) => (s.items || []).length > 0 || s.nama).length || (stores || []).length;
  const barang = goodsTotal(stores);
  const bedaToko = bedaTokoFee(stores ? stores.length : 0);
  const layanan = Number(biayaLayanan) || 0;
  const ongkirVal = Number(ongkir) || 0;
  const parkirVal = Number(parkir) || 0;
  const total = barang + ongkirVal + layanan + bedaToko + parkirVal;
  return {
    storeCount: stores ? stores.length : storeCount,
    barang,
    ongkir: ongkirVal,
    layanan,
    bedaToko,
    parkir: parkirVal,
    total
  };
}
