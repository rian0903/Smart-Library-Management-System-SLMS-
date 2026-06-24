'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, User, BookOpen, Clock, AlertTriangle, ArrowLeftRight, CheckCircle2, DollarSign } from 'lucide-react';
import { mockBorrowings } from '@/data/mockData';

export default function AdminPengembalianPage() {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  
  // Return processing state
  const [returnedDate, setReturnedDate] = useState('');
  const [daysOverdue, setDaysOverdue] = useState(0);
  const [calculatedFine, setCalculatedFine] = useState(0);
  const [finePaid, setFinePaid] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('slms_loans');
    if (saved) {
      setBorrowings(JSON.parse(saved));
    } else {
      setBorrowings(mockBorrowings);
    }
    setReturnedDate(new Date().toISOString().split('T')[0]);
  }, [successMsg]);

  // Update fine calculation when returnedDate or selectedLoan changes
  useEffect(() => {
    if (!selectedLoan) return;

    const due = new Date(selectedLoan.due_date);
    const ret = new Date(returnedDate);
    const timeDiff = ret.getTime() - due.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays > 0) {
      setDaysOverdue(diffDays);
      setCalculatedFine(diffDays * 1000); // Rp 1.000 per day fine
    } else {
      setDaysOverdue(0);
      setCalculatedFine(0);
    }
  }, [returnedDate, selectedLoan]);

  const saveLoans = (data: any[]) => {
    setBorrowings(data);
    localStorage.setItem('slms_loans', JSON.stringify(data));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode) return;

    // Search active loan for member code or member name
    const found = borrowings.find(b => 
      (b.member.member_code.toLowerCase() === searchCode.toLowerCase() ||
       b.member.name.toLowerCase().includes(searchCode.toLowerCase())) &&
      b.status !== 'returned'
    );

    if (found) {
      setSelectedLoan(found);
      setSuccessMsg('');
    } else {
      alert('Tidak ditemukan peminjaman aktif untuk anggota tersebut.');
      setSelectedLoan(null);
    }
  };

  const handleReturnProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    const updatedLoans = borrowings.map(b => {
      if (b.id === selectedLoan.id) {
        return {
          ...b,
          returned_at: returnedDate,
          status: 'returned',
          fine_amount: calculatedFine,
          fine_paid: calculatedFine > 0 ? finePaid : true,
          days_overdue: daysOverdue
        };
      }
      return b;
    });

    saveLoans(updatedLoans);

    // Save fine to fines list if there is a fine
    if (calculatedFine > 0) {
      const savedFines = localStorage.getItem('slms_fines');
      const finesList = savedFines ? JSON.parse(savedFines) : [];
      const newFine = {
        id: Date.now(),
        member: selectedLoan.member,
        book: selectedLoan.book,
        amount: calculatedFine,
        paid: finePaid,
        due_date: selectedLoan.due_date,
        returned_at: returnedDate,
        days_overdue: daysOverdue
      };
      finesList.unshift(newFine);
      localStorage.setItem('slms_fines', JSON.stringify(finesList));
    }

    setSuccessMsg(`Buku "${selectedLoan.book.title}" oleh ${selectedLoan.member.name} berhasil dikembalikan!`);
    setSelectedLoan(null);
    setSearchCode('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Proses Pengembalian Buku</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Input pengembalian buku, kalkulasi keterlambatan, dan hitung pembayaran denda secara instan.</p>
      </div>

      {successMsg && (
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
        
        {/* Left Column: Search Loan */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>Cari Peminjaman Aktif</h3>
          
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="search-code-input" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Kode Anggota / Nama Anggota</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="search-code-input"
                  type="text"
                  placeholder="Contoh: BRN-00001"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="input-base"
                  style={{ paddingLeft: '44px' }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '12px' }}>
              Cari Peminjaman
            </button>
          </form>

          {/* Quick List of Active Borrowings */}
          <div style={{ marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Peminjaman yang Sedang Berjalan</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
              {borrowings.filter(b => b.status !== 'returned').slice(0, 5).map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedLoan(b); setSuccessMsg(''); setSearchCode(b.member.member_code); }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px',
                    background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer',
                    fontSize: '0.75rem', textAlign: 'left', transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.member.name}</span>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '2px' }}>{b.book.title}</p>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: b.status === 'overdue' ? '#E11D48' : '#2563EB' }}>
                    {b.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Return Form */}
        {selectedLoan ? (
          <div className="card animate-fade-in" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>Detail Pengembalian</h3>

            <form onSubmit={handleReturnProcess} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Member & Book info summary */}
              <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <User size={16} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peminjam / Anggota</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedLoan.member.name} ({selectedLoan.member.member_code})</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <BookOpen size={16} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Buku yang Dipinjam</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedLoan.book.title}</p>
                  </div>
                </div>
              </div>

              {/* Loan Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Tanggal Pinjam</label>
                  <input type="text" value={selectedLoan.borrowed_at} disabled style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', fontSize: '0.8rem', color: 'var(--text-secondary)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Jatuh Tempo</label>
                  <input type="text" value={selectedLoan.due_date} disabled style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', fontSize: '0.8rem', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* Returned Date Input */}
              <div>
                <label htmlFor="return-date-input" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Tanggal Dikembalikan</label>
                <input
                  id="return-date-input"
                  type="date"
                  value={returnedDate}
                  onChange={(e) => setReturnedDate(e.target.value)}
                  className="input-base"
                  required
                />
              </div>

              {/* Overdue and Fine Section */}
              {daysOverdue > 0 && (
                <div style={{ background: '#FFF5F5', border: '1.5px solid #FCA5A5', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#B91C1C' }}>
                    <AlertTriangle size={18} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Terlambat {daysOverdue} Hari!</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#7F1D1D' }}>Total Denda (Rp 1.000 / hari)</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B91C1C' }}>Rp {calculatedFine.toLocaleString('id-ID')}</p>
                    </div>
                    {/* Payment state */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                      <input
                        id="checkbox-fine-paid"
                        type="checkbox"
                        checked={finePaid}
                        onChange={(e) => setFinePaid(e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <label htmlFor="checkbox-fine-paid" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7F1D1D', cursor: 'pointer' }}>Denda Lunas</label>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '12px', marginTop: '10px' }}>
                Proses Pengembalian
              </button>
            </form>
          </div>
        ) : (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Clock size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.85rem' }}>Silakan cari anggota di sebelah kiri untuk memproses pengembalian buku.</p>
          </div>
        )}
      </div>

    </div>
  );
}
