import React, { useState } from 'react';
import { useApp } from '../AppContext.jsx';

export default function Onboarding({ onDone }) {
  const { setDriverName } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Nama driver wajib diisi.');
      return;
    }
    setDriverName(trimmed);
    onDone();
  }

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-card">
        <div className="brand">TERAS DELIVERY</div>
        <div className="tagline">Catat pesanan, hitung otomatis, buat struk.</div>
        <div className="field" style={{ textAlign: 'left' }}>
          <label>Nama Driver</label>
          <input
            className="input"
            placeholder="Masukkan nama driver"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <div className="muted" style={{ color: '#dc2626', marginTop: 6 }}>{error}</div>}
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>SIMPAN &amp; MULAI</button>
      </div>
    </div>
  );
}
