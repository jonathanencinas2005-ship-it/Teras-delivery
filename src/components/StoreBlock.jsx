import React from 'react';
import { formatRupiah, parseRupiahInput } from '../utils/currency.js';
import { itemSubtotal, storeSubtotal } from '../utils/calc.js';

export default function StoreBlock({ store, index, onChange, onRemove, canRemove }) {
  function updateStoreName(nama) {
    onChange({ ...store, nama });
  }

  function updateItem(itemId, patch) {
    const items = store.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it));
    onChange({ ...store, items });
  }

  function addItem() {
    const newItem = { id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, nama: '', harga: 0, jumlah: 1 };
    onChange({ ...store, items: [...store.items, newItem] });
  }

  function removeItem(itemId) {
    onChange({ ...store, items: store.items.filter((it) => it.id !== itemId) });
  }

  return (
    <div className="store-block">
      <div className="between" style={{ marginBottom: 10 }}>
        <span className="badge">TOKO {index + 1}</span>
        {canRemove && (
          <button className="icon-btn link-danger" onClick={onRemove}>Hapus Toko</button>
        )}
      </div>
      <div className="field">
        <label>Nama Toko</label>
        <input
          className="input"
          placeholder='Contoh: "Jus Nenes"'
          value={store.nama}
          onChange={(e) => updateStoreName(e.target.value)}
        />
      </div>

      {store.items.map((item, idx) => (
        <div className="item-row" key={item.id}>
          <div className="between">
            <label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Item {idx + 1}</label>
            {store.items.length > 1 && (
              <button className="icon-btn link-danger" onClick={() => removeItem(item.id)}>Hapus</button>
            )}
          </div>
          <div className="field">
            <input
              className="input"
              placeholder="Nama item (contoh: Jus Alpukat)"
              value={item.nama}
              onChange={(e) => updateItem(item.id, { nama: e.target.value })}
            />
          </div>
          <div className="row">
            <div className="field">
              <label>Harga</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="Rp0"
                value={item.harga ? formatRupiah(item.harga) : ''}
                onChange={(e) => updateItem(item.id, { harga: parseRupiahInput(e.target.value) })}
              />
            </div>
            <div className="field">
              <label>Jumlah</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="1"
                value={item.jumlah || ''}
                onChange={(e) => updateItem(item.id, { jumlah: parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0 })}
              />
            </div>
          </div>
          <div className="muted">Subtotal: {formatRupiah(itemSubtotal(item))}</div>
        </div>
      ))}

      <button className="btn btn-secondary btn-sm btn-block-margin" onClick={addItem}>+ TAMBAH ITEM</button>

      <div className="between" style={{ marginTop: 10, fontWeight: 700 }}>
        <span>Subtotal Toko</span>
        <span>{formatRupiah(storeSubtotal(store))}</span>
      </div>
    </div>
  );
}
