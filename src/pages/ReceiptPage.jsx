import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import ReceiptDocument from '../components/ReceiptDocument.jsx';
import { buildReceiptText } from '../utils/receiptText.js';
import { saveReceiptAsJpeg } from '../services/receiptImage.js';

export default function ReceiptPage({ navigate, txId }) {
  const { transactions, receiptTemplate } = useApp();
  const tx = useMemo(() => transactions.find((t) => t.id === txId), [txId, transactions]);
  const receiptRef = useRef(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  async function handleCopy() {
    if (!tx) return;
    const text = buildReceiptText(tx, receiptTemplate);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Struk berhasil disalin');
    } catch (e) {
      showToast('Gagal menyalin struk');
    }
  }

  async function handleSaveJpeg() {
    if (!tx) return;
    setSaving(true);
    try {
      await saveReceiptAsJpeg(receiptRef.current, `Struk_${tx.nomor}.jpg`);
      showToast('Struk JPEG berhasil disimpan');
    } catch (e) {
      showToast('Gagal menyimpan JPEG');
    } finally {
      setSaving(false);
    }
  }

  if (!tx) {
    return (
      <>
        <div className="topbar">
          <h1>STRUK</h1>
        </div>
        <div className="screen">
          <div className="empty-state">Transaksi tidak ditemukan.</div>
          <button className="btn btn-secondary" onClick={() => navigate('dashboard')}>Kembali ke Dashboard</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="between">
          <h1>STRUK {tx.nomor}</h1>
          <button className="icon-btn" style={{ color: '#fff' }} onClick={() => navigate('dashboard')}>Tutup</button>
        </div>
      </div>
      <div className="screen">
        <ReceiptDocument ref={receiptRef} tx={tx} template={receiptTemplate} />

        <button className="btn btn-primary btn-block-margin" onClick={handleCopy}>COPY STRUK</button>
        <button className="btn btn-secondary btn-block-margin" onClick={handleSaveJpeg} disabled={saving}>
          {saving ? 'Menyimpan...' : 'SIMPAN JPEG HD'}
        </button>
        <button className="btn btn-outline btn-block-margin" onClick={() => navigate('new-order', { editId: tx.id })}>
          Edit Pesanan Ini
        </button>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
