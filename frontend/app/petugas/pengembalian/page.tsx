'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Calendar, User, BookOpen, Clock, AlertTriangle, CheckCircle2, DollarSign, QrCode } from 'lucide-react';
import { mockBorrowings, mockMembers } from '@/data/mockData';
import { Html5Qrcode } from 'html5-qrcode';

export default function PetugasPengembalianPage() {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [returnedDate, setReturnedDate] = useState('');
  const [daysOverdue, setDaysOverdue] = useState(0);
  const [calculatedFine, setCalculatedFine] = useState(0);
  const [finePaid, setFinePaid] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('slms_loans');
    setBorrowings(saved ? JSON.parse(saved) : mockBorrowings);
    setReturnedDate(new Date().toISOString().split('T')[0]);
  }, [successMsg]);

  useEffect(() => {
    if (!selectedLoan) return;
    const due = new Date(selectedLoan.due_date);
    const ret = new Date(returnedDate);
    const diffDays = Math.ceil((ret.getTime() - due.getTime()) / (1000 * 3600 * 24));
    if (diffDays > 0) { setDaysOverdue(diffDays); setCalculatedFine(diffDays * 1000); }
    else { setDaysOverdue(0); setCalculatedFine(0); }
  }, [returnedDate, selectedLoan]);

  const saveLoans = (data: any[]) => { setBorrowings(data); localStorage.setItem('slms_loans', JSON.stringify(data)); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode) return;
    const found = borrowings.find(b =>
      (b.member.member_code.toLowerCase() === searchCode.toLowerCase() ||
       b.member.name.toLowerCase().includes(searchCode.toLowerCase())) &&
      b.status !== 'returned'
    );
    if (found) { setSelectedLoan(found); setSuccessMsg(''); }
    else { alert('Tidak ditemukan peminjaman aktif untuk anggota tersebut.'); setSelectedLoan(null); }
  };

  const handleReturnProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;
    const updatedLoans = borrowings.map(b => b.id === selectedLoan.id ? { ...b, returned_at: returnedDate, status: 'returned', fine_amount: calculatedFine, fine_paid: calculatedFine > 0 ? finePaid : true, days_overdue: daysOverdue } : b);
    saveLoans(updatedLoans);
    if (calculatedFine > 0) {
      const savedFines = localStorage.getItem('slms_fines');
      const finesList = savedFines ? JSON.parse(savedFines) : [];
      finesList.unshift({ id: Date.now(), member: selectedLoan.member, book: selectedLoan.book, amount: calculatedFine, paid: finePaid, due_date: selectedLoan.due_date, returned_at: returnedDate, days_overdue: daysOverdue });
      localStorage.setItem('slms_fines', JSON.stringify(finesList));
    }
    setSuccessMsg(`Buku "${selectedLoan.book.title}" oleh ${selectedLoan.member.name} berhasil dikembalikan!`);
    setSelectedLoan(null); setSearchCode('');
  };

  const startScanner = async () => {
    setScannerOpen(true);
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode('return-qr-scanner');
        scannerRef.current = scanner;
        await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, (decoded) => {
          const parts = decoded.split('|');
          const code = parts[0];
          setSearchCode(code);
          stopScanner();
        }, () => {});
      } catch {}
    }, 300);
  };

  const stopScanner = () => {
    try { scannerRef.current?.stop(); } catch {}
    try { scannerRef.current?.clear(); } catch {}
    scannerRef.current = null;
    setScannerOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Proses Pengembalian Buku</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Input pengembalian buku, kalkulasi denda, dan proses pembayaran.</p>
      </div>

      {successMsg && (
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /><span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'start' }}>
        {/* Search */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>Cari Peminjaman Aktif</h3>
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Kode Anggota / Nama</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Contoh: ANG-00001" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} className="input-base" style={{ paddingLeft: '44px' }} required />
                </div>
                <button type="button" onClick={startScanner} style={{ padding: '8px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <QrCode size={18} />
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>Cari Peminjaman</button>
          </form>

          <div style={{ marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Peminjaman Aktif</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
              {borrowings.filter(b => b.status !== 'returned').slice(0, 5).map(b => (
                <button key={b.id} onClick={() => { setSelectedLoan(b); setSuccessMsg(''); setSearchCode(b.member.member_code); }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'left' }}
                >
                  <div><span style={{ fontWeight: 700 }}>{b.member.name}</span><p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{b.book.title}</p></div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: b.status === 'overdue' ? '#E11D48' : '#2563EB' }}>{b.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Return form */}
        {selectedLoan ? (
          <div className="card animate-fade-in" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>Detail Pengembalian</h3>
            <form onSubmit={handleReturnProcess} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <User size={16} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peminjam</p><p style={{ fontSize: '0.875rem', fontWeight: 700 }}>{selectedLoan.member.name} ({selectedLoan.member.member_code})</p></div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <BookOpen size={16} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Buku</p><p style={{ fontSize: '0.875rem', fontWeight: 700 }}>{selectedLoan.book.title}</p></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Tanggal Pinjam</label><input type="text" value={selectedLoan.borrowed_at} disabled style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', fontSize: '0.8rem' }} /></div>
                <div><label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Jatuh Tempo</label><input type="text" value={selectedLoan.due_date} disabled style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', fontSize: '0.8rem' }} /></div>
              </div>
              <div><label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Tanggal Dikembalikan</label><input type="date" value={returnedDate} onChange={(e) => setReturnedDate(e.target.value)} className="input-base" required /></div>
              {daysOverdue > 0 && (
                <div style={{ background: '#FFF5F5', border: '1.5px solid #FCA5A5', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#B91C1C' }}><AlertTriangle size={18} /><span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Terlambat {daysOverdue} Hari!</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><p style={{ fontSize: '0.7rem', color: '#7F1D1D' }}>Total Denda</p><p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B91C1C' }}>Rp {calculatedFine.toLocaleString('id-ID')}</p></div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                      <input id="fine-paid-cb" type="checkbox" checked={finePaid} onChange={(e) => setFinePaid(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <label htmlFor="fine-paid-cb" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7F1D1D', cursor: 'pointer' }}>Lunas</label>
                    </div>
                  </div>
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>Proses Pengembalian</button>
            </form>
          </div>
        ) : (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Clock size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.85rem' }}>Cari anggota untuk memproses pengembalian.</p>
          </div>
        )}
      </div>

      {/* QR Scanner */}
      {scannerOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ padding: '24px', maxWidth: '400px', width: '100%', margin: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontWeight: 700 }}>Scan QR Anggota</h4>
              <button onClick={stopScanner} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>
            <div id="return-qr-scanner" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }} />
          </div>
        </div>
      )}
    </div>
  );
}
