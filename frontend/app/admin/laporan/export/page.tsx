'use client';

import { useState } from 'react';
import { Download, FileText, CheckCircle2, RefreshCw, BarChart2 } from 'lucide-react';

export default function AdminExportPage() {
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const triggerDownload = (reportName: string, format: string) => {
    const key = `${reportName}-${format}`;
    setLoadingType(key);
    setSuccessMsg('');

    setTimeout(() => {
      // Simulate file download by creating a fake CSV trigger or just notification
      const csvContent = "data:text/csv;charset=utf-8,ID,Nama,Data\n1,Demo Row,Sample Data";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `laporan_${reportName.toLowerCase()}_demo.${format.toLowerCase()}`);
      document.body.appendChild(link); // Required for FF
      
      // Don't actually trigger download for PDF to avoid confusion, but CSV is great
      if (format === 'CSV') {
        link.click();
      }

      setLoadingType(null);
      setSuccessMsg(`Laporan ${reportName} dalam format ${format} berhasil diunduh!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  const reportsList = [
    { name: 'Koleksi Buku', desc: 'Daftar lengkap judul buku, ISBN, penulis, penerbit, kategori, dan detail stok rak.', color: '#3B82F6', icon: '📚' },
    { name: 'Data Keanggotaan', desc: 'Rekap database anggota perpustakaan terdaftar, masa aktif keanggotaan, dan detail kontak.', color: '#22C55E', icon: '👥' },
    { name: 'Transaksi Peminjaman', desc: 'Histori log peminjaman, tanggal transaksi, detail denda, petugas penanggung jawab.', color: '#F59E0B', icon: '🔄' },
    { name: 'Laporan Keuangan Denda', desc: 'Catatan denda masuk, daftar denda yang belum dibayar, rekap kas denda lunas.', color: '#EF4444', icon: '💰' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Ekspor Data Perpustakaan</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unduh rekapitulasi data lengkap perpustakaan Kabupaten Bireuen dalam format PDF, Excel, atau CSV.</p>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {reportsList.map((report) => (
          <div key={report.name} className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontSize: '2rem' }}>{report.icon}</div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#F1F5F9', color: 'var(--text-secondary)' }}>
                  Ready to Export
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>{report.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: 1.5, marginBottom: '24px' }}>{report.desc}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['PDF', 'EXCEL', 'CSV'].map((format) => {
                const key = `${report.name}-${format}`;
                const isLoading = loadingType === key;

                return (
                  <button
                    key={format}
                    onClick={() => triggerDownload(report.name, format)}
                    disabled={loadingType !== null}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px', borderRadius: '8px', border: '1.5px solid var(--border)',
                      background: 'white', fontSize: '0.75rem', fontWeight: 700,
                      color: 'var(--text-secondary)', cursor: loadingType !== null ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { if (!isLoading && loadingType === null) { e.currentTarget.style.borderColor = report.color; e.currentTarget.style.color = report.color; } }}
                    onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                  >
                    {isLoading ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Download size={12} />
                    )}
                    {format}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
