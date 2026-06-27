'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Library, Calendar, Shield } from 'lucide-react';

interface MemberCardProps {
  memberCode: string;
  name: string;
  email: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'expired';
}

export default function MemberCard({ memberCode, name, email, expiryDate, status }: MemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const qrData = `${memberCode}|${name}|${expiryDate}`;

  const handlePrint = () => {
    if (!cardRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kartu Anggota - ${name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
          @media print { body { min-height: auto; } }
        </style>
      </head>
      <body>
        ${cardRef.current.outerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const statusColors = {
    active: { bg: '#DCFCE7', text: '#15803D', label: 'AKTIF' },
    inactive: { bg: '#FEE2E2', text: '#B91C1C', label: 'NONAKTIF' },
    expired: { bg: '#FEF3C7', text: '#D97706', label: 'KADALUARSA' },
  };
  const sc = statusColors[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div
        ref={cardRef}
        id="member-card"
        style={{
          width: '360px',
          minHeight: '220px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2440 60%, #162D4A 100%)',
          color: 'white',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(15,36,64,0.35)',
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(59,130,246,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(34,197,94,0.06)' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #3B82F6, #22C55E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Library size={18} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.2 }}>Perpustakaan</p>
            <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>Kabupaten Bireuen</p>
          </div>
          <div style={{ marginLeft: 'auto', padding: '3px 8px', borderRadius: '6px', background: sc.bg }}>
            <span style={{ fontSize: '0.58rem', fontWeight: 800, color: sc.text, letterSpacing: '0.08em' }}>{sc.label}</span>
          </div>
        </div>

        {/* Body: Info + QR */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          {/* Left: member info */}
          <div style={{ flex: 1 }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '12px',
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '2px' }}>{name}</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>{email}</p>
            <div style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: '6px',
              background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)',
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'monospace', color: '#93C5FD', letterSpacing: '0.05em' }}>
                {memberCode}
              </span>
            </div>
          </div>

          {/* Right: QR code */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ background: 'white', borderRadius: '10px', padding: '8px' }}>
              <QRCodeSVG value={qrData} size={80} level="M" />
            </div>
            <p style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>Scan untuk masuk</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '16px', paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={11} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Berlaku s/d {expiryDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Shield size={11} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>SLMS Digital Card</span>
          </div>
        </div>
      </div>

      {/* Print button */}
      <button
        onClick={handlePrint}
        className="btn btn-primary"
        style={{ padding: '10px 24px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        Cetak Kartu
      </button>
    </div>
  );
}
