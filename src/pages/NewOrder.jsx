import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import StoreBlock from '../components/StoreBlock.jsx';
import RegionPicker from '../components/RegionPicker.jsx';
import { formatRupiah, parseRupiahInput } from '../utils/currency.js';
import { computeTotals } from '../utils/calc.js';
import { nowParts } from '../utils/date.js';

function emptyStore() {
  return {
    id: `store_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    nama: '',
    items: [{ id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, nama: '', harga: 0, jumlah: 1 }]
  };
}

export default function NewOrder({ navigate, editId }) {
  const { driverName, transactions, addTransaction, updateTransaction, settings } = useApp();
  const editingTx = useMemo(() => transactions.find((t) => t.id === editId), [editId, transactions]);

  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [catatan, setCatatan] = useState('');
  const [stores, setStores] = useState([emptyStore()]);
  const [wilayah, setWilayah] = useState(null);
  const [parkir, setParkir] = useState(0);
  const [step, setStep] = useState('form'); // form | summary
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (editingTx) {
      setNama(editingTx.pelanggan?.nama || '');
      setHp(editingTx.pelanggan?.hp || '');
      setAlamat(editingTx.pelanggan?.alamat || '');
      setCatatan(editingTx.pelanggan?.catatan || '');
      setStores(editingTx.stores && editingTx.stores.length > 0 ? editingTx.stores : [emptyStore()]);
      setWilayah(editingTx.wilayah || null);
      setParkir(editingTx.parkir || 0);
    }
  }, [editingTx]);

  const biayaLayanan = settings.biayaLayanan;

  const totals = useMemo(
    () => computeTotals({ stores, ongkir: wilayah?.harga || 0, biayaLayanan, parkir }),
    [stores, wilayah, biayaLayanan, parkir]
  );

  function updateStore(index, next) {
    setStores((prev) => prev.map((s, i) => (i === index ? next : s)));
  }

  function removeStore(index) {
    setStores((prev) => prev.filter((_, i) => i !== index));
  }

  function addStore() {
    setStores((prev) => [...prev, emptyStore()]);
  }

  function validate() {
    const errs = [];
    if (!nama.trim()) errs.push('Nama pelanggan wajib diisi.');
    stores.forEach((s, i) => {
      if (!s.nama.trim()) errs.push(`Nama toko ${i + 1} wajib diisi.`);
      if (s.items.length === 0) errs.push(`Toko ${i + 1} harus punya minimal 1 item.`);
      s.items.forEach((it, j) => {
        if (!it.nama.trim()) errs.push(`Nama item ${j + 1} di toko ${i + 1} wajib diisi.`);
        if (!it.harga || it.harga <= 0) errs.push(`Harga item "${it.nama || j + 1}" tidak valid.`);
        if (!it.jumlah || it.jumlah <= 0) errs.push(`Jumlah item "${it.nama || j + 1}" tidak valid.`);
      });
    });
    if (!wilayah) errs.push('Wilayah pengantaran wajib dipilih atau dibuat manual.');
    return errs;
  }

  function goToSummary() {
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;
    setStep('summary');
  }

  function handleSave() {
    const timeParts = editingTx ? null : nowParts();
    const payload = {
      driver: driverName,
      pelanggan: { nama: nama.trim(), hp: hp.trim(), alamat: alamat.trim(), catatan: catatan.trim() },
      stores,
      wilayah,
      ongkir: wilayah?.harga || 0,
      biayaLayanan,
      bedaToko: totals.bedaToko,
      parkir: Number(parkir) || 0,
      barang: totals.barang,
      total: totals.total
    };

    if (editingTx) {
      updateTransaction(editingTx.id, payload);
      navigate('receipt', { txId: editingTx.id });
    } else {
      const tx = addTransaction({
        ...payload,
        tanggalIso: timeParts.isoDate,
        tanggal: timeParts.dateStr,
        jam: timeParts.timeStr,
        createdAt: timeParts.createdAt
      });
      navigate('receipt', { txId: tx.id });
    }
  }

  return (
    <>
      <div className="topbar">
        <div className="between">
          <h1>{editingTx ? 'EDIT PESANAN' : 'PESANAN BARU'}</h1>
          <button className="icon-btn" style={{ color: '#fff' }} onClick={() => navigate('dashboard')}>Tutup</button>
        </div>
      </div>
      <div className="screen">
        {step === 'form' && (
          <>
            <div className="card">
              <h2>Data Pelanggan</h2>
              <div className="field">
                <label>Nama Pelanggan</label>
                <input className="input" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama pelanggan" />
              </div>
              <div className="field">
                <label>Nomor HP</label>
                <input className="input" inputMode="numeric" value={hp} onChange={(e) => setHp(e.target.value)} placeholder="08xxxxxxxxxx" />
              </div>
              <div className="field">
                <label>Alamat</label>
                <textarea className="input" value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Alamat pengantaran" />
              </div>
              <div className="field">
                <label>Catatan</label>
                <textarea className="input" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Catatan tambahan (opsional)" />
              </div>
            </div>

            <div className="section-title">Toko &amp; Item Pesanan</div>
            {stores.map((store, idx) => (
              <StoreBlock
                key={store.id}
                store={store}
                index={idx}
                onChange={(next) => updateStore(idx, next)}
                onRemove={() => removeStore(idx)}
                canRemove={stores.length > 1}
              />
            ))}
            <button className="btn btn-outline btn-block-margin" onClick={addStore}>+ TAMBAH TOKO</button>

            <div className="section-title">Wilayah Pengantaran</div>
            <div className="card">
              <RegionPicker selected={wilayah} onSelect={setWilayah} />
            </div>

            <div className="section-title">Biaya Parkir</div>
            <div className="card">
              <div className="field">
                <label>Biaya Parkir (opsional)</label>
                <input
                  className="input"
                  inputMode="numeric"
                  placeholder="Rp0"
                  value={parkir ? formatRupiah(parkir) : ''}
                  onChange={(e) => setParkir(parseRupiahInput(e.target.value))}
                />
              </div>
            </div>

            <div className="card">
              <div className="total-line"><span>Total Barang</span><span>{formatRupiah(totals.barang)}</span></div>
              <div className="total-line"><span>Ongkir</span><span>{formatRupiah(totals.ongkir)}</span></div>
              <div className="total-line"><span>Biaya Layanan</span><span>{formatRupiah(totals.layanan)}</span></div>
              <div className="total-line"><span>Biaya Beda Toko</span><span>{formatRupiah(totals.bedaToko)}</span></div>
              <div className="total-line"><span>Parkir</span><span>{formatRupiah(totals.parkir)}</span></div>
              <div className="total-line grand"><span>TOTAL</span><span>{formatRupiah(totals.total)}</span></div>
            </div>

            {errors.length > 0 && (
              <div className="card" style={{ borderColor: '#dc2626' }}>
                {errors.map((e, i) => (
                  <div key={i} className="muted" style={{ color: '#dc2626' }}>• {e}</div>
                ))}
              </div>
            )}

            <button className="btn btn-primary" onClick={goToSummary}>LIHAT RINGKASAN</button>
          </>
        )}

        {step === 'summary' && (
          <>
            <div className="card">
              <h2>RINGKASAN PESANAN</h2>
              <div className="total-line"><span>Pelanggan</span><span>{nama}</span></div>
              {hp && <div className="total-line"><span>No. HP</span><span>{hp}</span></div>}
              {alamat && <div className="total-line"><span>Alamat</span><span style={{ textAlign: 'right', maxWidth: '65%' }}>{alamat}</span></div>}
            </div>

            {stores.map((s, i) => (
              <div className="card" key={s.id}>
                <h3>TOKO {i + 1}: {s.nama.toUpperCase()}</h3>
                {s.items.map((it) => (
                  <div className="total-line" key={it.id}>
                    <span>{it.nama} ({it.jumlah}x)</span>
                    <span>{formatRupiah(it.harga * it.jumlah)}</span>
                  </div>
                ))}
              </div>
            ))}

            <div className="card">
              <div className="total-line"><span>Total Barang</span><span>{formatRupiah(totals.barang)}</span></div>
              <div className="total-line"><span>Wilayah</span><span>{wilayah?.nama}</span></div>
              <div className="total-line"><span>Ongkir</span><span>{formatRupiah(totals.ongkir)}</span></div>
              <div className="total-line"><span>Biaya Layanan</span><span>{formatRupiah(totals.layanan)}</span></div>
              <div className="total-line"><span>Biaya Beda Toko</span><span>{formatRupiah(totals.bedaToko)}</span></div>
              <div className="total-line"><span>Parkir</span><span>{formatRupiah(totals.parkir)}</span></div>
              <div className="total-line grand"><span>TOTAL</span><span>{formatRupiah(totals.total)}</span></div>
            </div>

            <div className="row">
              <button className="btn btn-secondary" onClick={() => setStep('form')}>Kembali</button>
              <button className="btn btn-primary" onClick={handleSave}>SIMPAN PESANAN</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
