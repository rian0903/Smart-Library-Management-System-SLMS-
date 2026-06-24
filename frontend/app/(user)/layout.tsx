import type { Metadata } from 'next';
import UserNavbar from '@/components/user/Navbar';
import UserFooter from '@/components/user/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Perpustakaan Kabupaten Bireuen',
    default: 'Perpustakaan Kabupaten Bireuen',
  },
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UserNavbar />
      <main style={{ flex: 1 }}>{children}</main>
      <UserFooter />
    </div>
  );
}
