import React, { useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { formatRupiah } from '../utils/currency.js';
import { todayIso, yesterdayIso, currentMonthIso, dateLabelLong, monthLabel } from '../utils/date.js';
import { filterByPeriod, aggregate } from '../utils/reportFilter.js';
import { generateReportPdf } from '../services/reportPdf.js';

export default function Reports({ navigate }) {
  const { transactions, driverName } = useApp();
  const [tab, setTab] = useState('today'); // today | yesterday | date | month | range
  const [pickDate, setPickDate] = useState(todayIso());
  const [pickMonth, setPickMonth] = useState(currentMonthIso());
  const [rangeStart, setRangeStart] = useState(todayIso());
  const [rangeEnd, setRangeEnd] = useState(todayIso());

  const period = useMemo(() => {
    if (tab === 'today') return { mode: 'date', date: todayIso() };
    if (tab === 'yesterday') return { mode: 'date', date: yesterdayIso() };
    if (tab === 'date') return { mode: 'date', date: pickDate };
    if (tab === 'month') return { mode: 'month', month: pickMonth };
    if (tab === 'range') return { mode: 'range', start: rangeStart, end: rangeEnd };
    return { mode: 'date', date: todayIso() };
  }, [tab, pickDate, pickMonth, rangeStart, rangeEnd]);

  const periodLabel = useMemo(() => {
    if (tab === 'today') return `Hari Ini (${dateLabelLong(todayIso())})`;
    if (tab === 'yesterday') return `Kemarin (${dateLabelLong(yesterdayIso())})`;
    if (tab === 'date') return dateLabelLong(pickDate);
    if (tab === 'month') return monthLabel(pickMonth);
    if (tab === 'range') return `${dateLabelLong(rangeStart)} – ${dateLabelLong(rangeEnd)}`;
    return '';
  }, [tab, pickDate, pickMonth, rangeStart, rangeEnd]);

  const filtered = useMemo(() => filterByPeriod(transactions, period), [transactions, period]);
  const summary = useMemo(() => aggregate(filtered), [filtered]);

  function filenameSuffix() {
    if (tab === 'today') return todayIso().split('-').reverse().join('-');
    if (tab === 'yesterday') return yesterdayIso().split('-').reverse().join('-');
    if (tab === 'date') return pickDate.split('-').reverse().join('-');
    if (tab === 'month') {
      const [y, m] = pickMonth.split('-');
      const names = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      return `${names[Number(m) - 1]}-${y}`;
    }
    if (tab === 'range') return `${rangeStart.split('-').reverse().join('-')}_sd_${rangeEnd.split('-').reverse().join('-')}`;
    return 'laporan';
  }

  function handleDownloadPdf() {
    generateReportPdf({
      driverName,
      periodLabel,
      filename: `Laporan_Teras_Delivery_${filenameSuffix()}.pdf`,
      summary,
      transactions: filtered
    });
  }

  return (
    <>
      <div className="topbar">
        <h1>LAPORAN</h1>
      </div>
      <div className="screen">
        <div className="tab-bar">
          <button className={`tab-btn ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>Hari Ini</button>
          <button className={`tab-btn ${tab === 'yesterday' ? 'active' : ''}`} onClick={() => setTab('yesterday')}>Kemarin</button>
          <button className={`tab-btn ${tab === 'date' ? 'active' : ''}`} onClick={() => setTab('date')}>Pilih Tanggal</button>
          <button className={`tab-btn ${tab === 'month' ? 'active' : ''}`} onClick={() => setTab('month')}>Bulanan</button>
          <button className={`tab-btn ${tab === 'range' ? 'active' : ''}`} onClick={() => setTab('range')}>Rentang</button>
        </div>

        {tab === 'date' && (
          <div className="card">
            <div className="field">
              <label>Pilih Tanggal</label>
              <input type="date" className="input" value={pickDate} onChange={(e) => setPickDate(e.target.value)} />
            </div>
          </div>
        )}
        {tab === 'month' && (
          <div className="card">
            <div className="field">
              <label>Pilih Bulan</label>
              <input type="month" className="input" value={pickMonth} onChange={(e) => setPickMonth(e.target.value)} />
            </div>
          </div>
        )}
        {tab === 'range' && (
          <div className="card">
            <div className="row">
              <div className="field">
                <label>Dari</label>
                <input type="date" className="input" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
              </div>
              <div className="field">
                <label>Sampai</label>
                <input type="date" className="input" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h2>LAPORAN {periodLabel.toUpperCase()}</h2>
          <div className="total-line"><span>Total Transaksi</span><span>{summary.count}</span></div>
          <div className="total-line"><span>Total Barang</span><span>{formatRupiah(summary.barang)}</span></div>
          <div className="total-line"><span>Total Ongkir</span><span>{formatRupiah(summary.ongkir)}</span></div>
          <div className="total-line"><span>Total Layanan</span><span>{formatRupiah(summary.layanan)}</span></div>
          <div className="total-line"><span>Total Beda Toko</span><span>{formatRupiah(summary.bedaToko)}</span></div>
          <div className="total-line"><span>Total Parkir</span><span>{formatRupiah(summary.parkir)}</span></div>
          <div className="total-line grand"><span>TOTAL</span><span>{formatRupiah(summary.total)}</span></div>
        </div>

        <button className="btn btn-primary btn-block-margin" onClick={handleDownloadPdf} disabled={filtered.length === 0}>
          DOWNLOAD PDF LAPORAN
        </button>

        <div className="section-title">Daftar Transaksi</div>
        {filtered.length === 0 && <div className="empty-state">Tidak ada transaksi pada periode ini.</div>}
        {filtered
          .slice()
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((tx) => (
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
