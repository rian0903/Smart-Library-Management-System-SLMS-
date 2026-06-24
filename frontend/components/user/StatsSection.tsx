'use client';

import { BookOpen, Users, CheckCircle, Sparkles } from 'lucide-react';
import { mockDashboardStats } from '@/data/mockData';
import { formatNumber } from '@/lib/utils';

const stats = [
  {
    icon: BookOpen,
    label: 'Total Koleksi',
    value: mockDashboardStats.total_books,
    color: '#3B82F6',
    bg: '#EFF6FF',
    suffix: ' Judul',
  },
  {
    icon: CheckCircle,
    label: 'Buku Tersedia',
    value: mockDashboardStats.books_available,
    color: '#22C55E',
    bg: '#F0FDF4',
    suffix: ' Judul',
  },
  {
    icon: Users,
    label: 'Buku Dipinjam',
    value: mockDashboardStats.books_borrowed,
    color: '#F59E0B',
    bg: '#FFFBEB',
    suffix: ' Buah',
  },
  {
    icon: Sparkles,
    label: 'Buku Baru',
    value: mockDashboardStats.new_books_this_month,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    suffix: ' Bulan Ini',
  },
];

export default function StatsSection() {
  return (
    <section
      style={{
        padding: '0 0 60px',
        background: 'var(--bg)',
        marginTop: '-48px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="page-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="card card-hover animate-fade-in"
              style={{
                padding: '24px',
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: stat.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon size={24} color={stat.color} />
                </div>
                <span
                  style={{
                    fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px',
                    borderRadius: '100px', background: stat.bg, color: stat.color,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}
                >
                  Live
                </span>
              </div>
              <p
                style={{
                  fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {formatNumber(stat.value)}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {stat.label}
                <span style={{ color: stat.color, fontWeight: 600 }}>{stat.suffix}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
