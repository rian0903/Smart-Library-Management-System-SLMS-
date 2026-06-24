'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  BookOpen, Users, ArrowLeftRight, DollarSign, UserCheck,
  Eye, Plus, TrendingUp, TrendingDown, Clock, Activity,
} from 'lucide-react';
import Link from 'next/link';
import { mockDashboardStats, mockDashboardCharts, mockActivityLogs, mockBorrowings } from '@/data/mockData';
import { formatNumber, formatDateTime, getRoleLabel } from '@/lib/utils';

type Period = 'weekly' | 'monthly' | 'yearly';

const statCards = [
  { label: 'Total Koleksi Buku', value: mockDashboardStats.total_books, icon: BookOpen, color: '#3B82F6', bg: '#EFF6FF', trend: '+42 bulan ini', up: true },
  { label: 'Total Anggota', value: mockDashboardStats.total_members, icon: Users, color: '#22C55E', bg: '#F0FDF4', trend: '+12 bulan ini', up: true },
  { label: 'Buku Dipinjam', value: mockDashboardStats.books_borrowed, icon: ArrowLeftRight, color: '#F59E0B', bg: '#FFFBEB', trend: '+8 hari ini', up: true },
  { label: 'Denda Aktif', value: mockDashboardStats.active_fines, icon: DollarSign, color: '#EF4444', bg: '#FEF2F2', trend: '8 terlambat', up: false },
  { label: 'Petugas Aktif', value: mockDashboardStats.active_staff, icon: UserCheck, color: '#8B5CF6', bg: '#F5F3FF', trend: 'Semua aktif', up: true },
  { label: 'Pengunjung Hari Ini', value: mockDashboardStats.today_visitors, icon: Eye, color: '#06B6D4', bg: '#ECFEFF', trend: '+23% vs kemarin', up: true },
];

const COLORS = ['#EC4899', '#22C55E', '#F43F5E', '#10B981', '#3B82F6', '#94A3B8'];

const yearlyData = [
  { label: 'Jan', value: 890 }, { label: 'Feb', value: 1024 }, { label: 'Mar', value: 1243 },
  { label: 'Apr', value: 978 }, { label: 'Mei', value: 1356 }, { label: 'Jun', value: 1134 },
  { label: 'Jul', value: 1456 }, { label: 'Agu', value: 1234 }, { label: 'Sep', value: 1067 },
  { label: 'Okt', value: 1345 }, { label: 'Nov', value: 1567 }, { label: 'Des', value: 1234 },
];

const quickActions = [
  { label: 'Tambah Buku', href: '/admin/buku/tambah', icon: Plus, color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'Tambah Anggota', href: '/admin/anggota/tambah', icon: Users, color: '#22C55E', bg: '#F0FDF4' },
  { label: 'Input Peminjaman', href: '/admin/peminjaman/tambah', icon: ArrowLeftRight, color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'Buku Tamu', href: '/admin/buku-tamu', icon: Eye, color: '#8B5CF6', bg: '#F5F3FF' },
];

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>('monthly');

  const chartData = period === 'weekly'
    ? mockDashboardCharts.borrowing_trend
    : period === 'yearly'
    ? yearlyData
    : mockDashboardCharts.borrowing_trend;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Dashboard Admin
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Selamat datang! Berikut ringkasan aktivitas Perpustakaan Kabupaten Bireuen.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', fontSize: '0.8rem', fontWeight: 600 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite' }} />
            Sistem Online
          </span>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className="card card-hover animate-fade-in"
            style={{ padding: '20px', animationDelay: `${i * 0.08}s`, opacity: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '8px', background: stat.up ? '#DCFCE7' : '#FEE2E2' }}>
                {stat.up ? <TrendingUp size={12} color="#15803D" /> : <TrendingDown size={12} color="#B91C1C" />}
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: stat.up ? '#15803D' : '#B91C1C' }}>{stat.trend}</span>
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1, marginBottom: '4px' }}>
              {formatNumber(stat.value)}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Borrowing trend chart */}
        <div className="card animate-fade-in delay-200" style={{ padding: '24px', opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Statistik Peminjaman</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total transaksi per periode</p>
            </div>
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '10px', padding: '3px', gap: '2px' }}>
              {(['weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '0.72rem', fontWeight: 600,
                    background: period === p ? 'white' : 'transparent',
                    color: period === p ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: period === p ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBorrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '0.8rem' }}
                formatter={(value: any) => [value, 'Peminjaman']}
              />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2.5} fill="url(#colorBorrow)" dot={{ fill: '#3B82F6', r: 4, strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Visitor bar chart */}
        <div className="card animate-fade-in delay-300" style={{ padding: '24px', opacity: 0 }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Pengunjung Mingguan</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jumlah kunjungan per hari</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockDashboardCharts.visitor_trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '0.8rem' }}
                formatter={(v: any) => [v, 'Pengunjung']}
                cursor={{ fill: 'rgba(59,130,246,0.06)' }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                {mockDashboardCharts.visitor_trend.map((_, i) => (
                  <Cell key={i} fill={i === mockDashboardCharts.visitor_trend.length - 1 ? '#6366F1' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Popular books pie chart */}
        <div className="card animate-fade-in delay-200" style={{ padding: '24px', opacity: 0 }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Buku Terpopuler</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top 5 buku paling banyak dipinjam</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ResponsiveContainer width="45%" height={180}>
              <PieChart>
                <Pie data={mockDashboardCharts.popular_books} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count">
                  {mockDashboardCharts.popular_books.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {mockDashboardCharts.popular_books.map((item, i) => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[i], flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.count}x dipinjam</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category distribution donut */}
        <div className="card animate-fade-in delay-300" style={{ padding: '24px', opacity: 0 }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Distribusi Kategori</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Komposisi koleksi per kategori</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ResponsiveContainer width="45%" height={180}>
              <PieChart>
                <Pie data={mockDashboardCharts.category_distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count">
                  {mockDashboardCharts.category_distribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {mockDashboardCharts.category_distribution.map((item) => (
                <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.category}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.count} buku</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Quick Actions + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Quick Actions */}
        <div className="card animate-fade-in delay-200" style={{ padding: '24px', opacity: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Aksi Cepat</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', padding: '20px 12px', borderRadius: '12px',
                  border: '1.5px solid', borderColor: 'var(--border)',
                  background: 'white', textDecoration: 'none', transition: 'all 0.25s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.background = action.bg;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${action.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <action.icon size={22} color={action.color} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card animate-fade-in delay-300" style={{ padding: '24px', opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Aktivitas Terbaru</h3>
            <Link href="/admin/sistem/audit" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Lihat Semua →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {mockActivityLogs.map((log, i) => {
              const actionColors: Record<string, string> = { create: '#22C55E', approve: '#3B82F6', login: '#8B5CF6', update: '#F59E0B', delete: '#EF4444' };
              const actionIcons: Record<string, string> = { create: '➕', approve: '✅', login: '🔑', update: '✏️', delete: '🗑️' };
              const color = actionColors[log.action] || '#94A3B8';
              const icon = actionIcons[log.action] || '📝';

              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                    padding: '14px 0',
                    borderBottom: i < mockActivityLogs.length - 1 ? '1px solid #F8FAFC' : 'none',
                  }}
                >
                  {/* Timeline dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      {icon}
                    </div>
                    {i < mockActivityLogs.length - 1 && <div style={{ width: '1px', height: '100%', background: '#F1F5F9', marginTop: '6px', minHeight: '20px' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.4 }}>
                      {log.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.user.name}</span>
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        {formatDateTime(log.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pending alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Reservasi Menunggu Persetujuan', value: mockDashboardStats.pending_reservations, color: '#F59E0B', bg: '#FFFBEB', href: '/admin/peminjaman?status=pending', icon: '⏳' },
          { label: 'Peminjaman Terlambat', value: mockDashboardStats.overdue_borrowings, color: '#EF4444', bg: '#FEF2F2', href: '/admin/peminjaman?status=overdue', icon: '⚠️' },
          { label: 'Buku Baru Bulan Ini', value: mockDashboardStats.new_books_this_month, color: '#3B82F6', bg: '#EFF6FF', href: '/admin/buku?sort=newest', icon: '📚' },
        ].map((alert) => (
          <Link
            key={alert.label}
            href={alert.href}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
              borderRadius: '12px', border: '1.5px solid', borderColor: alert.color + '40',
              background: alert.bg, textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${alert.color}20`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: '1.5rem' }}>{alert.icon}</div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, color: alert.color, lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatNumber(alert.value)}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{alert.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
