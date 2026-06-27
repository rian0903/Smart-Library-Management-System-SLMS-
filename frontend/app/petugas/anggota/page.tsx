'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Eye, CheckCircle, Mail, Phone, MapPin, QrCode, X, CreditCard } from 'lucide-react';
import { mockMembers } from '@/data/mockData';
import MemberCard from '@/components/shared/MemberCard';

export default function PetugasAnggotaPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('slms_members');
    if (saved) {
      setMembers(JSON.parse(saved));
    } else {
      setMembers(mockMembers);
    }
  }, [successMsg]);

  const saveToLocal = (data: any[]) => {
    setMembers(data);
    localStorage.setItem('slms_members', JSON.stringify(data));
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.member_code.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) return;

    const memberCode = `ANG-${String(members.length + 1).padStart(5, '0')}`;
    const joinedAt = new Date().toISOString().split('T')[0];
    const expiredAt = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0];

    const newMember = {
      id: Date.now(),
      user_id: Date.now(),
      member_code: memberCode,
      name,
      email,
      phone,
      address,
      joined_at: joinedAt,
      expired_at: expiredAt,
      status: 'active' as const,
      total_borrows: 0,
      qr_code: `${memberCode}|${name}|${expiredAt}`,
    };

    saveToLocal([newMember, ...members]);
    setSuccessMsg(`Anggota baru "${name}" berhasil didaftarkan dengan kode ${memberCode}`);
    setTimeout(() => setSuccessMsg(''), 5000);
    closeModal();

    // Show the card for the new member
    setSelectedMember(newMember);
    setShowCardModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  const viewCard = (member: any) => {
    setSelectedMember(member);
    setShowCardModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title block */}
      <div className="flex flex-col sm:flex-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Manajemen Anggota</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Daftarkan anggota baru dan kelola data keanggotaan perpustakaan.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}>
          <Plus size={18} /> Daftar Anggota Baru
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* Search */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Cari berdasarkan nama, kode anggota, atau email..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-base" style={{ paddingLeft: '38px', fontSize: '0.85rem' }} />
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="card hidden md:block" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="table-base" style={{ width: '100%', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kode</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nama</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kontak</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Masa Aktif</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada data anggota ditemukan.</td></tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 700, color: '#22C55E' }}>{m.member_code}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #DCFCE7, #F0FDF4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', fontWeight: 700, fontSize: '0.8rem' }}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pinjam: {m.total_borrows || 0} buku</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {m.email}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {m.phone}</p>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <p>Bergabung: {m.joined_at}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Kadaluarsa: {m.expired_at}</p>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '8px', border: 'none',
                      fontSize: '0.7rem', fontWeight: 700,
                      background: m.status === 'active' ? '#DCFCE7' : m.status === 'expired' ? '#FEF3C7' : '#FEE2E2',
                      color: m.status === 'active' ? '#15803D' : m.status === 'expired' ? '#D97706' : '#B91C1C',
                    }}>
                      {m.status === 'active' ? 'Aktif' : m.status === 'expired' ? 'Kadaluarsa' : 'Nonaktif'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <button onClick={() => viewCard(m)} style={{ width: '32px', height: '32px', border: '1.5px solid var(--border)', background: 'white', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Lihat Kartu Anggota">
                      <CreditCard size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada data anggota ditemukan.</div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #DCFCE7, #F0FDF4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: 600 }}>{m.member_code}</p>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, background: m.status === 'active' ? '#DCFCE7' : '#FEE2E2', color: m.status === 'active' ? '#15803D' : '#B91C1C' }}>
                  {m.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12} /> {m.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} /> {m.phone}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <button onClick={() => viewCard(m)} style={{ padding: '6px 12px', border: '1.5px solid var(--border)', background: 'white', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CreditCard size={13} /> Lihat Kartu
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '480px', padding: '28px', margin: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>Daftar Anggota Baru</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nama Lengkap</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama lengkap" className="input-base" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" className="input-base" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nomor Telepon</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 08123456789" className="input-base" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Alamat</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat rumah lengkap" className="input-base" rows={2} style={{ resize: 'none' }} required />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '10px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.875rem' }}>
                  Daftarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Preview Modal */}
      {showCardModal && selectedMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '460px', padding: '28px', margin: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Kartu Anggota</h3>
              <button onClick={() => setShowCardModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <MemberCard
              memberCode={selectedMember.member_code}
              name={selectedMember.name}
              email={selectedMember.email}
              expiryDate={selectedMember.expired_at}
              status={selectedMember.status === 'active' ? 'active' : selectedMember.status === 'expired' ? 'expired' : 'inactive'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
