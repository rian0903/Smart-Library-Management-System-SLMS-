'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { BarChart2, Calendar, FileText, Download, TrendingUp, Info } from 'lucide-react';
import { mockDashboardCharts } from '@/data/mockData';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const visitorDetails = [
  { label: 'Senin', value: 65, member: 45, nonMember: 20 },
  { label: 'Selasa', value: 82, member: 55, nonMember: 27 },
  { label: 'Rabu', value: 78, member: 50, nonMember: 28 },
  { label: 'Kamis', value: 91, member: 60, nonMember: 31 },
  { label: 'Jumat', value: 110, member: 85, nonMember: 25 },
  { label: 'Sabtu', value: 45, member: 30, nonMember: 15 },
];

export default function AdminStatistikPage() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Laporan & Statistik</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analisis data grafik kunjungan, peminjaman buku, dan kontribusi kategori teraktif.</p>
        </div>
      </div>

      {/* Grid of Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Chart 1: Peminjaman Tren */}
        <div className="card animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '18px' }}>Tren Peminjaman Buku</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockDashboardCharts.borrowing_trend}>
              <defs>
                <linearGradient id="colorBorrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" name="Total Peminjaman" stroke="#3B82F6" strokeWidth={2.5} fill="url(#colorBorrow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Pengunjung Mingguan */}
        <div className="card animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '18px' }}>Komposisi Pengunjung Mingguan</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={visitorDetails}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="member" name="Anggota" fill="#3B82F6" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="nonMember" name="Umum / Tamu" fill="#818CF8" stackId="a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Distribusi Kategori Buku */}
        <div className="card animate-fade-in" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '18px' }}>Proporsi Buku Per Kategori</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
            <ResponsiveContainer width="45%" height={200}>
              <PieChart>
                <Pie data={mockDashboardCharts.category_distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count">
                  {mockDashboardCharts.category_distribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mockDashboardCharts.category_distribution.map((item, i) => (
                <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.category}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.count} buku</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Ringkasan Analisis</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Berdasarkan data kunjungan dan peminjaman selama 30 hari terakhir, kategori <strong>Novel & Sastra</strong> merupakan yang paling aktif berkontribusi terhadap 38% peminjaman buku. 
              Hari dengan kunjungan terpadat berada di hari <strong>Jumat</strong>, dipicu oleh program peningkatan literasi mingguan perpustakaan.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', background: '#F0F9FF', border: '1px solid #B9E6FE', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
            <Info size={20} color="#0284C7" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', color: '#0369A1', lineHeight: 1.4 }}>
              Data statistik di atas diperbarui secara otomatis setiap pukul 00.00 WIB. Anda dapat mendownload rekapitulasi data lengkap pada menu Export Data.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
