export const DEFAULT_SETTINGS = {
  biayaLayanan: 2000,
  bedaTokoFee: 3000
};

export const RECEIPT_ELEMENT_KEYS = [
  'logo',
  'namaUsaha',
  'alamatUsaha',
  'hpUsaha',
  'nomorTransaksi',
  'tanggal',
  'jam',
  'driver',
  'pelanggan',
  'hpPelanggan',
  'alamatPelanggan',
  'namaToko',
  'item',
  'harga',
  'jumlah',
  'subtotal',
  'ongkir',
  'biayaLayanan',
  'bedaToko',
  'parkir',
  'total',
  'catatan',
  'footer'
];

export const DEFAULT_RECEIPT_TEMPLATE = {
  namaUsaha: 'Teras Delivery',
  alamatUsaha: '',
  hpUsaha: '',
  logoDataUrl: '',
  showLogo: false,
  header: 'TERAS DELIVERY',
  footer: 'Terima kasih telah menggunakan Teras Delivery',
  ukuran: '58mm', // '58mm' | '80mm'
  elements: RECEIPT_ELEMENT_KEYS.reduce((acc, k) => {
    acc[k] = true;
    return acc;
  }, {})
};
