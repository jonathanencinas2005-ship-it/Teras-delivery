import React from 'react';
import { useApp } from '../AppContext.jsx';
import { formatRupiah } from '../utils/currency.js';

export default function ReceiptList({ navigate }) {
  const { transactions } = useApp();
  const sorted = transactions.slice().sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <div className="topbar">
        <h1>STRUK</h1>
        <div className="subtitle">Pilih transaksi untuk melihat struk</div>
      </div>
      <div className="screen">
        {sorted.length === 0 && <div className="empty-state">Belum ada transaksi.</div>}
        {sorted.map((tx) => (
          <div className="list-item" key={tx.id} onClick={() => navigate('receipt', { txId: tx.id })}>
            <div className="top">
              <span className="num">{tx.nomor}</span>
              <span className="total">{formatRupiah(tx.total)}</span>
            </div>
            <div className="muted">{tx.tanggal} {tx.jam} · {tx.pelanggan?.nama}</div>
          </div>
        ))}
      </div>
    </>
  );
}
