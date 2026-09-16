import html2canvas from 'html2canvas';

export async function saveReceiptAsJpeg(node, filename) {
  if (!node) throw new Error('Elemen struk tidak ditemukan');
  const canvas = await html2canvas(node, {
    scale: 3,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false
  });
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return dataUrl;
}
