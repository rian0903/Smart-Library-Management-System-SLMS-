import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'badge-success',
    available: 'badge-success',
    returned: 'badge-success',
    approved: 'badge-success',
    pending: 'badge-warning',
    overdue: 'badge-danger',
    rejected: 'badge-danger',
    out_of_stock: 'badge-danger',
    inactive: 'badge-gray',
    expired: 'badge-gray',
    cancelled: 'badge-gray',
    procured: 'badge-purple',
  };
  return map[status] || 'badge-gray';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Aktif',
    available: 'Tersedia',
    returned: 'Dikembalikan',
    approved: 'Disetujui',
    pending: 'Menunggu',
    overdue: 'Terlambat',
    rejected: 'Ditolak',
    out_of_stock: 'Habis',
    inactive: 'Nonaktif',
    expired: 'Kedaluwarsa',
    cancelled: 'Dibatalkan',
    procured: 'Diprocure',
    lost: 'Hilang',
    completed: 'Selesai',
  };
  return map[status] || status;
}

export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    petugas: 'Petugas',
    user: 'Pengguna',
  };
  return map[role] || role;
}

export function calculateFine(dueDate: string, ratePerDay = 1000): number {
  const days = getDaysOverdue(dueDate);
  return days * ratePerDay;
}

export function generateMemberCode(id: number): string {
  return `BRN-${String(id).padStart(5, '0')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
