# Smart Library Management System (SLMS) - Frontend Demo

Halaman ini berisi panduan untuk menjalankan dan memahami struktur **Frontend Next.js 15** untuk aplikasi **Perpustakaan Kabupaten Bireuen**. Aplikasi ini dirancang menggunakan Next.js 15, TypeScript, Tailwind CSS, dan Zustand. 

Untuk tujuan demo/prototype, seluruh interaksi data (seperti pendaftaran, reservasi, peminjaman, pengembalian, denda, serta data master kategori, penulis, rak, dan notifikasi) disimulasikan secara dinamis menggunakan `localStorage` di sisi client.

---

## 📁 Struktur Folder Frontend

```text
frontend/
├── app/                  # Next.js App Router (Halaman & Routing)
│   ├── (user)/           # Area Anggota & Pengunjung
│   │   ├── beranda/      # Landing page utama
│   │   ├── katalog/      # Pencarian buku & Detail buku (`/katalog/[id]`)
│   │   ├── reservasi/    # Dashboard reservasi online anggota
│   │   ├── profil/       # Profil & Kartu Anggota Digital (QR Code)
│   │   ├── riwayat/      # Riwayat sirkulasi peminjaman
│   │   ├── buku-tamu/    # Form check-in pengunjung perpustakaan
│   │   └── pengajuan-buku/# Pengusulan buku baru
│   │
│   ├── admin/            # Area Dashboard Management (Super Admin, Admin, Petugas)
│   │   ├── dashboard/    # Ringkasan analitik dan grafik chart
│   │   ├── anggota/      # CRUD & aktivasi anggota
│   │   ├── buku/         # CRUD buku
│   │   ├── kategori/     # CRUD klasifikasi Kategori Buku [NEW]
│   │   ├── penulis/      # CRUD data biografi Penulis Buku [NEW]
│   │   ├── rak/          # CRUD data tata letak lokasi Rak Buku [NEW]
│   │   ├── notifikasi/   # Pusat baca & detail Notifikasi Sistem [NEW]
│   │   ├── peminjaman/   # Approve/reject reservasi online
│   │   ├── pengembalian/ # Input kembali buku & hitung denda otomatis
│   │   ├── denda/        # Rekap kas keuangan denda
│   │   ├── buku-tamu/    # Log kunjungan harian
│   │   ├── laporan/      # Laporan statistik & export CSV/PDF
│   │   └── sistem/       # Role manajemen, audit log, & konfigurasi parameter sirkulasi
│   │
│   ├── login/            # Form login multi-role
│   ├── daftar/           # Form registrasi anggota baru
│   └── page.tsx          # Root redirect ke /beranda
│
├── components/           # Komponen UI
│   ├── admin/            # Sidebar, Topbar dashboard admin (mengelola ganti tema & badge notif)
│   ├── user/             # Navbar (mengelola ganti tema & search), Footer, Hero, dll.
│   └── ui/               # Reusable UI elements
│
├── data/                 # Sumber data mock
│   └── mockData.ts       # Sample data buku, anggota, grafik analitik, dll.
│
├── store/                # Zustand State Management
│   └── authStore.ts      # Mengelola autentikasi dan session role user
│
└── lib/                  # Library & helper utilities
    ├── api.ts            # Axios client setup untuk integrasi Laravel API nanti
    └── utils.ts          # Formatter Rupiah, angka, dan tanggal
```

---

## 🔑 Data Akun Login Demo (Multi-Role)

Anda dapat masuk menggunakan kredensial dummy berikut pada halaman `/login` untuk melihat tampilan masing-masing peran:

| Peran (Role) | Email | Sandi (Password) | Menu Utama |
|---|---|---|---|
| **Super Admin** | `superadmin@bireuen.go.id` | `password` | Kelola Petugas, Edit Hak Akses/Role, Log Audit, Pengaturan Denda |
| **Admin** | `admin@bireuen.go.id` | `password` | Kelola Buku, Kelola Anggota, Kelola Kategori/Penulis/Rak, Laporan |
| **Petugas (Staf)** | `ahmad@bireuen.go.id` | `password` | Transaksi Pinjam, Proses Kembali Buku, Penerimaan Bayar Denda |
| **Anggota / User** | *(Registrasi di `/daftar`)* | *Bebas* | Cari Buku, Reservasi Buku, Lihat Kartu Anggota Digital |

---

## 🚀 Cara Menjalankan Project

1. Pastikan Anda berada dalam direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Instal seluruh package dependencies:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka browser dan buka link berikut:
   **`http://localhost:3000`**

---

## 💡 Fitur Unggulan Demo Interaktif (LocalStorage)

Seluruh logika sirkulasi perpustakaan disimulasikan menggunakan `localStorage`. Beberapa fitur baru yang dapat Anda uji coba:
* **Ganti Tema (Dark Theme)**: Klik tombol ☀️/🌙 pada bagian kanan atas di area pengguna atau admin. Tema gelap-terang sinkron di seluruh komponen Next.js lewat CSS Variables dan tidak flicker saat refresh.
* **Manajemen Master Data (Kategori, Penulis, Rak)**:
  * Kelola kategori buku di `/admin/kategori` (dengan picker warna hex, emoji, dan slug generator otomatis).
  * Kelola nama & biografi penulis di `/admin/penulis` dengan inisial avatar berwarna.
  * Kelola penempatan fisik di `/admin/rak` dengan seleksi nomor rak dan lantai gedung.
* **Halaman Baca Notifikasi (`/admin/notifikasi`)**:
  * Ikon Bell di Topbar menampilkan unread count.
  * Halaman `/admin/notifikasi` memungkinkan Anda memilih notifikasi di bilah kiri, membaca detail pesan panjangnya di bilah kanan, menandai sebagai telah dibaca, atau menghapusnya. Perubahan status "dibaca" langsung memutakhirkan badge angka notifikasi di Topbar secara real-time.
