'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid, List, SlidersHorizontal, X, BookOpen, Star, ChevronDown } from 'lucide-react';
import { mockBooks, mockCategories } from '@/data/mockData';
import { truncate, getStatusLabel } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

export default function KatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const years = Array.from(new Set(mockBooks.map((b) => b.year))).sort((a, b) => b - a);

  const filtered = useMemo(() => {
    return mockBooks.filter((book) => {
      const matchSearch = !search ||
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.name.toLowerCase().includes(search.toLowerCase()) ||
        book.isbn.includes(search);
      const matchCat = !selectedCategory || book.category.slug === selectedCategory;
      const matchYear = !selectedYear || book.year === parseInt(selectedYear);
      return matchSearch && matchCat && matchYear;
    });
  }, [search, selectedCategory, selectedYear]);

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);
  const hasFilters = search || selectedCategory || selectedYear;

  function clearFilters() {
    setSearch('');
    setSelectedCategory('');
    setSelectedYear('');
    setCurrentPage(1);
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)', padding: '40px 0' }}>
        <div className="page-container">
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Katalog Buku
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            Temukan dari {mockBooks.length}+ koleksi buku perpustakaan
          </p>
        </div>
      </div>

      <div className="page-container" style={{ padding: '32px 24px' }}>
        {/* Search + Filter Bar */}
        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="katalog-search"
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Cari judul, penulis, ISBN..."
                className="input-base"
                style={{ paddingLeft: '44px' }}
              />
            </div>

            {/* Category */}
            <div style={{ position: 'relative', minWidth: '160px' }}>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="input-base"
                style={{ appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
              >
                <option value="">Semua Kategori</option>
                {mockCategories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            </div>

            {/* Year */}
            <div style={{ position: 'relative', minWidth: '130px' }}>
              <select
                id="filter-year"
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                className="input-base"
                style={{ appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
              >
                <option value="">Semua Tahun</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            </div>

            {/* View toggle */}
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '10px', padding: '4px', gap: '2px' }}>
              <button
                id="view-grid"
                onClick={() => setViewMode('grid')}
                style={{ padding: '7px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: viewMode === 'grid' ? 'white' : 'transparent', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
              ><Grid size={16} /></button>
              <button
                id="view-list"
                onClick={() => setViewMode('list')}
                style={{ padding: '7px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
              ><List size={16} /></button>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
              >
                <X size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> buku
            {hasFilters && <span style={{ color: 'var(--primary)', fontWeight: 600 }}> (difilter)</span>}
          </p>
          {hasFilters && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {search && <span className="badge badge-primary">Cari: {truncate(search, 20)}</span>}
              {selectedCategory && <span className="badge badge-primary">{mockCategories.find(c => c.slug === selectedCategory)?.name}</span>}
              {selectedYear && <span className="badge badge-primary">{selectedYear}</span>}
            </div>
          )}
        </div>

        {/* Books Grid */}
        {paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Tidak ada buku ditemukan
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Coba ubah kata kunci atau hapus filter yang aktif
            </p>
            <button onClick={clearFilters} className="btn btn-primary">Reset Filter</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {paginated.map((book, i) => (
              <Link
                key={book.id}
                href={`/katalog/${book.id}`}
                className="card card-hover animate-fade-in"
                style={{ textDecoration: 'none', overflow: 'hidden', animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                {/* Cover */}
                <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#F1F5F9' }}>
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' }}>
                      <BookOpen size={36} color="#6366F1" />
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: book.category.color + '18', color: book.category.color }}>
                    {book.category.name}
                  </span>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '4px', lineHeight: 1.3 }}>
                    {truncate(book.title, 38)}
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{book.author.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontSize: '0.775rem', fontWeight: 700 }}>{book.rating}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: book.available_stock > 0 ? '#DCFCE7' : '#FEE2E2', color: book.available_stock > 0 ? '#15803D' : '#B91C1C' }}>
                      {book.available_stock > 0 ? 'Tersedia' : 'Habis'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paginated.map((book, i) => (
              <Link
                key={book.id}
                href={`/katalog/${book.id}`}
                className="card animate-fade-in"
                style={{ display: 'flex', gap: '20px', padding: '16px', textDecoration: 'none', transition: 'all 0.2s', animationDelay: `${i * 0.04}s`, opacity: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{ width: '72px', height: '100px', borderRadius: '10px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                  {book.cover ? <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)' }}><BookOpen size={28} color="#6366F1" /></div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{book.title}</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '8px', flexShrink: 0, background: book.available_stock > 0 ? '#DCFCE7' : '#FEE2E2', color: book.available_stock > 0 ? '#15803D' : '#B91C1C' }}>
                      {book.available_stock > 0 ? `${book.available_stock} Tersedia` : 'Habis'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{book.author.name} • {book.year}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '10px' }}>{truncate(book.description, 120)}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: book.category.color + '18', color: book.category.color }}>{book.category.name}</span>
                    <span className="badge badge-gray">ISBN: {book.isbn}</span>
                    <span className="badge badge-gray">{book.shelf?.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '8px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            >
              ← Sebelumnya
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid', borderColor: currentPage === page ? 'var(--primary)' : 'var(--border)', background: currentPage === page ? 'var(--primary)' : 'white', color: currentPage === page ? 'white' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '8px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            >
              Berikutnya →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
