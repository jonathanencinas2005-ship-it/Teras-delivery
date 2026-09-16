import React, { useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { formatRupiah } from '../utils/currency.js';
import { dateLabelLong } from '../utils/date.js';
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function History({ navigate }) {
  const { transactions, deleteTransaction } = useApp();
  const [confirmId, setConfirmId] = useState(null);

  const grouped = useMemo(() => {
    const map = new Map();
    transactions
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .forEach((tx) => {
        const key = tx.tanggalIso;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(tx);
      });
    return Array.from(map.entries());
  }, [transactions]);

  function handleDelete(id) {
    deleteTransaction(id);
    setConfirmId(null);
  }

  return (
    <>
      <div className="topbar">
        <h1>RIWAYAT PESANAN</h1>
      </div>
      <div className="screen">
        {grouped.length === 0 && <div className="empty-state">Belum ada riwayat pesanan.</div>}
        {grouped.map(([iso, txs]) => (
          <div key={iso}>
            <div className="section-title">{dateLabelLong(iso).toUpperCase()}</div>
            {txs.map((tx) => (
              <div className="list-item" key={tx.id}>
                <div className="top">
                  <span className="num">{tx.nomor}</span>
                  <span className="total">{formatRupiah(tx.total)}</span>
                </div>
                <div className="muted">{tx.jam} · {tx.pelanggan?.nama} · {(tx.stores || []).map((s) => s.nama).join(', ')}</div>
                <div className="row" style={{ marginTop: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('receipt', { txId: tx.id })}>Lihat Detail</button>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('new-order', { editId: tx.id })}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirmId(tx.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {confirmId && (
        <ConfirmModal
          title="Hapus Transaksi?"
          message="Transaksi ini akan dihapus permanen dan laporan akan otomatis dihitung ulang."
          onCancel={() => setConfirmId(null)}
          onConfirm={() => handleDelete(confirmId)}
        />
      )}
    </>
  );
}
