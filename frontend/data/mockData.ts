import {
  Book,
  BookCategory,
  Member,
  Borrowing,
  GuestBook,
  DashboardStats,
  DashboardCharts,
  ActivityLog,
  Reservation,
  BookRequest,
  User,
} from '@/types';

// ==================== CATEGORIES ====================
export const mockCategories: BookCategory[] = [
  { id: 1, name: 'Teknologi', slug: 'teknologi', icon: '💻', color: '#3B82F6', book_count: 145 },
  { id: 2, name: 'Pendidikan', slug: 'pendidikan', icon: '🎓', color: '#22C55E', book_count: 230 },
  { id: 3, name: 'Sejarah', slug: 'sejarah', icon: '📜', color: '#F59E0B', book_count: 89 },
  { id: 4, name: 'Novel', slug: 'novel', icon: '📖', color: '#EC4899', book_count: 312 },
  { id: 5, name: 'Agama', slug: 'agama', icon: '🕌', color: '#10B981', book_count: 178 },
  { id: 6, name: 'Sains', slug: 'sains', icon: '🔬', color: '#8B5CF6', book_count: 96 },
  { id: 7, name: 'Hukum', slug: 'hukum', icon: '⚖️', color: '#EF4444', book_count: 67 },
  { id: 8, name: 'Ekonomi', slug: 'ekonomi', icon: '📊', color: '#F97316', book_count: 112 },
  { id: 9, name: 'Kesehatan', slug: 'kesehatan', icon: '🏥', color: '#06B6D4', book_count: 84 },
  { id: 10, name: 'Anak-Anak', slug: 'anak-anak', icon: '🧸', color: '#F43F5E', book_count: 203 },
];

// ==================== BOOKS ====================
const covers = [
  'https://covers.openlibrary.org/b/id/8739161-L.jpg',
  'https://covers.openlibrary.org/b/id/8408800-L.jpg',
  'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  'https://covers.openlibrary.org/b/id/8775558-L.jpg',
  'https://covers.openlibrary.org/b/id/9255566-L.jpg',
  'https://covers.openlibrary.org/b/id/8750297-L.jpg',
  'https://covers.openlibrary.org/b/id/12833741-L.jpg',
  'https://covers.openlibrary.org/b/id/10521270-L.jpg',
];

export const mockBooks: Book[] = [
  {
    id: 1, code: 'BKN-001', title: 'Pemrograman Web Modern dengan React', isbn: '978-602-0921-01-1',
    author: { id: 1, name: 'Ahmad Fauzi' }, publisher: { id: 1, name: 'Penerbit Informatika', city: 'Bandung' },
    category: mockCategories[0], shelf: { id: 1, code: 'A-01', location: 'Rak A', floor: 'Lantai 1' },
    year: 2023, stock: 5, available_stock: 3, cover: covers[0],
    description: 'Panduan lengkap membangun aplikasi web modern menggunakan React, TypeScript, dan ekosistemnya.',
    status: 'available', rating: 4.8, borrow_count: 87, created_at: '2023-01-15',
  },
  {
    id: 2, code: 'BKN-002', title: 'Sejarah Aceh: Dari Kesultanan ke Otonomi Khusus', isbn: '978-602-0921-02-2',
    author: { id: 2, name: 'Prof. Dr. Rusdi Sufi' }, publisher: { id: 2, name: 'Balai Pustaka', city: 'Jakarta' },
    category: mockCategories[2], shelf: { id: 2, code: 'C-03', location: 'Rak C', floor: 'Lantai 1' },
    year: 2020, stock: 3, available_stock: 1, cover: covers[1],
    description: 'Buku komprehensif tentang sejarah Aceh dari era Kesultanan hingga pemberlakuan Otonomi Khusus.',
    status: 'available', rating: 4.6, borrow_count: 143, created_at: '2020-06-10',
  },
  {
    id: 3, code: 'BKN-003', title: 'Laskar Pelangi', isbn: '978-979-1037-38-1',
    author: { id: 3, name: 'Andrea Hirata' }, publisher: { id: 3, name: 'Bentang Pustaka', city: 'Yogyakarta' },
    category: mockCategories[3], shelf: { id: 3, code: 'D-05', location: 'Rak D', floor: 'Lantai 2' },
    year: 2005, stock: 8, available_stock: 6, cover: covers[2],
    description: 'Novel inspiratif tentang semangat anak-anak Belitung dalam meraih pendidikan.',
    status: 'available', rating: 4.9, borrow_count: 312, created_at: '2019-03-01',
  },
  {
    id: 4, code: 'BKN-004', title: 'Fikih Islam Lengkap', isbn: '978-602-0921-04-4',
    author: { id: 4, name: 'Sulaiman Rasjid' }, publisher: { id: 4, name: 'Sinar Baru Algesindo', city: 'Bandung' },
    category: mockCategories[4], shelf: { id: 4, code: 'E-02', location: 'Rak E', floor: 'Lantai 1' },
    year: 2022, stock: 10, available_stock: 7, cover: covers[3],
    description: 'Panduan komprehensif hukum Islam mencakup ibadah, muamalah, dan hukum keluarga.',
    status: 'available', rating: 4.7, borrow_count: 198, created_at: '2022-01-20',
  },
  {
    id: 5, code: 'BKN-005', title: 'Biologi Molekuler untuk Pemula', isbn: '978-602-0921-05-5',
    author: { id: 5, name: 'Dr. Nurdiana Sari' }, publisher: { id: 5, name: 'Erlangga', city: 'Jakarta' },
    category: mockCategories[5], shelf: { id: 5, code: 'F-01', location: 'Rak F', floor: 'Lantai 2' },
    year: 2021, stock: 4, available_stock: 0, cover: covers[4],
    description: 'Pengantar biologi molekuler yang komprehensif untuk mahasiswa dan peneliti pemula.',
    status: 'out_of_stock', rating: 4.5, borrow_count: 76, created_at: '2021-08-15',
  },
  {
    id: 6, code: 'BKN-006', title: 'Hukum Perdata Indonesia', isbn: '978-602-0921-06-6',
    author: { id: 6, name: 'Prof. R. Subekti' }, publisher: { id: 6, name: 'Pradnya Paramita', city: 'Jakarta' },
    category: mockCategories[6], shelf: { id: 6, code: 'G-02', location: 'Rak G', floor: 'Lantai 2' },
    year: 2019, stock: 6, available_stock: 4, cover: covers[5],
    description: 'Referensi utama hukum perdata yang berlaku di Indonesia.',
    status: 'available', rating: 4.4, borrow_count: 89, created_at: '2019-11-01',
  },
  {
    id: 7, code: 'BKN-007', title: 'Ekonomi Pembangunan Daerah', isbn: '978-602-0921-07-7',
    author: { id: 7, name: 'Dr. Lincolin Arsyad' }, publisher: { id: 7, name: 'BPFE', city: 'Yogyakarta' },
    category: mockCategories[7], shelf: { id: 7, code: 'H-03', location: 'Rak H', floor: 'Lantai 2' },
    year: 2022, stock: 5, available_stock: 2, cover: covers[6],
    description: 'Konsep dan teori ekonomi pembangunan dengan fokus pada pengembangan daerah.',
    status: 'available', rating: 4.3, borrow_count: 64, created_at: '2022-05-10',
  },
  {
    id: 8, code: 'BKN-008', title: 'Dasar-Dasar Ilmu Kesehatan Masyarakat', isbn: '978-602-0921-08-8',
    author: { id: 8, name: 'Dr. Achmad Leki' }, publisher: { id: 5, name: 'Erlangga', city: 'Jakarta' },
    category: mockCategories[8], shelf: { id: 8, code: 'I-01', location: 'Rak I', floor: 'Lantai 3' },
    year: 2023, stock: 7, available_stock: 5, cover: covers[7],
    description: 'Buku teks komprehensif ilmu kesehatan masyarakat untuk jenjang S1.',
    status: 'available', rating: 4.6, borrow_count: 71, created_at: '2023-02-20',
  },
  {
    id: 9, code: 'BKN-009', title: 'Kurikulum Merdeka Belajar', isbn: '978-602-0921-09-9',
    author: { id: 9, name: 'Kemendikbudristek' }, publisher: { id: 7, name: 'Kemendikbud Press', city: 'Jakarta' },
    category: mockCategories[1], shelf: { id: 2, code: 'B-04', location: 'Rak B', floor: 'Lantai 1' },
    year: 2022, stock: 12, available_stock: 9, cover: covers[0],
    description: 'Panduan implementasi Kurikulum Merdeka Belajar untuk guru dan kepala sekolah.',
    status: 'available', rating: 4.2, borrow_count: 156, created_at: '2022-07-01',
  },
  {
    id: 10, code: 'BKN-010', title: 'Si Kancil dan Kawan-Kawan', isbn: '978-602-0921-10-0',
    author: { id: 10, name: 'Tim Redaksi' }, publisher: { id: 8, name: 'Gramedia', city: 'Jakarta' },
    category: mockCategories[9], shelf: { id: 9, code: 'J-01', location: 'Rak J', floor: 'Lantai 1' },
    year: 2023, stock: 15, available_stock: 12, cover: covers[1],
    description: 'Kumpulan cerita rakyat nusantara yang mendidik untuk anak-anak usia dini.',
    status: 'available', rating: 4.8, borrow_count: 234, created_at: '2023-04-05',
  },
  {
    id: 11, code: 'BKN-011', title: 'Machine Learning dengan Python', isbn: '978-602-0921-11-1',
    author: { id: 1, name: 'Ahmad Fauzi' }, publisher: { id: 1, name: 'Penerbit Informatika', city: 'Bandung' },
    category: mockCategories[0], shelf: { id: 1, code: 'A-02', location: 'Rak A', floor: 'Lantai 1' },
    year: 2023, stock: 6, available_stock: 4, cover: covers[2],
    description: 'Panduan praktis machine learning menggunakan Python, scikit-learn, dan TensorFlow.',
    status: 'available', rating: 4.7, borrow_count: 93, created_at: '2023-03-12',
  },
  {
    id: 12, code: 'BKN-012', title: 'Bumi Manusia', isbn: '978-979-417-384-0',
    author: { id: 11, name: 'Pramoedya Ananta Toer' }, publisher: { id: 9, name: 'Lentera Dipantara', city: 'Jakarta' },
    category: mockCategories[3], shelf: { id: 3, code: 'D-06', location: 'Rak D', floor: 'Lantai 2' },
    year: 2018, stock: 6, available_stock: 3, cover: covers[3],
    description: 'Novel epik tetralogi Buru, kisah cinta dan perlawanan di era kolonialisme Belanda.',
    status: 'available', rating: 4.9, borrow_count: 287, created_at: '2018-01-01',
  },
];

// ==================== MEMBERS ====================
export const mockMembers: Member[] = [
  { id: 1, user_id: 5, member_code: 'ANG-00001', name: 'Rahmat Hidayat', email: 'rahmat@gmail.com', phone: '081234567890', address: 'Jl. Medan Banda Aceh No. 12, Bireuen', joined_at: '2023-01-15', expired_at: '2025-01-15', status: 'active', total_borrows: 24, qr_code: 'ANG-00001|Rahmat Hidayat|2025-01-15' },
  { id: 2, user_id: 6, member_code: 'ANG-00002', name: 'Siti Aminah', email: 'siti@gmail.com', phone: '082345678901', address: 'Jl. Ahmad Yani No. 5, Bireuen', joined_at: '2023-02-20', expired_at: '2025-02-20', status: 'active', total_borrows: 18, qr_code: 'ANG-00002|Siti Aminah|2025-02-20' },
  { id: 3, user_id: 7, member_code: 'ANG-00003', name: 'Muhammad Rizki', email: 'rizki@gmail.com', phone: '083456789012', address: 'Desa Cot Gapu, Bireuen', joined_at: '2022-11-10', expired_at: '2024-11-10', status: 'expired', total_borrows: 42, qr_code: 'ANG-00003|Muhammad Rizki|2024-11-10' },
  { id: 4, user_id: 8, member_code: 'ANG-00004', name: 'Nurul Izzah', email: 'nurul@gmail.com', phone: '084567890123', address: 'Jl. Makmur No. 8, Bireuen', joined_at: '2023-05-01', expired_at: '2025-05-01', status: 'active', total_borrows: 11, qr_code: 'ANG-00004|Nurul Izzah|2025-05-01' },
  { id: 5, user_id: 9, member_code: 'ANG-00005', name: 'Khairul Anwar', email: 'khairul@gmail.com', phone: '085678901234', address: 'Jl. Cut Nyak Dien No. 3, Bireuen', joined_at: '2023-06-12', expired_at: '2025-06-12', status: 'active', total_borrows: 7, qr_code: 'ANG-00005|Khairul Anwar|2025-06-12' },
  { id: 6, user_id: 10, member_code: 'ANG-00006', name: 'Fatimah Zahra', email: 'fatimah@gmail.com', phone: '086789012345', address: 'Jl. Teuku Umar No. 17, Bireuen', joined_at: '2023-07-20', expired_at: '2025-07-20', status: 'active', total_borrows: 33, qr_code: 'ANG-00006|Fatimah Zahra|2025-07-20' },
  { id: 7, user_id: 11, member_code: 'ANG-00007', name: 'Irfan Maulana', email: 'irfan@gmail.com', phone: '087890123456', address: 'Gampong Blang Bladeh, Bireuen', joined_at: '2024-01-05', expired_at: '2026-01-05', status: 'active', total_borrows: 5, qr_code: 'ANG-00007|Irfan Maulana|2026-01-05' },
];

// ==================== BORROWINGS ====================
export const mockBorrowings: Borrowing[] = [
  { id: 1, member: mockMembers[0], book: mockBooks[0], borrowed_at: '2026-06-10', due_date: '2026-06-24', status: 'overdue', fine_amount: 0, fine_paid: false, days_overdue: 0 },
  { id: 2, member: mockMembers[1], book: mockBooks[2], borrowed_at: '2026-06-15', due_date: '2026-06-29', status: 'active', fine_amount: 0, fine_paid: false },
  { id: 3, member: mockMembers[2], book: mockBooks[3], borrowed_at: '2026-06-01', due_date: '2026-06-15', returned_at: '2026-06-14', status: 'returned', fine_amount: 0, fine_paid: true },
  { id: 4, member: mockMembers[3], book: mockBooks[4], borrowed_at: '2026-06-20', due_date: '2026-07-04', status: 'active', fine_amount: 0, fine_paid: false },
  { id: 5, member: mockMembers[4], book: mockBooks[1], borrowed_at: '2026-06-18', due_date: '2026-07-02', status: 'active', fine_amount: 0, fine_paid: false },
];

// ==================== RESERVATIONS ====================
export const mockReservations: Reservation[] = [
  { id: 1, member: mockMembers[0], book: mockBooks[4], reservation_date: '2026-06-22', status: 'pending', created_at: '2026-06-22' },
  { id: 2, member: mockMembers[1], book: mockBooks[6], reservation_date: '2026-06-23', status: 'approved', created_at: '2026-06-23' },
  { id: 3, member: mockMembers[5], book: mockBooks[0], reservation_date: '2026-06-24', status: 'pending', created_at: '2026-06-24' },
];

// ==================== GUEST BOOK ====================
export const mockGuestBooks: GuestBook[] = [
  { id: 1, visitor_name: 'Ahmad Firdaus', member: mockMembers[0], purpose: 'Membaca buku referensi', visit_date: '2026-06-24', check_in: '08:30', check_out: '11:00', qr_token: 'ANG-00001|Rahmat Hidayat|2025-01-15' },
  { id: 2, visitor_name: 'Rizka Maulida', purpose: 'Mengerjakan tugas kuliah', visit_date: '2026-06-24', check_in: '09:15', qr_token: 'QR002' },
  { id: 3, visitor_name: 'Budi Santoso', member: mockMembers[2], purpose: 'Meminjam buku', visit_date: '2026-06-24', check_in: '10:00', check_out: '10:30', qr_token: 'ANG-00003|Muhammad Rizki|2024-11-10' },
  { id: 4, visitor_name: 'Sari Dewi', purpose: 'Penelitian', visit_date: '2026-06-23', check_in: '13:00', check_out: '16:30', qr_token: 'QR004' },
  { id: 5, visitor_name: 'Hendra Gunawan', purpose: 'Membaca koran', visit_date: '2026-06-23', check_in: '09:00', check_out: '09:45', qr_token: 'QR005' },
  { id: 6, visitor_name: 'Fatimah Zahra', member: mockMembers[5], purpose: 'Meminjam buku', visit_date: '2026-06-24', check_in: '08:00', qr_token: 'ANG-00006|Fatimah Zahra|2025-07-20' },
];

// ==================== BOOK REQUESTS ====================
export const mockBookRequests: BookRequest[] = [
  { id: 1, user: { id: 5, name: 'Rahmat Hidayat', email: 'rahmat@gmail.com', role: 'user', is_active: true, created_at: '2023-01-15' }, title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', reason: 'Sangat dibutuhkan mahasiswa Teknik Informatika', status: 'pending', created_at: '2026-06-20' },
  { id: 2, user: { id: 6, name: 'Siti Aminah', email: 'siti@gmail.com', role: 'user', is_active: true, created_at: '2023-02-20' }, title: 'Atomic Habits', author: 'James Clear', reason: 'Buku motivasi yang sangat populer', status: 'approved', notes: 'Akan dipesan bulan depan', created_at: '2026-06-15' },
];

// ==================== ACTIVITY LOGS ====================
export const mockActivityLogs: ActivityLog[] = [
  { id: 1, user: { id: 2, name: 'Admin Bireuen', email: 'admin@bireuen.go.id', role: 'admin', is_active: true, created_at: '2022-01-01' }, action: 'create', model: 'Book', model_id: 12, description: 'Menambahkan buku baru: Bumi Manusia', ip_address: '192.168.1.10', created_at: '2026-06-24T08:15:00' },
  { id: 2, user: { id: 3, name: 'Petugas Ahmad', email: 'ahmad@bireuen.go.id', role: 'petugas', is_active: true, created_at: '2022-01-01' }, action: 'login', model: 'User', model_id: 3, description: 'Login ke sistem', ip_address: '192.168.1.15', created_at: '2026-06-24T08:00:00' },
  { id: 3, user: { id: 2, name: 'Admin Bireuen', email: 'admin@bireuen.go.id', role: 'admin', is_active: true, created_at: '2022-01-01' }, action: 'approve', model: 'Reservation', model_id: 2, description: 'Menyetujui reservasi buku: Ekonomi Pembangunan Daerah', ip_address: '192.168.1.10', created_at: '2026-06-24T09:30:00' },
  { id: 4, user: { id: 3, name: 'Petugas Ahmad', email: 'ahmad@bireuen.go.id', role: 'petugas', is_active: true, created_at: '2022-01-01' }, action: 'create', model: 'Borrowing', model_id: 5, description: 'Input peminjaman buku: Sejarah Aceh oleh Khairul Anwar', ip_address: '192.168.1.15', created_at: '2026-06-24T10:00:00' },
];

// ==================== DASHBOARD STATS ====================
export const mockDashboardStats: DashboardStats = {
  total_books: 1516,
  total_members: 847,
  books_borrowed: 134,
  books_available: 1382,
  active_fines: 23,
  active_staff: 6,
  today_visitors: 78,
  new_books_this_month: 42,
  pending_reservations: 15,
  overdue_borrowings: 8,
};

// ==================== DASHBOARD CHARTS ====================
export const mockDashboardCharts: DashboardCharts = {
  borrowing_trend: [
    { label: 'Jan', value: 98 }, { label: 'Feb', value: 124 }, { label: 'Mar', value: 143 },
    { label: 'Apr', value: 118 }, { label: 'Mei', value: 156 }, { label: 'Jun', value: 134 },
  ],
  visitor_trend: [
    { label: 'Sen', value: 65 }, { label: 'Sel', value: 82 }, { label: 'Rab', value: 78 },
    { label: 'Kam', value: 91 }, { label: 'Jum', value: 110 }, { label: 'Sab', value: 45 },
  ],
  popular_books: [
    { title: 'Laskar Pelangi', count: 312 },
    { title: 'Bumi Manusia', count: 287 },
    { title: 'Si Kancil', count: 234 },
    { title: 'Fikih Islam', count: 198 },
    { title: 'Kurikulum Merdeka', count: 156 },
  ],
  category_distribution: [
    { category: 'Novel', count: 312, color: '#EC4899' },
    { category: 'Pendidikan', count: 230, color: '#22C55E' },
    { category: 'Anak-Anak', count: 203, color: '#F43F5E' },
    { category: 'Agama', count: 178, color: '#10B981' },
    { category: 'Teknologi', count: 145, color: '#3B82F6' },
    { category: 'Lainnya', count: 248, color: '#94A3B8' },
  ],
};

// ==================== USERS ====================
export const mockUsers: User[] = [
  { id: 1, name: 'Super Admin', email: 'superadmin@bireuen.go.id', role: 'super_admin', is_active: true, created_at: '2022-01-01' },
  { id: 2, name: 'Admin Bireuen', email: 'admin@bireuen.go.id', role: 'admin', is_active: true, created_at: '2022-01-01' },
  { id: 3, name: 'Petugas Ahmad', email: 'ahmad@bireuen.go.id', role: 'petugas', is_active: true, created_at: '2022-01-01' },
  { id: 4, name: 'Petugas Sari', email: 'sari@bireuen.go.id', role: 'petugas', is_active: true, created_at: '2022-06-01' },
];
