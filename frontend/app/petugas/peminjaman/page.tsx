'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Calendar, User, BookOpen, Clock, Check, X, AlertTriangle, ArrowLeftRight, ClipboardList, QrCode } from 'lucide-react';
import { mockBorrowings, mockReservations, mockBooks, mockMembers } from '@/data/mockData';
import { Html5Qrcode } from 'html5-qrcode';

export default function PetugasPeminjamanPage() {
  const [activeTab, setActiveTab] = useState<'loans' | 'reservations' | 'new'>('loans');
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // New borrowing form
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLoans = localStorage.getItem('slms_loans');
    setBorrowings(savedLoans ? JSON.parse(savedLoans) : mockBorrowings);
    const savedReservations = localStorage.getItem('slms_reservations');
    setReservations(savedReservations ? JSON.parse(savedReservations) : mockReservations);
  }, [alert]);

  const saveLoans = (data: any[]) => { setBorrowings(data); localStorage.setItem('slms_loans', JSON.stringify(data)); };
  const saveReservations = (data: any[]) => { setReservations(data); localStorage.setItem('slms_reservations', JSON.stringify(data)); };

  const filteredLoans = borrowings.filter(b =>
    b.member.name.toLowerCase().includes(search.toLowerCase()) ||
    b.book.title.toLowerCase().includes(search.toLowerCase()) ||
    b.member.member_code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReservations = reservations.filter(r =>
    r.member.name.toLowerCase().includes(search.toLowerCase()) ||
    r.book.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleApproveReservation = (id: number) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;
    const updatedReservations = reservations.map(r => r.id === id ? { ...r, status: 'approved' } : r);
    saveReservations(updatedReservations);
    const borrowDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newLoan = { id: Date.now(), member: reservation.member, book: reservation.book, borrowed_at: borrowDate, due_date: dueDate, status: 'active', fine_amount: 0, fine_paid: false };
    saveLoans([newLoan, ...borrowings]);
    setAlert({ type: 'success', message: `Reservasi disetujui! Buku "${reservation.book.title}" untuk ${reservation.member.name} resmi dipinjam.` });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleRejectReservation = (id: number) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;
    saveReservations(reservations.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setAlert({ type: 'success', message: `Reservasi untuk "${reservation.book.title}" ditolak.` });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleExtendLoan = (id: number) => {
    const loan = borrowings.find(b => b.id === id);
    if (!loan) return;
    const currentDue = new Date(loan.due_date);
    currentDue.setDate(currentDue.getDate() + 7);
    saveLoans(borrowings.map(b => b.id === id ? { ...b, due_date: currentDue.toISOString().split('T')[0] } : b));
    setAlert({ type: 'success', message: `Masa pinjam "${loan.book.title}" diperpanjang 7 hari.` });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateBorrowing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !selectedBook) return;
    const borrowDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newLoan = { id: Date.now(), member: selectedMember, book: selectedBook, borrowed_at: borrowDate, due_date: dueDate, status: 'active', fine_amount: 0, fine_paid: false };
    saveLoans([newLoan, ...borrowings]);
    setAlert({ type: 'success', message: `Peminjaman berhasil! "${selectedBook.title}" dipinjam oleh ${selectedMember.name}.` });
    setSelectedMember(null); setSelectedBook(null); setMemberSearch(''); setBookSearch('');
    setActiveTab('loans');
    setTimeout(() => setAlert(null), 5000);
  };

  const startScanner = async () => {
    setScannerOpen(true);
    setTimeout(async () => {
      if (!scannerDivRef.current) return;
      try {
        const scanner = new Html5Qrcode('petugas-qr-scanner');
        scannerRef.current = scanner;
        await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, (decoded) => {
          const parts = decoded.split('|');
          const code = parts[0];
          const member = mockMembers.find(m => m.member_code === code);
          if (member) { setSelectedMember(member); setMemberSearch(member.name); }
          stopScanner();
        }, () => {});
      } catch { /* camera not available */ }
    }, 300);
  };

  const stopScanner = () => {
    try { scannerRef.current?.stop(); } catch {}
    try { scannerRef.current?.clear(); } catch {}
    scannerRef.current = null;
    setScannerOpen(false);
  };

  const foundMembers = mockMembers.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.member_code.toLowerCase().includes(memberSearch.toLowerCase())
  ).slice(0, 5);

  const foundBooks = mockBooks.filter(b =>
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.code.toLowerCase().includes(bookSearch.toLowerCase())
  ).filter(b => b.available_stock > 0).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Transaksi Peminjaman</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kelola peminjaman buku dan setujui reservasi online.</p>
      </div>

      {alert && (
        <div style={{ padding: '14px 20px', borderRadius: '10px', background: alert.type === 'success' ? '#DEF7EC' : '#FDE8E8', color: alert.type === 'success' ? '#03543F' : '#9B1C1C', border: `1.5px solid ${alert.type === 'success' ? '#BCF0DA' : '#F8B4B4'}`, fontWeight: 500, fontSize: '0.85rem' }}>
          {alert.message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', gap: '24px', overflowX: 'auto' }}>
        {[
          { key: 'loans', label: 'Peminjaman Aktif', icon: ArrowLeftRight },
          { key: 'reservations', label: 'Reservasi', icon: ClipboardList, badge: reservations.filter(r => r.status === 'pending').length },
          { key: 'new', label: 'Peminjaman Baru', icon: BookOpen },
        ].map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key as any); setSearch(''); }}
            style={{
              padding: '12px 8px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: activeTab === tab.key ? 750 : 500,
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.key ? '3px solid var(--primary)' : '3px solid transparent',
              marginBottom: '-2px', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
            }}
          >
            <tab.icon size={16} /> {tab.label}
            {tab.badge ? <span style={{ background: 'var(--danger)', color: 'white', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {activeTab === 'new' ? (
        /* New Borrowing Form */
        <div className="card" style={{ padding: '28px', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>Input Peminjaman Baru</h3>
          <form onSubmit={handleCreateBorrowing} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Member search */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Anggota</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Cari nama / kode anggota..." value={memberSearch}
                    onChange={(e) => { setMemberSearch(e.target.value); setSelectedMember(null); }}
                    className="input-base" style={{ paddingLeft: '36px' }} />
                </div>
                <button type="button" onClick={startScanner} style={{ padding: '8px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <QrCode size={16} /> Scan
                </button>
              </div>
              {memberSearch && !selectedMember && foundMembers.length > 0 && (
                <div style={{ marginTop: '4px', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                  {foundMembers.map(m => (
                    <button key={m.id} type="button" onClick={() => { setSelectedMember(m); setMemberSearch(m.name); }}
                      style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{m.member_code}</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedMember && <p style={{ marginTop: '4px', fontSize: '0.75rem', color: '#22C55E', fontWeight: 600 }}>Terpilih: {selectedMember.name} ({selectedMember.member_code})</p>}
            </div>

            {/* Book search */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Buku</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Cari judul / kode buku..." value={bookSearch}
                  onChange={(e) => { setBookSearch(e.target.value); setSelectedBook(null); }}
                  className="input-base" style={{ paddingLeft: '36px' }} />
              </div>
              {bookSearch && !selectedBook && foundBooks.length > 0 && (
                <div style={{ marginTop: '4px', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                  {foundBooks.map(b => (
                    <button key={b.id} type="button" onClick={() => { setSelectedBook(b); setBookSearch(b.title); }}
                      style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span style={{ fontWeight: 600 }}>{b.title}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{b.code} (Stok: {b.available_stock})</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedBook && <p style={{ marginTop: '4px', fontSize: '0.75rem', color: '#22C55E', fontWeight: 600 }}>Terpilih: {selectedBook.title}</p>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', borderRadius: '12px' }} disabled={!selectedMember || !selectedBook}>
              Simpan Peminjaman
            </button>
          </form>

          {/* QR Scanner modal */}
          {scannerOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
              <div className="card" style={{ padding: '24px', maxWidth: '400px', width: '100%', margin: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: 700 }}>Scan QR Anggota</h4>
                  <button onClick={stopScanner} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                </div>
                <div id="petugas-qr-scanner" ref={scannerDivRef} style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder={activeTab === 'loans' ? 'Cari peminjaman...' : 'Cari reservasi...'} value={search} onChange={(e) => setSearch(e.target.value)} className="input-base" style={{ paddingLeft: '38px', fontSize: '0.85rem' }} />
            </div>
          </div>

          {/* Desktop table */}
          <div className="card hidden md:block" style={{ overflowX: 'auto', padding: 0 }}>
            {activeTab === 'loans' ? (
              <table className="table-base" style={{ width: '100%', minWidth: '750px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                    {['Anggota', 'Buku', 'Tgl Pinjam', 'Jatuh Tempo', 'Status', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: h === 'Aksi' || h === 'Status' ? 'center' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada data.</td></tr>
                  ) : filteredLoans.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 20px' }}><p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{b.member.name}</p><p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.member.member_code}</p></td>
                      <td style={{ padding: '14px 20px', maxWidth: '240px' }}><p style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.book.title}</p></td>
                      <td style={{ padding: '14px 20px', fontSize: '0.8rem' }}>{b.borrowed_at}</td>
                      <td style={{ padding: '14px 20px', fontSize: '0.8rem' }}>{b.due_date}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}><span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: b.status === 'overdue' ? '#FDE8E8' : '#EFF6FF', color: b.status === 'overdue' ? '#E11D48' : '#2563EB' }}>{b.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}</span></td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}><button onClick={() => handleExtendLoan(b.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Perpanjang</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="table-base" style={{ width: '100%', minWidth: '750px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                    {['Anggota', 'Buku', 'Tgl Pengambilan', 'Status', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: h === 'Aksi' || h === 'Status' ? 'center' : 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada data.</td></tr>
                  ) : filteredReservations.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 20px' }}><p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{r.member.name}</p><p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.member.member_code}</p></td>
                      <td style={{ padding: '14px 20px', maxWidth: '240px' }}><p style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.book.title}</p></td>
                      <td style={{ padding: '14px 20px', fontSize: '0.8rem' }}>{r.reservation_date}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}><span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: r.status === 'approved' ? '#DCFCE7' : r.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', color: r.status === 'approved' ? '#15803D' : r.status === 'rejected' ? '#B91C1C' : '#D97706' }}>{r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : 'Menunggu'}</span></td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        {r.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => handleApproveReservation(r.id)} style={{ width: '32px', height: '32px', border: 'none', background: '#DCFCE7', color: '#15803D', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} /></button>
                            <button onClick={() => handleRejectReservation(r.id)} style={{ width: '32px', height: '32px', border: 'none', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                          </div>
                        ) : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Diproses</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(activeTab === 'loans' ? filteredLoans : filteredReservations).length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada data.</div>
            ) : (activeTab === 'loans' ? filteredLoans : filteredReservations).map((item: any) => (
              <div key={item.id} className="card" style={{ padding: '16px' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.member.name}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{item.member.member_code}</p>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.book.title}</p>
                </div>
                {activeTab === 'loans' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: item.status === 'overdue' ? '#FDE8E8' : '#EFF6FF', color: item.status === 'overdue' ? '#E11D48' : '#2563EB' }}>{item.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}</span>
                    <button onClick={() => handleExtendLoan(item.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Perpanjang</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: item.status === 'approved' ? '#DCFCE7' : '#FEF3C7', color: item.status === 'approved' ? '#15803D' : '#D97706' }}>{item.status === 'approved' ? 'Disetujui' : 'Menunggu'}</span>
                    {item.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleApproveReservation(item.id)} style={{ width: '32px', height: '32px', border: 'none', background: '#DCFCE7', color: '#15803D', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} /></button>
                        <button onClick={() => handleRejectReservation(item.id)} style={{ width: '32px', height: '32px', border: 'none', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
