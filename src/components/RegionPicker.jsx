import React, { useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { formatRupiah, parseRupiahInput } from '../utils/currency.js';
import { uid } from '../utils/id.js';

export default function RegionPicker({ selected, onSelect }) {
  const { regions, addRegion } = useApp();
  const [query, setQuery] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState(0);
  const [saveAsNew, setSaveAsNew] = useState(true);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return regions;
    return regions.filter((r) => r.nama.toLowerCase().includes(q));
  }, [query, regions]);

  function handleSelectRegion(region) {
    onSelect({ nama: region.nama, harga: region.harga, isManual: false, regionId: region.id });
    setShowManual(false);
  }

  function handleSaveManual() {
    const nama = manualName.trim();
    const harga = Number(manualPrice) || 0;
    if (!nama) return;
    if (saveAsNew) {
      const newRegion = { id: uid('region'), nama, harga, isDefault: false };
      addRegion(newRegion);
      onSelect({ nama, harga, isManual: false, regionId: newRegion.id });
    } else {
      onSelect({ nama, harga, isManual: true });
    }
    setManualName('');
    setManualPrice(0);
    setShowManual(false);
    setQuery('');
  }

  return (
    <div>
      <div className="field search-box">
        <label>Cari Wilayah Pengantaran</label>
        <input
          className="input"
          placeholder="🔍 Cari wilayah pengantaran"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {selected && (
        <div className="region-result selected" style={{ marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 700 }}>{selected.nama}</div>
            <div className="muted">Wilayah terpilih</div>
          </div>
          <div className="price">{formatRupiah(selected.harga)}</div>
        </div>
      )}

      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {results.map((r) => (
          <div
            key={r.id}
            className={`region-result ${selected && selected.regionId === r.id ? 'selected' : ''}`}
            onClick={() => handleSelectRegion(r)}
          >
            <div>{r.nama}</div>
            <div className="price">{formatRupiah(r.harga)}</div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="muted" style={{ padding: '10px 0' }}>Wilayah tidak ditemukan.</div>
        )}
      </div>

      {!showManual && (
        <button className="btn btn-outline btn-sm btn-block-margin" onClick={() => setShowManual(true)}>
          + WILAYAH LAIN / MANUAL
        </button>
      )}

      {showManual && (
        <div className="card" style={{ marginTop: 10, background: '#fbfcfe' }}>
          <h3>Wilayah Manual</h3>
          <div className="field">
            <label>Nama Wilayah</label>
            <input className="input" value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder='Contoh: "Lelea - Sukamaju"' />
          </div>
          <div className="field">
            <label>Harga Ongkir</label>
            <input
              className="input"
              inputMode="numeric"
              value={manualPrice ? formatRupiah(manualPrice) : ''}
              onChange={(e) => setManualPrice(parseRupiahInput(e.target.value))}
              placeholder="Rp0"
            />
          </div>
          <div className="checkbox-row" style={{ borderBottom: 'none' }}>
            <input type="checkbox" checked={saveAsNew} onChange={(e) => setSaveAsNew(e.target.checked)} id="saveAsNewRegion" />
            <label htmlFor="saveAsNewRegion" style={{ fontWeight: 400 }}>Simpan sebagai wilayah baru</label>
          </div>
          <div className="row">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowManual(false)}>Batal</button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveManual}>Gunakan Wilayah</button>
          </div>
        </div>
      )}
    </div>
  );
}
