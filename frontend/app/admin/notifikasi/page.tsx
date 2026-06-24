'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ShieldAlert, BookOpen, UserCheck, CheckCircle2, ChevronRight, Inbox } from 'lucide-react';

interface Notification {
  id: number;
  type: 'system' | 'overdue' | 'borrow' | 'return';
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  color: string;
}

const defaultNotifications: Notification[] = [
  {
    id: 1,
    type: 'overdue',
    title: '8 Buku Terlambat Dikembalikan',
    message: 'Terdapat 8 buku pinjaman anggota yang telah melewati batas tanggal pengembalian aktif. Harap segera kirim pengingat WhatsApp/Email otomatis.',
    time: '5 menit lalu',
    date: '2026-06-24',
    read: false,
    color: '#EF4444'
  },
  {
    id: 2,
    type: 'borrow',
    title: 'Peminjaman Reservasi Baru: Rahmat Hidayat',
    message: 'Anggota Rahmat Hidayat (BRN-00001) mengajukan reservasi online untuk buku "Biologi Molekuler untuk Pemula".',
    time: '12 menit lalu',
    date: '2026-06-24',
    read: false,
    color: '#3B82F6'
  },
  {
    id: 3,
    type: 'return',
    title: 'Pengembalian Berhasil: Bumi Manusia',
    message: 'Buku "Bumi Manusia" (BRN-012) telah sukses dikembalikan oleh anggota Siti Aminah (BRN-00002). Peminjaman ditutup tanpa denda.',
    time: '1 jam lalu',
    date: '2026-06-24',
    read: true,
    color: '#22C55E'
  },
  {
    id: 4,
    type: 'system',
    title: 'Pemeliharaan Sistem Selesai',
    message: 'Pembaruan server ke Next.js 15 dan optimasi engine pencarian katalog selesai dilakukan pada pukul 02:00 WIB.',
    time: '20 jam lalu',
    date: '2026-06-23',
    read: true,
    color: '#8B5CF6'
  },
  {
    id: 5,
    type: 'borrow',
    title: 'Pendaftaran Anggota Baru: Nurul Izzah',
    message: 'Nurul Izzah telah menyelesaikan pendaftaran online. Kode anggota BRN-00004 aktif dan siap digunakan.',
    time: '1 hari lalu',
    date: '2026-06-23',
    read: true,
    color: '#3B82F6'
  }
];

export default function AdminNotifikasiPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('slms_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(defaultNotifications);
      localStorage.setItem('slms_notifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  const saveToStorage = (updatedList: Notification[]) => {
    setNotifications(updatedList);
    localStorage.setItem('slms_notifications', JSON.stringify(updatedList));
  };

  const handleMarkAsRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveToStorage(updated);
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif({ ...selectedNotif, read: true });
    }
    // Trigger topbar sync
    window.dispatchEvent(new Event('storage'));
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveToStorage(updated);
    if (selectedNotif) {
      setSelectedNotif({ ...selectedNotif, read: true });
    }
    window.dispatchEvent(new Event('storage'));
  };

  const handleDelete = (id: number) => {
    const updated = notifications.filter(n => n.id !== id);
    saveToStorage(updated);
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif(null);
    }
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeleteAllRead = () => {
    if (confirm('Hapus semua notifikasi yang sudah dibaca?')) {
      const updated = notifications.filter(n => !n.read);
      saveToStorage(updated);
      if (selectedNotif && selectedNotif.read) {
        setSelectedNotif(null);
      }
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Filter Logic
  const filtered = notifications.filter(n => {
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'unread' && !n.read) || 
      (activeFilter === 'read' && n.read);
      
    const matchesType = 
      activeType === 'all' || 
      n.type === activeType;

    return matchesFilter && matchesType;
  });

  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'overdue':
        return <ShieldAlert size={18} style={{ color }} />;
      case 'borrow':
        return <BookOpen size={18} style={{ color }} />;
      case 'return':
        return <CheckCircle2 size={18} style={{ color }} />;
      case 'system':
      default:
        return <Bell size={18} style={{ color }} />;
    }
  };

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '4px' }}>
            Notifikasi Sistem
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Pusat informasi aktivitas sirkulasi buku, reservasi, keterlambatan denda, dan pengumuman sistem.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {getUnreadCount() > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <Check size={14} /> Tandai Semua Dibaca
            </button>
          )}
          {notifications.some(n => n.read) && (
            <button
              onClick={handleDeleteAllRead}
              className="btn btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)', padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <Trash2 size={14} /> Hapus Yang Dibaca
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', flex: 1, minHeight: 0 }}>
        {/* Left Side: Filter and List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--card)' }}>
          {/* Quick Filters */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '4px' }}>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'unread', label: `Belum Dibaca (${getUnreadCount()})` },
              { id: 'read', label: 'Dibaca' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                style={{
                  flex: 1, padding: '6px 4px', fontSize: '0.75rem', fontWeight: 600,
                  borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: activeFilter === f.id ? 'var(--primary)' : 'transparent',
                  color: activeFilter === f.id ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.15s'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              { id: 'all', label: 'Semua Kategori' },
              { id: 'overdue', label: 'Terlambat' },
              { id: 'borrow', label: 'Reservasi' },
              { id: 'return', label: 'Kembali' },
              { id: 'system', label: 'Sistem' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                style={{
                  padding: '4px 8px', fontSize: '0.7rem', fontWeight: 600,
                  borderRadius: '4px', border: '1px solid var(--border)', cursor: 'pointer',
                  background: activeType === t.id ? 'var(--bg)' : 'transparent',
                  color: activeType === t.id ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* List Scroll */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filtered.length > 0 ? (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setSelectedNotif(n);
                    if (!n.read) handleMarkAsRead(n.id);
                  }}
                  style={{
                    padding: '14px 16px', borderBottom: '1px solid var(--border)',
                    cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start',
                    background: selectedNotif?.id === n.id ? 'var(--bg)' : 'transparent',
                    borderLeft: !n.read ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { if (selectedNotif?.id !== n.id) e.currentTarget.style.background = 'var(--bg)'; }}
                  onMouseLeave={(e) => { if (selectedNotif?.id !== n.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: n.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getIcon(n.type, n.color)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '0.8rem', fontWeight: !n.read ? 700 : 500,
                      color: 'var(--text-primary)', marginBottom: '2px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {n.title}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                      {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '48px 16px', color: 'var(--text-muted)' }}>
                <Inbox size={32} />
                <span style={{ fontSize: '0.8rem' }}>Tidak ada notifikasi</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Read Panel */}
        <div className="card" style={{ background: 'var(--card)', padding: '32px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {selectedNotif ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: selectedNotif.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    {getIcon(selectedNotif.type, selectedNotif.color)}
                  </div>
                  <div>
                    <span className="badge badge-gray" style={{ textTransform: 'uppercase', fontSize: '0.65rem', marginBottom: '4px' }}>
                      {selectedNotif.type}
                    </span>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {selectedNotif.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedNotif.id)}
                  style={{
                    padding: '8px', borderRadius: '8px', border: '1px solid var(--border)',
                    background: 'transparent', color: 'var(--danger)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Message content */}
              <div style={{ color: 'var(--text-primary)', fontSize: '0.925rem', lineHeight: 1.7, background: 'var(--bg)', padding: '20px', borderRadius: '12px' }}>
                {selectedNotif.message}
              </div>

              {/* Meta details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Waktu Penerimaan</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNotif.time}</p>
                </div>
                <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Tanggal Penerimaan</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedNotif.date}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'var(--text-muted)' }}>
              <Bell size={48} style={{ opacity: 0.5 }} />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Pilih Notifikasi</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Klik salah satu notifikasi di panel sebelah kiri untuk membaca isinya.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
