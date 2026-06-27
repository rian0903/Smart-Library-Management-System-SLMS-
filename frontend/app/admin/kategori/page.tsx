'use client';

import { useState, useEffect } from 'react';
import { mockCategories } from '@/data/mockData';
import { BookCategory } from '@/types';
import { Tag, Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BookCategory | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('📖');
  const [color, setColor] = useState('#3B82F6');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('slms_categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(mockCategories);
      localStorage.setItem('slms_categories', JSON.stringify(mockCategories));
    }
  }, []);

  const saveToStorage = (updatedList: BookCategory[]) => {
    setCategories(updatedList);
    localStorage.setItem('slms_categories', JSON.stringify(updatedList));
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setIcon('📖');
    setColor('#3B82F6');
    setShowModal(true);
  };

  const handleOpenEdit = (cat: BookCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon || '📖');
    setColor(cat.color || '#3B82F6');
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      // Edit
      const updated = categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name, slug, icon, color } 
          : cat
      );
      saveToStorage(updated);
    } else {
      // Add
      const newCat: BookCategory = {
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name,
        slug,
        icon,
        color,
        book_count: 0
      };
      saveToStorage([...categories, newCat]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      const updated = categories.filter(c => c.id !== id);
      saveToStorage(updated);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '4px' }}>
            Manajemen Kategori Buku
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Kelola kategori klasifikasi buku untuk memudahkan pencarian katalog anggota.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      {/* Main Card */}
      <div className="card" style={{ background: 'var(--card)', padding: '24px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block" style={{ overflowX: 'auto' }}>
          <table className="table-base">
            <thead>
              <tr>
                <th>Ikon</th>
                <th>Nama Kategori</th>
                <th>Slug URL</th>
                <th>Warna Tema</th>
                <th>Jumlah Buku</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <span style={{ fontSize: '1.25rem' }}>{cat.icon || '📖'}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'var(--bg)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                        {cat.slug}
                      </code>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: cat.color || '#3B82F6' }} />
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{cat.color}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{cat.book_count || 0} Buku</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          style={{
                            padding: '6px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: 'transparent', color: 'var(--primary)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Ubah Kategori"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          style={{
                            padding: '6px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: 'transparent', color: 'var(--danger)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Hapus Kategori"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Tidak ada kategori ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card View - Mobile */}
        <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div key={cat.id} style={{ padding: '14px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{cat.icon || '📖'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</p>
                    <code style={{ fontSize: '0.72rem', padding: '1px 4px', background: 'var(--card)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{cat.slug}</code>
                  </div>
                  <span className="badge badge-gray">{cat.book_count || 0} Buku</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: cat.color || '#3B82F6' }} />
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{cat.color}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <button onClick={() => handleOpenEdit(cat)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Tidak ada kategori ditemukan</div>
          )}
        </div>
      </div>

      {/* CRUD Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '480px', padding: '24px', background: 'var(--card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={20} color="var(--primary)" />
                {editingCategory ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Pemrograman, Sastra"
                  className="input-base"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Slug URL (Otomatis)</label>
                <input
                  type="text"
                  required
                  disabled
                  value={slug}
                  className="input-base"
                  style={{ background: 'var(--bg)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Emoji Ikon</label>
                  <input
                    type="text"
                    required
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Contoh: 💻"
                    className="input-base"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Warna Hex</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      style={{ width: '42px', height: '42px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      required
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#3B82F6"
                      className="input-base"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                  style={{ border: '1px solid var(--border)' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
