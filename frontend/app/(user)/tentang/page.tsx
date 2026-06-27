'use client';

import { MapPin, Phone, Mail, Clock, BookOpen, Users, Award, Heart, Target, Eye } from 'lucide-react';

export default function TentangPage() {
  const stats = [
    { icon: BookOpen, value: '1.500+', label: 'Koleksi Buku', color: '#3B82F6' },
    { icon: Users, value: '847', label: 'Anggota Aktif', color: '#22C55E' },
    { icon: Award, value: '15+', label: 'Tahun Melayani', color: '#F59E0B' },
    { icon: Heart, value: '12', label: 'Petugas', color: '#EC4899' },
  ];

  const hours = [
    { day: 'Senin - Kamis', time: '08.00 - 16.30 WIB' },
    { day: 'Jumat', time: '08.00 - 11.30 WIB, 14.00 - 16.30 WIB' },
    { day: 'Sabtu', time: '08.00 - 12.00 WIB' },
    { day: 'Minggu & Hari Libur', time: 'Tutup' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
        padding: '80px 24px 60px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="page-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 900, color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '12px' }}>
            Tentang Kami
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Perpustakaan Kabupaten Bireuen — Pusat ilmu pengetahuan dan literasi masyarakat yang modern, inklusif, dan terjangkau.
          </p>
        </div>
      </section>

      <div className="page-container" style={{ padding: '48px 24px 80px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '60px', marginTop: '-40px' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="card animate-fade-in" style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: stat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.value}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Profile section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} color="white" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Profil Perpustakaan
              </h2>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
                Perpustakaan Kabupaten Bireuen adalah lembaga pelayanan publik yang bertugas mengelola, menyimpan, dan menyebarluaskan informasi serta bahan pustaka untuk mendukung pendidikan, penelitian, dan rekreasi masyarakat Kabupaten Bireuen dan sekitarnya.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                Dengan lebih dari 1.500 koleksi buku yang mencakup berbagai bidang ilmu, perpustakaan kami berkomitmen menjadi pusat literasi modern yang mudah diakses oleh seluruh lapisan masyarakat, baik secara langsung maupun melalui platform digital ini.
              </p>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={18} color="white" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Visi & Misi
              </h2>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={16} /> Visi
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  Menjadi perpustakaan modern yang menjadi rujukan utama masyarakat Kabupaten Bireuen dalam mengakses ilmu pengetahuan, informasi, dan layanan literasi berkualitas.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22C55E', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={16} /> Misi
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Menyediakan koleksi buku dan bahan pustaka yang lengkap dan berkualitas.',
                    'Mengembangkan layanan perpustakaan berbasis teknologi digital.',
                    'Meningkatkan minat baca dan literasi masyarakat melalui program-program edukasi.',
                    'Menciptakan ruang belajar yang nyaman, inklusif, dan ramah untuk semua usia.',
                  ].map((misi, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#22C55E', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span>
                      {misi}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* Contact */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} color="white" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Hubungi Kami
              </h2>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: MapPin, label: 'Alamat', value: 'Jl. T. Hamzah Bendahara No. 1, Bireuen, Aceh 24251', color: '#3B82F6' },
                  { icon: Phone, label: 'Telepon', value: '(0644) 21234', color: '#22C55E' },
                  { icon: Mail, label: 'Email', value: 'perpustakaan@bireuen.go.id', color: '#F59E0B' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={18} color={item.color} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Opening hours */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color="white" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Jam Operasional
              </h2>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {hours.map((h) => (
                  <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: h.time === 'Tutup' ? '#FEF2F2' : 'var(--bg)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{h.day}</p>
                    <p style={{ fontSize: '0.825rem', fontWeight: 600, color: h.time === 'Tutup' ? '#EF4444' : 'var(--text-secondary)' }}>{h.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #EC4899, #DB2777)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="white" />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Lokasi Kami
            </h2>
          </div>
          <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.123456789!2d96.7!3d5.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMTInMDAuMCJOIDk2wrA0MicwMC4wIkU!5e0!3m2!1sid!2sid!4v1234567890"
              style={{ width: '100%', height: '100%', border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Perpustakaan Kabupaten Bireuen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
