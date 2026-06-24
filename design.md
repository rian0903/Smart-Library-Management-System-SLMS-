# DESIGN.MD

# Sistem Informasi Perpustakaan Kabupaten

## Tech Stack

Frontend:

* Next.js 15
* TypeScript
* Tailwind CSS
* Shadcn UI
* React Query

Backend:

* Laravel 12 REST API

Database:

* MySQL

Authentication:

* Laravel Sanctum

Role:

* Super Admin
* Admin
* Petugas
* User

---

# DESIGN SYSTEM

## Color Palette

Primary:
#3B82F6

Secondary:
#6366F1

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

Background:
#F8FAFC

Dark:
#111827

Card:
#FFFFFF

---

# APLIKASI TERBAGI MENJADI 2 AREA

1. Frontend User
2. Admin Dashboard

---

# FRONTEND USER

Referensi:
Next Tailwind Dashboard

Karakter:

* Modern
* Clean
* Friendly
* Responsive
* Banyak whitespace
* Card based layout

---

# USER LAYOUT

## Navbar

Logo Perpustakaan

Menu:

* Beranda
* Katalog Buku
* Buku Populer
* Riwayat Peminjaman
* Tentang Kami

Kanan:

* Search
* Notifikasi
* Profil

---

# HOME PAGE

## Hero Section

Menampilkan:

* Total Koleksi Buku
* Total Anggota
* Buku Baru

Button:

* Cari Buku
* Daftar Anggota

---

## Statistik

Card:

* Total Buku
* Buku Tersedia
* Buku Dipinjam
* Buku Baru

---

## Buku Populer

Grid Card

Isi:

* Cover
* Judul
* Penulis
* Rating
* Tombol Detail

---

## Buku Terbaru

Grid Layout

---

## Kategori Buku

Card Category:

* Teknologi
* Pendidikan
* Sejarah
* Novel
* Agama
* Sains

---

# KATALOG BUKU

Filter:

* Judul
* Penulis
* Kategori
* Tahun Terbit

View:

* Grid
* List

---

# DETAIL BUKU

Menampilkan:

* Cover Besar
* Deskripsi
* Stok
* Lokasi Rak
* Penulis
* Penerbit

Button:

* Pinjam Buku

---

# USER PROFILE

Menu:

* Profil Saya
* Riwayat Peminjaman
* Wishlist
* Pengaturan

---

# PETUGAS DASHBOARD

Tampilan sama seperti Frontend User namun memiliki menu tambahan:

* Dashboard
* Buku
* Anggota
* Peminjaman
* Pengembalian

---

# ADMIN DASHBOARD

Referensi:
Vue Notus Dashboard

Karakter:

* Enterprise
* Analitik
* Monitoring
* Professional
* Sidebar Gelap
* Data Heavy

---

# ADMIN LAYOUT

## Sidebar

Background:

Dark Navy

Menu:

Dashboard

Master Data

* Buku
* Kategori
* Penulis
* Penerbit
* Rak

Keanggotaan

* Anggota
* Petugas

Transaksi

* Peminjaman
* Pengembalian
* Denda

Laporan

* Buku Populer
* Statistik
* Export Data

Sistem

* Role Management
* Audit Log
* Pengaturan

---

# TOPBAR

Kiri:

* Breadcrumb

Kanan:

* Search
* Notification
* User Profile
* Dark Mode

---

# DASHBOARD ADMIN

## Ringkasan Statistik

Card:

* Total Buku
* Total Anggota
* Buku Dipinjam
* Denda Aktif
* Petugas Aktif
* Pengunjung Hari Ini

---

## Grafik Analitik

### Statistik Peminjaman

Area Chart

Periode:

* Mingguan
* Bulanan
* Tahunan

---

### Statistik Pengunjung

Bar Chart

---

### Buku Terpopuler

Pie Chart

---

### Distribusi Kategori

Donut Chart

---

# QUICK ACTION

Card Action:

* Tambah Buku
* Tambah Anggota
* Tambah Petugas
* Cetak Laporan

---

# RECENT ACTIVITY

Timeline

Menampilkan:

* Buku dipinjam
* Buku dikembalikan
* Anggota baru
* Petugas login

---

# MANAJEMEN BUKU

Fitur:

* CRUD Buku
* Import Excel
* Export Excel
* QR Code Buku
* Barcode Buku

Kolom:

* Kode
* Judul
* Penulis
* Kategori
* Stok
* Status

---

# MANAJEMEN ANGGOTA

Fitur:

* CRUD
* Aktivasi
* Nonaktifkan

Kolom:

* ID
* Nama
* Email
* Telepon
* Status

---

# TRANSAKSI PEMINJAMAN

Status:

* Menunggu
* Dipinjam
* Dikembalikan
* Terlambat

Fitur:

* Approve
* Reject
* Perpanjang

---

# MANAJEMEN DENDA

Fitur:

* Perhitungan Otomatis
* Riwayat Pembayaran
* Export

---

# ROLE MANAGEMENT

## SUPER ADMIN

Hak Akses:

* Full Access
* Kelola Admin
* Kelola Role
* Kelola Sistem
* Audit Log

---

## ADMIN

Hak Akses:

* Kelola Operasional
* Kelola Buku
* Kelola Anggota
* Kelola Laporan

---

## PETUGAS

Hak Akses:

* Peminjaman
* Pengembalian
* Data Buku

---

## USER

Hak Akses:

* Cari Buku
* Pinjam Buku
* Riwayat

---

# AUDIT LOG

Mencatat:

* Login
* Logout
* Tambah Data
* Ubah Data
* Hapus Data

---

# NOTIFICATION CENTER

Jenis:

* Buku Terlambat
* Peminjaman Baru
* Pengembalian Baru
* Sistem

---

# EXPORT DATA

Format:

* PDF
* Excel
* CSV

---

# RESPONSIVE

Desktop:

> = 1280px

Laptop:
1024px

Tablet:
768px

Mobile:
<768px

---

# FOLDER STRUCTURE

src/

├── app/
├── components/
│
├── user/
│   ├── books/
│   ├── profile/
│   └── catalog/
│
├── petugas/
│   ├── dashboard/
│   ├── loans/
│   └── returns/
│
├── admin/
│   ├── dashboard/
│   ├── analytics/
│   ├── books/
│   ├── users/
│   ├── reports/
│   └── settings/
│
├── hooks/
├── services/
├── store/
├── types/
└── utils/

---

# UI STYLE TARGET

Frontend User:

* Next Tailwind Style
* Minimalist
* Card Layout
* Friendly

Admin Dashboard:

* Vue Notus Style
* Analytics Dashboard
* Enterprise Grade
* Data Driven
* Professional
* Dark Sidebar
* Rich Charts
