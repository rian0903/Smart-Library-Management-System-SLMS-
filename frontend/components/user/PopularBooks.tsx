'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, BookOpen, Eye } from 'lucide-react';
import { mockBooks } from '@/data/mockData';
import { truncate } from '@/lib/utils';

export default function PopularBooks() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const popularBooks = [...mockBooks].sort((a, b) => (b.borrow_count || 0) - (a.borrow_count || 0)).slice(0, 6);

  return (
    <section style={{ padding: '60px 0', background: 'white' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>⭐</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Paling Diminati</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Buku Populer
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
              Koleksi yang paling banyak dipinjam oleh anggota kami
            </p>
          </div>
          <Link
            href="/buku-populer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--primary)', textDecoration: 'none', fontWeight: 600,
              fontSize: '0.875rem', padding: '8px 16px', borderRadius: '10px',
              border: '1.5px solid #DBEAFE', background: '#EFF6FF',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
          >
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
          {popularBooks.map((book, i) => (
            <div
              key={book.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                style={{
                  borderRadius: '14px', overflow: 'hidden', position: 'relative',
                  boxShadow: hoveredId === book.id ? 'var(--shadow-xl)' : 'var(--shadow)',
                  transform: hoveredId === book.id ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  border: '1px solid var(--border)',
                  background: 'white',
                }}
              >
                {/* Cover */}
                <div style={{ position: 'relative', aspectRatio: '3/4', background: '#F1F5F9', overflow: 'hidden' }}>
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' }}>
                      <BookOpen size={40} color="#6366F1" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div
                    style={{
                      position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: hoveredId === book.id ? 1 : 0, transition: 'opacity 0.3s',
                    }}
                  >
                    <Link
                      href={`/katalog/${book.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 18px', borderRadius: '10px',
                        background: 'white', color: 'var(--text-primary)',
                        textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem',
                      }}
                    >
                      <Eye size={16} /> Detail
                    </Link>
                  </div>

                  {/* Status badge */}
                  {book.available_stock === 0 && (
                    <span
                      style={{
                        position: 'absolute', top: '8px', left: '8px',
                        background: '#EF4444', color: 'white',
                        fontSize: '0.65rem', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '6px',
                      }}
                    >
                      Habis
                    </span>
                  )}

                  {/* Rank badge */}
                  {i < 3 && (
                    <span
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: i === 0 ? '#F59E0B' : i === 1 ? '#94A3B8' : '#CD7F32',
                        color: 'white', fontSize: '0.7rem', fontWeight: 800,
                        padding: '2px 8px', borderRadius: '6px',
                      }}
                    >
                      #{i + 1}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '14px' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '4px' }}>
                    {truncate(book.title, 40)}
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {book.author.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {book.rating?.toFixed(1)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {book.borrow_count}x dipinjam
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
