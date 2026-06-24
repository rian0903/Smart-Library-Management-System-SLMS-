import type { Metadata } from 'next';
import HeroSection from '@/components/user/HeroSection';
import StatsSection from '@/components/user/StatsSection';
import PopularBooks from '@/components/user/PopularBooks';
import NewBooks from '@/components/user/NewBooks';
import CategorySection from '@/components/user/CategorySection';

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Selamat datang di Perpustakaan Kabupaten Bireuen. Temukan ribuan koleksi buku, reservasi online, dan layanan perpustakaan digital.',
};

export default function BerandaPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <PopularBooks />
      <NewBooks />
      <CategorySection />
    </>
  );
}
