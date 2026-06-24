'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Library, LayoutDashboard, BookOpen, Tag, Users, UserCheck,
  ArrowLeftRight, RotateCcw, DollarSign, BarChart2, FileText,
  Download, Shield, Activity, Settings, ChevronDown, ChevronRight,
  Menu, X, LogOut, Bell, Search, User, Sun, Moon,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials, getRoleLabel } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    label: 'Master Data', icon: BookOpen,
    children: [
      { label: 'Buku', href: '/admin/buku', icon: BookOpen },
      { label: 'Kategori', href: '/admin/kategori', icon: Tag },
      { label: 'Penulis', href: '/admin/penulis', icon: User },
      { label: 'Rak', href: '/admin/rak', icon: Library },
    ],
  },
  {
    label: 'Keanggotaan', icon: Users,
    children: [
      { label: 'Anggota', href: '/admin/anggota', icon: Users },
      { label: 'Petugas', href: '/admin/petugas', icon: UserCheck },
    ],
  },
  {
    label: 'Transaksi', icon: ArrowLeftRight,
    children: [
      { label: 'Peminjaman', href: '/admin/peminjaman', icon: ArrowLeftRight },
      { label: 'Pengembalian', href: '/admin/pengembalian', icon: RotateCcw },
      { label: 'Denda', href: '/admin/denda', icon: DollarSign },
    ],
  },
  {
    label: 'Laporan', icon: BarChart2,
    children: [
      { label: 'Buku Populer', href: '/admin/laporan/populer', icon: BarChart2 },
      { label: 'Statistik', href: '/admin/laporan/statistik', icon: FileText },
      { label: 'Export Data', href: '/admin/laporan/export', icon: Download },
    ],
  },
  {
    label: 'Sistem', icon: Shield,
    children: [
      { label: 'Role Management', href: '/admin/sistem/role', icon: Shield },
      { label: 'Audit Log', href: '/admin/sistem/audit', icon: Activity },
      { label: 'Pengaturan', href: '/admin/sistem/pengaturan', icon: Settings },
    ],
  },
];

export default function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [openGroups, setOpenGroups] = useState<string[]>(['Master Data', 'Keanggotaan', 'Transaksi']);

  function toggleGroup(label: string) {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  function isGroupActive(children?: { href: string }[]) {
    return children?.some((c) => isActive(c.href)) ?? false;
  }

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '20px 0' : '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '12px',
          overflow: 'hidden',
          minHeight: '72px',
        }}
      >
        {!collapsed ? (
          <>
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Library size={20} color="white" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1.2 }}>SLMS</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>Perpustakaan Bireuen</p>
            </div>
            <button
              onClick={onToggle}
              style={{
                marginLeft: 'auto', width: '28px', height: '28px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)', flexShrink: 0, transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)', flexShrink: 0, transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}>
        {navItems.map((item) => {
          if (item.href) {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: collapsed ? '12px 18px' : '10px 20px',
                  margin: '1px 8px', borderRadius: '10px',
                  textDecoration: 'none',
                  background: active ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.2))' : 'transparent',
                  border: active ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <item.icon
                  size={18}
                  color={active ? '#60A5FA' : 'rgba(255,255,255,0.45)'}
                  style={{ flexShrink: 0 }}
                />
                {!collapsed && (
                  <span style={{ fontSize: '0.875rem', fontWeight: active ? 700 : 500, color: active ? '#E2E8F0' : 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
                {active && !collapsed && (
                  <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6' }} />
                )}
              </Link>
            );
          }

          // Group
          const groupActive = isGroupActive(item.children);
          const isOpen = openGroups.includes(item.label);

          return (
            <div key={item.label}>
              <button
                onClick={() => !collapsed && toggleGroup(item.label)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: collapsed ? '12px 18px' : '10px 20px',
                  margin: '1px 8px', borderRadius: '10px',
                  width: 'calc(100% - 16px)', border: 'none', cursor: 'pointer',
                  background: groupActive && collapsed ? 'rgba(59,130,246,0.15)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = groupActive && collapsed ? 'rgba(59,130,246,0.15)' : 'transparent'; }}
              >
                <item.icon
                  size={18}
                  color={groupActive ? '#60A5FA' : 'rgba(255,255,255,0.45)'}
                  style={{ flexShrink: 0 }}
                />
                {!collapsed && (
                  <>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                    <ChevronDown
                      size={14}
                      color="rgba(255,255,255,0.3)"
                      style={{ marginLeft: 'auto', transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
                    />
                  </>
                )}
              </button>

              {/* Children */}
              {(!collapsed && isOpen) && item.children?.map((child) => {
                const childActive = isActive(child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 20px 9px 48px', margin: '0 8px', borderRadius: '10px',
                      textDecoration: 'none',
                      background: childActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                      borderLeft: childActive ? '2px solid #3B82F6' : '2px solid transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { if (!childActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={(e) => { if (!childActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <child.icon size={15} color={childActive ? '#60A5FA' : 'rgba(255,255,255,0.4)'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: childActive ? 600 : 400, color: childActive ? '#CBD5E1' : 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
                      {child.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User info at bottom */}
      {user && (
        <div
          style={{
            padding: collapsed ? '12px 14px' : '16px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '0.75rem', fontWeight: 700,
            }}
          >
            {getInitials(user.name)}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>
                {getRoleLabel(user.role)}
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
