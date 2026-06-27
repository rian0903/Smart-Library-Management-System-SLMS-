'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Library, LayoutDashboard, BookOpen, Users, ArrowLeftRight,
  RotateCcw, ChevronDown, ChevronRight, Menu, X, ClipboardList,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials, getRoleLabel } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/petugas/dashboard', icon: LayoutDashboard },
  {
    label: 'Transaksi', icon: ArrowLeftRight,
    children: [
      { label: 'Peminjaman', href: '/petugas/peminjaman', icon: ArrowLeftRight },
      { label: 'Pengembalian', href: '/petugas/pengembalian', icon: RotateCcw },
    ],
  },
  {
    label: 'Keanggotaan', icon: Users,
    children: [
      { label: 'Buku Tamu', href: '/petugas/buku-tamu', icon: ClipboardList },
      { label: 'Anggota', href: '/petugas/anggota', icon: Users },
      { label: 'Kartu Anggota', href: '/petugas/kartu-anggota', icon: CreditCard },
    ],
  },
];

export default function PetugasSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    if (isMobile && mobileOpen) onMobileClose?.();
  }, [pathname]);

  const { user } = useAuthStore();
  const [openGroups, setOpenGroups] = useState<string[]>(['Transaksi', 'Keanggotaan']);

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

  const showMobile = isMobile && mobileOpen;
  const hideMobile = isMobile && !mobileOpen;
  const isCollapsed = !isMobile && collapsed;

  return (
    <>
      {showMobile && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          }}
        />
      )}
      <aside
        style={{
          width: isMobile ? '260px' : (isCollapsed ? '72px' : '260px'),
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          display: 'flex', flexDirection: 'column',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden', flexShrink: 0,
          position: isMobile ? 'fixed' : 'sticky', top: 0, left: 0, height: '100vh',
          zIndex: isMobile ? 50 : 'auto',
          transform: hideMobile ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: isCollapsed ? '20px 0' : '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '12px', overflow: 'hidden', minHeight: '72px',
        }}>
          {!isCollapsed ? (
            <>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Library size={20} color="white" />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1.2 }}>SLMS</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>Panel Petugas</p>
              </div>
              <button onClick={onToggle} style={{
                marginLeft: 'auto', width: '28px', height: '28px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)', flexShrink: 0,
              }}>
                <X size={14} />
              </button>
            </>
          ) : (
            <button onClick={onToggle} style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)',
            }}>
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
                <Link key={item.label} href={item.href} title={isCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: isCollapsed ? '12px 18px' : '10px 20px',
                    margin: '1px 8px', borderRadius: '10px', textDecoration: 'none',
                    background: active ? 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(22,163,74,0.2))' : 'transparent',
                    border: active ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <item.icon size={18} color={active ? '#4ADE80' : 'rgba(255,255,255,0.45)'} style={{ flexShrink: 0 }} />
                  {!isCollapsed && (
                    <span style={{ fontSize: '0.875rem', fontWeight: active ? 700 : 500, color: active ? '#E2E8F0' : 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            }

            const groupActive = isGroupActive(item.children);
            const isOpen = openGroups.includes(item.label);

            return (
              <div key={item.label}>
                <button onClick={() => !isCollapsed && toggleGroup(item.label)} title={isCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: isCollapsed ? '12px 18px' : '10px 20px',
                    margin: '1px 8px', borderRadius: '10px',
                    width: 'calc(100% - 16px)', border: 'none', cursor: 'pointer',
                    background: groupActive && isCollapsed ? 'rgba(34,197,94,0.15)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = groupActive && isCollapsed ? 'rgba(34,197,94,0.15)' : 'transparent'; }}
                >
                  <item.icon size={18} color={groupActive ? '#4ADE80' : 'rgba(255,255,255,0.45)'} style={{ flexShrink: 0 }} />
                  {!isCollapsed && (
                    <>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                      <ChevronDown size={14} color="rgba(255,255,255,0.3)"
                        style={{ marginLeft: 'auto', transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
                    </>
                  )}
                </button>

                {(!isCollapsed && isOpen) && item.children?.map((child) => {
                  const childActive = isActive(child.href);
                  return (
                    <Link key={child.href} href={child.href}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 20px 9px 48px', margin: '0 8px', borderRadius: '10px',
                        textDecoration: 'none',
                        background: childActive ? 'rgba(34,197,94,0.15)' : 'transparent',
                        borderLeft: childActive ? '2px solid #22C55E' : '2px solid transparent',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { if (!childActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={(e) => { if (!childActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <child.icon size={15} color={childActive ? '#4ADE80' : 'rgba(255,255,255,0.4)'} />
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

        {/* Mobile close */}
        {isMobile && (
          <button onClick={onMobileClose} style={{
            position: 'absolute', top: '20px', right: '16px',
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)', zIndex: 10,
          }}>
            <X size={16} />
          </button>
        )}

        {/* User info */}
        {user && (
          <div style={{
            padding: isCollapsed ? '12px 14px' : '16px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '0.75rem', fontWeight: 700,
            }}>
              {getInitials(user.name)}
            </div>
            {!isCollapsed && (
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
    </>
  );
}
