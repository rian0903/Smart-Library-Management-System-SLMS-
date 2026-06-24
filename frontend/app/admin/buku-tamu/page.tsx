'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Users, Eye, Clock, CheckCircle } from 'lucide-react';
import { mockGuestBooks } from '@/data/mockData';

export default function AdminBukuTamuPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('slms_guestbooks');
    if (saved) {
      setVisits(JSON.parse(saved));
    } else {
      setVisits(mockGuestBooks);
    }
  }, [successMsg]);

  const saveVisits = (data: any[]) => {
    setVisits(data);
    localStorage.setItem('slms_guestbooks', JSON.stringify(data));
  };

  const handleCheckout = (id: number) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const updated = visits.map(v => v.id === id ? { ...v, check_out: time } : v);
    saveVisits(updated);
    setSuccessMsg('Pengunjung berhasil check-out!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filtered = visits.filter(v => 
    v.visitor_name.toLowerCase().includes(search.toLowerCase()) ||
    v.purpose.toLowerCase().includes(search.toLowerCase())
  );

  const totalToday = visits.length;
  const activeNow = visits.filter(v => !v.check_out).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Rekap Buku Tamu</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pantau daftar kunjungan harian perpustakaan kabupaten secara real-time.</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Pengunjung Hari Ini</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{totalToday}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aktif di Perpustakaan</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>{activeNow}</p>
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="guest-logs-search"
            type="text"
            placeholder="Cari berdasarkan nama atau tujuan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
            style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Visitor Logs Table */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="table-base" style={{ width: '100%', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nama Pengunjung</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status Anggota</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Keperluan</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check In</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check Out</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada catatan kunjungan.</td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{v.visitor_name}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: v.member ? '#DCFCE7' : '#E2E8F0', color: v.member ? '#15803D' : '#64748B' }}>
                      {v.member ? `Anggota (${v.member.member_code})` : 'Umum / Tamu'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{v.purpose}</td>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {v.check_in}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {v.check_out ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {v.check_out}</div>
                    ) : (
                      <span style={{ color: '#D97706', fontWeight: 600 }}>Di Dalam</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    {!v.check_out ? (
                      <button
                        onClick={() => handleCheckout(v.id)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Check Out
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selesai</span>
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
