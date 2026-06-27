'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, ArrowLeftRight, RotateCcw, Clock, QrCode,
  BookOpen, ClipboardList, AlertTriangle, TrendingUp,
} from 'lucide-react';
import { mockBorrowings, mockGuestBooks, mockDashboardStats } from '@/data/mockData';

export default function PetugasDashboardPage() {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    const savedLoans = localStorage.getItem('slms_loans');
    setBorrowings(savedLoans ? JSON.parse(savedLoans) : mockBorrowings);
    const savedVisits = localStorage.getItem('slms_guestbooks');
    setVisits(savedVisits ? JSON.parse(savedVisits) : mockGuestBooks);
  }, []);

  const activeLoans = borrowings.filter(b => b.status !== 'returned');
  const overdueLoans = borrowings.filter(b => b.status === 'overdue');
  const todayVisitors = visits.length;
  const activeVisitors = visits.filter(v => !v.check_out).length;

  const stats = [
    { label: 'Pengunjung Hari Ini', value: todayVisitors, icon: Users, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Peminjaman Aktif', value: activeLoans.length, icon: ArrowLeftRight, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Terlambat', value: overdueLoans.length, icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2' },
    { label: 'Di Perpustakaan', value: activeVisitors, icon: Clock, color: '#22C55E', bg: '#F0FDF4' },
  ];

  const quickActions = [
    { label: 'Scan QR Masuk', href: '/petugas/buku-tamu', icon: QrCode, color: '#22C55E', bg: '#F0FDF4', desc: 'Check-in pengunjung' },
    { label: 'Input Peminjaman', href: '/petugas/peminjaman', icon: BookOpen, color: '#3B82F6', bg: '#EFF6FF', desc: 'Catat peminjaman baru' },
    { label: 'Proses Pengembalian', href: '/petugas/pengembalian', icon: RotateCcw, color: '#F59E0B', bg: '#FFFBEB', desc: 'Kembalikan buku' },
    { label: 'Buku Tamu', href: '/petugas/buku-tamu', icon: ClipboardList, color: '#8B5CF6', bg: '#F5F3FF', desc: 'Lihat catatan tamu' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Dashboard Petugas
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Selamat datang! Pantau aktivitas harian perpustakaan.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card card-hover animate-fade-in" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Aksi Cepat</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 16px',
                borderRadius: '12px', border: '1.5px solid var(--border)', background: 'white',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${action.color}20`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <action.icon size={22} color={action.color} />
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{action.label}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Borrowings */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Peminjaman Terbaru</h3>
          <Link href="/petugas/peminjaman" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Lihat Semua →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {activeLoans.slice(0, 5).map((b, i) => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0',
              borderBottom: i < Math.min(activeLoans.length, 5) - 1 ? '1px solid #F1F5F9' : 'none',
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: b.status === 'overdue' ? '#FEE2E2' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={16} color={b.status === 'overdue' ? '#EF4444' : '#3B82F6'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.book.title}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.member.name} &middot; {b.member.member_code}</p>
              </div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', flexShrink: 0,
                background: b.status === 'overdue' ? '#FDE8E8' : '#EFF6FF',
                color: b.status === 'overdue' ? '#E11D48' : '#2563EB',
              }}>
                {b.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}
              </span>
            </div>
          ))}
          {activeLoans.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px', fontSize: '0.85rem' }}>Belum ada peminjaman aktif.</p>
          )}
        </div>
      </div>
    </div>
  );
}
