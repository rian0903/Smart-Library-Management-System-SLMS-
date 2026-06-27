'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Users, Clock, CheckCircle, QrCode, X, UserPlus } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { mockGuestBooks, mockMembers } from '@/data/mockData';

export default function PetugasBukuTamuPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = 'petugas-guest-qr-reader';

  // Manual form state
  const [visitorName, setVisitorName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberResults, setMemberResults] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('slms_guestbooks');
    if (saved) {
      setVisits(JSON.parse(saved));
    } else {
      setVisits(mockGuestBooks);
    }
  }, [successMsg]);

  const saveVisits = (data: any[]) => {
    setVisits(data);
    localStorage.setItem('slms_guestbooks', JSON.stringify(data));
  };

  const handleCheckout = (id: number) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const updated = visits.map(v => v.id === id ? { ...v, check_out: time } : v);
    saveVisits(updated);
    setSuccessMsg('Pengunjung berhasil check-out!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const startScanner = () => {
    setShowScanner(true);
    setTimeout(() => {
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerElementId);
        }
        scannerRef.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            // Parse QR data: member_code|name|expiry
            const parts = decodedText.split('|');
            if (parts.length >= 2) {
              const memberCode = parts[0];
              const memberName = parts[1];
              // Find member in data
              const members = JSON.parse(localStorage.getItem('slms_members') || JSON.stringify(mockMembers));
              const found = members.find((m: any) => m.member_code === memberCode);
              if (found) {
                setSelectedMember(found);
                setVisitorName(found.name);
                setIsMember(true);
              } else {
                setVisitorName(memberName);
                setIsMember(true);
              }
            }
            stopScanner();
            setShowManualForm(true);
          },
          () => {}
        ).catch(() => {});
      } catch {}
    }, 300);
  };

  const stopScanner = () => {
    try { scannerRef.current?.stop(); } catch {}
    setShowScanner(false);
  };

  useEffect(() => {
    return () => {
      try { scannerRef.current?.stop(); } catch {}
    };
  }, []);

  const handleMemberSearch = (query: string) => {
    setMemberSearch(query);
    if (query.length < 2) { setMemberResults([]); return; }
    const members = JSON.parse(localStorage.getItem('slms_members') || JSON.stringify(mockMembers));
    setMemberResults(members.filter((m: any) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.member_code.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5));
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !purpose) return;

    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];
    const newVisit = {
      id: Date.now(),
      visitor_name: visitorName,
      member: selectedMember || undefined,
      purpose,
      visit_date: today,
      check_in: time,
      check_out: undefined,
      qr_token: `QR-${Date.now()}`,
    };

    saveVisits([newVisit, ...visits]);
    setSuccessMsg(`${visitorName} berhasil check-in!`);
    setTimeout(() => setSuccessMsg(''), 3000);

    // Reset form
    setVisitorName('');
    setPurpose('');
    setIsMember(false);
    setSelectedMember(null);
    setMemberSearch('');
    setMemberResults([]);
    setShowManualForm(false);
  };

  const filtered = visits.filter(v =>
    v.visitor_name.toLowerCase().includes(search.toLowerCase()) ||
    v.purpose.toLowerCase().includes(search.toLowerCase())
  );

  const totalToday = visits.filter(v => v.visit_date === new Date().toISOString().split('T')[0]).length;
  const activeNow = visits.filter(v => !v.check_out).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Buku Tamu</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kelola kunjungan perpustakaan - check-in dan check-out pengunjung.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={startScanner} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', background: '#22C55E', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            <QrCode size={18} /> Scan QR
          </button>
          <button onClick={() => setShowManualForm(!showManualForm)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
            <UserPlus size={18} /> Check-in Manual
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', border: '1.5px solid #BCF0DA', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* QR Scanner */}
      {showScanner && (
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Scan QR Kartu Anggota</h3>
            <button onClick={stopScanner} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
          </div>
          <div id={scannerElementId} style={{ maxWidth: '320px', margin: '0 auto' }} />
        </div>
      )}

      {/* Manual Check-in Form */}
      {showManualForm && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Form Check-in Pengunjung</h3>
          <form onSubmit={handleManualCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nama Pengunjung</label>
              <input type="text" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Masukkan nama pengunjung" className="input-base" required />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '8px' }}>
                <input type="checkbox" checked={isMember} onChange={(e) => setIsMember(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#22C55E' }} />
                Pengunjung adalah anggota perpustakaan
              </label>
              {isMember && (
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" value={memberSearch} onChange={(e) => handleMemberSearch(e.target.value)} placeholder="Cari anggota (nama atau kode)..." className="input-base" style={{ paddingLeft: '38px' }} />
                  {memberResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: '10px', boxShadow: 'var(--shadow-lg)', zIndex: 10, marginTop: '4px' }}>
                      {memberResults.map((m: any) => (
                        <button key={m.id} type="button" onClick={() => { setSelectedMember(m); setVisitorName(m.name); setMemberSearch(''); setMemberResults([]); }}
                          style={{ width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none', background: selectedMember?.id === m.id ? '#EFF6FF' : 'white', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{m.member_code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedMember && (
                    <p style={{ fontSize: '0.75rem', color: '#22C55E', marginTop: '4px', fontWeight: 600 }}>
                      Terpilih: {selectedMember.name} ({selectedMember.member_code})
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Keperluan</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="input-base" required style={{ cursor: 'pointer' }}>
                <option value="">Pilih keperluan...</option>
                <option value="Membaca buku referensi">Membaca buku referensi</option>
                <option value="Meminjam buku">Meminjam buku</option>
                <option value="Mengembalikan buku">Mengembalikan buku</option>
                <option value="Mengerjakan tugas">Mengerjakan tugas</option>
                <option value="Penelitian">Penelitian</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setShowManualForm(false); setSelectedMember(null); setVisitorName(''); setPurpose(''); }} style={{ padding: '10px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem' }}>
                Check-in
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pengunjung Hari Ini</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{totalToday}</p>
          </div>
        </div>
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aktif di Perpustakaan</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>{activeNow}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Cari berdasarkan nama atau tujuan..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-base" style={{ paddingLeft: '38px', fontSize: '0.85rem' }} />
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="card hidden md:block" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="table-base" style={{ width: '100%', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nama Pengunjung</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Keperluan</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check In</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check Out</th>
              <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Tidak ada catatan kunjungan.</td></tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{v.visitor_name}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: v.member ? '#DCFCE7' : '#E2E8F0', color: v.member ? '#15803D' : '#64748B' }}>
                      {v.member ? `Anggota (${v.member.member_code})` : 'Umum / Tamu'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{v.purpose}</td>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {v.check_in}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {v.check_out ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {v.check_out}</div>
                    ) : (
                      <span style={{ color: '#D97706', fontWeight: 600 }}>Di Dalam</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    {!v.check_out ? (
                      <button onClick={() => handleCheckout(v.id)} className="btn btn-primary" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                        Check Out
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selesai</span>
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
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada catatan kunjungan.</div>
        ) : (
          filtered.map((v) => (
            <div key={v.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{v.visitor_name}</p>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: v.member ? '#DCFCE7' : '#E2E8F0', color: v.member ? '#15803D' : '#64748B' }}>
                    {v.member ? `Anggota (${v.member.member_code})` : 'Umum'}
                  </span>
                </div>
                {!v.check_out ? (
                  <button onClick={() => handleCheckout(v.id)} className="btn btn-primary" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                    Check Out
                  </button>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Selesai</span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{v.purpose}</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> In: {v.check_in}</span>
                {v.check_out && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Out: {v.check_out}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
