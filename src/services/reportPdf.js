import jsPDF from 'jspdf';
import { formatRupiah } from '../utils/currency.js';

export function generateReportPdf({ driverName, periodLabel, filename, summary, transactions }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 40;
  let y = 50;

  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('TERAS DELIVERY', marginX, y);
  y += 20;

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Driver: ${driverName}`, marginX, y);
  y += 16;
  doc.text(`Periode: ${periodLabel}`, marginX, y);
  y += 24;

  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('RINGKASAN', marginX, y);
  y += 18;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);

  const summaryRows = [
    ['Total Transaksi', String(summary.count)],
    ['Total Barang', formatRupiah(summary.barang)],
    ['Total Ongkir', formatRupiah(summary.ongkir)],
    ['Total Layanan', formatRupiah(summary.layanan)],
    ['Total Beda Toko', formatRupiah(summary.bedaToko)],
    ['Total Parkir', formatRupiah(summary.parkir)]
  ];
  summaryRows.forEach(([label, val]) => {
    doc.text(label, marginX, y);
    doc.text(val, 400, y, { align: 'right' });
    y += 16;
  });

  doc.setFont(undefined, 'bold');
  doc.text('TOTAL KESELURUHAN', marginX, y);
  doc.text(formatRupiah(summary.total), 400, y, { align: 'right' });
  y += 26;

  doc.setFontSize(12);
  doc.text('DETAIL TRANSAKSI', marginX, y);
  y += 16;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9.5);

  const colX = { no: marginX, tgl: marginX + 70, pel: marginX + 140, toko: marginX + 260, total: 555 };
  doc.setFont(undefined, 'bold');
  doc.text('No', colX.no, y);
  doc.text('Tanggal', colX.tgl, y);
  doc.text('Pelanggan', colX.pel, y);
  doc.text('Toko', colX.toko, y);
  doc.text('Total', colX.total, y, { align: 'right' });
  y += 6;
  doc.line(marginX, y, 555, y);
  y += 12;
  doc.setFont(undefined, 'normal');

  const sorted = transactions.slice().sort((a, b) => a.createdAt - b.createdAt);
  sorted.forEach((t) => {
    if (y > 780) {
      doc.addPage();
      y = 50;
    }
    doc.text(t.nomor, colX.no, y);
    doc.text(`${t.tanggal} ${t.jam}`, colX.tgl, y);
    doc.text((t.pelanggan?.nama || '-').slice(0, 20), colX.pel, y);
    doc.text((t.stores || []).map((s) => s.nama).join(', ').slice(0, 28), colX.toko, y);
    doc.text(formatRupiah(t.total), colX.total, y, { align: 'right' });
    y += 15;
  });

  doc.save(filename);
}
