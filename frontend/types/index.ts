// ==================== AUTH TYPES ====================
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'petugas' | 'user';
  avatar?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}

// ==================== MEMBER TYPES ====================
export interface Member {
  id: number;
  user_id: number;
  member_code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joined_at: string;
  expired_at: string;
  status: 'active' | 'inactive' | 'expired';
  qr_code?: string;
  avatar?: string;
  total_borrows?: number;
}

// ==================== BOOK TYPES ====================
export interface BookCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  book_count?: number;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
}

export interface Publisher {
  id: number;
  name: string;
  city: string;
}

export interface Shelf {
  id: number;
  code: string;
  location: string;
  floor: string;
}

export interface Book {
  id: number;
  code: string;
  title: string;
  author: Author;
  publisher: Publisher;
  category: BookCategory;
  shelf?: Shelf;
  year: number;
  stock: number;
  available_stock: number;
  cover?: string;
  description: string;
  isbn: string;
  status: 'available' | 'out_of_stock' | 'lost';
  rating?: number;
  borrow_count?: number;
  qr_code?: string;
  created_at: string;
}

export interface BookFilters {
  search?: string;
  category_id?: number;
  author?: string;
  year?: number;
  status?: string;
  page?: number;
  per_page?: number;
}

// ==================== RESERVATION TYPES ====================
export interface Reservation {
  id: number;
  member: Member;
  book: Book;
  reservation_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  notes?: string;
  approved_by?: User;
  created_at: string;
}

// ==================== BORROWING TYPES ====================
export interface Borrowing {
  id: number;
  member: Member;
  book: Book;
  petugas?: User;
  borrowed_at: string;
  due_date: string;
  returned_at?: string;
  status: 'active' | 'returned' | 'overdue' | 'lost';
  fine_amount: number;
  fine_paid: boolean;
  days_overdue?: number;
}

// ==================== GUEST BOOK TYPES ====================
export interface GuestBook {
  id: number;
  visitor_name: string;
  member?: Member;
  purpose: string;
  visit_date: string;
  check_in: string;
  check_out?: string;
  qr_token: string;
}

// ==================== BOOK REQUEST TYPES ====================
export interface BookRequest {
  id: number;
  user: User;
  title: string;
  author: string;
  publisher?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'procured';
  notes?: string;
  created_at: string;
}

// ==================== NOTIFICATION TYPES ====================
export interface Notification {
  id: number;
  type: 'overdue' | 'new_borrow' | 'return' | 'system' | 'reservation';
  title: string;
  message: string;
  read_at?: string;
  created_at: string;
  data?: Record<string, unknown>;
}

// ==================== ACTIVITY LOG TYPES ====================
export interface ActivityLog {
  id: number;
  user: User;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'approve' | 'reject';
  model: string;
  model_id?: number;
  description: string;
  ip_address: string;
  created_at: string;
}

// ==================== DASHBOARD TYPES ====================
export interface DashboardStats {
  total_books: number;
  total_members: number;
  books_borrowed: number;
  books_available: number;
  active_fines: number;
  active_staff: number;
  today_visitors: number;
  new_books_this_month: number;
  pending_reservations: number;
  overdue_borrowings: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

export interface DashboardCharts {
  borrowing_trend: ChartDataPoint[];
  visitor_trend: ChartDataPoint[];
  popular_books: { title: string; count: number }[];
  category_distribution: { category: string; count: number; color: string }[];
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ==================== UI TYPES ====================
export type ViewMode = 'grid' | 'list';
export type Theme = 'light' | 'dark';
export type Period = 'weekly' | 'monthly' | 'yearly';
