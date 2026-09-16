import React, { useRef, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { formatRupiah, parseRupiahInput } from '../utils/currency.js';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { uid } from '../utils/id.js';

export default function Settings({ navigate }) {
  const {
    driverName, setDriverName,
    settings, updateSettings,
    regions, addRegion, updateRegion, deleteRegion,
    exportAllData, importAllData, resetAllData
  } = useApp();

  const [tab, setTab] = useState('profil');
  const [nameDraft, setNameDraft] = useState(driverName);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDeleteRegion, setConfirmDeleteRegion] = useState(null);
  const [editingRegion, setEditingRegion] = useState(null);
  const [newRegionName, setNewRegionName] = useState('');
  const [newRegionPrice, setNewRegionPrice] = useState(0);
  const [toast, setToast] = useState('');
  const importInputRef = useRef(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  function handleSaveName() {
    if (!nameDraft.trim()) return;
    setDriverName(nameDraft.trim());
    showToast('Nama driver diperbarui');
  }

  function handleAddRegion() {
    const nama = newRegionName.trim();
    if (!nama) return;
    addRegion({ id: uid('region'), nama, harga: Number(newRegionPrice) || 0, isDefault: false });
    setNewRegionName('');
    setNewRegionPrice(0);
    showToast('Wilayah ditambahkan');
  }

  function handleExport() {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateSuffix = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `TerasDelivery_Backup_${dateSuffix}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data berhasil diexport');
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importAllData(data);
        showToast('Data berhasil diimport');
      } catch (err) {
        showToast('File tidak valid');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <>
      <div className="topbar">
        <h1>PENGATURAN</h1>
      </div>
      <div className="screen">
        <div className="tab-bar">
          <button className={`tab-btn ${tab === 'profil' ? 'active' : ''}`} onClick={() => setTab('profil')}>Profil</button>
          <button className={`tab-btn ${tab === 'biaya' ? 'active' : ''}`} onClick={() => setTab('biaya')}>Biaya</button>
          <button className={`tab-btn ${tab === 'wilayah' ? 'active' : ''}`} onClick={() => setTab('wilayah')}>Wilayah</button>
          <button className={`tab-btn ${tab === 'struk' ? 'active' : ''}`} onClick={() => setTab('struk')}>Custom Struk</button>
          <button className={`tab-btn ${tab === 'data' ? 'active' : ''}`} onClick={() => setTab('data')}>Data</button>
        </div>

        {tab === 'profil' && (
          <div className="card">
            <h2>Profil Driver</h2>
            <div className="field">
              <label>Nama Driver</label>
              <input className="input" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleSaveName}>Simpan Perubahan</button>
          </div>
        )}

        {tab === 'biaya' && (
          <div className="card">
            <h2>Pengaturan Biaya</h2>
            <div className="field">
              <label>Biaya Layanan (default per transaksi)</label>
              <input
                className="input"
                inputMode="numeric"
                value={formatRupiah(settings.biayaLayanan)}
                onChange={(e) => updateSettings({ biayaLayanan: parseRupiahInput(e.target.value) })}
              />
            </div>
            <div className="muted">Biaya beda toko bersifat tetap: Rp0 jika 1 toko, Rp3.000 jika lebih dari 1 toko (tidak berubah sesuai aturan aplikasi).</div>
          </div>
        )}

        {tab === 'wilayah' && (
          <>
            <div className="card">
              <h2>Tambah Wilayah Baru</h2>
              <div className="field">
                <label>Nama Wilayah</label>
                <input className="input" value={newRegionName} onChange={(e) => setNewRegionName(e.target.value)} />
              </div>
              <div className="field">
                <label>Harga Ongkir</label>
                <input
                  className="input"
                  inputMode="numeric"
                  value={newRegionPrice ? formatRupiah(newRegionPrice) : ''}
                  onChange={(e) => setNewRegionPrice(parseRupiahInput(e.target.value))}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddRegion}>+ Tambah Wilayah</button>
            </div>

            <div className="section-title">Daftar Wilayah ({regions.length})</div>
            {regions.map((r) => (
              <div className="list-item" key={r.id}>
                {editingRegion === r.id ? (
                  <>
                    <div className="field">
                      <input className="input" defaultValue={r.nama} id={`name-${r.id}`} />
                    </div>
                    <div className="field">
                      <input className="input" inputMode="numeric" defaultValue={r.harga} id={`price-${r.id}`} />
                    </div>
                    <div className="row">
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingRegion(null)}>Batal</button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const nama = document.getElementById(`name-${r.id}`).value.trim();
                          const harga = parseRupiahInput(document.getElementById(`price-${r.id}`).value);
                          if (nama) updateRegion(r.id, { nama, harga });
                          setEditingRegion(null);
                        }}
                      >Simpan</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="between">
                      <span style={{ fontWeight: 700 }}>{r.nama}</span>
                      <span>{formatRupiah(r.harga)}</span>
                    </div>
                    <div className="row" style={{ marginTop: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setEditingRegion(r.id)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteRegion(r.id)}>Hapus</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {tab === 'struk' && (
          <div className="card">
            <h2>Custom Struk</h2>
            <p className="muted">Atur identitas usaha, logo, header/footer, ukuran, dan elemen yang tampil di struk.</p>
            <button className="btn btn-primary" onClick={() => navigate('custom-receipt')}>Buka Pengaturan Custom Struk</button>
          </div>
        )}

        {tab === 'data' && (
          <>
            <div className="card">
              <h2>Backup Data</h2>
              <button className="btn btn-primary" onClick={handleExport}>EXPORT DATA (JSON)</button>
              <input ref={importInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportFile} />
              <button className="btn btn-secondary btn-block-margin" onClick={() => importInputRef.current?.click()}>IMPORT DATA (JSON)</button>
            </div>
            <div className="card">
              <h2>Zona Berbahaya</h2>
              <button className="btn btn-danger" onClick={() => setConfirmReset(true)}>HAPUS SEMUA DATA</button>
            </div>
          </>
        )}
      </div>

      {confirmReset && (
        <ConfirmModal
          title="Hapus Semua Data?"
          message="Seluruh transaksi, wilayah tambahan, dan pengaturan akan dihapus permanen dari perangkat ini. Aksi ini tidak dapat dibatalkan."
          confirmLabel="Ya, Hapus Semua"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => { resetAllData(); setConfirmReset(false); showToast('Semua data telah dihapus'); }}
        />
      )}
      {confirmDeleteRegion && (
        <ConfirmModal
          title="Hapus Wilayah?"
          message="Wilayah ini akan dihapus dari daftar."
          onCancel={() => setConfirmDeleteRegion(null)}
          onConfirm={() => { deleteRegion(confirmDeleteRegion); setConfirmDeleteRegion(null); }}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
