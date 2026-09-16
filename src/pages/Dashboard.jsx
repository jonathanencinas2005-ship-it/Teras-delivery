import React, { useMemo } from 'react';
import { useApp } from '../AppContext.jsx';
import { formatRupiah } from '../utils/currency.js';
import { todayIso } from '../utils/date.js';

export default function Dashboard({ navigate }) {
  const { driverName, transactions } = useApp();

  const todayTx = useMemo(() => {
    const t = todayIso();
    return transactions.filter((tx) => tx.tanggalIso === t);
  }, [transactions]);

  const totalToday = todayTx.reduce((sum, tx) => sum + (tx.total || 0), 0);
  const recent = transactions.slice(0, 5);

  return (
    <>
      <div className="topbar">
        <h1>TERAS DELIVERY</h1>
        <div className="subtitle">Driver: {driverName}</div>
      </div>
      <div className="screen">
        <div className="card">
          <div className="row">
            <div className="big-stat">
              <div className="num">{todayTx.length}</div>
              <div className="label">Pesanan Hari Ini</div>
            </div>
            <div className="big-stat">
              <div className="num">{formatRupiah(totalToday)}</div>
              <div className="label">Total Hari Ini</div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ padding: '18px', fontSize: 17, marginBottom: 16 }} onClick={() => navigate('new-order')}>
          + PESANAN BARU
        </button>

        <div className="section-title">Pesanan Terbaru</div>
        {recent.length === 0 && (
          <div className="empty-state">Belum ada pesanan. Tekan "+ Pesanan Baru" untuk mulai mencatat.</div>
        )}
        {recent.map((tx) => (
          <div className="list-item" key={tx.id} onClick={() => navigate('receipt', { txId: tx.id })}>
            <div className="top">
              <span className="num">{tx.nomor}</span>
              <span className="total">{formatRupiah(tx.total)}</span>
            </div>
            <div className="muted">{tx.pelanggan?.nama || '-'} · {tx.tanggal} {tx.jam}</div>
          </div>
        ))}
      </div>
    </>
  );
}
