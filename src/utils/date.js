function pad(n) {
  return String(n).padStart(2, '0');
}

// Ambil tanggal/jam lokal perangkat, format DD/MM/YYYY dan HH:mm
export function nowParts() {
  const d = new Date();
  return {
    isoDate: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, // untuk sorting/filter
    dateStr: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
    timeStr: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    createdAt: d.getTime()
  };
}

export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isoFromDdMmYyyy(dateStr) {
  // dateStr: DD/MM/YYYY -> YYYY-MM-DD
  const [dd, mm, yyyy] = dateStr.split('/');
  return `${yyyy}-${mm}-${dd}`;
}

export function monthLabel(isoMonth) {
  // isoMonth: YYYY-MM
  const [y, m] = isoMonth.split('-').map(Number);
  const names = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${names[m - 1]} ${y}`;
}

export function currentMonthIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function currentIsoDate() {
  return todayIso();
}

export function yesterdayIso() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function dateLabelLong(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const names = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${d} ${names[m - 1]} ${y}`;
}
