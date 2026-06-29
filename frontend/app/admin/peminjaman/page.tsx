'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, User, BookOpen, Clock, Check, X, AlertTriangle, ArrowLeftRight, ClipboardList, Plus } from 'lucide-react';
import { mockBorrowings, mockReservations, mockBooks, mockMembers } from '@/data/mockData';
import { getSettings, logAudit } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function AdminPeminjamanPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'loans' | 'reservations'>('loans');
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [showNewLoan, setShowNewLoan] = useState(false);
  const [nlMemberCode, setNlMemberCode] = useState('');
  const [nlBookCode, setNlBookCode] = useState('');
  const [nlBorrowDate, setNlBorrowDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load borrowings
    const savedLoans = localStorage.getItem('slms_loans');
    if (savedLoans) {
      setBorrowings(JSON.parse(savedLoans));
    } else {
      setBorrowings(mockBorrowings);
    }

    // Load reservations
    const savedReservations = localStorage.getItem('slms_reservations');
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    } else {
      setReservations(mockReservations);
    }
  }, [alert]);

  const saveLoans = (data: any[]) => {
    setBorrowings(data);
    localStorage.setItem('slms_loans', JSON.stringify(data));
  };

  const saveReservations = (data: any[]) => {
    setReservations(data);
    localStorage.setItem('slms_reservations', JSON.stringify(data));
  };

  const filteredLoans = borrowings.filter(b => 
    b.member.name.toLowerCase().includes(search.toLowerCase()) ||
    b.book.title.toLowerCase().includes(search.toLowerCase()) ||
    b.member.member_code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReservations = reservations.filter(r => 
    r.member.name.toLowerCase().includes(search.toLowerCase()) ||
    r.book.title.toLowerCase().includes(search.toLowerCase()) ||
    r.member.member_code.toLowerCase().includes(search.toLowerCase())
  );

  // Approve online reservation (converts reservation status to 'approved' or can instantly check-out)
  const handleApproveReservation = (id: number) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    // Update reservation status to approved
    const updatedReservations = reservations.map(r => r.id === id ? { ...r, status: 'approved' } : r);
    saveReservations(updatedReservations);

    // Create a new borrowing loan
    const borrowDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 days loan

    const newLoan = {
      id: Date.now(),
      member: reservation.member,
      book: reservation.book,
      borrowed_at: borrowDate,
      due_date: dueDate,
      status: 'active',
      fine_amount: 0,
      fine_paid: false
    };

    const updatedLoans = [newLoan, ...borrowings];
    saveLoans(updatedLoans);

    setAlert({ type: 'success', message: `Reservasi disetujui! Buku "${reservation.book.title}" untuk anggota ${reservation.member.name} kini resmi dipinjam.` });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleRejectReservation = (id: number) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    const updated = reservations.map(r => r.id === id ? { ...r, status: 'rejected' } : r);
    saveReservations(updated);

    setAlert({ type: 'success', message: `Reservasi untuk buku "${reservation.book.title}" ditolak.` });
    setTimeout(() => setAlert(null), 5000);
  };

  // Extend loan due date by 7 days
  const handleExtendLoan = (id: number) => {
    const loan = borrowings.find(b => b.id === id);
    if (!loan) return;

    const currentDue = new Date(loan.due_date);
    currentDue.setDate(currentDue.getDate() + 7);
    const newDueDate = currentDue.toISOString().split('T')[0];

    const updated = borrowings.map(b => b.id === id ? {
      ...b,
      due_date: newDueDate,
      status: b.status === 'overdue' ? 'active' : b.status // if overdue, could be reset if now extended
    } : b);

    saveLoans(updated);
    setAlert({ type: 'success', message: `Masa pinjam buku "${loan.book.title}" berhasil diperpanjang 7 hari hingga ${newDueDate}.` });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = getSettings();
    const member = mockMembers.find(m => m.member_code.toLowerCase() === nlMemberCode.toLowerCase());
    const allBooks = localStorage.getItem('slms_books');
    const booksList = allBooks ? JSON.parse(allBooks) : mockBooks;
    const book = booksList.find((b: any) => b.code.toLowerCase() === nlBookCode.toLowerCase());
    if (!member) { setAlert({ type: 'danger', message: 'Kode anggota tidak ditemukan.' }); setTimeout(() => setAlert(null), 4000); return; }
    if (!book) { setAlert({ type: 'danger', message: 'Kode buku tidak ditemukan.' }); setTimeout(() => setAlert(null), 4000); return; }
    if (book.available_stock <= 0) { setAlert({ type: 'danger', message: 'Stok buku habis.' }); setTimeout(() => setAlert(null), 4000); return; }
    const loanDays = settings.maxLoanDays || 14;
    const dueDate = new Date(new Date(nlBorrowDate).getTime() + loanDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newLoan = {
      id: Date.now(),
      member: { id: member.id, name: member.name, member_code: member.member_code, email: member.email },
      book: { id: book.id, title: book.title, author: book.author, cover: book.cover, code: book.code },
      borrowed_at: nlBorrowDate, due_date: dueDate, status: 'active', fine_amount: 0, fine_paid: false,
    };
    const updatedBooks = booksList.map((b: any) => b.id === book.id ? { ...b, available_stock: b.available_stock - 1 } : b);
    localStorage.setItem('slms_books', JSON.stringify(updatedBooks));
    const updatedLoans = [newLoan, ...borrowings];
    saveLoans(updatedLoans);
    logAudit({ user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined, action: 'create', model: 'Borrowing', model_id: newLoan.id, description: `Input peminjaman: ${book.title} oleh ${member.name}` });
    setAlert({ type: 'success', message: `Peminjaman berhasil dibuat! Buku "${book.title}" dipinjam oleh ${member.name}, jatuh tempo ${dueDate}.` });
    setTimeout(() => setAlert(null), 6000);
    setShowNewLoan(false);
    setNlMemberCode(''); setNlBookCode('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Transaksi Peminjaman</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Setujui pengajuan reservasi online anggota atau kelola peminjaman buku aktif.</p>
        </div>
        <button onClick={() => setShowNewLoan(!showNewLoan)} className="btn btn-primary" style={{ display: 'flex', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}>
          <Plus size={18} /> {showNewLoan ? 'Tutup Form' : 'Input Peminjaman Baru'}
        </button>
      </div>

      {alert && (
        <div style={{ padding: '14px 20px', borderRadius: '10px', background: alert.type === 'success' ? '#DEF7EC' : '#FDE8E8', color: alert.type === 'success' ? '#03543F' : '#9B1C1C', border: `1.5px solid ${alert.type === 'success' ? '#BCF0DA' : '#F8B4B4'}`, fontWeight: 500, fontSize: '0.85rem' }}>
          {alert.message}
        </div>
      )}

      {/* New Loan Form */}
      {showNewLoan && (
        <div className="card animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>Input Peminjaman Baru</h3>
          <form onSubmit={handleCreateLoan} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Kode Anggota</label>
              <input type="text" value={nlMemberCode} onChange={(e) => setNlMemberCode(e.target.value)} placeholder="ANG-00001" className="input-base" required />
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Kode Buku</label>
              <input type="text" value={nlBookCode} onChange={(e) => setNlBookCode(e.target.value)} placeholder="BKN-001" className="input-base" required />
            </div>
            <div style={{ minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Tanggal Pinjam</label>
              <input type="date" value={nlBorrowDate} onChange={(e) => setNlBorrowDate(e.target.value)} className="input-base" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', whiteSpace: 'nowrap' }}>Buat Peminjaman</button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', gap: '24px' }}>
        <button
          onClick={() => { setActiveTab('loans'); setSearch(''); }}
          style={{
            padding: '12px 8px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: activeTab === 'loans' ? 750 : 500,
            color: activeTab === 'loans' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'loans' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <ArrowLeftRight size={16} /> Peminjaman Aktif
        </button>
        <button
          onClick={() => { setActiveTab('reservations'); setSearch(''); }}
          style={{
            padding: '12px 8px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: activeTab === 'reservations' ? 750 : 500,
            color: activeTab === 'reservations' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'reservations' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <ClipboardList size={16} /> Reservasi Online
          {reservations.filter(r => r.status === 'pending').length > 0 && (
            <span style={{ background: 'var(--danger)', color: 'white', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
              {reservations.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* Search Filter */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="transaction-search"
            type="text"
            placeholder={activeTab === 'loans' ? "Cari peminjaman (nama anggota, buku)..." : "Cari reservasi..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
            style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Table Content - Desktop */}
      <div className="card hidden md:block" style={{ overflowX: 'auto', padding: 0 }}>
        {activeTab === 'loans' ? (
          <table className="table-base" style={{ width: '100%', minWidth: '750px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Anggota</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Buku</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tgl Pinjam</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Jatuh Tempo</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada data peminjaman ditemukan.</td>
                </tr>
              ) : (
                filteredLoans.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{b.member.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.member.member_code}</p>
                    </td>
                    <td style={{ padding: '14px 20px', maxWidth: '240px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.book.title}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.book.author.name}</p>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.borrowed_at}</td>
                    <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.due_date}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: b.status === 'overdue' ? '#FDE8E8' : '#EFF6FF', color: b.status === 'overdue' ? '#E11D48' : '#2563EB' }}>
                        {b.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleExtendLoan(b.id)}
                          style={{
                            padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--border)',
                            background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                            color: 'var(--text-secondary)', transition: 'all 0.15s'
                          }}
                        >
                          Perpanjang
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="table-base" style={{ width: '100%', minWidth: '750px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Anggota</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Buku</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tgl Pengambilan</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Catatan</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada data reservasi ditemukan.</td>
                </tr>
              ) : (
                filteredReservations.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.member.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.member.member_code}</p>
                    </td>
                    <td style={{ padding: '14px 20px', maxWidth: '240px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.book.title}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.book.author.name}</p>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.reservation_date}</td>
                    <td style={{ padding: '14px 20px', fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.notes || '-'}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', 
                        background: r.status === 'approved' ? '#DCFCE7' : r.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', 
                        color: r.status === 'approved' ? '#15803D' : r.status === 'rejected' ? '#B91C1C' : '#D97706' 
                      }}>
                        {r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      {r.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            id={`btn-approve-${r.id}`}
                            onClick={() => handleApproveReservation(r.id)}
                            style={{
                              width: '32px', height: '32px', border: 'none', background: '#DCFCE7',
                              color: '#15803D', borderRadius: '8px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Setujui Reservasi"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            id={`btn-reject-${r.id}`}
                            onClick={() => handleRejectReservation(r.id)}
                            style={{
                              width: '32px', height: '32px', border: 'none', background: '#FEE2E2',
                              color: '#B91C1C', borderRadius: '8px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Tolak Reservasi"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Diproses</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeTab === 'loans' ? (
          filteredLoans.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada data peminjaman ditemukan.</div>
          ) : (
            filteredLoans.map((b) => (
              <div key={b.id} className="card" style={{ padding: '16px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{b.member.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.member.member_code}</p>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{b.book.title}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.book.author.name}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <span>Pinjam: {b.borrowed_at}</span>
                  <span>Tempo: {b.due_date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: b.status === 'overdue' ? '#FDE8E8' : '#EFF6FF', color: b.status === 'overdue' ? '#E11D48' : '#2563EB' }}>
                    {b.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}
                  </span>
                  <button onClick={() => handleExtendLoan(b.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Perpanjang
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          filteredReservations.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada data reservasi ditemukan.</div>
          ) : (
            filteredReservations.map((r) => (
              <div key={r.id} className="card" style={{ padding: '16px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.member.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.member.member_code}</p>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{r.book.title}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.book.author.name}</p>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>Pengambilan: {r.reservation_date}</span>
                  {r.notes && <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Catatan: {r.notes}</p>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: r.status === 'approved' ? '#DCFCE7' : r.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', color: r.status === 'approved' ? '#15803D' : r.status === 'rejected' ? '#B91C1C' : '#D97706' }}>
                    {r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                  </span>
                  {r.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleApproveReservation(r.id)} style={{ width: '32px', height: '32px', border: 'none', background: '#DCFCE7', color: '#15803D', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={16} /></button>
                      <button onClick={() => handleRejectReservation(r.id)} style={{ width: '32px', height: '32px', border: 'none', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>

    </div>
  );
}
