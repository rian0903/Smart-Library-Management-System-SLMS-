'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { mockCategories } from '@/data/mockData';
import { formatNumber } from '@/lib/utils';

export default function CategorySection() {
  return (
    <section
      style={{
        padding: '60px 0 80px',
        background: 'linear-gradient(180deg, white 0%, #F8FAFC 100%)',
      }}
    >
      <div className="page-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>📂</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Jelajahi Koleksi
            </span>
          </div>
          <h2
            style={{
              fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)',
              fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '12px',
            }}
          >
            Kategori Buku
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Temukan buku favorit Anda dari berbagai kategori yang tersedia di perpustakaan kami
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {mockCategories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/katalog?category=${cat.slug}`}
              className="animate-fade-in"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '28px 16px', borderRadius: '16px',
                border: '1.5px solid var(--border)', background: 'white',
                textDecoration: 'none', transition: 'all 0.3s',
                animationDelay: `${i * 0.06}s`, opacity: 0,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = cat.color;
                e.currentTarget.style.background = cat.color + '08';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 30px ${cat.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: cat.color + '18', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: '14px', fontSize: '1.75rem',
                  transition: 'transform 0.3s',
                }}
              >
                {cat.icon}
              </div>
              <h3
                style={{
                  fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)',
                  marginBottom: '4px', textAlign: 'center',
                }}
              >
                {cat.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {formatNumber(cat.book_count || 0)} buku
              </p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/katalog"
            className="btn btn-primary"
            style={{ padding: '13px 32px', fontSize: '0.95rem', display: 'inline-flex' }}
          >
            Lihat Seluruh Katalog <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
