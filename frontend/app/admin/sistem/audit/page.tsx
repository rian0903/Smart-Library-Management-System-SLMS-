'use client';

import { useState } from 'react';
import { Search, Activity, Clock, ShieldAlert } from 'lucide-react';
import { mockActivityLogs } from '@/data/mockData';
import { formatDateTime } from '@/lib/utils';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>(mockActivityLogs);
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => 
    l.user.name.toLowerCase().includes(search.toLowerCase()) ||
    l.description.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Audit Log Aktivitas</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Catatan rekapitulasi aktivitas petugas dan administrator di dalam sistem informasi perpustakaan.</p>
      </div>

      {/* Filter / Search */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="audit-search"
            type="text"
            placeholder="Cari logs (nama petugas, deskripsi)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
            style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Logs Timeline / Table */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tidak ada log ditemukan.</p>
          ) : (
            filtered.map((log, i) => {
              const actionColors: Record<string, string> = { create: '#22C55E', approve: '#3B82F6', login: '#8B5CF6', update: '#F59E0B', delete: '#EF4444' };
              const actionIcons: Record<string, string> = { create: '➕', approve: '✅', login: '🔑', update: '✏️', delete: '🗑️' };
              const color = actionColors[log.action] || '#94A3B8';
              const icon = actionIcons[log.action] || '📝';

              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                    padding: '16px 0',
                    borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                    {icon}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {log.description}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                        <Clock size={11} /> {formatDateTime(log.created_at)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>Petugas: <strong style={{ color: 'var(--text-secondary)' }}>{log.user.name} ({log.user.role})</strong></span>
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                      <span>IP Address: <strong>{log.ip_address}</strong></span>
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                      <span>Model: <strong>{log.model} (ID: {log.model_id || '-'})</strong></span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
