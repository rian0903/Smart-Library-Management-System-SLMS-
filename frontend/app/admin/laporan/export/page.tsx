'use client';

import { useState } from 'react';
import { Download, CheckCircle2, RefreshCw } from 'lucide-react';
import { mockBooks, mockMembers, mockBorrowings, mockGuestBooks } from '@/data/mockData';
import { logAudit } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function AdminExportPage() {
  const { user } = useAuthStore();
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerDownload = (reportName: string, format: string) => {
    const key = `${reportName}-${format}`;
    setLoadingType(key);
    setSuccessMsg('');

    setTimeout(() => {
      if (reportName === 'Koleksi Buku') {
        const saved = localStorage.getItem('slms_books');
        const books = saved ? JSON.parse(saved) : mockBooks;
        downloadCSV(`laporan_buku_${Date.now()}.${format === 'CSV' ? 'csv' : 'csv'}`,
          ['ID', 'Kode', 'Judul', 'Penulis', 'ISBN', 'Kategori', 'Tahun', 'Stok', 'Stok Tersedia', 'Status'],
          books.map((b: any) => [b.id, b.code, b.title, b.author?.name || b.author, b.isbn, b.category?.name || b.category, b.year, b.stock, b.available_stock, b.status])
        );
      } else if (reportName === 'Data Keanggotaan') {
        const saved = localStorage.getItem('slms_members');
        const members = saved ? JSON.parse(saved) : mockMembers;
        downloadCSV(`laporan_anggota_${Date.now()}.csv`,
          ['ID', 'Kode Anggota', 'Nama', 'Email', 'Telepon', 'Alamat', 'Bergabung', 'Berakhir', 'Status', 'Total Pinjam'],
          members.map((m: any) => [m.id, m.member_code, m.name, m.email, m.phone, m.address, m.joined_at, m.expired_at, m.status, m.total_borrows])
        );
      } else if (reportName === 'Transaksi Peminjaman') {
        const saved = localStorage.getItem('slms_loans');
        const loans = saved ? JSON.parse(saved) : mockBorrowings;
        downloadCSV(`laporan_peminjaman_${Date.now()}.csv`,
          ['ID', 'Anggota', 'Kode Anggota', 'Buku', 'Tgl Pinjam', 'Jatuh Tempo', 'Tgl Kembali', 'Status', 'Denda'],
          loans.map((l: any) => [l.id, l.member?.name, l.member?.member_code, l.book?.title, l.borrowed_at, l.due_date, l.returned_at || '-', l.status, l.fine_amount || 0])
        );
      } else if (reportName === 'Laporan Keuangan Denda') {
        const saved = localStorage.getItem('slms_fines');
        const fines = saved ? JSON.parse(saved) : [];
        downloadCSV(`laporan_denda_${Date.now()}.csv`,
          ['ID', 'Anggota', 'Buku', 'Jumlah Denda', 'Lunas', 'Jatuh Tempo', 'Tgl Kembali', 'Hari Terlambat'],
          fines.map((f: any) => [f.id, f.member?.name, f.book?.title, f.amount, f.paid ? 'Ya' : 'Tidak', f.due_date, f.returned_at, f.days_overdue])
        );
      }

      logAudit({ user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined, action: 'export', model: 'Report', description: `Export laporan ${reportName} (${format})` });
      setLoadingType(null);
      setSuccessMsg(`Laporan ${reportName} dalam format ${format} berhasil diunduh!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1000);
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
