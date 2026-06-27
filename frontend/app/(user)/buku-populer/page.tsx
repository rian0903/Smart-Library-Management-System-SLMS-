'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, BookOpen, Eye, TrendingUp, Trophy, Filter, ChevronDown } from 'lucide-react';
import { mockBooks, mockCategories } from '@/data/mockData';
import { truncate } from '@/lib/utils';

export default function BukuPopulerPage() {
  const [selectedCat, setSelectedCat] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const sorted = [...mockBooks]
    .filter((b) => !selectedCat || b.category.slug === selectedCat)
    .sort((a, b) => (b.borrow_count || 0) - (a.borrow_count || 0));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '12px' }}>
            <Trophy size={14} color="#F59E0B" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309' }}>Koleksi Terpopuler</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '8px' }}>
            Buku Populer
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            Temukan buku-buku yang paling banyak dipinjam oleh anggota perpustakaan kami.
          </p>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '36px' }}>
          <button
            onClick={() => setSelectedCat('')}
            style={{
              padding: '8px 18px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              border: '1.5px solid', transition: 'all 0.2s',
              borderColor: !selectedCat ? 'var(--primary)' : 'var(--border)',
              background: !selectedCat ? 'var(--primary)' : 'var(--card)',
              color: !selectedCat ? 'white' : 'var(--text-secondary)',
            }}
          >
            Semua
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.slug)}
              style={{
                padding: '8px 18px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                border: '1.5px solid', transition: 'all 0.2s',
                borderColor: selectedCat === cat.slug ? cat.color : 'var(--border)',
                background: selectedCat === cat.slug ? cat.color : 'var(--card)',
                color: selectedCat === cat.slug ? 'white' : 'var(--text-secondary)',
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        {sorted.length >= 3 && !selectedCat && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '720px', margin: '0 auto 48px' }}>
            {[sorted[1], sorted[0], sorted[2]].map((book, i) => {
              const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const colors = ['', '#F59E0B', '#94A3B8', '#CD7F32'];
              const heights = ['', '120px', '96px', '80px'];
              return (
                <Link
                  key={book.id}
                  href={`/katalog/${book.id}`}
                  className="animate-fade-in card-hover"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '24px 16px', borderRadius: '16px',
                    border: '1.5px solid var(--border)', background: 'white',
                    textDecoration: 'none', transition: 'all 0.3s',
                    animationDelay: `${i * 0.1}s`, opacity: 0,
                    order: rank === 1 ? 0 : rank === 2 ? -1 : 1,
                  }}
                >
                  <div style={{ width: heights[rank], height: heights[rank], borderRadius: '10px', overflow: 'hidden', marginBottom: '14px', boxShadow: 'var(--shadow)' }}>
                    {book.cover ? (
                      <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' }}>
                        <BookOpen size={32} color="#6366F1" />
                      </div>
                    )}
                  </div>
                  <div style={{
                    background: colors[rank], color: 'white', fontSize: '0.7rem', fontWeight: 800,
                    padding: '2px 10px', borderRadius: '6px', marginBottom: '10px',
                  }}>
                    #{rank}
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.3, marginBottom: '4px' }}>
                    {truncate(book.title, 35)}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{book.author.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{book.rating?.toFixed(1)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>{book.borrow_count}x</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Full grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {sorted.map((book, i) => {
            const rank = i + 1;
            return (
              <div
                key={book.id}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i, 12) * 0.05}s`, opacity: 0 }}
                onMouseEnter={() => setHoveredId(book.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={{
                  display: 'flex', gap: '16px', padding: '16px', borderRadius: '14px',
                  border: '1.5px solid var(--border)', background: 'white', transition: 'all 0.25s',
                  boxShadow: hoveredId === book.id ? 'var(--shadow-md)' : 'none',
                  transform: hoveredId === book.id ? 'translateY(-2px)' : 'none',
                }}>
                  <div style={{ position: 'relative', width: '60px', height: '82px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#F1F5F9' }}>
                    {book.cover ? (
                      <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' }}>
                        <BookOpen size={22} color="#6366F1" />
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: rank <= 3 ? '#F59E0B' : '#64748B',
                      color: 'white', fontSize: '0.6rem', fontWeight: 800, textAlign: 'center', padding: '1px 0',
                    }}>
                      #{rank}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/katalog/${book.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '4px' }}>
                        {truncate(book.title, 45)}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{book.author.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{book.rating?.toFixed(1)}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <TrendingUp size={11} /> {book.borrow_count}x dipinjam
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '3rem', marginBottom: '12px' }}>📚</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Tidak ada buku dalam kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
