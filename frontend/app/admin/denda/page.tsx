'use client';

import { useState, useEffect } from 'react';
import { Search, DollarSign, CheckCircle2, AlertTriangle, Calendar, Users, Filter } from 'lucide-react';
import { mockMembers, mockBooks } from '@/data/mockData';

export default function AdminDendaPage() {
  const [fines, setFines] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('slms_fines');
    if (saved) {
      setFines(JSON.parse(saved));
    } else {
      // Mock some default fines
      const initialFines = [
        { id: 1, member: mockMembers[0], book: mockBooks[0], amount: 14000, paid: false, due_date: '2026-06-10', returned_at: '-', days_overdue: 14 },
        { id: 2, member: mockMembers[1], book: mockBooks[2], amount: 5000, paid: true, due_date: '2026-06-05', returned_at: '2026-06-10', days_overdue: 5 },
        { id: 3, member: mockMembers[3], book: mockBooks[1], amount: 8000, paid: false, due_date: '2026-06-12', returned_at: '-', days_overdue: 8 }
      ];
      setFines(initialFines);
      localStorage.setItem('slms_fines', JSON.stringify(initialFines));
    }
  }, [successMsg]);

  const saveFines = (data: any[]) => {
    setFines(data);
    localStorage.setItem('slms_fines', JSON.stringify(data));
  };

  const handlePayFine = (id: number) => {
    const updated = fines.map(f => f.id === id ? { ...f, paid: true, returned_at: new Date().toISOString().split('T')[0] } : f);
    saveFines(updated);
    
    // Update loan state if matched
    const savedLoans = localStorage.getItem('slms_loans');
    if (savedLoans) {
      const parsedLoans = JSON.parse(savedLoans);
      const matchedFine = fines.find(f => f.id === id);
      if (matchedFine) {
        const updatedLoans = parsedLoans.map((l: any) => 
          l.member.member_code === matchedFine.member.member_code && 
          l.book.title === matchedFine.book.title 
            ? { ...l, fine_paid: true } 
            : l
        );
        localStorage.setItem('slms_loans', JSON.stringify(updatedLoans));
      }
    }

    setSuccessMsg('Pembayaran denda berhasil dicatat!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = fines.filter(f => {
    const matchesSearch = f.member.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.member.member_code.toLowerCase().includes(search.toLowerCase()) ||
                          f.book.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'paid' && f.paid) || 
                          (filterStatus === 'unpaid' && !f.paid);
    return matchesSearch && matchesStatus;
  });

  const totalUnpaid = fines.filter(f => !f.paid).reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fines.filter(f => f.paid).reduce((sum, f) => sum + f.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Manajemen Denda</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Catat pembayaran denda keterlambatan buku dan pantau rekap keuangan perpustakaan.</p>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Belum Dibayar</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#B91C1C', marginTop: '4px' }}>Rp {totalUnpaid.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Denda Diterima</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>Rp {totalPaid.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="fines-search"
            type="text"
            placeholder="Cari berdasarkan nama anggota atau judul buku..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
            style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', background: '#F1F5F9', borderRadius: '10px', padding: '4px' }}>
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'unpaid', label: 'Belum Lunas' },
            { id: 'paid', label: 'Lunas' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id as any)}
              style={{
                padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600,
                background: filterStatus === item.id ? 'white' : 'transparent',
                color: filterStatus === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: filterStatus === item.id ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fines Log Table */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="table-base" style={{ width: '100%', minWidth: '750px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Anggota</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Buku</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Keterlambatan</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Jumlah Denda</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada data denda ditemukan.</td>
              </tr>
            ) : (
              filtered.map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{f.member.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.member.member_code}</p>
                  </td>
                  <td style={{ padding: '14px 20px', maxWidth: '220px' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.book.title}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Jatuh tempo: {f.due_date}</p>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: '#E11D48', fontWeight: 600 }}>{f.days_overdue} hari</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Rp {f.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: f.paid ? '#DCFCE7' : '#FEE2E2', color: f.paid ? '#15803D' : '#B91C1C' }}>
                      {f.paid ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    {!f.paid ? (
                      <button
                        onClick={() => handlePayFine(f.id)}
                        className="btn btn-primary"
                        style={{
                          padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
                          display: 'inline-flex', gap: '4px'
                        }}
                      >
                        Bayar Lunas
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tgl Bayar: {f.returned_at}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
