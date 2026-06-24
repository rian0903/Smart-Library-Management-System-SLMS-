'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, User, BookOpen, Clock, Check, X, AlertTriangle, ArrowLeftRight, ClipboardList } from 'lucide-react';
import { mockBorrowings, mockReservations } from '@/data/mockData';

export default function AdminPeminjamanPage() {
  const [activeTab, setActiveTab] = useState<'loans' | 'reservations'>('loans');
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Transaksi Peminjaman</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Setujui pengajuan reservasi online anggota atau kelola peminjaman buku aktif.</p>
      </div>

      {alert && (
        <div style={{ padding: '14px 20px', borderRadius: '10px', background: alert.type === 'success' ? '#DEF7EC' : '#FDE8E8', color: alert.type === 'success' ? '#03543F' : '#9B1C1C', border: `1.5px solid ${alert.type === 'success' ? '#BCF0DA' : '#F8B4B4'}`, fontWeight: 500, fontSize: '0.85rem' }}>
          {alert.message}
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
        <div style={{ position: 'relative', maxWidth: '380px' }}>
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

      {/* Table Content */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
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

    </div>
  );
}
