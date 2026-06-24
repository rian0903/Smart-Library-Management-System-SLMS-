'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Download, Upload, QrCode, BookOpen,
  Edit, Trash2, Eye, ChevronDown, X, Filter,
} from 'lucide-react';
import { mockBooks, mockCategories } from '@/data/mockData';
import { truncate, getStatusLabel } from '@/lib/utils';

export default function AdminBukuPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const perPage = 10;

  const filtered = mockBooks.filter((b) => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.name.toLowerCase().includes(search.toLowerCase()) || b.code.includes(search);
    const matchCat = !selectedCat || b.category.slug === selectedCat;
    const matchStatus = !selectedStatus || b.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  function toggleSelect(id: number) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'available', label: 'Tersedia' },
    { value: 'out_of_stock', label: 'Habis' },
    { value: 'lost', label: 'Hilang' },
  ];

  const statusColors: Record<string, { bg: string; color: string }> = {
    available: { bg: '#DCFCE7', color: '#15803D' },
    out_of_stock: { bg: '#FEE2E2', color: '#B91C1C' },
    lost: { bg: '#FEF3C7', color: '#B45309' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Manajemen Buku
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Total {mockBooks.length} koleksi buku perpustakaan
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.color = '#15803D'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Upload size={16} /> Import Excel
          </button>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.color = '#B45309'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Download size={16} /> Export
          </button>
          <Link
            href="/admin/buku/tambah"
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Tambah Buku
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="buku-search"
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari kode, judul, penulis..."
              className="input-base"
              style={{ paddingLeft: '38px', height: '38px', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select value={selectedCat} onChange={(e) => { setSelectedCat(e.target.value); setPage(1); }} className="input-base" style={{ height: '38px', appearance: 'none', paddingRight: '30px', paddingLeft: '12px', fontSize: '0.85rem', minWidth: '150px', cursor: 'pointer' }}>
              <option value="">Semua Kategori</option>
              {mockCategories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }} className="input-base" style={{ height: '38px', appearance: 'none', paddingRight: '30px', paddingLeft: '12px', fontSize: '0.85rem', minWidth: '140px', cursor: 'pointer' }}>
              {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>

          {(search || selectedCat || selectedStatus) && (
            <button onClick={() => { setSearch(''); setSelectedCat(''); setSelectedStatus(''); setPage(1); }} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
              <X size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: '#EFF6FF', border: '1.5px solid #BFDBFE' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
            {selectedIds.length} buku dipilih
          </span>
          <div style={{ width: '1px', height: '20px', background: '#BFDBFE' }} />
          <button style={{ fontSize: '0.8rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Hapus Terpilih</button>
          <button style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Export Terpilih</button>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{paginated.length}</strong> dari <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> buku
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-base">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={(e) => setSelectedIds(e.target.checked ? paginated.map(b => b.id) : [])}
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th>Kode</th>
                <th>Judul Buku</th>
                <th>Penulis</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Rak</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((book) => {
                const sc = statusColors[book.status] || { bg: '#F1F5F9', color: '#475569' };
                return (
                  <tr key={book.id}>
                    <td>
                      <input type="checkbox" checked={selectedIds.includes(book.id)} onChange={() => toggleSelect(book.id)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)', background: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>
                        {book.code}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '54px', borderRadius: '6px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                          {book.cover ? <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <BookOpen size={20} color="#94A3B8" style={{ margin: '17px 10px' }} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                            {truncate(book.title, 35)}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ISBN: {book.isbn}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{book.author.name}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: book.category.color + '18', color: book.category.color }}>
                        {book.category.name}
                      </span>
                    </td>
                    <td>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: book.available_stock > 0 ? '#22C55E' : '#EF4444' }}>
                          {book.available_stock}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>dari {book.stock}</p>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '8px', background: sc.bg, color: sc.color }}>
                        {getStatusLabel(book.status)}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{book.shelf?.code || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button title="QR Code" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#8B5CF6'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                        ><QrCode size={14} /></button>
                        <Link href={`/admin/buku/${book.id}`} title="Detail" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s', textDecoration: 'none' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#3B82F6'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                        ><Eye size={14} /></Link>
                        <Link href={`/admin/buku/${book.id}/edit`} title="Edit" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s', textDecoration: 'none' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.color = '#22C55E'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                        ><Edit size={14} /></Link>
                        <button title="Hapus" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'white'; }}
                        ><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Halaman {page} dari {totalPages}
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>← Sebelumnya</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1.5px solid', borderColor: page === p ? 'var(--primary)' : 'var(--border)', background: page === p ? 'var(--primary)' : 'white', color: page === p ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Berikutnya →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
