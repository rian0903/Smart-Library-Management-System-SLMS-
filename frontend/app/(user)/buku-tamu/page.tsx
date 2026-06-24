'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Info, FileText, CheckCircle2, QrCode, Clock, Users } from 'lucide-react';
import { mockGuestBooks, mockMembers } from '@/data/mockData';

export default function GuestBookPage() {
  const [visitorName, setVisitorName] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [memberCode, setMemberCode] = useState('');
  const [purpose, setPurpose] = useState('Membaca buku');
  const [submitted, setSubmitted] = useState(false);
  const [checkInTime, setCheckInTime] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [recentVisits, setRecentVisits] = useState<any[]>([]);

  // Load guest books from localStorage or mockData
  useEffect(() => {
    const savedGuestBooks = localStorage.getItem('slms_guestbooks');
    if (savedGuestBooks) {
      setRecentVisits(JSON.parse(savedGuestBooks));
    } else {
      setRecentVisits(mockGuestBooks);
    }
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitorName) return;

    const matchedMember = isMember 
      ? mockMembers.find(m => m.member_code.toLowerCase() === memberCode.toLowerCase()) 
      : undefined;

    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const date = new Date().toISOString().split('T')[0];
    const token = `QR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const newVisit = {
      id: recentVisits.length + 1,
      visitor_name: isMember && matchedMember ? matchedMember.name : visitorName,
      member: matchedMember,
      purpose,
      visit_date: date,
      check_in: time,
      qr_token: token
    };

    const updatedVisits = [newVisit, ...recentVisits];
    setRecentVisits(updatedVisits);
    localStorage.setItem('slms_guestbooks', JSON.stringify(updatedVisits));

    setCheckInTime(time);
    setQrToken(token);
    setSubmitted(true);
  };

  const handleReset = () => {
    setVisitorName('');
    setIsMember(false);
    setMemberCode('');
    setPurpose('Membaca buku');
    setSubmitted(false);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="page-container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '8px', background: 'rgba(59,130,246,0.12)', color: 'var(--primary)' }}>
            E-Visitor Perpustakaan
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Buku Tamu Digital
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '500px', margin: '0 auto' }}>
            Silakan isi buku tamu digital terlebih dahulu sebelum menggunakan fasilitas perpustakaan.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
          
          {/* Form / Success Card */}
          <div className="card" style={{ padding: '32px' }}>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Form Kunjungan</h3>
                
                {/* Member Checkbox */}
                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', alignItems: 'center' }}>
                  <input
                    id="checkbox-member"
                    type="checkbox"
                    checked={isMember}
                    onChange={(e) => setIsMember(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="checkbox-member" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    Saya adalah Anggota Terdaftar
                  </label>
                </div>

                {isMember ? (
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="guest-member-code" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Kode Anggota</label>
                    <input
                      id="guest-member-code"
                      type="text"
                      placeholder="Contoh: BRN-00001"
                      value={memberCode}
                      onChange={(e) => setMemberCode(e.target.value)}
                      className="input-base"
                      required
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Masukkan kode anggota untuk mengisi nama secara otomatis.
                    </p>
                  </div>
                ) : (
                  <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="guest-name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Nama Lengkap</label>
                    <input
                      id="guest-name"
                      type="text"
                      placeholder="Masukkan nama lengkap Anda"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="input-base"
                      required
                    />
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <label htmlFor="guest-purpose" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Tujuan Kunjungan</label>
                  <select
                    id="guest-purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="input-base"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Membaca buku">Membaca Buku / Referensi</option>
                    <option value="Meminjam buku">Meminjam / Mengembalikan Buku</option>
                    <option value="Mengerjakan tugas">Mengerjakan Tugas / Belajar</option>
                    <option value="Penelitian">Penelitian / Riset</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', borderRadius: '12px' }}>
                  Check In Kunjungan
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#15803D' }}>
                  <CheckCircle2 size={36} />
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Check In Berhasil!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  Terima kasih telah berkunjung ke Perpustakaan Kabupaten Bireuen.
                </p>

                {/* QR Code Simulation */}
                <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '140px', height: '140px', background: 'white', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '12px' }}>
                    <QrCode size={110} color="#1E293B" />
                  </div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Token: {qrToken}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>Waktu Masuk: {checkInTime}</p>
                </div>

                <button onClick={handleReset} className="btn" style={{ border: '1.5px solid var(--border)', background: 'white', width: '100%', padding: '11px', justifyContent: 'center', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                  Isi Kembali Buku Tamu
                </button>
              </div>
            )}
          </div>

          {/* Recent Visitors */}
          <div className="card" style={{ padding: '28px', maxHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Users size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pengunjung Hari Ini</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentVisits.slice(0, 8).map((visit, i) => (
                <div key={visit.id || i} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ 
                    width: '38px', height: '38px', borderRadius: '50%', 
                    background: visit.member ? 'linear-gradient(135deg, #DBEAFE, #EFF6FF)' : '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: visit.member ? 'var(--primary)' : 'var(--text-muted)',
                    fontSize: '0.9rem', fontWeight: 700
                  }}>
                    {visit.visitor_name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {visit.visitor_name}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> {visit.check_in}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{visit.purpose}</p>
                      {visit.member && (
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: '#DCFCE7', color: '#15803D' }}>
                          Anggota
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
