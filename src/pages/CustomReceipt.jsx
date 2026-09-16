import React, { useMemo, useRef } from 'react';
import { useApp } from '../AppContext.jsx';
import ReceiptDocument from '../components/ReceiptDocument.jsx';
import { RECEIPT_ELEMENT_KEYS } from '../data/defaultSettings.js';

const ELEMENT_LABELS = {
  logo: 'Logo',
  namaUsaha: 'Nama Usaha',
  alamatUsaha: 'Alamat',
  hpUsaha: 'Nomor HP Usaha',
  nomorTransaksi: 'Nomor Transaksi',
  tanggal: 'Tanggal',
  jam: 'Jam',
  driver: 'Driver',
  pelanggan: 'Nama Pelanggan',
  hpPelanggan: 'Nomor HP Pelanggan',
  alamatPelanggan: 'Alamat Pelanggan',
  namaToko: 'Nama Toko',
  item: 'Item',
  harga: 'Harga',
  jumlah: 'Jumlah',
  subtotal: 'Subtotal',
  ongkir: 'Ongkir',
  biayaLayanan: 'Biaya Layanan',
  bedaToko: 'Biaya Beda Toko',
  parkir: 'Parkir',
  total: 'Total',
  catatan: 'Catatan',
  footer: 'Footer'
};

const SAMPLE_TX = {
  nomor: 'TD-0001',
  driver: 'Jo',
  tanggal: '16/09/2026',
  jam: '14:35',
  pelanggan: { nama: 'Budi', hp: '081234567890', alamat: 'Jl. Contoh No. 1', catatan: 'Tanpa es' },
  stores: [
    { id: 's1', nama: 'Jus Nenes', items: [{ id: 'i1', nama: 'Jus Alpukat', harga: 21000, jumlah: 1 }] },
    { id: 's2', nama: 'Seblak Teh Ida', items: [{ id: 'i2', nama: 'Seblak', harga: 15000, jumlah: 1 }] }
  ],
  barang: 36000,
  ongkir: 8000,
  biayaLayanan: 2000,
  bedaToko: 3000,
  parkir: 2000,
  total: 51000
};

export default function CustomReceipt({ navigate }) {
  const { receiptTemplate, updateReceiptTemplate } = useApp();
  const fileInputRef = useRef(null);

  function toggleElement(key) {
    updateReceiptTemplate({ elements: { ...receiptTemplate.elements, [key]: !receiptTemplate.elements[key] } });
  }

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateReceiptTemplate({ logoDataUrl: reader.result, showLogo: true });
    };
    reader.readAsDataURL(file);
  }

  const previewTemplate = useMemo(() => receiptTemplate, [receiptTemplate]);

  return (
    <>
      <div className="topbar">
        <div className="between">
          <h1>CUSTOM STRUK</h1>
          <button className="icon-btn" style={{ color: '#fff' }} onClick={() => navigate('settings')}>Selesai</button>
        </div>
      </div>
      <div className="screen">
        <div className="section-title">Preview</div>
        <ReceiptDocument tx={SAMPLE_TX} template={previewTemplate} />

        <div className="section-title">Identitas</div>
        <div className="card">
          <div className="field">
            <label>Nama Usaha</label>
            <input className="input" value={receiptTemplate.namaUsaha} onChange={(e) => updateReceiptTemplate({ namaUsaha: e.target.value })} />
          </div>
          <div className="field">
            <label>Alamat</label>
            <input className="input" value={receiptTemplate.alamatUsaha} onChange={(e) => updateReceiptTemplate({ alamatUsaha: e.target.value })} />
          </div>
          <div className="field">
            <label>Nomor HP</label>
            <input className="input" value={receiptTemplate.hpUsaha} onChange={(e) => updateReceiptTemplate({ hpUsaha: e.target.value })} />
          </div>
        </div>

        <div className="section-title">Logo</div>
        <div className="card">
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
          <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>Upload Logo</button>
          <div className="row btn-block-margin">
            <button className="btn btn-secondary btn-sm" onClick={() => updateReceiptTemplate({ showLogo: true })} disabled={!receiptTemplate.logoDataUrl}>Tampilkan Logo</button>
            <button className="btn btn-secondary btn-sm" onClick={() => updateReceiptTemplate({ showLogo: false })}>Sembunyikan Logo</button>
            <button className="btn btn-danger btn-sm" onClick={() => updateReceiptTemplate({ logoDataUrl: '', showLogo: false })}>Hapus Logo</button>
          </div>
        </div>

        <div className="section-title">Header &amp; Footer</div>
        <div className="card">
          <div className="field">
            <label>Teks Header</label>
            <input className="input" value={receiptTemplate.header} onChange={(e) => updateReceiptTemplate({ header: e.target.value })} />
          </div>
          <div className="field">
            <label>Teks Footer</label>
            <input className="input" value={receiptTemplate.footer} onChange={(e) => updateReceiptTemplate({ footer: e.target.value })} />
          </div>
        </div>

        <div className="section-title">Ukuran Struk</div>
        <div className="card">
          <div className="row">
            <button
              className={`btn ${receiptTemplate.ukuran === '58mm' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateReceiptTemplate({ ukuran: '58mm' })}
            >58mm</button>
            <button
              className={`btn ${receiptTemplate.ukuran === '80mm' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateReceiptTemplate({ ukuran: '80mm' })}
            >80mm</button>
          </div>
        </div>

        <div className="section-title">Elemen Struk</div>
        <div className="card">
          {RECEIPT_ELEMENT_KEYS.map((key) => (
            <div className="checkbox-row" key={key}>
              <input
                type="checkbox"
                id={`el-${key}`}
                checked={!!receiptTemplate.elements[key]}
                onChange={() => toggleElement(key)}
              />
              <label htmlFor={`el-${key}`} style={{ fontWeight: 400 }}>{ELEMENT_LABELS[key] || key}</label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
