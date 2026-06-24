'use client';

import { useState } from 'react';
import { Shield, Check, Save, Info, CheckSquare, Square } from 'lucide-react';

interface PermissionGroup {
  category: string;
  permissions: { id: string; name: string; desc: string }[];
}

const permissionGroups: PermissionGroup[] = [
  {
    category: 'Manajemen Buku',
    permissions: [
      { id: 'book_view', name: 'Lihat Katalog', desc: 'Melihat daftar buku dan lokasi rak.' },
      { id: 'book_create', name: 'Tambah Buku', desc: 'Menambahkan koleksi buku baru.' },
      { id: 'book_edit', name: 'Edit Buku', desc: 'Mengubah deskripsi dan stok buku.' },
      { id: 'book_delete', name: 'Hapus Buku', desc: 'Menghapus buku dari sistem.' },
    ]
  },
  {
    category: 'Manajemen Anggota',
    permissions: [
      { id: 'member_view', name: 'Lihat Anggota', desc: 'Melihat database anggota perpustakaan.' },
      { id: 'member_create', name: 'Tambah Anggota', desc: 'Mendaftarkan anggota baru.' },
      { id: 'member_edit', name: 'Aktivasi Anggota', desc: 'Mengaktifkan / menonaktifkan masa berlaku.' },
    ]
  },
  {
    category: 'Transaksi Peminjaman',
    permissions: [
      { id: 'loan_approve', name: 'Persetujuan Reservasi', desc: 'Menyetujui reservasi online.' },
      { id: 'loan_process', name: 'Proses Peminjaman', desc: 'Input peminjaman & pengembalian buku.' },
      { id: 'loan_fine', name: 'Manajemen Denda', desc: 'Mencatat pelunasan denda.' },
    ]
  }
];

export default function AdminRolePage() {
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'admin' | 'petugas'>('admin');
  
  // Matrix of role -> permission IDs
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    super_admin: ['book_view', 'book_create', 'book_edit', 'book_delete', 'member_view', 'member_create', 'member_edit', 'loan_approve', 'loan_process', 'loan_fine'],
    admin: ['book_view', 'book_create', 'book_edit', 'member_view', 'member_create', 'member_edit', 'loan_approve', 'loan_process', 'loan_fine'],
    petugas: ['book_view', 'member_view', 'loan_approve', 'loan_process', 'loan_fine']
  });

  const [success, setSuccess] = useState(false);

  const togglePermission = (permId: string) => {
    if (selectedRole === 'super_admin') return; // Super admin has full permissions locked

    const currentPerms = rolePermissions[selectedRole];
    const updatedPerms = currentPerms.includes(permId)
      ? currentPerms.filter(id => id !== permId)
      : [...currentPerms, permId];

    setRolePermissions({
      ...rolePermissions,
      [selectedRole]: updatedPerms
    });
  };

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Role & Hak Akses</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Konfigurasi matriks kewenangan akses fitur berdasarkan peran/role pengguna.</p>
        </div>
        <button id="btn-save-roles" onClick={handleSave} className="btn btn-primary" style={{ display: 'flex', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}>
          <Save size={18} /> Simpan Hak Akses
        </button>
      </div>

      {success && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.85rem' }}>
          Matriks hak akses berhasil disimpan dan diperbarui!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '28px', alignItems: 'start' }}>
        
        {/* Left Side: Select Role */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>Pilih Peran</h3>
          {[
            { id: 'super_admin', label: 'Super Admin' },
            { id: 'admin', label: 'Admin' },
            { id: 'petugas', label: 'Petugas' }
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id as any)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '10px', border: 'none',
                background: selectedRole === role.id ? '#EFF6FF' : 'transparent',
                color: selectedRole === role.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: selectedRole === role.id ? 700 : 500,
                fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              <Shield size={16} />
              {role.label}
            </button>
          ))}
        </div>

        {/* Right Side: Permissions Matrix */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Matriks Kewenangan: {selectedRole.replace('_', ' ').toUpperCase()}</h3>
            {selectedRole === 'super_admin' && (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#FEE2E2', color: '#E11D48' }}>
                Full Access Locked
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {permissionGroups.map((group) => (
              <div key={group.category} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>{group.category}</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                  {group.permissions.map((perm) => {
                    const isChecked = rolePermissions[selectedRole].includes(perm.id);
                    return (
                      <div
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        style={{
                          display: 'flex', gap: '10px', alignItems: 'flex-start',
                          padding: '12px', border: '1px solid var(--border)', borderRadius: '10px',
                          cursor: selectedRole === 'super_admin' ? 'not-allowed' : 'pointer',
                          background: isChecked ? '#F8FAFC' : 'white',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ marginTop: '2px', color: isChecked ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{perm.name}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>{perm.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
