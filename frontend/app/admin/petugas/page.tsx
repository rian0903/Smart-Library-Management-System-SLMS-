'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, Mail, Calendar, UserCheck } from 'lucide-react';
import { mockUsers } from '@/data/mockData';
import { getRoleLabel } from '@/lib/utils';

export default function AdminPetugasPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'petugas'>('petugas');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('slms_staff');
    if (saved) {
      setStaff(JSON.parse(saved));
    } else {
      // Filter super_admin/admin/petugas
      setStaff(mockUsers.filter(u => u.role !== 'user'));
    }
  }, []);

  const saveToLocal = (data: any[]) => {
    setStaff(data);
    localStorage.setItem('slms_staff', JSON.stringify(data));
  };

  const filtered = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editMode && currentId !== null) {
      const updated = staff.map(s => s.id === currentId ? {
        ...s, name, email, role, is_active: isActive
      } : s);
      saveToLocal(updated);
    } else {
      const newStaff = {
        id: Date.now(),
        name,
        email,
        role,
        is_active: isActive,
        created_at: new Date().toISOString().split('T')[0]
      };
      saveToLocal([newStaff, ...staff]);
    }

    closeModal();
  };

  const handleEdit = (s: any) => {
    setEditMode(true);
    setCurrentId(s.id);
    setName(s.name);
    setEmail(s.email);
    setRole(s.role);
    setIsActive(s.is_active);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus petugas ini?')) {
      const updated = staff.filter(s => s.id !== id);
      saveToLocal(updated);
    }
  };

  const toggleActive = (id: number) => {
    const updated = staff.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s);
    saveToLocal(updated);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setName('');
    setEmail('');
    setRole('petugas');
    setIsActive(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Manajemen Petugas</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kelola akun petugas perpustakaan, tingkat hak akses, dan status keaktifan staf.</p>
        </div>
        <button id="btn-add-staff" onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}>
          <Plus size={18} /> Tambah Petugas
        </button>
      </div>

      {/* Filter / Search */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="staff-search"
            type="text"
            placeholder="Cari nama atau email petugas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
            style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Staff Table - Desktop */}
      <div className="card hidden md:block" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="table-base" style={{ width: '100%', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nama Petugas</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peran / Role</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada data petugas.</td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #E0E7FF, #EEF2F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontWeight: 700, fontSize: '0.8rem' }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Terdaftar: {s.created_at?.split('T')[0] || '2025-01-01'}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12} /> {s.email}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: s.role === 'super_admin' ? '#FDE8E8' : s.role === 'admin' ? '#FEF3C7' : '#E0E7FF', color: s.role === 'super_admin' ? '#E11D48' : s.role === 'admin' ? '#D97706' : '#4F46E5' }}>
                      {getRoleLabel(s.role)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleActive(s.id)}
                      disabled={s.role === 'super_admin'}
                      style={{
                        padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: s.role === 'super_admin' ? 'not-allowed' : 'pointer',
                        fontSize: '0.7rem', fontWeight: 700,
                        background: s.is_active ? '#DCFCE7' : '#FEE2E2',
                        color: s.is_active ? '#15803D' : '#B91C1C',
                        opacity: s.role === 'super_admin' ? 0.6 : 1,
                        transition: 'all 0.15s'
                      }}
                    >
                      {s.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    {s.role !== 'super_admin' && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleEdit(s)} style={{ width: '32px', height: '32px', border: '1.5px solid var(--border)', background: 'white', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(s.id)} style={{ width: '32px', height: '32px', border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
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
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada data petugas.</div>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #E0E7FF, #EEF2F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: s.role === 'super_admin' ? '#FDE8E8' : s.role === 'admin' ? '#FEF3C7' : '#E0E7FF', color: s.role === 'super_admin' ? '#E11D48' : s.role === 'admin' ? '#D97706' : '#4F46E5' }}>
                  {getRoleLabel(s.role)}
                </span>
                <button
                  onClick={() => toggleActive(s.id)}
                  disabled={s.role === 'super_admin'}
                  style={{ padding: '3px 8px', borderRadius: '8px', border: 'none', cursor: s.role === 'super_admin' ? 'not-allowed' : 'pointer', fontSize: '0.7rem', fontWeight: 700, background: s.is_active ? '#DCFCE7' : '#FEE2E2', color: s.is_active ? '#15803D' : '#B91C1C', opacity: s.role === 'super_admin' ? 0.6 : 1 }}
                >
                  {s.is_active ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
              {s.role !== 'super_admin' && (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <button onClick={() => handleEdit(s)} style={{ padding: '6px 12px', border: '1.5px solid var(--border)', background: 'white', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(s.id)} style={{ padding: '6px 12px', border: '1.5px solid #FCA5A5', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '440px', padding: '28px', margin: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>
              {editMode ? 'Edit Akun Petugas' : 'Tambah Petugas Baru'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nama Petugas</label>
                <input
                  id="modal-staff-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama petugas"
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
                <input
                  id="modal-staff-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@bireuen.go.id"
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Tingkat Peran</label>
                <select
                  id="modal-staff-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="input-base"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="petugas">Petugas Perpustakaan</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Status Aktif</label>
                <select
                  id="modal-staff-active"
                  value={isActive ? 'yes' : 'no'}
                  onChange={(e) => setIsActive(e.target.value === 'yes')}
                  className="input-base"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="yes">Aktif</option>
                  <option value="no">Nonaktif</option>
                </select>
              </div>

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
