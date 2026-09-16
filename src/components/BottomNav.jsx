import React from 'react';

const ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'history', label: 'Riwayat', icon: '🧾' },
  { key: 'receipt-list', label: 'Struk', icon: '🖨️' },
  { key: 'reports', label: 'Laporan', icon: '📊' },
  { key: 'settings', label: 'Pengaturan', icon: '⚙️' }
];

export default function BottomNav({ current, navigate }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((it) => (
        <button
          key={it.key}
          className={`nav-item ${current === it.key ? 'active' : ''}`}
          onClick={() => navigate(it.key)}
        >
          <span className="nav-icon">{it.icon}</span>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
