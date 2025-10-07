# 🎫 Discount Voucher Management System

> **Full-stack web application untuk mengelola voucher diskon dengan fitur CRUD lengkap, import/export CSV, dan autentikasi.**

Sistem manajemen voucher diskon yang dibangun dengan **React + TypeScript** di frontend dan **Go (Golang)** di backend dengan **PostgreSQL** sebagai database.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi Stack](#️-teknologi-stack)
- [Prasyarat Instalasi](#-prasyarat-instalasi)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi & Setup](#-instalasi--setup)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

### 🔐 Autentikasi
- Login dengan dummy token-based authentication
- Protected routes dengan middleware authorization
- Session management dengan localStorage

### 📊 Manajemen Voucher
- ✅ **Create**: Tambah voucher baru dengan validasi real-time
- ✅ **Read**: Lihat daftar voucher dengan pagination
- ✅ **Update**: Edit voucher yang sudah ada
- ✅ **Delete**: Hapus voucher dengan konfirmasi
- 🔍 **Search**: Cari voucher berdasarkan kode
- 📈 **Sort**: Urutkan berdasarkan tanggal kadaluarsa atau persentase diskon
- 📄 **Pagination**: Navigasi halaman dengan server-side pagination

### 📥 Import/Export
- 📤 **Export CSV**: Download semua voucher dalam format CSV
- 📥 **Upload CSV**: Bulk import voucher dengan preview dan validasi per-baris
- ✅ Template CSV yang bisa didownload

### 🎨 User Interface
- Modern, responsive, dan mobile-friendly
- Loading states dan progress indicators
- Toast notifications untuk feedback
- Form validation dengan error messages
- Smooth animations dan transitions

---

## 🛠️ Teknologi Stack

### **Frontend**
| Teknologi | Versi Minimal | Deskripsi |
|-----------|---------------|-----------|
| **Node.js** | v18.0.0 | JavaScript runtime |
| **pnpm** | v8.0.0 | Package manager (disarankan) |
| **npm** | v9.0.0 | Alternative package manager |
| **React** | v19.1.1 | UI library |
| **TypeScript** | v5.9.3 | Type-safe JavaScript |
| **Vite** | v7.1.7 | Build tool & dev server |
| **Tailwind CSS** | v4.1.14 | Utility-first CSS framework |
| **React Router** | v7.9.3 | Client-side routing |

### **Backend**
| Teknologi | Versi Minimal | Deskripsi |
|-----------|---------------|-----------|
| **Go (Golang)** | v1.23 | Backend language |
| **Gin** | v1.10.0 | HTTP web framework |
| **pgx/v5** | v5.5.5 | PostgreSQL driver |
| **PostgreSQL** | v13.0 | Relational database |
| **godotenv** | v1.5.1 | Environment variable loader |

---

## 📦 Prasyarat Instalasi

Sebelum memulai, pastikan sistem Anda telah menginstall:

### 1. **Node.js & Package Manager**
```bash
# Cek versi Node.js (minimal v18.0.0)
node --version

# Install pnpm (disarankan)
npm install -g pnpm

# Atau gunakan npm (minimal v9.0.0)
npm --version
```

### 2. **Go (Golang)**
```bash
# Cek versi Go (minimal v1.23)
go version
```
Download dari: https://golang.org/dl/

### 3. **PostgreSQL**
```bash
# Cek versi PostgreSQL (minimal v13.0)
psql --version
```
Download dari: https://www.postgresql.org/download/

### 4. **Git**
```bash
git --version
```

---

## 📁 Struktur Proyek

```
discount-voucher-management/
├── README.md                          # 👈 File ini
├── PRD_Discount_Voucher_Management.md # Product Requirements Document
│
├── backend/                           # 🔧 Go Backend API
│   ├── cmd/server/                    # Entrypoint aplikasi
│   ├── internal/                      # Business logic
│   │   ├── app/                       # Server initialization
│   │   ├── auth/                      # Authentication handlers & service
│   │   ├── voucher/                   # Voucher CRUD (handler, service, repository)
│   │   ├── http/                      # Routing & middleware
│   │   ├── database/                  # Database connection pool
│   │   ├── config/                    # Configuration loader
│   │   └── logger/                    # Structured logging
│   ├── migrations/                    # SQL database migrations
│   ├── .env.example                   # Environment variables template
│   ├── go.mod                         # Go dependencies
│   └── README.md                      # Backend documentation
│
└── frontend/                          # ⚛️ React Frontend
    ├── src/
    │   ├── components/                # Reusable UI components
    │   │   ├── common/                # Button, Input, Modal, Toast, dll
    │   │   ├── layout/                # Header, Sidebar, Layout
    │   │   └── voucher/               # Voucher-specific components
    │   ├── pages/                     # Route pages
    │   ├── context/                   # React Context (Auth, Toast)
    │   ├── hooks/                     # Custom React hooks
    │   ├── types/                     # TypeScript type definitions
    │   ├── utils/                     # Helper functions
    │   └── api/                       # API client (axios)
    ├── public/                        # Static assets
    ├── package.json                   # Dependencies
    ├── vite.config.ts                 # Vite configuration
    ├── tsconfig.json                  # TypeScript configuration
    └── README.md                      # Frontend documentation
```

---

## 🚀 Instalasi & Setup

### **Langkah 1: Clone Repository**

```bash
git clone https://github.com/mhakimsaputra17/discount-voucher-management.git
cd discount-voucher-management
```

### **Langkah 2: Setup Database**

1. **Buat database PostgreSQL:**
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE voucher_db;

# Keluar dari psql
\q
```

2. **Jalankan migration:**
```bash
# Dari root project
psql -U postgres -d voucher_db -f backend/migrations/001_init.sql
```

### **Langkah 3: Setup Backend**

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
go mod download

# Copy environment variables
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Edit .env sesuai konfigurasi Anda
# Minimal yang harus diisi:
# DATABASE_URL=postgres://postgres:password@localhost:5432/voucher_db?sslmode=disable
# SERVER_PORT=8080
# AUTH_TOKEN=123456
# CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Contoh file `.env`:**
```env
APP_ENV=development
SERVER_PORT=8080
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/voucher_db?sslmode=disable
DATABASE_MAX_CONNS=10
DATABASE_MIN_CONNS=2
AUTH_TOKEN=123456
CSV_MAX_SIZE_MB=5
QUERY_TIMEOUT_SECONDS=5
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### **Langkah 4: Setup Frontend**

```bash
# Kembali ke root, lalu masuk ke frontend
cd ../frontend

# Install dependencies menggunakan pnpm (disarankan)
pnpm install

# Atau menggunakan npm
npm install
```

---

## 🎯 Menjalankan Aplikasi

### **Option 1: Menjalankan Secara Manual**

#### 1. **Jalankan Backend** (Terminal 1)
```bash
cd backend
go run ./cmd/server
```
✅ Backend berjalan di: `http://localhost:8080`

#### 2. **Jalankan Frontend** (Terminal 2)
```bash
cd frontend
pnpm dev
# atau: npm run dev
```
✅ Frontend berjalan di: `http://localhost:3000` atau `http://localhost:5173`

### **Option 2: Menjalankan Dengan Build**

#### Backend (Production Build)
```bash
cd backend
go build -o server.exe ./cmd/server
./server.exe
```

#### Frontend (Production Build)
```bash
cd frontend
pnpm build
pnpm preview
```

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:8080
```

### **Authentication**
Semua endpoint (kecuali `/login`) memerlukan header:
```
Authorization: Bearer 123456
```

### **Endpoints**

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/login` | Login (dummy authentication) |
| `GET` | `/vouchers` | List vouchers (search, sort, pagination) |
| `POST` | `/vouchers` | Create voucher baru |
| `PUT` | `/vouchers/:id` | Update voucher |
| `DELETE` | `/vouchers/:id` | Delete voucher |
| `POST` | `/vouchers/upload-csv` | Bulk import via CSV |
| `GET` | `/vouchers/export` | Export semua voucher ke CSV |

### **Contoh Request**

#### 1. Login
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

**Response:**
```json
{
  "token": "123456"
}
```

#### 2. List Vouchers (dengan search, sort, pagination)
```bash
curl -X GET "http://localhost:8080/vouchers?q=SUMMER&sort=expiry_date&order=asc&page=1&limit=10" \
  -H "Authorization: Bearer 123456"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "voucher_code": "SUMMER2025",
      "discount_percent": 25,
      "expiry_date": "2025-12-31",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

#### 3. Create Voucher
```bash
curl -X POST http://localhost:8080/vouchers \
  -H "Authorization: Bearer 123456" \
  -H "Content-Type: application/json" \
  -d '{
    "voucher_code": "NEWYEAR2026",
    "discount_percent": 30,
    "expiry_date": "2026-01-31"
  }'
```

#### 4. Upload CSV
```bash
curl -X POST http://localhost:8080/vouchers/upload-csv \
  -H "Authorization: Bearer 123456" \
  -F "file=@vouchers.csv"
```

**CSV Format:**
```csv
voucher_code,discount_percent,expiry_date
WELCOME10,10,2025-12-31
FLASH50,50,2025-10-31
```

---

## 🖼️ Screenshots

### Dashboard Voucher
![Voucher List](https://via.placeholder.com/800x400?text=Voucher+List+Page)

### Form Create/Edit
![Voucher Form](https://via.placeholder.com/800x400?text=Voucher+Form)

### CSV Upload
![CSV Upload](https://via.placeholder.com/800x400?text=CSV+Upload+with+Preview)

---

## 🔧 Troubleshooting

### **1. Backend tidak bisa connect ke database**
```
Error: failed to connect to database
```
**Solusi:**
- Pastikan PostgreSQL sudah berjalan
- Cek `DATABASE_URL` di file `.env`
- Cek username, password, dan nama database
- Test koneksi: `psql -U postgres -d voucher_db`

### **2. CORS Error di Frontend**
```
Access to fetch at 'http://localhost:8080' has been blocked by CORS policy
```
**Solusi:**
- Update `CORS_ALLOWED_ORIGINS` di `.env` backend
- Tambahkan URL frontend Anda (misal: `http://localhost:3000`)
- Restart backend

### **3. Port sudah digunakan**
```
Error: listen tcp :8080: bind: address already in use
```
**Solusi:**
- Ubah `SERVER_PORT` di `.env` backend (misal: `8081`)
- Atau matikan aplikasi yang menggunakan port tersebut

### **4. Frontend tidak bisa fetch API**
**Solusi:**
- Pastikan backend sudah berjalan di `http://localhost:8080`
- Cek konfigurasi API base URL di `frontend/src/api/axios.ts`
- Buka Network tab di DevTools browser untuk debug

### **5. Migration Error**
```
Error: relation "vouchers" already exists
```
**Solusi:**
- Migration sudah pernah dijalankan
- Atau drop table dulu: `DROP TABLE IF EXISTS vouchers CASCADE;`
- Lalu jalankan ulang migration

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
go test ./... -v
```

### Frontend Testing
```bash
cd frontend
pnpm test
# atau: npm test
```

---

## 📝 Catatan Penting

1. **Dummy Authentication**: Sistem ini menggunakan dummy token (`123456`) untuk keperluan demonstrasi. Untuk production, implementasikan JWT atau OAuth2.

2. **Data Persistence**: 
   - Backend: Data disimpan di PostgreSQL
   - Frontend: Token disimpan di localStorage browser

3. **Environment Variables**: Jangan commit file `.env` ke Git. File ini berisi kredensial database.

4. **CSV Size Limit**: Default maksimal 5MB. Ubah di `CSV_MAX_SIZE_MB` di `.env` jika perlu.

5. **CORS Configuration**: Pastikan URL frontend Anda terdaftar di `CORS_ALLOWED_ORIGINS` backend.

---

## 🚀 Deployment

### **Backend Deployment (Heroku/Railway)**
1. Install PostgreSQL addon
2. Set environment variables
3. Run migrations
4. Deploy

### **Frontend Deployment (Vercel/Netlify)**
1. Build project: `pnpm build`
2. Deploy folder `dist/`
3. Set environment variable: `VITE_API_BASE_URL`

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 Lisensi

Project ini menggunakan lisensi **MIT License**.

---

## 👨‍💻 Developer

**Muhammad Hakim Saputra**  
GitHub: [@mhakimsaputra17](https://github.com/mhakimsaputra17)

---

## 📞 Support

Jika ada pertanyaan atau masalah:
- 🐛 **Bug Reports**: Buat issue di GitHub
- 💡 **Feature Requests**: Buat issue dengan label `enhancement`
- 📧 **Email**: Hubungi via GitHub profile

---

## 🎉 Acknowledgments

- [React](https://react.dev/) - UI Library
- [Go Gin](https://gin-gonic.com/) - Web Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Vite](https://vitejs.dev/) - Build Tool

---

**⭐ Star repository ini jika bermanfaat!**

**Built with ❤️ using React, TypeScript, Go, and PostgreSQL**
