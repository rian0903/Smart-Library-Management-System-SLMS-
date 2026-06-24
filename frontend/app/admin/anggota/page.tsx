'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, Users, Mail, Phone, MapPin } from 'lucide-react';
import { mockMembers } from '@/data/mockData';

export default function AdminAnggotaPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    const saved = localStorage.getItem('slms_members');
    if (saved) {
      setMembers(JSON.parse(saved));
    } else {
      setMembers(mockMembers);
    }
  }, []);

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

    if (editMode && currentId !== null) {
      const updated = members.map(m => m.id === currentId ? {
        ...m, name, email, phone, address, status
      } : m);
      saveToLocal(updated);
    } else {
      const newMember = {
        id: Date.now(),
        user_id: Date.now(),
        member_code: `BRN-${Math.floor(10000 + Math.random() * 90000)}`,
        name,
        email,
        phone,
        address,
        joined_at: new Date().toISOString().split('T')[0],
        expired_at: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
        status,
        total_borrows: 0
      };
      saveToLocal([newMember, ...members]);
    }

    closeModal();
  };

  const handleEdit = (member: any) => {
    setEditMode(true);
    setCurrentId(member.id);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setAddress(member.address);
    setStatus(member.status);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      const updated = members.filter(m => m.id !== id);
      saveToLocal(updated);
    }
  };

  const toggleStatus = (id: number) => {
    const updated = members.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: m.status === 'active' ? 'inactive' : 'active'
        };
      }
      return m;
    });
    saveToLocal(updated);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setStatus('active');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Manajemen Anggota</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kelola data anggota perpustakaan, masa aktif, dan aktivasi kartu digital.</p>
        </div>
        <button id="btn-add-member" onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}>
          <Plus size={18} /> Tambah Anggota
        </button>
      </div>

      {/* Filter / Search bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="member-search"
            type="text"
            placeholder="Cari berdasarkan nama, kode anggota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
            style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="table-base" style={{ width: '100%', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kode Anggota</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nama</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kontak</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Masa Aktif</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada data anggota ditemukan.</td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{m.member_code}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Pinjam: {m.total_borrows || 0} buku</p>
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
                    <button
                      onClick={() => toggleStatus(m.id)}
                      style={{
                        padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        fontSize: '0.7rem', fontWeight: 700,
                        background: m.status === 'active' ? '#DCFCE7' : '#FEE2E2',
                        color: m.status === 'active' ? '#15803D' : '#B91C1C',
                        transition: 'all 0.15s'
                      }}
                    >
                      {m.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(m)} style={{ width: '32px', height: '32px', border: '1.5px solid var(--border)', background: 'white', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} style={{ width: '32px', height: '32px', border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '480px', padding: '28px', margin: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>
              {editMode ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nama Lengkap</label>
                <input
                  id="modal-member-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama anggota"
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
                <input
                  id="modal-member-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nomor Telepon</label>
                <input
                  id="modal-member-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Alamat</label>
                <textarea
                  id="modal-member-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat rumah lengkap"
                  className="input-base"
                  rows={2}
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              {editMode && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Status</label>
                  <select
                    id="modal-member-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="input-base"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '10px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.875rem' }}>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
