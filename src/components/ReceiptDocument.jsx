import React from 'react';
import { formatRupiah } from '../utils/currency.js';

const ReceiptDocument = React.forwardRef(({ tx, template }, ref) => {
  const el = template.elements;
  const sizeClass = template.ukuran === '80mm' ? 'size-80' : 'size-58';

  if (!tx) return null;

  return (
    <div ref={ref} className={`receipt-preview ${sizeClass}`}>
      <div className="receipt-center">
        {el.logo && template.showLogo && template.logoDataUrl && (
          <img src={template.logoDataUrl} alt="logo" className="receipt-logo" />
        )}
        <div style={{ fontWeight: 700 }}>{template.header || 'TERAS DELIVERY'}</div>
        {el.namaUsaha && template.namaUsaha && <div>{template.namaUsaha}</div>}
        {el.alamatUsaha && template.alamatUsaha && <div>{template.alamatUsaha}</div>}
        {el.hpUsaha && template.hpUsaha && <div>{template.hpUsaha}</div>}
      </div>
      <div className="receipt-divider" />

      {el.nomorTransaksi && <div>No: {tx.nomor}</div>}
      {el.driver && <div>Driver: {tx.driver}</div>}
      {(el.tanggal || el.jam) && (
        <div>
          {el.tanggal ? `Tanggal: ${tx.tanggal}` : ''}{el.tanggal && el.jam ? ' ' : ''}{el.jam ? tx.jam : ''}
        </div>
      )}

      {el.pelanggan && (
        <>
          <div style={{ marginTop: 6 }}>Pelanggan:</div>
          <div>{tx.pelanggan?.nama || '-'}</div>
          {el.hpPelanggan && tx.pelanggan?.hp && <div>{tx.pelanggan.hp}</div>}
          {el.alamatPelanggan && tx.pelanggan?.alamat && <div>{tx.pelanggan.alamat}</div>}
        </>
      )}

      {(tx.stores || []).map((store) => (
        <div key={store.id} style={{ marginTop: 8 }}>
          {el.namaToko && <div style={{ fontWeight: 700 }}>TOKO: {(store.nama || '').toUpperCase()}</div>}
          {(store.items || []).map((it) => (
            el.item ? (
              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{it.nama}{el.jumlah ? ` (${it.jumlah}x)` : ''}</span>
                {(el.harga || el.subtotal) && <span>{formatRupiah(it.harga * it.jumlah)}</span>}
              </div>
            ) : null
          ))}
        </div>
      ))}

      <div className="receipt-divider" />
      {(el.subtotal || el.harga) && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Barang</span><span>{formatRupiah(tx.barang)}</span>
        </div>
      )}
      {el.ongkir && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Ongkir</span><span>{formatRupiah(tx.ongkir)}</span>
        </div>
      )}
      {el.biayaLayanan && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Layanan</span><span>{formatRupiah(tx.biayaLayanan)}</span>
        </div>
      )}
      {el.bedaToko && tx.bedaToko > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Beda Toko</span><span>{formatRupiah(tx.bedaToko)}</span>
        </div>
      )}
      {el.parkir && tx.parkir > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Parkir</span><span>{formatRupiah(tx.parkir)}</span>
        </div>
      )}
      {el.total && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginTop: 6 }}>
          <span>TOTAL</span><span>{formatRupiah(tx.total)}</span>
        </div>
      )}
      <div className="receipt-divider" />

      {el.catatan && tx.pelanggan?.catatan && <div>Catatan: {tx.pelanggan.catatan}</div>}

      <div className="receipt-center" style={{ marginTop: 6 }}>
        {el.footer && <div>{template.footer || 'Terima kasih telah menggunakan Teras Delivery'}</div>}
        {el.namaUsaha && <div>{template.namaUsaha || 'Teras Delivery'}</div>}
      </div>
    </div>
  );
});

export default ReceiptDocument;
