'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Star, MapPin, Calendar, Clipboard, ShieldCheck, Tag, Info, User, HelpCircle } from 'lucide-react';
import { mockBooks } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';
import { truncate } from '@/lib/utils';

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [reserveDate, setReserveDate] = useState('');
  const [notes, setNotes] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const bookId = parseInt(id);
  const book = mockBooks.find((b) => b.id === bookId);

  // Set default reserve date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setReserveDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  if (!book) {
    return (
      <div className="page-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❌</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Buku Tidak Ditemukan
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Maaf, buku dengan ID yang Anda cari tidak tersedia dalam katalog kami.
        </p>
        <Link href="/katalog" className="btn btn-primary">Kembali ke Katalog</Link>
      </div>
    );
  }

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!reserveDate) {
      setAlert({ type: 'danger', message: 'Tanggal reservasi harus diisi.' });
      return;
    }

    // Save reservation to localStorage for the demo
    const localReservations = localStorage.getItem('slms_reservations');
    const reservationsList = localReservations ? JSON.parse(localReservations) : [];
    
    // Create new reservation
    const newReservation = {
      id: reservationsList.length + 100, // starting from 100
      book: {
        id: book.id,
        title: book.title,
        cover: book.cover,
        author: book.author,
        category: book.category,
      },
      member: {
        name: user?.name || 'Anggota Perpustakaan',
        member_code: 'ANG-00099',
      },
      reservation_date: reserveDate,
      status: 'pending',
      notes: notes,
      created_at: new Date().toISOString().split('T')[0],
    };

    reservationsList.unshift(newReservation);
    localStorage.setItem('slms_reservations', JSON.stringify(reservationsList));

    setShowModal(false);
    setNotes('');
    setAlert({ type: 'success', message: `Berhasil mengajukan reservasi untuk buku "${book.title}". Silakan cek status di menu Profil.` });

    // Clear alert after 5 seconds
    setTimeout(() => setAlert(null), 8000);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Breadcrumbs */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
        <div className="page-container" style={{ display: 'flex', gap: '8px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          <Link href="/beranda" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Beranda</Link>
          <span>/</span>
          <Link href="/katalog" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Katalog</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{truncate(book.title, 35)}</span>
        </div>
      </div>

      <div className="page-container" style={{ padding: '32px 24px' }}>
        {alert && (
          <div 
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              background: alert.type === 'success' ? '#DEF7EC' : '#FDE8E8',
              color: alert.type === 'success' ? '#03543F' : '#9B1C1C',
              border: `1.5px solid ${alert.type === 'success' ? '#BCF0DA' : '#F8B4B4'}`,
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          >
            {alert.message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Left Column - Cover Card */}
          <div className="card" style={{ padding: '24px', textAlign: 'center', position: 'sticky', top: '100px' }}>
            <div style={{ 
              aspectRatio: '3/4', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              background: '#F1F5F9',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '280px',
              margin: '0 auto 24px',
            }}>
              {book.cover ? (
                <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' }}>
                  <BookOpen size={64} color="#6366F1" />
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stok</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{book.stock}</p>
                </div>
                <div style={{ borderLeft: '1px solid var(--border)' }} />
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tersedia</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: book.available_stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {book.available_stock}
                  </p>
                </div>
                <div style={{ borderLeft: '1px solid var(--border)' }} />
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dipinjam</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{book.stock - book.available_stock}</p>
                </div>
              </div>

              {book.available_stock > 0 ? (
                <button 
                  id="btn-reserve-book"
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push('/login');
                    } else {
                      setShowModal(true);
                    }
                  }} 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '12px' }}
                >
                  <Calendar size={18} /> Reservasi Peminjaman
                </button>
              ) : (
                <button 
                  disabled 
                  className="btn" 
                  style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '12px', background: '#E2E8F0', color: '#94A3B8', cursor: 'not-allowed' }}
                >
                  Stok Habis
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '8px', background: book.category.color + '18', color: book.category.color }}>
                  {book.category.icon} {book.category.name}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: '#FEF3C7', color: '#D97706' }}>
                  <Star size={12} fill="#D97706" color="#D97706" /> {book.rating}
                </span>
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.25, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {book.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                <User size={16} />
                <span style={{ fontWeight: 600 }}>{book.author.name}</span>
              </div>

              {/* Book Metadata Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 0', marginBottom: '24px' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Penerbit</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{book.publisher.name}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Tahun Terbit</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{book.year}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>ISBN</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{book.isbn}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Kode Buku</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{book.code}</p>
                </div>
              </div>

              {/* Shelf Location */}
              {book.shelf && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#F0F9FF', border: '1px solid #B9E6FE', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#0369A1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lokasi Rak Buku</p>
                    <p style={{ fontSize: '0.9rem', color: '#0C4A6E', fontWeight: 700 }}>
                      {book.shelf.location} ({book.shelf.code}) — {book.shelf.floor}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Sinopsis Buku</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7, textAlign: 'justify' }}>
                  {book.description || 'Tidak ada deskripsi yang tersedia untuk buku ini.'}
                </p>
              </div>
            </div>

            {/* General info */}
            <div className="card" style={{ padding: '20px', display: 'flex', gap: '12px', background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)', border: 'none' }}>
              <Info size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Ketentuan Reservasi</h4>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Buku yang direservasi harus diambil di perpustakaan maksimal 2 hari setelah tanggal disetujui. Harap bawa Kartu Anggota Digital di profil Anda saat pengambilan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '440px', padding: '28px', margin: '20px', boxShadow: 'var(--shadow-2xl)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>Reservasi Buku</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: '20px' }}>
              Isi data berikut untuk mengajukan reservasi peminjaman.
            </p>

            <form onSubmit={handleReserve}>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="modal-book-title" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Buku yang Dipilih</label>
                <input
                  id="modal-book-title"
                  type="text"
                  value={book.title}
                  disabled
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#F8FAFC', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="modal-reserve-date" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Tanggal Pengambilan</label>
                <input
                  id="modal-reserve-date"
                  type="date"
                  value={reserveDate}
                  onChange={(e) => setReserveDate(e.target.value)}
                  className="input-base"
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="modal-notes" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Catatan Tambahan (Opsional)</label>
                <textarea
                  id="modal-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-base"
                  rows={3}
                  placeholder="Contoh: Diambil sore hari setelah jam kerja"
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  style={{ padding: '10px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.875rem' }}
                >
                  Kirim Reservasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
