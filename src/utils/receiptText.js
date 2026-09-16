import { formatRupiah } from './currency.js';

export function buildReceiptText(tx, template) {
  const el = template.elements;
  const lines = [];
  const divider = '------------------------';

  lines.push(template.header || 'TERAS DELIVERY');
  if (el.namaUsaha && template.namaUsaha) lines.push(template.namaUsaha);
  if (el.alamatUsaha && template.alamatUsaha) lines.push(template.alamatUsaha);
  if (el.hpUsaha && template.hpUsaha) lines.push(template.hpUsaha);
  lines.push(divider);

  if (el.nomorTransaksi) lines.push(`No: ${tx.nomor}`);
  if (el.driver) lines.push(`Driver: ${tx.driver}`);
  if (el.tanggal && el.jam) lines.push(`Tanggal: ${tx.tanggal} ${tx.jam}`);
  else {
    if (el.tanggal) lines.push(`Tanggal: ${tx.tanggal}`);
    if (el.jam) lines.push(`Jam: ${tx.jam}`);
  }

  if (el.pelanggan) {
    lines.push('');
    lines.push('Pelanggan:');
    lines.push(tx.pelanggan?.nama || '-');
    if (el.hpPelanggan && tx.pelanggan?.hp) lines.push(tx.pelanggan.hp);
    if (el.alamatPelanggan && tx.pelanggan?.alamat) lines.push(tx.pelanggan.alamat);
  }

  (tx.stores || []).forEach((store) => {
    lines.push('');
    if (el.namaToko) lines.push(`TOKO: ${(store.nama || '').toUpperCase()}`);
    (store.items || []).forEach((it) => {
      if (el.item) {
        const hargaJumlah = el.harga && el.jumlah
          ? `${it.jumlah} x ${formatRupiah(it.harga)} = ${formatRupiah(it.harga * it.jumlah)}`
          : el.subtotal
            ? formatRupiah(it.harga * it.jumlah)
            : '';
        lines.push(it.nama);
        if (hargaJumlah) lines.push(hargaJumlah);
      }
    });
  });

  lines.push(divider);
  if (el.subtotal || el.harga) lines.push(`Total Barang: ${formatRupiah(tx.barang)}`);
  if (el.ongkir) lines.push(`Ongkir: ${formatRupiah(tx.ongkir)}`);
  if (el.biayaLayanan) lines.push(`Layanan: ${formatRupiah(tx.biayaLayanan)}`);
  if (el.bedaToko && tx.bedaToko > 0) lines.push(`Beda Toko: ${formatRupiah(tx.bedaToko)}`);
  if (el.parkir && tx.parkir > 0) lines.push(`Parkir: ${formatRupiah(tx.parkir)}`);
  lines.push('');
  if (el.total) lines.push(`TOTAL: ${formatRupiah(tx.total)}`);
  lines.push(divider);

  if (el.catatan && tx.pelanggan?.catatan) {
    lines.push(`Catatan: ${tx.pelanggan.catatan}`);
  }

  if (el.footer) lines.push(template.footer || 'Terima kasih telah menggunakan Teras Delivery');
  if (el.namaUsaha) lines.push(template.namaUsaha || 'Teras Delivery');

  return lines.join('\n');
}
