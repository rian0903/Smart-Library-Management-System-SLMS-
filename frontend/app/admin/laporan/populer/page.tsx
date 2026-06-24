'use client';

import { useState, useEffect } from 'react';
import { Award, BookOpen, Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import { mockBooks } from '@/data/mockData';

export default function AdminBukuPopulerPage() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    // Sort books by borrow_count descending
    const sorted = [...mockBooks].sort((a, b) => (b.borrow_count ?? 0) - (a.borrow_count ?? 0));
    setBooks(sorted);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Laporan Buku Terpopuler</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Daftar buku dengan frekuensi peminjaman tertinggi oleh anggota perpustakaan.</p>
      </div>

      {/* Top 3 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {books.slice(0, 3).map((book, idx) => (
          <div 
            key={book.id} 
            className="card" 
            style={{ 
              padding: '24px', 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: idx === 0 
                ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' 
                : idx === 1 
                  ? 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)' 
                  : 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
              border: idx === 0 ? '1.5px solid #FCD34D' : idx === 1 ? '1.5px solid #CBD5E1' : '1.5px solid #FDBA74'
            }}
          >
            {/* Rank Badge */}
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: idx === 0 ? '#F59E0B' : idx === 1 ? '#64748B' : '#EA580C',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 800
            }}>
              #{idx + 1}
            </div>

            <div style={{ width: '50px', height: '68px', borderRadius: '6px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
              <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{book.author.name}</p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <TrendingUp size={12} /> {book.borrow_count}x Dipinjam
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complete Rankings Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="table-base" style={{ width: '100%', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peringkat</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Judul Buku</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kategori</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Penerbit</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Dipinjam</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, index) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', color: index === 0 ? '#F59E0B' : index === 1 ? '#64748B' : index === 2 ? '#EA580C' : 'var(--text-secondary)' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '44px', borderRadius: '4px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                      <img src={b.cover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{b.title}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Oleh: {b.author.name}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: b.category.color + '18', color: b.category.color }}>
                    {b.category.name}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <p>{b.publisher.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tahun {b.year} | ISBN: {b.isbn}</p>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {b.borrow_count} kali
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#D97706' }}>
                    <Star size={12} fill="#D97706" color="#D97706" /> {b.rating}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
