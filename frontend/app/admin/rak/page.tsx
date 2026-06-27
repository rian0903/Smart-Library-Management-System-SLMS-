'use client';

import { useState, useEffect } from 'react';
import { mockBooks } from '@/data/mockData';
import { Library, Plus, Edit2, Trash2, Search, X, Layers } from 'lucide-react';

interface Shelf {
  id: number;
  code: string;
  location: string;
  floor: string;
  book_count: number;
}

export default function AdminRakPage() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [floor, setFloor] = useState('Lantai 1');

  // Load from local storage or seed from mockBooks on mount
  useEffect(() => {
    const saved = localStorage.getItem('slms_shelves');
    if (saved) {
      setShelves(JSON.parse(saved));
    } else {
      // Extract unique shelves from mockBooks
      const shelfMap = new Map<string, { id: number; location: string; floor: string; count: number }>();
      mockBooks.forEach(book => {
        if (book.shelf) {
          const key = book.shelf.code;
          const current = shelfMap.get(key) || { 
            id: book.shelf.id || Math.random(), 
            location: book.shelf.location, 
            floor: book.shelf.floor,
            count: 0 
          };
          shelfMap.set(key, { ...current, count: current.count + 1 });
        }
      });

      const initialShelves: Shelf[] = Array.from(shelfMap.entries()).map(([code, data], idx) => ({
        id: idx + 1,
        code,
        location: data.location,
        floor: data.floor,
        book_count: data.count
      }));

      setShelves(initialShelves);
      localStorage.setItem('slms_shelves', JSON.stringify(initialShelves));
    }
  }, []);

  const saveToStorage = (updatedList: Shelf[]) => {
    setShelves(updatedList);
    localStorage.setItem('slms_shelves', JSON.stringify(updatedList));
  };

  const handleOpenAdd = () => {
    setEditingShelf(null);
    setCode('');
    setLocation('');
    setFloor('Lantai 1');
    setShowModal(true);
  };

  const handleOpenEdit = (shelf: Shelf) => {
    setEditingShelf(shelf);
    setCode(shelf.code);
    setLocation(shelf.location);
    setFloor(shelf.floor);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !location.trim()) return;

    if (editingShelf) {
      // Edit
      const updated = shelves.map(s =>
        s.id === editingShelf.id
          ? { ...s, code, location, floor }
          : s
      );
      saveToStorage(updated);
    } else {
      // Add
      const newShelf: Shelf = {
        id: shelves.length > 0 ? Math.max(...shelves.map(s => s.id)) + 1 : 1,
        code,
        location,
        floor,
        book_count: 0
      };
      saveToStorage([...shelves, newShelf]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus rak ini?')) {
      const updated = shelves.filter(s => s.id !== id);
      saveToStorage(updated);
    }
  };

  const filteredShelves = shelves.filter(shelf =>
    shelf.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelf.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelf.floor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '4px' }}>
            Manajemen Rak Buku (Lokasi)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Kelola layout lokasi rak dan lantai penyimpanan buku untuk memandu pengunjung perpustakaan offline.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Tambah Rak
        </button>
      </div>

      {/* Main Card */}
      <div className="card" style={{ background: 'var(--card)', padding: '24px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Cari kode rak, nama, atau lantai..."
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
                <th>Kode Rak</th>
                <th>Nama Lokasi</th>
                <th>Lantai Gedung</th>
                <th>Buku Terisi</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredShelves.length > 0 ? (
                filteredShelves.map((shelf) => (
                  <tr key={shelf.id}>
                    <td>
                      <code style={{ fontSize: '0.85rem', fontWeight: 700, padding: '4px 8px', background: 'var(--bg)', borderRadius: '6px', color: 'var(--primary)' }}>
                        {shelf.code}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{shelf.location}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Layers size={14} />
                        <span>{shelf.floor}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-success">{shelf.book_count || 0} Judul Buku</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEdit(shelf)}
                          style={{
                            padding: '6px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: 'transparent', color: 'var(--primary)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Ubah Rak"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(shelf.id)}
                          style={{
                            padding: '6px', borderRadius: '8px', border: '1px solid var(--border)',
                            background: 'transparent', color: 'var(--danger)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          title="Hapus Rak"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    Tidak ada rak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card View - Mobile */}
        <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredShelves.length > 0 ? (
            filteredShelves.map((shelf) => (
              <div key={shelf.id} style={{ padding: '14px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <code style={{ fontSize: '0.85rem', fontWeight: 700, padding: '3px 8px', background: 'var(--card)', borderRadius: '6px', color: 'var(--primary)' }}>{shelf.code}</code>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}>{shelf.location}</p>
                  </div>
                  <span className="badge badge-success">{shelf.book_count || 0} Buku</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '10px' }}>
                  <Layers size={14} />
                  <span>{shelf.floor}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <button onClick={() => handleOpenEdit(shelf)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(shelf.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Tidak ada rak ditemukan</div>
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
                <Library size={20} color="var(--primary)" />
                {editingShelf ? 'Ubah Data Rak' : 'Tambah Rak Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Kode Rak</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Contoh: A-01, B-03"
                    className="input-base"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Nama Rak / Lokasi</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Rak A, Rak Referensi"
                    className="input-base"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Lantai Gedung</label>
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="input-base"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Lantai 1">Lantai 1 (Koleksi Utama & Anak)</option>
                  <option value="Lantai 2">Lantai 2 (Koleksi Ilmiah & Novel)</option>
                  <option value="Lantai 3">Lantai 3 (Referensi & Jurnal)</option>
                </select>
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
                  {editingShelf ? 'Simpan Perubahan' : 'Tambah Rak'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
