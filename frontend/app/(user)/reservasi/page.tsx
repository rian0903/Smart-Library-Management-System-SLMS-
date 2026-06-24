'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, BookOpen, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { mockReservations } from '@/data/mockData';

export default function ReservasiPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Load reservations from localStorage + mockData
    const localReservations = localStorage.getItem('slms_reservations');
    const customReservations = localReservations ? JSON.parse(localReservations) : [];
    
    // Filter mock reservations for this user email
    const userMockReservations = mockReservations.filter(r => r.member.email === user.email);
    setReservations([...customReservations, ...userMockReservations]);
  }, [isAuthenticated, user, router]);

  if (!user) {
    return null;
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="page-container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Reservasi Buku Saya
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Daftar buku yang Anda reservasi untuk dipinjam secara offline di perpustakaan.
            </p>
          </div>
          <Link href="/katalog" className="btn btn-primary">
            <BookOpen size={16} /> Reservasi Buku Baru
          </Link>
        </div>

        {reservations.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Belum Ada Reservasi
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto' }}>
              Anda belum melakukan reservasi buku apapun. Jelajahi katalog dan ajukan reservasi untuk buku favorit Anda!
            </p>
            <Link href="/katalog" className="btn btn-primary" style={{ display: 'inline-flex' }}>Jelajahi Katalog</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reservations.map((reserve) => (
              <div key={reserve.id} className="card" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
                <div style={{ width: '60px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                  {reserve.book.cover ? (
                    <img src={reserve.book.cover} alt={reserve.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' }}>
                      <BookOpen size={28} color="#6366F1" />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {reserve.book.title}
                    </h3>
                    <span style={{ 
                      fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', 
                      background: reserve.status === 'approved' ? '#DCFCE7' : reserve.status === 'rejected' ? '#FEE2E2' : reserve.status === 'completed' ? '#E2E8F0' : '#FEF3C7', 
                      color: reserve.status === 'approved' ? '#15803D' : reserve.status === 'rejected' ? '#B91C1C' : reserve.status === 'completed' ? '#64748B' : '#D97706',
                      flexShrink: 0
                    }}>
                      {reserve.status === 'approved' ? 'Disetujui' : reserve.status === 'rejected' ? 'Ditolak' : reserve.status === 'completed' ? 'Selesai' : 'Menunggu'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{reserve.book.author.name}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> Tgl Diajukan: {reserve.created_at}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Tgl Pengambilan: <strong>{reserve.reservation_date}</strong>
                    </span>
                  </div>
                  
                  {reserve.notes && (
                    <div style={{ marginTop: '10px', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <strong>Catatan Anda:</strong> {reserve.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
