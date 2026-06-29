'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Download, Upload, QrCode, BookOpen,
  Edit, Trash2, Eye, ChevronDown, X, Filter, CheckCircle2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { mockBooks, mockCategories } from '@/data/mockData';
import { truncate, getStatusLabel, logAudit } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function AdminBukuPage() {
  const { user } = useAuthStore();
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const perPage = 10;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Form state
  const [fTitle, setFTitle] = useState('');
  const [fCode, setFCode] = useState('');
  const [fIsbn, setFIsbn] = useState('');
  const [fAuthor, setFAuthor] = useState('');
  const [fPublisher, setFPublisher] = useState('');
  const [fCity, setFCity] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fShelfCode, setFShelfCode] = useState('');
  const [fShelfLocation, setFShelfLocation] = useState('');
  const [fShelfFloor, setFShelfFloor] = useState('');
  const [fYear, setFYear] = useState(new Date().getFullYear());
  const [fStock, setFStock] = useState(1);
  const [fDescription, setFDescription] = useState('');
  const [fCover, setFCover] = useState('');

  // QR Modal
  const [qrBook, setQrBook] = useState<any | null>(null);

  // Alert
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('slms_books');
    if (saved) {
      setBooks(JSON.parse(saved));
    } else {
      setBooks(mockBooks);
    }
  }, []);

  const saveToLocal = (data: any[]) => {
    setBooks(data);
    localStorage.setItem('slms_books', JSON.stringify(data));
  };

  const showAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const filtered = books.filter((b) => {
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

  const openAddModal = () => {
    setEditMode(false);
    setCurrentId(null);
    const maxCode = books.reduce((max, b) => {
      const num = parseInt(b.code.replace('BKN-', ''));
      return num > max ? num : max;
    }, 0);
    setFCode(`BKN-${String(maxCode + 1).padStart(3, '0')}`);
    setFTitle(''); setFIsbn(''); setFAuthor(''); setFPublisher(''); setFCity('');
    setFCategory(mockCategories[0]?.slug || ''); setFShelfCode(''); setFShelfLocation(''); setFShelfFloor('Lantai 1');
    setFYear(new Date().getFullYear()); setFStock(1); setFDescription(''); setFCover('');
    setShowModal(true);
  };

  const openEditModal = (book: any) => {
    setEditMode(true);
    setCurrentId(book.id);
    setFTitle(book.title); setFCode(book.code); setFIsbn(book.isbn);
    setFAuthor(book.author.name); setFPublisher(book.publisher.name); setFCity(book.publisher.city || '');
    setFCategory(book.category.slug); setFShelfCode(book.shelf?.code || ''); setFShelfLocation(book.shelf?.location || '');
    setFShelfFloor(book.shelf?.floor || 'Lantai 1');
    setFYear(book.year); setFStock(book.stock); setFDescription(book.description); setFCover(book.cover || '');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditMode(false); setCurrentId(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitle || !fCode || !fAuthor) return;

    const cat = mockCategories.find(c => c.slug === fCategory) || mockCategories[0];
    const shelf = fShelfCode ? { id: Date.now(), code: fShelfCode, location: fShelfLocation, floor: fShelfFloor } : undefined;
    const availStock = editMode ? (() => {
      const existing = books.find(b => b.id === currentId);
      const borrowed = existing ? existing.stock - existing.available_stock : 0;
      return Math.max(0, fStock - borrowed);
    })() : fStock;

    if (editMode && currentId !== null) {
      const updated = books.map(b => b.id === currentId ? {
        ...b, title: fTitle, code: fCode, isbn: fIsbn,
        author: { ...b.author, name: fAuthor },
        publisher: { ...b.publisher, name: fPublisher, city: fCity },
        category: cat, shelf, year: fYear, stock: fStock,
        available_stock: availStock, description: fDescription, cover: fCover || b.cover,
        status: fStock > 0 ? 'available' : 'out_of_stock',
        qr_code: `${fCode}|${fTitle}`,
      } : b);
      saveToLocal(updated);
      logAudit({ user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined, action: 'update', model: 'Book', model_id: currentId, description: `Mengupdate buku: ${fTitle}` });
      showAlert('success', `Buku "${fTitle}" berhasil diperbarui!`);
    } else {
      const newBook = {
        id: Date.now(), code: fCode, title: fTitle, isbn: fIsbn,
        author: { id: Date.now(), name: fAuthor },
        publisher: { id: Date.now(), name: fPublisher, city: fCity },
        category: cat, shelf, year: fYear, stock: fStock, available_stock: fStock,
        cover: fCover || '', description: fDescription,
        status: fStock > 0 ? 'available' as const : 'out_of_stock' as const,
        rating: 0, borrow_count: 0,
        qr_code: `${fCode}|${fTitle}`,
        created_at: new Date().toISOString().split('T')[0],
      };
      saveToLocal([newBook, ...books]);
      logAudit({ user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined, action: 'create', model: 'Book', model_id: newBook.id, description: `Menambahkan buku baru: ${fTitle}` });
      showAlert('success', `Buku "${fTitle}" berhasil ditambahkan!`);
    }
    closeModal();
  };

  const handleDelete = (book: any) => {
    if (confirm(`Hapus buku "${book.title}"?`)) {
      const updated = books.filter(b => b.id !== book.id);
      saveToLocal(updated);
      logAudit({ user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined, action: 'delete', model: 'Book', model_id: book.id, description: `Menghapus buku: ${book.title}` });
      showAlert('success', `Buku "${book.title}" berhasil dihapus!`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Hapus ${selectedIds.length} buku yang dipilih?`)) {
      const updated = books.filter(b => !selectedIds.includes(b.id));
      saveToLocal(updated);
      logAudit({ user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined, action: 'delete', model: 'Book', description: `Menghapus ${selectedIds.length} buku sekaligus` });
      showAlert('success', `${selectedIds.length} buku berhasil dihapus!`);
      setSelectedIds([]);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Kode', 'Judul', 'Penulis', 'Penerbit', 'Kategori', 'ISBN', 'Tahun', 'Stok', 'Tersedia', 'Status', 'Rak'];
    const rows = filtered.map(b => [b.code, `"${b.title}"`, `"${b.author.name}"`, `"${b.publisher.name}"`, b.category.name, b.isbn, b.year, b.stock, b.available_stock, b.status, b.shelf?.code || '-']);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan_buku_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    logAudit({ user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined, action: 'create', model: 'Book', description: 'Export data buku ke CSV' });
    showAlert('success', 'Data buku berhasil diekspor ke CSV!');
  };

  const handleBulkExport = () => {
    if (selectedIds.length === 0) return;
    const selected = books.filter(b => selectedIds.includes(b.id));
    const headers = ['Kode', 'Judul', 'Penulis', 'Penerbit', 'Kategori', 'ISBN', 'Tahun', 'Stok', 'Tersedia', 'Status'];
    const rows = selected.map(b => [b.code, `"${b.title}"`, `"${b.publisher.name}"`, b.category.name, b.isbn, b.year, b.stock, b.available_stock, b.status]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `buku_terpilih_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showAlert('success', `${selectedIds.length} buku berhasil diekspor!`);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) { showAlert('danger', 'File CSV kosong atau tidak valid.'); return; }
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        let imported = 0;
        const maxId = books.reduce((m, b) => Math.max(m, b.id), 0);
        let nextId = maxId + 1;
        const maxCode = books.reduce((m, b) => { const n = parseInt(b.code.replace('BKN-', '')); return n > m ? n : m; }, 0);
        let nextCode = maxCode + 1;

        const newBooks: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          if (vals.length < 3) continue;
          const titleIdx = headers.indexOf('judul') >= 0 ? headers.indexOf('judul') : 1;
          const authorIdx = headers.indexOf('penulis') >= 0 ? headers.indexOf('penulis') : 2;
          const isbnIdx = headers.indexOf('isbn') >= 0 ? headers.indexOf('isbn') : -1;
          const catIdx = headers.indexOf('kategori') >= 0 ? headers.indexOf('kategori') : -1;
          const yearIdx = headers.indexOf('tahun') >= 0 ? headers.indexOf('tahun') : -1;
          const stockIdx = headers.indexOf('stok') >= 0 ? headers.indexOf('stok') : -1;

          const title = vals[titleIdx] || `Book ${nextId}`;
          const authorName = vals[authorIdx] || 'Unknown';
          const cat = catIdx >= 0 ? mockCategories.find(c => c.name.toLowerCase() === vals[catIdx]?.toLowerCase()) || mockCategories[0] : mockCategories[0];
          const stock = stockIdx >= 0 ? parseInt(vals[stockIdx]) || 1 : 1;

          newBooks.push({
            id: nextId++, code: `BKN-${String(nextCode++).padStart(3, '0')}`,
            title, isbn: isbnIdx >= 0 ? vals[isbnIdx] || '' : '',
            author: { id: nextId, name: authorName },
            publisher: { id: nextId, name: 'Imported', city: '' },
            category: cat, year: yearIdx >= 0 ? parseInt(vals[yearIdx]) || 2024 : 2024,
            stock, available_stock: stock, cover: '', description: '',
            status: stock > 0 ? 'available' : 'out_of_stock',
            rating: 0, borrow_count: 0, qr_code: `BKN-${String(nextCode - 1).padStart(3, '0')}|${title}`,
            created_at: new Date().toISOString().split('T')[0],
          });
          imported++;
        }
        if (imported > 0) {
          saveToLocal([...newBooks, ...books]);
          logAudit({ user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined, action: 'create', model: 'Book', description: `Import ${imported} buku dari CSV` });
          showAlert('success', `${imported} buku berhasil diimpor dari CSV!`);
        } else {
          showAlert('danger', 'Tidak ada data buku yang valid ditemukan dalam file CSV.');
        }
      } catch {
        showAlert('danger', 'Gagal membaca file CSV. Pastikan format CSV benar.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="flex flex-col sm:flex-row" style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Manajemen Buku
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Total {books.length} koleksi buku perpustakaan
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.color = '#15803D'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <Upload size={16} /> Import CSV
          </button>
          <button onClick={handleExportCSV} className="flex-1 sm:flex-none"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.color = '#B45309'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <Download size={16} /> Export CSV
          </button>
          <button onClick={openAddModal} className="btn btn-primary flex-1 sm:flex-none" style={{ padding: '9px 18px', fontSize: '0.85rem', justifyContent: 'center' }}>
            <Plus size={16} /> Tambah Buku
          </button>
        </div>
      </div>

      {alert && (
        <div style={{ padding: '14px 20px', borderRadius: '10px', background: alert.type === 'success' ? '#DEF7EC' : '#FDE8E8', color: alert.type === 'success' ? '#03543F' : '#9B1C1C', border: `1.5px solid ${alert.type === 'success' ? '#BCF0DA' : '#F8B4B4'}`, fontWeight: 500, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {alert.message}
        </div>
      )}

      {/* Filter bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input id="buku-search" type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari kode, judul, penulis..." className="input-base" style={{ paddingLeft: '38px', height: '38px', fontSize: '0.85rem' }} />
          </div>
          <div className="w-full sm:w-auto" style={{ position: 'relative' }}>
            <select value={selectedCat} onChange={(e) => { setSelectedCat(e.target.value); setPage(1); }} className="input-base" style={{ height: '38px', appearance: 'none', paddingRight: '30px', paddingLeft: '12px', fontSize: '0.85rem', width: '100%', cursor: 'pointer' }}>
              <option value="">Semua Kategori</option>
              {mockCategories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>
          <div className="w-full sm:w-auto" style={{ position: 'relative' }}>
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }} className="input-base" style={{ height: '38px', appearance: 'none', paddingRight: '30px', paddingLeft: '12px', fontSize: '0.85rem', width: '100%', cursor: 'pointer' }}>
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
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>{selectedIds.length} buku dipilih</span>
          <div style={{ width: '1px', height: '20px', background: '#BFDBFE' }} />
          <button onClick={handleBulkDelete} style={{ fontSize: '0.8rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Hapus Terpilih</button>
          <button onClick={handleBulkExport} style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Export Terpilih</button>
        </div>
      )}

      {/* Table - Desktop */}
      <div className="card hidden md:block" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{paginated.length}</strong> dari <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> buku
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-base">
            <thead>
              <tr>
                <th style={{ width: '40px' }}><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? paginated.map(b => b.id) : [])} checked={selectedIds.length === paginated.length && paginated.length > 0} style={{ cursor: 'pointer' }} /></th>
                <th>Kode</th><th>Judul Buku</th><th>Penulis</th><th>Kategori</th><th>Stok</th><th>Status</th><th>Rak</th><th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((book) => {
                const sc = statusColors[book.status] || { bg: '#F1F5F9', color: '#475569' };
                return (
                  <tr key={book.id}>
                    <td><input type="checkbox" checked={selectedIds.includes(book.id)} onChange={() => toggleSelect(book.id)} style={{ cursor: 'pointer' }} /></td>
                    <td><span style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)', background: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>{book.code}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '54px', borderRadius: '6px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                          {book.cover ? <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <BookOpen size={20} color="#94A3B8" style={{ margin: '17px 10px' }} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{truncate(book.title, 35)}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ISBN: {book.isbn}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{book.author.name}</td>
                    <td><span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: book.category.color + '18', color: book.category.color }}>{book.category.name}</span></td>
                    <td><div style={{ textAlign: 'center' }}><p style={{ fontWeight: 700, fontSize: '0.95rem', color: book.available_stock > 0 ? '#22C55E' : '#EF4444' }}>{book.available_stock}</p><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>dari {book.stock}</p></div></td>
                    <td><span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '8px', background: sc.bg, color: sc.color }}>{getStatusLabel(book.status)}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{book.shelf?.code || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button title="QR Code" onClick={() => setQrBook(book)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#8B5CF6'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}><QrCode size={14} /></button>
                        <button title="Edit" onClick={() => openEditModal(book)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.color = '#22C55E'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}><Edit size={14} /></button>
                        <button title="Hapus" onClick={() => handleDelete(book)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'white'; }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Halaman {page} dari {totalPages}</p>
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

      {/* Card View - Mobile */}
      <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0 4px' }}>Menampilkan <strong>{paginated.length}</strong> dari <strong>{filtered.length}</strong> buku</p>
        {paginated.map((book) => {
          const sc = statusColors[book.status] || { bg: '#F1F5F9', color: '#475569' };
          return (
            <div key={book.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '50px', height: '68px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                  {book.cover ? <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <BookOpen size={24} color="#94A3B8" style={{ margin: '22px 13px' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '4px' }}>{truncate(book.title, 40)}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{book.author.name}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)', background: '#EFF6FF', padding: '2px 6px', borderRadius: '4px' }}>{book.code}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: sc.bg, color: sc.color }}>{getStatusLabel(book.status)}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Stok: <strong style={{ color: book.available_stock > 0 ? '#22C55E' : '#EF4444' }}>{book.available_stock}/{book.stock}</strong></span>
                  <span>{book.category.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setQrBook(book)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><QrCode size={13} /></button>
                  <button onClick={() => openEditModal(book)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Edit size={13} /></button>
                  <button onClick={() => handleDelete(book)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          );
        })}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hal {page}/{totalPages}</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontSize: '0.8rem' }}>← Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, fontSize: '0.8rem' }}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, overflowY: 'auto', padding: '20px' }}>
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '600px', padding: '28px', margin: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px' }}>{editMode ? 'Edit Buku' : 'Tambah Buku Baru'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Kode Buku</label>
                  <input type="text" value={fCode} onChange={(e) => setFCode(e.target.value)} className="input-base" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>ISBN</label>
                  <input type="text" value={fIsbn} onChange={(e) => setFIsbn(e.target.value)} className="input-base" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Judul Buku</label>
                <input type="text" value={fTitle} onChange={(e) => setFTitle(e.target.value)} placeholder="Masukkan judul buku" className="input-base" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Penulis</label>
                  <input type="text" value={fAuthor} onChange={(e) => setFAuthor(e.target.value)} className="input-base" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Penerbit</label>
                  <input type="text" value={fPublisher} onChange={(e) => setFPublisher(e.target.value)} className="input-base" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Kategori</label>
                  <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className="input-base" style={{ cursor: 'pointer' }}>
                    {mockCategories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Tahun</label>
                  <input type="number" value={fYear} onChange={(e) => setFYear(parseInt(e.target.value))} className="input-base" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Stok</label>
                  <input type="number" value={fStock} onChange={(e) => setFStock(parseInt(e.target.value))} className="input-base" min={0} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Kode Rak</label>
                  <input type="text" value={fShelfCode} onChange={(e) => setFShelfCode(e.target.value)} placeholder="A-01" className="input-base" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Lokasi Rak</label>
                  <input type="text" value={fShelfLocation} onChange={(e) => setFShelfLocation(e.target.value)} placeholder="Rak A" className="input-base" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Lantai</label>
                  <select value={fShelfFloor} onChange={(e) => setFShelfFloor(e.target.value)} className="input-base" style={{ cursor: 'pointer' }}>
                    <option>Lantai 1</option><option>Lantai 2</option><option>Lantai 3</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>URL Cover (Opsional)</label>
                <input type="url" value={fCover} onChange={(e) => setFCover(e.target.value)} placeholder="https://..." className="input-base" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Deskripsi</label>
                <textarea value={fDescription} onChange={(e) => setFDescription(e.target.value)} className="input-base" rows={3} style={{ resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '10px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.875rem' }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrBook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setQrBook(null)}>
          <div className="card animate-scale-in" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '380px', padding: '32px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>QR Code Buku</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>{qrBook.title}</p>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', display: 'inline-flex', marginBottom: '16px' }}>
              <QRCodeSVG value={qrBook.qr_code || `${qrBook.code}|${qrBook.title}`} size={180} level="M" />
            </div>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              <p><strong>Kode:</strong> {qrBook.code}</p>
              <p><strong>Kategori:</strong> {qrBook.category.name}</p>
              <p><strong>Rak:</strong> {qrBook.shelf?.location || '-'} ({qrBook.shelf?.code || '-'})</p>
            </div>
            <button onClick={() => setQrBook(null)} style={{ padding: '10px 24px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
