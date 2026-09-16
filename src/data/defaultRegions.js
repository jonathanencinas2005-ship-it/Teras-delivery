import { uid } from '../utils/id.js';

const RAW = [
  ['Lelea sekitarnya', 7000],
  ['Lelea - Waru Kedung', 8000],
  ['Lelea - Larangan', 8000],
  ['Lelea - Pengauban', 8000],
  ['Lelea - Telagasari/Langgengsari', 9000],
  ['Lelea - Tlakop Telagasari', 12000],
  ['Lelea - Lanjan', 9000],
  ['Lelea - Jemeti', 9000],
  ['Lelea - RS Sentra/Hasna', 7000],
  ['Lelea - Langut', 9000],
  ['Lelea - Langut Parek Pertamina', 8000],
  ['Lelea - Tegal Bedug', 11000],
  ['Lelea - Cempeh (Parek Masjid)', 8000],
  ['Lelea - Kasmaran', 8000],
  ['Lelea - Kiajaran Kulon/Wetan', 10000],
  ['Lelea - Kiajaran (Pelabuhan)', 13000],
  ['Lelea - Pangkalan', 14000],
  ['Lelea - Celeng', 9000],
  ['Lelea - Tugu', 16000],
  ['Lelea - Tunggul Payung', 17000],
  ['Lelea - Jatisura', 17000],
  ['Lelea - Jambak', 22000],
  ['Lelea - Nunuk', 12000],
  ['Lelea - Tempel Wetan', 9000],
  ['Lelea - Tempel Kulon', 10000],
  ['Lelea - Larisma Jaya', 25000],
  ['Lelea - Bangkir', 30000],
  ['Lelea - Jatibarang', 35000]
];

export function buildDefaultRegions() {
  return RAW.map(([nama, harga]) => ({
    id: uid('region'),
    nama,
    harga,
    isDefault: true
  }));
}
