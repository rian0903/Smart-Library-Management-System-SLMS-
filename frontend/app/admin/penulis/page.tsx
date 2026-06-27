'use client';

import { useState, useEffect } from 'react';
import { mockBooks } from '@/data/mockData';
import { User, Plus, Edit2, Trash2, Search, X, BookOpen } from 'lucide-react';

interface Author {
  id: number;
  name: string;
  bio: string;
  book_count: number;
}

export default function AdminPenulisPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // Extract initial authors list from mockBooks on mount if storage is empty
  useEffect(() => {
    const saved = localStorage.getItem('slms_authors');
    if (saved) {
      setAuthors(JSON.parse(saved));
    } else {
      // Get unique authors from mockBooks
      const authorMap = new Map<string, { id: number; count: number }>();
      mockBooks.forEach(book => {
        if (book.author) {
          const key = book.author.name;
          const current = authorMap.get(key) || { id: book.author.id || Math.random(), count: 0 };
          authorMap.set(key, { id: current.id, count: current.count + 1 });
        }
      });

      const initialAuthors: Author[] = Array.from(authorMap.entries()).map(([name, data], idx) => ({
        id: idx + 1,
        name,
        bio: `Penulis ternama Indonesia yang telah berkontribusi dalam berbagai karya literatur ilmiah maupun populer.`,
        book_count: data.count
      }));

      setAuthors(initialAuthors);
      localStorage.setItem('slms_authors', JSON.stringify(initialAuthors));
    }
  }, []);

  const saveToStorage = (updatedList: Author[]) => {
    setAuthors(updatedList);
    localStorage.setItem('slms_authors', JSON.stringify(updatedList));
  };

  const handleOpenAdd = () => {
    setEditingAuthor(null);
    setName('');
    setBio('');
    setShowModal(true);
  };

  const handleOpenEdit = (auth: Author) => {
    setEditingAuthor(auth);
    setName(auth.name);
    setBio(auth.bio);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingAuthor) {
      // Edit
      const updated = authors.map(auth =>
        auth.id === editingAuthor.id
          ? { ...auth, name, bio }
          : auth
      );
      saveToStorage(updated);
    } else {
      // Add
      const newAuth: Author = {
        id: authors.length > 0 ? Math.max(...authors.map(a => a.id)) + 1 : 1,
        name,
        bio: bio || 'Tidak ada deskripsi biografi.',
        book_count: 0
      };
      saveToStorage([...authors, newAuth]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus penulis ini?')) {
      const updated = authors.filter(a => a.id !== id);
      saveToStorage(updated);
    }
  };

  const filteredAuthors = authors.filter(auth =>
    auth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auth.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '4px' }}>
            Manajemen Penulis Buku
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Kelola data biografi penulis yang bukunya terdaftar di Perpustakaan Kabupaten Bireuen.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Tambah Penulis
        </button>
      </div>

      {/* Main Card */}
      <div className="card" style={{ background: 'var(--card)', padding: '24px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Cari penulis atau biografi..."
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
                <th>Nama Penulis</th>
                <th>Biografi / Deskripsi Singkat</th>
                <th>Koleksi Buku</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.length > 0 ? (
                filteredAuthors.map((auth) => (
                  <tr key={auth.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem'
                        }}>
                          {auth.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{auth.name}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {auth.bio}
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={12} /> {auth.book_count} Judul
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEdit(auth)}
                          style={{
                            padding: '6px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: 'transparent', color: 'var(--primary)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Ubah Penulis"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(auth.id)}
                          style={{
                            padding: '6px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: 'transparent', color: 'var(--danger)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Hapus Penulis"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Tidak ada penulis ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card View - Mobile */}
        <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAuthors.length > 0 ? (
            filteredAuthors.map((auth) => (
              <div key={auth.id} style={{ padding: '14px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                    {auth.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{auth.name}</p>
                    <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <BookOpen size={12} /> {auth.book_count} Judul
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>{auth.bio}</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <button onClick={() => handleOpenEdit(auth)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(auth.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Tidak ada penulis ditemukan</div>
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
                <User size={20} color="var(--primary)" />
                {editingAuthor ? 'Ubah Data Penulis' : 'Tambah Penulis Baru'}
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Nama Penulis</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi, Pramoedya Ananta Toer"
                  className="input-base"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Biografi / Deskripsi</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Masukkan biografi singkat penulis..."
                  className="input-base"
                  style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                />
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
                  {editingAuthor ? 'Simpan Perubahan' : 'Tambah Penulis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
