'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Info } from 'lucide-react';
import { mockDashboardCharts, mockBooks, mockBorrowings, mockCategories, mockGuestBooks } from '@/data/mockData';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AdminStatistikPage() {
  const [borrowTrend, setBorrowTrend] = useState(mockDashboardCharts.borrowing_trend);
  const [visitorData, setVisitorData] = useState(mockDashboardCharts.visitor_trend);
  const [categoryDist, setCategoryDist] = useState(mockDashboardCharts.category_distribution);
  const [summaryText, setSummaryText] = useState('');

  useEffect(() => {
    // Aggregate borrowing trend from real loans
    const savedLoans = localStorage.getItem('slms_loans');
    const loans = savedLoans ? JSON.parse(savedLoans) : mockBorrowings;
    const monthMap: Record<string, number> = {};
    loans.forEach((l: any) => {
      if (l.borrowed_at) {
        const d = new Date(l.borrowed_at);
        const key = d.toLocaleString('id-ID', { month: 'short' });
        monthMap[key] = (monthMap[key] || 0) + 1;
      }
    });
    if (Object.keys(monthMap).length > 0) {
      setBorrowTrend(Object.entries(monthMap).map(([label, value]) => ({ label, value })));
    }

    // Aggregate visitor data from guestbooks
    const savedGuests = localStorage.getItem('slms_guestbooks');
    const guests = savedGuests ? JSON.parse(savedGuests) : mockGuestBooks;
    const dayMap: Record<string, { member: number; nonMember: number }> = {};
    guests.forEach((g: any) => {
      if (g.visit_date) {
        const d = new Date(g.visit_date);
        const day = d.toLocaleString('id-ID', { weekday: 'short' });
        if (!dayMap[day]) dayMap[day] = { member: 0, nonMember: 0 };
        if (g.member) dayMap[day].member++; else dayMap[day].nonMember++;
      }
    });
    if (Object.keys(dayMap).length > 0) {
      setVisitorData(Object.entries(dayMap).map(([label, v]) => ({ label, value: v.member + v.nonMember, ...v })));
    }

    // Aggregate category distribution from books
    const savedBooks = localStorage.getItem('slms_books');
    const books = savedBooks ? JSON.parse(savedBooks) : mockBooks;
    const catMap: Record<string, number> = {};
    books.forEach((b: any) => {
      const cat = b.category?.name || b.category || 'Lainnya';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    setCategoryDist(catEntries.map(([category, count], i) => ({ category, count, color: COLORS[i % COLORS.length] })));

    // Build summary
    const topCat = catEntries.length > 0 ? catEntries[0][0] : 'N/A';
    const totalLoans = loans.length;
    setSummaryText(`Berdasarkan data saat ini, kategori ${topCat} merupakan yang paling aktif. Total ${totalLoans} peminjaman tercatat dan ${guests.length} kunjungan terdaftar di sistem.`);
  }, []);

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
            <BarChart data={visitorData}>
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
                <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count">
                  {categoryDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categoryDist.map((item, i) => (
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
              {summaryText || 'Memuat data statistik...'}
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
