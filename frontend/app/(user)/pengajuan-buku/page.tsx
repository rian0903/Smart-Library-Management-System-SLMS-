'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, User, Building, MessageSquare, ClipboardList, CheckCircle2, Info, FileText } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { mockBookRequests } from '@/data/mockData';

export default function BookRequestPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Load requests from localStorage or mockData
    const localRequests = localStorage.getItem('slms_book_requests');
    if (localRequests) {
      setRequests(JSON.parse(localRequests));
    } else {
      // Filter mock requests for this user
      const userMockRequests = mockBookRequests.filter(r => r.user.email === user.email);
      setRequests(userMockRequests);
    }
  }, [isAuthenticated, user, router, submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !reason) return;

    const newRequest = {
      id: requests.length + 100,
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
      },
      title,
      author,
      publisher,
      reason,
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0],
    };

    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem('slms_book_requests', JSON.stringify(updatedRequests));

    setTitle('');
    setAuthor('');
    setPublisher('');
    setReason('');
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="page-container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '8px', background: 'rgba(59,130,246,0.12)', color: 'var(--primary)' }}>
            Usulan Buku
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Usulkan Buku Baru
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '500px', margin: '0 auto' }}>
            Buku yang Anda cari tidak tersedia? Silakan ajukan usulan pengadaan buku baru kepada kami.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
          
          {/* Form */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Formulir Usulan</h3>

            {submitted && (
              <div style={{ display: 'flex', gap: '10px', background: '#DCFCE7', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', color: '#15803D', fontSize: '0.875rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>Usulan buku berhasil dikirim! Silakan pantau status usulan di panel sebelah kanan.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="req-title" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Judul Buku</label>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="req-title"
                    type="text"
                    placeholder="Masukkan judul lengkap buku"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-base"
                    style={{ paddingLeft: '44px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="req-author" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Penulis / Pengarang</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="req-author"
                    type="text"
                    placeholder="Masukkan nama penulis"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="input-base"
                    style={{ paddingLeft: '44px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="req-publisher" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Penerbit (Opsional)</label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="req-publisher"
                    type="text"
                    placeholder="Masukkan nama penerbit"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="input-base"
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="req-reason" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Alasan Usulan</label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={18} style={{ position: 'absolute', left: '14px', top: '24px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <textarea
                    id="req-reason"
                    placeholder="Kenapa buku ini penting untuk perpustakaan?"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="input-base"
                    rows={3}
                    style={{ paddingLeft: '44px', resize: 'none' }}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '12px' }}>
                Kirim Usulan Buku
              </button>
            </form>
          </div>

          {/* Past Requests */}
          <div className="card" style={{ padding: '28px', maxHeight: '520px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <ClipboardList size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Usulan Saya</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem' }}>Belum ada usulan buku yang diajukan.</p>
                </div>
              ) : (
                requests.map((req, i) => (
                  <div key={req.id || i} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                        {req.title}
                      </h4>
                      <span style={{ 
                        fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', 
                        background: req.status === 'approved' ? '#DCFCE7' : req.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', 
                        color: req.status === 'approved' ? '#15803D' : req.status === 'rejected' ? '#B91C1C' : '#D97706',
                        flexShrink: 0
                      }}>
                        {req.status === 'approved' ? 'Disetujui' : req.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Penulis: {req.author}</p>
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      <span>Diajukan: {req.created_at}</span>
                      {req.notes && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Ket: {req.notes}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
