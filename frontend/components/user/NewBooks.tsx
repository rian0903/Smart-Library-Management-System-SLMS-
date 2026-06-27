'use client';

import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { mockBooks } from '@/data/mockData';
import { truncate } from '@/lib/utils';

export default function NewBooks() {
  const newBooks = [...mockBooks].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 8);

  return (
    <section style={{ padding: '60px 0', background: 'var(--bg)' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🆕</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Koleksi Terbaru</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Buku Terbaru
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
              Tambahan koleksi terbaru yang siap dipinjam
            </p>
          </div>
          <Link
            href="/katalog?sort=newest"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#22C55E', textDecoration: 'none', fontWeight: 600,
              fontSize: '0.875rem', padding: '8px 16px', borderRadius: '10px',
              border: '1.5px solid #BBF7D0', background: '#F0FDF4',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#DCFCE7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F0FDF4'; }}
          >
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>

        {/* List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {newBooks.map((book, i) => (
            <Link
              key={book.id}
              href={`/katalog/${book.id}`}
              className="animate-fade-in"
              style={{
                display: 'flex', gap: '16px', padding: '16px',
                borderRadius: '14px', border: '1.5px solid var(--border)',
                background: 'white', textDecoration: 'none', transition: 'all 0.25s',
                animationDelay: `${i * 0.07}s`, opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#BFDBFE';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Book cover */}
              <div style={{ width: '64px', height: '88px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' }}>
                {book.cover ? (
                  <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={24} color="#6366F1" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: '6px' }}>
                  <span
                    style={{
                      display: 'inline-block', fontSize: '0.65rem', fontWeight: 700,
                      padding: '2px 8px', borderRadius: '6px',
                      background: book.category.color + '18',
                      color: book.category.color,
                    }}
                  >
                    {book.category.name}
                  </span>
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '4px' }}>
                  {truncate(book.title, 45)}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {book.author.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(book.created_at).getFullYear()}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px',
                      borderRadius: '6px',
                      background: book.available_stock > 0 ? '#DCFCE7' : '#FEE2E2',
                      color: book.available_stock > 0 ? '#15803D' : '#B91C1C',
                    }}
                  >
                    {book.available_stock > 0 ? `${book.available_stock} Tersedia` : 'Habis'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
