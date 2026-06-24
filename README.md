# Smart Library Management System (SLMS) - Perpustakaan Kabupaten Bireuen

Aplikasi Sistem Informasi Manajemen Perpustakaan Kabupaten Bireuen dirancang untuk mendigitalisasi layanan perpustakaan secara modern dan premium. Berdasarkan kebutuhan pengembangan tahap awal, project ini berjalan sebagai **Frontend Interactive Demo / Prototype** dengan persistensi state menggunakan `localStorage` agar dapat diuji coba tanpa memerlukan koneksi database aktif.

---

## 📁 Struktur Folder Project

Project ini terbagi menjadi dua bagian utama: **Frontend (Next.js 15)** dan **Backend (Laravel 12)**.

```text
project magang/
├── backend/                  # Source code backend Laravel 12 API (Scaffolding selesai)
│   ├── app/                  # Model, Controller, Middleware Laravel
│   ├── config/               # Konfigurasi aplikasi backend
│   ├── database/             # Migrations dan Seeders untuk skema database
│   ├── routes/api.php        # Endpoint REST API
│   └── .env                  # Konfigurasi database MySQL & Sanctum
│
├── frontend/                 # Source code frontend Next.js 15 (Demo Utama)
│   ├── app/                  # Next.js App Router
│   │   ├── (user)/           # Area Pengguna/Anggota (Beranda, Katalog, Profil, Buku Tamu)
│   │   ├── admin/            # Area Administrator (Dashboard, Anggota, Transaksi, Laporan, Sistem)
│   │   │   ├── kategori/     # CRUD manajemen Kategori Buku [NEW]
│   │   │   ├── penulis/      # CRUD manajemen Penulis Buku [NEW]
│   │   │   ├── rak/          # CRUD manajemen Lokasi Rak Buku [NEW]
│   │   │   ├── notifikasi/   # Halaman baca dan rekap notifikasi [NEW]
│   │   │   └── ...           # Menu admin lainnya (buku, peminjaman, dll.)
│   │   ├── daftar/           # Halaman pendaftaran anggota baru
│   │   ├── login/            # Halaman login multi-role
│   │   ├── layout.tsx        # Layout utama aplikasi (menginisialisasi tema)
│   │   └── page.tsx          # Root redirect ke /beranda
│   │
│   ├── components/           # Reusable UI Components
│   │   ├── admin/            # Sidebar, Topbar admin (dengan toggle dark mode)
│   │   ├── user/             # Navbar (dengan toggle dark mode), Footer, Hero, dll.
│   │   └── ui/               # Base UI components
│   │
│   ├── data/                 # Dummy / Mock Data statis
│   │   └── mockData.ts       # Kumpulan data buku, anggota, petugas, dll.
│   │
│   ├── store/                # State management client-side
│   │   └── authStore.ts      # Zustand auth store terhubung ke localStorage
│   │
│   └── types/                # Defini tipe TypeScript
│       └── index.ts          # Type definition untuk Buku, Anggota, Reservasi, dll.
│
└── design.md                 # Rujukan arsitektur UI dan skema desain asli
```

---

## 🔑 Akun Login Demo (Multi-Role)

Aplikasi frontend mendukung multi-role authorization. Anda dapat masuk menggunakan kredensial demo berikut pada halaman `/login`:

| Peran (Role) | Email | Sandi (Password) | Akses Utama |
|---|---|---|---|
| **Super Admin** | `superadmin@bireuen.go.id` | `password` | Kelola Petugas, Hak Akses/Role, Audit Log, Pengaturan Sistem |
| **Admin** | `admin@bireuen.go.id` | `password` | Kelola Buku, Kelola Anggota, Laporan & Statistik, Export Data |
| **Petugas (Staf)** | `ahmad@bireuen.go.id` | `password` | Transaksi Peminjaman, Pengembalian Buku, Denda Keterlambatan |
| **Anggota / User** | *(Register via `/daftar`)* | *Bebas* | Cari Buku, Reservasi Online, Lihat Profil & Kartu Digital |

---

## 🚀 Panduan Setup & Cara Menjalankan

### Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18.x atau yang lebih baru).

### Langkah-Langkah Menjalankan Frontend (Demo & Dummy)

1. Buka terminal Anda dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Instal seluruh dependensi yang diperlukan:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal (Next.js dev server):
   ```bash
   npm run dev
   ```

4. Buka peramban (browser) Anda dan akses alamat:
   **`http://localhost:3000`**

---

## 🔄 Alur Simulasi Interaktif & Fitur Unggulan

Agar demo terasa interaktif layaknya sistem asli dengan database, fitur-fitur berikut telah diaktifkan di tingkat frontend:

1. **Ganti Tema (Dark Theme Mode)**: Klik tombol ☀️/🌙 di Navbar User (sisi kanan search) atau Topbar Admin (sisi kiri notifikasi). Tema yang dipilih akan disimpan di `localStorage` dan dimuat secara otomatis saat halaman direfresh tanpa flicker putih.
2. **Manajemen Master Data Baru**:
   - `/admin/kategori`: CRUD kategori lengkap dengan picker warna hex, emoji ikon, dan penyusunan slug URL otomatis.
   - `/admin/penulis`: CRUD penulis beserta biografi singkat dan koleksi buku.
   - `/admin/rak`: CRUD tata letak rak penyimpanan buku di lantai 1, 2, atau 3.
3. **Pusat Notifikasi & Halaman Baca (`/admin/notifikasi`)**:
   - Di Topbar admin, klik ikon Bell untuk membuka popup cepat berisi notifikasi terbaru.
   - Klik **"Lihat Semua Notifikasi"** untuk pergi ke halaman khusus. Di halaman ini, Anda dapat membaca isi lengkap pesan notifikasi, menyaring berdasarkan kategori (Terlambat, Reservasi, Kembali, Sistem), menandai sebagai telah dibaca, serta menghapusnya. Badge jumlah notifikasi unread di Topbar admin akan tersinkronisasi secara real-time.
4. **Pendaftaran Anggota**: Registrasi di `/daftar` akan men-generate nomor anggota unik (`BRN-XXXXX`) secara dinamis ke `localStorage: slms_members` dan langsung masuk sesi login.
5. **Reservasi & Sirkulasi**: Anggota melakukan reservasi di halaman katalog buku, admin/petugas melakukan approval di `/admin/peminjaman`, pengembalian diproses di `/admin/pengembalian` dengan deteksi hari terlambat dan penghitungan denda otomatis (berdasarkan tarif denda harian yang diatur di menu Pengaturan).
