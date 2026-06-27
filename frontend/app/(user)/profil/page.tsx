'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, QrCode, Clock, BookOpen, Star, ShieldCheck, History, Edit2, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { mockMembers, mockBorrowings, mockReservations } from '@/data/mockData';
import { getInitials, getStatusLabel } from '@/lib/utils';

export default function ProfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'borrowings' | 'reservations'>('profile');
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Try to find member info in registered users list
    const registeredUsers = localStorage.getItem('slms_registered_users');
    let foundMember = null;
    if (registeredUsers) {
      const parsed = JSON.parse(registeredUsers);
      const matched = parsed.find((item: any) => item.user.email === user.email);
      if (matched) foundMember = matched.member;
    }

    // Fallback to mockData
    if (!foundMember) {
      foundMember = mockMembers.find(m => m.email === user.email) || {
        id: user.id,
        user_id: user.id,
        member_code: 'BRN-00001',
        name: user.name,
        email: user.email,
        phone: '081234567890',
        address: 'Jl. Medan Banda Aceh No. 12, Bireuen',
        joined_at: user.created_at || '2025-01-15',
        expired_at: '2027-01-15',
        status: 'active' as const,
        total_borrows: 12
      };
    }

    setMemberInfo(foundMember);
    setEditName(foundMember.name);
    setEditPhone(foundMember.phone);
    setEditAddress(foundMember.address);

    // Load reservations from localStorage + mockData
    const localReservations = localStorage.getItem('slms_reservations');
    const customReservations = localReservations ? JSON.parse(localReservations) : [];
    
    // Filter mock reservations for this user email
    const userMockReservations = mockReservations.filter(r => r.member.email === user.email);
    setReservations([...customReservations, ...userMockReservations]);

    // Load active borrowings
    const userMockBorrowings = mockBorrowings.filter(b => b.member.email === user.email);
    setBorrowings(userMockBorrowings);

  }, [isAuthenticated, user, router]);

  if (!user || !memberInfo) {
    return (
      <div className="page-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(59,130,246,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Memuat data profil...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update local store
    updateUser({ name: editName });

    // Update member info state
    const updatedMember = {
      ...memberInfo,
      name: editName,
      phone: editPhone,
      address: editAddress
    };
    setMemberInfo(updatedMember);

    // Update in registered users in localStorage if exists
    const registeredUsers = localStorage.getItem('slms_registered_users');
    if (registeredUsers) {
      const parsed = JSON.parse(registeredUsers);
      const index = parsed.findIndex((item: any) => item.user.email === user.email);
      if (index !== -1) {
        parsed[index].user.name = editName;
        parsed[index].member.name = editName;
        parsed[index].member.phone = editPhone;
        parsed[index].member.address = editAddress;
        localStorage.setItem('slms_registered_users', JSON.stringify(parsed));
      }
    }

    setEditMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="page-container" style={{ maxWidth: '1000px' }}>
        
        {/* Save success toast */}
        {saveSuccess && (
          <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100, background: '#10B981', color: 'white', padding: '12px 24px', borderRadius: '10px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.875rem' }} className="animate-scale-in">
            <CheckCircle2 size={18} /> Profil berhasil diperbarui!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column - Card Digital & Quick Info */}
          <div className="lg:sticky lg:top-[100px]" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Digital Membership Card (Vue Notus/Premium style) */}
            <div 
              style={{ 
                background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)', 
                borderRadius: '20px', 
                padding: '24px', 
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                aspectRatio: '1.58/1'
              }}
            >
              {/* Background Glow */}
              <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>KARTU ANGGOTA DIGITAL</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '2px' }}>Perpustakaan Bireuen</p>
                </div>
                <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ADE80', fontSize: '0.65rem', fontWeight: 700 }}>
                  AKTIF
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ background: 'white', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={70} color="#0F172A" />
                </div>
                <div>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{memberInfo.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: '4px', letterSpacing: '0.05em' }}>{memberInfo.member_code}</p>
                  <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Berlaku s/d: {memberInfo.expired_at}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="card" style={{ padding: '8px' }}>
              {[
                { id: 'profile', label: 'Informasi Profil', icon: User },
                { id: 'borrowings', label: 'Peminjaman Aktif', icon: BookOpen, count: borrowings.length },
                { id: 'reservations', label: 'Reservasi Online', icon: Calendar, count: reservations.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeTab === tab.id ? '#EFF6FF' : 'transparent',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left'
                  }}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span style={{ marginLeft: 'auto', background: activeTab === tab.id ? 'var(--primary)' : '#E2E8F0', color: activeTab === tab.id ? 'white' : 'var(--text-secondary)', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column - Tab Content */}
          <div className="card" style={{ padding: '32px', minHeight: '440px' }}>
            
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Detail Profil</h3>
                  {!editMode && (
                    <button onClick={() => setEditMode(true)} style={{ border: '1.5px solid var(--border)', background: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Edit2 size={12} /> Edit Profil
                    </button>
                  )}
                </div>

                {!editMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem', fontWeight: 700 }}>
                        {getInitials(memberInfo.name)}
                      </div>
                      <div>
                        <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{memberInfo.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status Anggota: <strong style={{ color: 'var(--success)' }}>Aktif</strong></p>
                      </div>
                    </div>

                    {[
                      { icon: Mail, label: 'Email', value: memberInfo.email },
                      { icon: Phone, label: 'Nomor Telepon', value: memberInfo.phone },
                      { icon: MapPin, label: 'Alamat', value: memberInfo.address },
                      { icon: Calendar, label: 'Tanggal Bergabung', value: memberInfo.joined_at }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <item.icon size={18} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nama Lengkap</label>
                      <input
                        id="edit-name"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-base"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nomor Telepon</label>
                      <input
                        id="edit-phone"
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="input-base"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Alamat</label>
                      <textarea
                        id="edit-address"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="input-base"
                        rows={3}
                        required
                        style={{ resize: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button type="button" onClick={() => setEditMode(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Batal
                      </button>
                      <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Tab: Borrowings */}
            {activeTab === 'borrowings' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>Peminjaman Aktif</h3>
                
                {borrowings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📚</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Anda tidak sedang meminjam buku.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {borrowings.map((borrow) => (
                      <div key={borrow.id} style={{ display: 'flex', gap: '16px', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ width: '48px', height: '64px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                          <img src={borrow.book.cover} alt={borrow.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{borrow.book.title}</h4>
                          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{borrow.book.author.name}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '10px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} /> Jatuh Tempo: <strong>{borrow.due_date}</strong>
                            </span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: borrow.status === 'overdue' ? '#FDE8E8' : '#EFF6FF', color: borrow.status === 'overdue' ? '#E11D48' : '#2563EB' }}>
                              {borrow.status === 'overdue' ? 'Terlambat' : 'Dipinjam'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Reservations */}
            {activeTab === 'reservations' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>Reservasi Peminjaman</h3>
                
                {reservations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📅</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Belum ada pengajuan reservasi.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reservations.map((reserve) => (
                      <div key={reserve.id} style={{ display: 'flex', gap: '16px', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ width: '48px', height: '64px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                          {reserve.book.cover ? (
                            <img src={reserve.book.cover} alt={reserve.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E2E8F0' }}><BookOpen size={20} color="#94A3B8" /></div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reserve.book.title}</h4>
                            <span style={{ 
                              fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', 
                              background: reserve.status === 'approved' ? '#DCFCE7' : reserve.status === 'rejected' ? '#FEE2E2' : '#FEF3C7', 
                              color: reserve.status === 'approved' ? '#15803D' : reserve.status === 'rejected' ? '#B91C1C' : '#D97706',
                              flexShrink: 0
                            }}>
                              {reserve.status === 'approved' ? 'Disetujui' : reserve.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{reserve.book.author.name}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '10px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> Tgl Pengambilan: <strong>{reserve.reservation_date}</strong>
                            </span>
                            {reserve.notes && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                Catatan: {reserve.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
