'use client';

import Link from 'next/link';
import { Library, MapPin, Phone, Mail, Clock, Globe, Share2, Play } from 'lucide-react';

export default function UserFooter() {
  return (
    <footer style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.7)', marginTop: 'auto' }}>
      <div className="page-container" style={{ padding: '64px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Library size={24} color="white" />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>Perpustakaan</p>
                <p style={{ color: '#60A5FA', fontWeight: 600, fontSize: '0.85rem' }}>Kabupaten Bireuen</p>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', marginBottom: '20px' }}>
              Platform digital terpadu layanan perpustakaan Kabupaten Bireuen. Akses ribuan koleksi buku, reservasi online, dan berbagai layanan perpustakaan modern.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: Globe, href: '#', color: '#1877F2' },
                { icon: Share2, href: '#', color: '#E4405F' },
                { icon: Play, href: '#', color: '#FF0000' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', color: 'rgba(255,255,255,0.6)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>Layanan</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { href: '/katalog', label: 'Katalog Buku' },
                { href: '/reservasi', label: 'Reservasi Online' },
                { href: '/buku-tamu', label: 'Buku Tamu Digital' },
                { href: '/daftar', label: 'Daftar Anggota' },
                { href: '/pengajuan-buku', label: 'Usul Buku Baru' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#60A5FA'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>Informasi</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { href: '/tentang', label: 'Tentang Kami' },
                { href: '/kategori', label: 'Kategori Buku' },
                { href: '/buku-populer', label: 'Buku Populer' },
                { href: '/statistik', label: 'Statistik Perpustakaan' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#60A5FA'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>Hubungi Kami</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: MapPin, text: 'Jl. T. Hamzah Bendahara No. 1, Bireuen, Aceh 24251' },
                { icon: Phone, text: '(0644) 21234' },
                { icon: Mail, text: 'perpustakaan@bireuen.go.id' },
                { icon: Clock, text: 'Sen-Jum: 08.00–16.30 | Sab: 08.00–12.00' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <item.icon size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#60A5FA' }} />
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '12px',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
            © 2026 Perpustakaan Kabupaten Bireuen. Hak cipta dilindungi.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
            Smart Library Management System v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
