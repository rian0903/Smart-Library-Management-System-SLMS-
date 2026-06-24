'use client';

import { useState, useEffect } from 'react';
import { Save, Library, DollarSign, Calendar, MapPin, CheckCircle } from 'lucide-react';

export default function AdminPengaturanPage() {
  const [libraryName, setLibraryName] = useState('Perpustakaan Kabupaten Bireuen');
  const [finePerDay, setFinePerDay] = useState(1000);
  const [maxLoanDays, setMaxLoanDays] = useState(14);
  const [maxBooks, setMaxBooks] = useState(3);
  const [address, setAddress] = useState('Jl. Medan Banda Aceh No. 12, Bireuen, Aceh');
  const [phone, setPhone] = useState('0644-123456');
  const [email, setEmail] = useState('perpustakaan@bireuen.go.id');

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('slms_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLibraryName(parsed.libraryName);
      setFinePerDay(parsed.finePerDay);
      setMaxLoanDays(parsed.maxLoanDays);
      setMaxBooks(parsed.maxBooks);
      setAddress(parsed.address);
      setPhone(parsed.phone);
      setEmail(parsed.email);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      libraryName, finePerDay, maxLoanDays, maxBooks, address, phone, email
    };
    localStorage.setItem('slms_settings', JSON.stringify(config));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Pengaturan Sistem</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Konfigurasi parameter operasional perpustakaan, tarif denda, dan profil kontak instansi.</p>
        </div>
      </div>

      {success && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> Pengaturan berhasil disimpan dan diterapkan!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
        
        {/* Left Column: Library Profile */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '8px' }}>Profil Instansi</h3>
          
          <div>
            <label htmlFor="input-library-name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nama Perpustakaan</label>
            <input
              id="input-library-name"
              type="text"
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              className="input-base"
              required
            />
          </div>

          <div>
            <label htmlFor="input-library-address" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Alamat Fisik</label>
            <textarea
              id="input-library-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-base"
              rows={3}
              required
              style={{ resize: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label htmlFor="input-library-phone" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Telepon</label>
              <input id="input-library-phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-base" required />
            </div>
            <div>
              <label htmlFor="input-library-email" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Email</label>
              <input id="input-library-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" required />
            </div>
          </div>
        </div>

        {/* Right Column: Loan Parameters */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '8px' }}>Parameter Sirkulasi</h3>
          
          <div>
            <label htmlFor="input-fine-amount" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Denda Keterlambatan (Per Hari)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Rp</span>
              <input
                id="input-fine-amount"
                type="number"
                value={finePerDay}
                onChange={(e) => setFinePerDay(parseInt(e.target.value))}
                className="input-base"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="input-loan-duration" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Durasi Peminjaman Maksimal</label>
            <div style={{ position: 'relative' }}>
              <input
                id="input-loan-duration"
                type="number"
                value={maxLoanDays}
                onChange={(e) => setMaxLoanDays(parseInt(e.target.value))}
                className="input-base"
                style={{ paddingRight: '50px' }}
                required
              />
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Hari</span>
            </div>
          </div>

          <div>
            <label htmlFor="input-max-books" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Batas Buku Dipinjam Sekaligus</label>
            <div style={{ position: 'relative' }}>
              <input
                id="input-max-books"
                type="number"
                value={maxBooks}
                onChange={(e) => setMaxBooks(parseInt(e.target.value))}
                className="input-base"
                style={{ paddingRight: '50px' }}
                required
              />
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Buku</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: '12px', marginTop: '10px', justifyContent: 'center' }}>
            <Save size={18} /> Simpan Parameter Konfigurasi
          </button>
        </div>

      </form>

    </div>
  );
}
