'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, BookOpen, Users, Sparkles, ChevronDown } from 'lucide-react';
import { mockDashboardStats } from '@/data/mockData';
import { formatNumber } from '@/lib/utils';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedStats, setAnimatedStats] = useState({ books: 0, members: 0, new: 0 });

  useEffect(() => {
    // Animate stats counting up
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        books: Math.round(eased * mockDashboardStats.total_books),
        members: Math.round(eased * mockDashboardStats.total_members),
        new: Math.round(eased * mockDashboardStats.new_books_this_month),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/katalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section
      style={{
        background: 'linear-gradient(145deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
        padding: '80px 0 120px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Floating book icons */}
      {[
        { top: '15%', left: '8%', size: 32, opacity: 0.15, delay: '0s' },
        { top: '70%', left: '5%', size: 24, opacity: 0.1, delay: '1s' },
        { top: '25%', right: '8%', size: 28, opacity: 0.12, delay: '0.5s' },
        { top: '65%', right: '6%', size: 36, opacity: 0.08, delay: '1.5s' },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            right: item.right,
            opacity: item.opacity,
            animation: `float 4s ease-in-out infinite`,
            animationDelay: item.delay,
            pointerEvents: 'none',
          }}
        >
          <BookOpen size={item.size} color="#60A5FA" />
        </div>
      ))}

      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '100px', padding: '6px 16px',
              color: '#93C5FD', fontSize: '0.8rem', fontWeight: 600,
            }}
          >
            <Sparkles size={14} />
            Platform Perpustakaan Digital Modern
          </span>
        </div>

        {/* Heading */}
        <div className="animate-fade-in delay-100" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Perpustakaan Kabupaten{' '}
            <span style={{ background: 'linear-gradient(135deg, #60A5FA, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Bireuen
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Temukan ribuan koleksi buku, reservasi online, dan nikmati berbagai layanan perpustakaan digital dari mana saja, kapan saja.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="animate-fade-in delay-200" style={{ maxWidth: '600px', margin: '0 auto 40px', position: 'relative' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '0',
              background: 'white', borderRadius: '14px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            <Search size={20} style={{ marginLeft: '20px', flexShrink: 0, color: 'var(--text-muted)' }} />
            <input
              id="hero-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku, penulis, atau kategori..."
              style={{
                flex: 1, padding: '16px 16px', border: 'none', outline: 'none',
                fontSize: '0.95rem', color: 'var(--text-primary)',
                background: 'transparent',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px', margin: '6px 6px 6px 0',
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                color: 'white', border: 'none', borderRadius: '10px',
                cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s', flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <span className="hidden sm:inline">Cari</span> <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <Link
            href="/katalog"
            className="btn btn-primary"
            style={{ padding: '13px 28px', fontSize: '0.95rem' }}
          >
            <BookOpen size={18} /> Jelajahi Katalog
          </Link>
          <Link
            href="/daftar"
            className="btn"
            style={{
              padding: '13px 28px', fontSize: '0.95rem',
              background: 'rgba(255,255,255,0.1)', color: 'white',
              border: '1.5px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          >
            <Users size={18} /> Daftar Anggota
          </Link>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in delay-400"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '20px', maxWidth: '700px', margin: '0 auto',
          }}
        >
          {[
            { value: formatNumber(animatedStats.books), label: 'Koleksi Buku', icon: '📚' },
            { value: formatNumber(animatedStats.members), label: 'Anggota Aktif', icon: '👥' },
            { value: `+${animatedStats.new}`, label: 'Buku Baru Bulan Ini', icon: '✨' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center', padding: '20px 16px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px', backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.icon}</div>
              <p style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ textAlign: 'center', marginTop: '48px', animation: 'bounce 2s infinite' }}>
          <ChevronDown size={24} color="rgba(255,255,255,0.3)" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
}
