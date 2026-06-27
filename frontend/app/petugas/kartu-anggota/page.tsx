'use client';

import { useState, useEffect } from 'react';
import { Search, CreditCard, QrCode } from 'lucide-react';
import { mockMembers } from '@/data/mockData';
import MemberCard from '@/components/shared/MemberCard';

export default function PetugasKartuAnggotaPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberResults, setMemberResults] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('slms_members');
    if (saved) {
      setMembers(JSON.parse(saved));
    } else {
      setMembers(mockMembers);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    if (query.length < 2) { setMemberResults([]); return; }
    const results = members.filter(m =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.member_code.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
    setMemberResults(results);
  };

  const selectMember = (member: any) => {
    setSelectedMember(member);
    setSearch('');
    setMemberResults([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Kartu Anggota</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pilih anggota untuk menampilkan dan mencetak kartu keanggotaan digital dengan QR code.</p>
      </div>

      {/* Search / Select Member */}
      <div className="card" style={{ padding: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Pilih Anggota
        </label>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari nama, kode anggota, atau email..."
            className="input-base"
            style={{ paddingLeft: '40px', fontSize: '0.9rem' }}
          />
          {memberResults.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 10, marginTop: '4px', maxHeight: '320px', overflowY: 'auto' }}>
              {memberResults.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMember(m)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    border: 'none',
                    borderBottom: '1px solid #F1F5F9',
                    background: selectedMember?.id === m.id ? '#F0FDF4' : 'white',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = selectedMember?.id === m.id ? '#F0FDF4' : 'white'; }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #DCFCE7, #F0FDF4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#22C55E', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                  }}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.member_code} &middot; {m.email}</p>
                  </div>
                  <span style={{
                    padding: '3px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                    background: m.status === 'active' ? '#DCFCE7' : m.status === 'expired' ? '#FEF3C7' : '#FEE2E2',
                    color: m.status === 'active' ? '#15803D' : m.status === 'expired' ? '#D97706' : '#B91C1C',
                  }}>
                    {m.status === 'active' ? 'Aktif' : m.status === 'expired' ? 'Kadaluarsa' : 'Nonaktif'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected member info */}
        {selectedMember && (
          <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={16} color="#22C55E" />
            <span style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 600 }}>
              Terpilih: {selectedMember.name} ({selectedMember.member_code})
            </span>
            <button onClick={() => setSelectedMember(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '0.8rem', textDecoration: 'underline' }}>
              Ganti
            </button>
          </div>
        )}
      </div>

      {/* Card Display */}
      {selectedMember ? (
        <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={18} /> Kartu Keanggotaan
          </h3>
          <MemberCard
            memberCode={selectedMember.member_code}
            name={selectedMember.name}
            email={selectedMember.email}
            expiryDate={selectedMember.expired_at}
            status={selectedMember.status === 'active' ? 'active' : selectedMember.status === 'expired' ? 'expired' : 'inactive'}
          />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '360px' }}>
            <p>QR code berisi kode anggota yang dapat discan oleh petugas untuk:</p>
            <ul style={{ marginTop: '8px', paddingLeft: '20px', textAlign: 'left', lineHeight: '1.8' }}>
              <li>Check-in masuk perpustakaan</li>
              <li>Proses peminjaman buku</li>
              <li>Proses pengembalian buku</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💳</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pilih anggota di atas untuk menampilkan kartu keanggotaan.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>Kartu dapat dicetak langsung dari halaman ini.</p>
        </div>
      )}

      {/* Quick Member List */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Anggota Terbaru</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {members.slice(0, 10).map((m) => (
            <button
              key={m.id}
              onClick={() => selectMember(m)}
              style={{
                padding: '8px 14px', borderRadius: '8px',
                border: selectedMember?.id === m.id ? '1.5px solid #22C55E' : '1.5px solid var(--border)',
                background: selectedMember?.id === m.id ? '#F0FDF4' : 'white',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                color: selectedMember?.id === m.id ? '#15803D' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {m.member_code} - {m.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
