'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, BookOpen, Clock, AlertTriangle, ArrowLeftRight, CheckCircle, History as HistoryIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { mockBorrowings } from '@/data/mockData';

export default function RiwayatPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [borrowings, setBorrowings] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Filter mock borrowings for this user
    const userBorrowings = mockBorrowings.filter(b => b.member.email === user.email);
    setBorrowings(userBorrowings);
  }, [isAuthenticated, user, router]);

  if (!user) {
    return null;
  }

  const activeLoans = borrowings.filter(b => b.status === 'active' || b.status === 'overdue');
  const pastLoans = borrowings.filter(b => b.status === 'returned');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="page-container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Riwayat Peminjaman
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Pantau peminjaman aktif Anda dan lihat riwayat pengembalian buku sebelumnya.
          </p>
        </div>

        {/* Section: Peminjaman Aktif */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={18} color="var(--primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Peminjaman Aktif ({activeLoans.length})</h2>
          </div>

          {activeLoans.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Anda tidak sedang meminjam buku saat ini.</p>
              <Link href="/katalog" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Cari Buku</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeLoans.map((loan) => (
                <div key={loan.id} className="card" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '60px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                    <img src={loan.book.cover} alt={loan.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {loan.book.title}
                      </h3>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', 
                        background: loan.status === 'overdue' ? '#FDE8E8' : '#EFF6FF', 
                        color: loan.status === 'overdue' ? '#E11D48' : '#2563EB',
                        flexShrink: 0
                      }}>
                        {loan.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{loan.book.author.name}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> Pinjam: {loan.borrowed_at}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> Jatuh Tempo: <strong style={{ color: loan.status === 'overdue' ? '#E11D48' : 'var(--text-primary)' }}>{loan.due_date}</strong>
                      </span>
                      {loan.status === 'overdue' && (
                        <span style={{ fontSize: '0.75rem', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <AlertTriangle size={12} /> Denda: Rp {loan.fine_amount || '5.000'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Riwayat Pengembalian */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <HistoryIcon size={18} color="var(--primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Riwayat Pengembalian ({pastLoans.length})</h2>
          </div>

          {pastLoans.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada catatan pengembalian buku.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pastLoans.map((loan) => (
                <div key={loan.id} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', opacity: 0.9 }}>
                  <div style={{ width: '48px', height: '64px', borderRadius: '6px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                    <img src={loan.book.cover} alt={loan.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {loan.book.title}
                      </h3>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', 
                        background: '#DCFCE7', 
                        color: '#15803D',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle size={10} /> Dikembalikan
                      </span>
                    </div>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{loan.book.author.name}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>Pinjam: {loan.borrowed_at}</span>
                      <span>Kembali: {loan.returned_at}</span>
                      {loan.fine_amount > 0 && (
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>Denda Lunas: Rp {loan.fine_amount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
