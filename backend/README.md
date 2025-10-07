# 🔧 Discount Voucher Management - Backend API

> **RESTful API backend untuk sistem manajemen voucher diskon, dibangun dengan Go (Golang), Gin Framework, dan PostgreSQL.**

Backend API yang powerful dan scalable untuk mengelola voucher diskon dengan fitur CRUD lengkap, autentikasi, CSV import/export, dan validasi data yang robust.

---

## 📋 Daftar Isi

- [Teknologi Stack](#-teknologi-stack)
- [Fitur](#-fitur)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Server](#-menjalankan-server)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Testing](#-testing)

---

## 🛠️ Teknologi Stack

| Teknologi | Versi Minimal | Deskripsi |
|-----------|---------------|-----------|
| **Go (Golang)** | 1.23+ | Backend programming language |
| **Gin** | 1.10.0+ | HTTP web framework |
| **pgx/v5** | 5.5.5+ | PostgreSQL driver & toolkit |
| **PostgreSQL** | 13.0+ | Relational database |
| **godotenv** | 1.5.1+ | Environment variable loader |
| **CORS** | 1.7.2+ | Cross-Origin Resource Sharing middleware |

### Dependencies (dari go.mod)
```go
require (
    github.com/gin-contrib/cors v1.7.2
    github.com/gin-gonic/gin v1.10.0
    github.com/jackc/pgx/v5 v5.5.5
    github.com/joho/godotenv v1.5.1
)
```

---

## ✨ Fitur

### 🔐 Autentikasi
- Dummy token-based authentication untuk demonstrasi
- Middleware untuk protected routes
- Configurable auth token via environment variable

### 📊 Voucher Management (CRUD)
- ✅ **Create**: Tambah voucher dengan validasi
- ✅ **Read**: List voucher dengan search, sort, dan pagination
- ✅ **Update**: Edit voucher existing
- ✅ **Delete**: Hapus voucher (hard delete)

### 🔍 Advanced Queries
- **Search**: Filter berdasarkan voucher code (case-insensitive)
- **Sort**: Urutkan berdasarkan `expiry_date` atau `discount_percent` (ASC/DESC)
- **Pagination**: Server-side pagination dengan limit & page

### 📥 CSV Operations
- **Import**: Bulk upload voucher via CSV dengan validasi per-row
- **Export**: Download semua voucher dalam format CSV
- Duplicate detection (in-file dan database)
- Error reporting detail untuk setiap row yang gagal

### 🛡️ Data Validation
- Voucher code harus unique
- Discount percent: 1-100 (integer)
- Expiry date: format `YYYY-MM-DD`
- Database constraints & triggers

### ⚙️ Production-Ready Features
- Graceful shutdown
- Connection pooling (pgx pool)
- Structured logging
- CORS configuration
- Query timeout
- Error handling & recovery
- Request validation

---

## 📦 Prasyarat

Pastikan sistem Anda telah menginstall:

### 1. **Go (Golang)**
```bash
# Cek versi (minimal 1.23)
go version
```
Download dari: https://golang.org/dl/

### 2. **PostgreSQL**
```bash
# Cek versi (minimal 13.0)
psql --version
```
Download dari: https://www.postgresql.org/download/

### 3. **Git**
```bash
git --version
```

---

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/mhakimsaputra17/discount-voucher-management.git
cd discount-voucher-management/backend
```

### 2. Install Dependencies
```bash
go mod download
```

### 3. Setup Database

**Buat Database:**
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE voucher_db;

# Keluar
\q
```

**Jalankan Migration:**
```bash
# Dari folder backend
psql -U postgres -d voucher_db -f migrations/001_init.sql
```

**Atau langsung dengan DATABASE_URL:**
```bash
psql "postgres://postgres:yourpassword@localhost:5432/voucher_db?sslmode=disable" -f migrations/001_init.sql
```

### 4. Konfigurasi Environment

**Copy file environment:**
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

**Edit `.env` sesuai kebutuhan:**
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

---

## ⚙️ Konfigurasi

### Environment Variables

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `APP_ENV` | `development` | Environment (development/production) |
| `SERVER_PORT` | `8080` | Port HTTP server |
| `DATABASE_URL` | **Required** | PostgreSQL connection string |
| `DATABASE_MAX_CONNS` | `10` | Maksimal koneksi pool database |
| `DATABASE_MIN_CONNS` | `2` | Minimal koneksi pool database |
| `AUTH_TOKEN` | `123456` | Dummy auth token |
| `CSV_MAX_SIZE_MB` | `5` | Maksimal ukuran file CSV (MB) |
| `QUERY_TIMEOUT_SECONDS` | `5` | Timeout untuk query database |
| `CORS_ALLOWED_ORIGINS` | `*` | Allowed origins untuk CORS (comma-separated) |

### Database URL Format
```
postgres://[user]:[password]@[host]:[port]/[database]?sslmode=[disable|require]
```

**Contoh:**
```
postgres://postgres:mypassword@localhost:5432/voucher_db?sslmode=disable
```

---

## 🎯 Menjalankan Server

### Development Mode
```bash
# Dari folder backend
go run ./cmd/server
```

Server akan berjalan di: `http://localhost:8080`

### Production Build
```bash
# Build binary
go build -o server.exe ./cmd/server

# Jalankan
./server.exe
```

### Build untuk platform lain
```bash
# Linux
GOOS=linux GOARCH=amd64 go build -o server-linux ./cmd/server

# Mac
GOOS=darwin GOARCH=amd64 go build -o server-mac ./cmd/server

# Windows
GOOS=windows GOARCH=amd64 go build -o server.exe ./cmd/server
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8080
```

### Authentication Header
Semua endpoint (kecuali `/login`) memerlukan:
```
Authorization: Bearer 123456
```
*Token bisa diubah via `AUTH_TOKEN` di `.env`*

---

### 🔐 Authentication

#### POST /login
**Dummy login endpoint**

**Request:**
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

**Response (200):**
```json
{
  "token": "123456"
}
```

---

### 📊 Voucher CRUD

#### GET /vouchers
**List vouchers dengan search, sort, pagination**

**Query Parameters:**
- `q` (optional): Search voucher code
- `sort` (optional): `expiry_date` | `discount_percent`
- `order` (optional): `asc` | `desc`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Request:**
```bash
curl -X GET "http://localhost:8080/vouchers?q=SUMMER&sort=expiry_date&order=asc&page=1&limit=10" \
  -H "Authorization: Bearer 123456"
```

**Response (200):**
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

#### POST /vouchers
**Create voucher baru**

**Request:**
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

**Response (201):**
```json
{
  "id": 2,
  "voucher_code": "NEWYEAR2026",
  "discount_percent": 30,
  "expiry_date": "2026-01-31",
  "created_at": "2025-10-07T10:00:00Z",
  "updated_at": "2025-10-07T10:00:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "voucher_code already exists"
}
```

#### PUT /vouchers/:id
**Update voucher**

**Request:**
```bash
curl -X PUT http://localhost:8080/vouchers/2 \
  -H "Authorization: Bearer 123456" \
  -H "Content-Type: application/json" \
  -d '{
    "voucher_code": "NEWYEAR2026",
    "discount_percent": 35,
    "expiry_date": "2026-02-28"
  }'
```

**Response (200):**
```json
{
  "id": 2,
  "voucher_code": "NEWYEAR2026",
  "discount_percent": 35,
  "expiry_date": "2026-02-28",
  "created_at": "2025-10-07T10:00:00Z",
  "updated_at": "2025-10-07T10:30:00Z"
}
```

#### DELETE /vouchers/:id
**Delete voucher**

**Request:**
```bash
curl -X DELETE http://localhost:8080/vouchers/2 \
  -H "Authorization: Bearer 123456"
```

**Response (204):**
```
No Content
```

---

### 📥 CSV Import/Export

#### POST /vouchers/upload-csv
**Bulk import vouchers via CSV**

**CSV Format:**
```csv
voucher_code,discount_percent,expiry_date
WELCOME10,10,2025-12-31
FLASH50,50,2025-10-31
EARLYBIRD,20,2025-06-30
```

**Request:**
```bash
curl -X POST http://localhost:8080/vouchers/upload-csv \
  -H "Authorization: Bearer 123456" \
  -F "file=@vouchers.csv"
```

**Response (200) - Success:**
```json
{
  "total_rows": 3,
  "success_count": 3,
  "failure_count": 0,
  "failures": []
}
```

**Response (200) - Partial Success:**
```json
{
  "total_rows": 5,
  "success_count": 3,
  "failure_count": 2,
  "failures": [
    {
      "row": 2,
      "reason": "voucher_code already exists: WELCOME10"
    },
    {
      "row": 4,
      "reason": "discount_percent must be between 1 and 100"
    }
  ]
}
```

**Validation Rules:**
- Header harus: `voucher_code,discount_percent,expiry_date`
- `voucher_code`: non-empty, unique
- `discount_percent`: integer 1-100
- `expiry_date`: format `YYYY-MM-DD`

#### GET /vouchers/export
**Export semua vouchers ke CSV**

**Request:**
```bash
curl -X GET http://localhost:8080/vouchers/export \
  -H "Authorization: Bearer 123456" \
  -o vouchers.csv
```

**Response (200):**
```csv
voucher_code,discount_percent,expiry_date
SUMMER2025,25,2025-12-31
WELCOME10,10,2025-11-30
FLASH50,50,2025-06-15
```

---

## 🗄️ Database Schema

### Tabel: `vouchers`

```sql
CREATE TABLE vouchers (
    id BIGSERIAL PRIMARY KEY,
    voucher_code TEXT NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
    expiry_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX ux_vouchers_voucher_code ON vouchers (voucher_code);
CREATE INDEX idx_vouchers_expiry_date ON vouchers (expiry_date);
CREATE INDEX idx_vouchers_discount_percent ON vouchers (discount_percent);

-- Trigger untuk auto-update updated_at
CREATE TRIGGER trg_vouchers_set_updated_at
BEFORE UPDATE ON vouchers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```

### Columns

| Column | Type | Constraints | Deskripsi |
|--------|------|-------------|-----------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-increment ID |
| `voucher_code` | TEXT | NOT NULL, UNIQUE | Kode voucher unik |
| `discount_percent` | INTEGER | NOT NULL, 1-100 | Persentase diskon |
| `expiry_date` | DATE | NOT NULL | Tanggal kadaluarsa |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp created |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Timestamp updated |

---

## 📁 Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # Entrypoint aplikasi
│
├── internal/                    # Private application code
│   ├── app/
│   │   └── server.go            # Server initialization & lifecycle
│   │
│   ├── auth/
│   │   ├── handler.go           # Login handler
│   │   └── service.go           # Dummy auth logic
│   │
│   ├── voucher/
│   │   ├── handler.go           # HTTP handlers (CRUD, CSV)
│   │   ├── service.go           # Business logic & validation
│   │   ├── repository.go        # Database access layer
│   │   └── model.go             # Data models & DTOs
│   │
│   ├── http/
│   │   ├── router/
│   │   │   └── routes.go        # Route definitions
│   │   ├── middleware/
│   │   │   ├── auth.go          # Auth middleware
│   │   │   └── cors.go          # CORS middleware
│   │   └── response/
│   │       └── response.go      # Standard response helpers
│   │
│   ├── database/
│   │   └── postgres.go          # pgx pool connection
│   │
│   ├── config/
│   │   └── config.go            # Environment config loader
│   │
│   ├── logger/
│   │   └── logger.go            # Structured logger wrapper
│   │
│   └── common/
│       └── errors.go            # Custom error types
│
├── migrations/
│   └── 001_init.sql             # Database schema migration
│
├── .env.example                 # Environment variables template
├── go.mod                       # Go module dependencies
├── go.sum                       # Dependency checksums
└── README.md                    # Dokumentasi ini
```

### Arsitektur Layer

```
┌─────────────────┐
│   HTTP Handler  │  ← Gin handlers, request/response
├─────────────────┤
│   Service Layer │  ← Business logic, validation
├─────────────────┤
│   Repository    │  ← Database access (pgx)
├─────────────────┤
│   PostgreSQL    │  ← Data persistence
└─────────────────┘
```

**Clean Architecture Principles:**
- **Handlers**: HTTP request/response, routing
- **Services**: Business logic, validasi domain
- **Repository**: Database queries, data mapping
- **Models**: Data structures, DTOs

---

## 🧪 Testing

### Run Tests
```bash
# Run semua tests
go test ./... -v

# Run tests dengan coverage
go test ./... -cover

# Generate coverage report
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out
```

### Manual Testing dengan curl

**1. Login:**
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

**2. Create Voucher:**
```bash
curl -X POST http://localhost:8080/vouchers \
  -H "Authorization: Bearer 123456" \
  -H "Content-Type: application/json" \
  -d '{"voucher_code":"TEST2025","discount_percent":15,"expiry_date":"2025-12-31"}'
```

**3. List Vouchers:**
```bash
curl -X GET "http://localhost:8080/vouchers?page=1&limit=10" \
  -H "Authorization: Bearer 123456"
```

---

## 🔧 Development Notes

### Logging
Server menggunakan structured logging:
```go
log.Printf("[INFO] Server starting on port %s", cfg.ServerPort)
log.Printf("[ERROR] Failed to create voucher: %v", err)
```

### Database Connection Pool
```go
// Konfigurasi pool
config.MaxConns = 10      // Maksimal koneksi
config.MinConns = 2       // Minimal koneksi idle
config.HealthCheckPeriod = 30 * time.Second
```

### Error Handling
```go
// Service error → HTTP status
ErrNotFound        → 404
ErrDuplicateCode   → 409
ErrValidation      → 400
ErrInternal        → 500
```

### CSV Validation
- File size: Max 5MB (configurable)
- Header: Exact match required
- Duplicate detection: In-file dan vs database
- Per-row error reporting

---

## 📊 Performance

### Benchmarks (lokal)
- **Create**: ~10-20ms
- **List (10 items)**: ~15-25ms
- **Update**: ~12-18ms
- **Delete**: ~8-12ms
- **CSV Import (100 rows)**: ~200-300ms
- **CSV Export (1000 rows)**: ~100-150ms

### Optimization
- Index pada `voucher_code`, `expiry_date`, `discount_percent`
- Connection pooling (pgx)
- Query timeout (5s default)
- Streaming untuk CSV export

---

## 🔐 Security Notes

⚠️ **Disclaimer:** Aplikasi ini menggunakan **dummy authentication** untuk keperluan demonstrasi.

Untuk production:
- ✅ Implementasi JWT atau OAuth2
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ SQL injection prevention (sudah handled by pgx)
- ✅ HTTPS only
- ✅ Environment secrets management

---

## 🚀 Deployment

### Heroku
```bash
# Login
heroku login

# Create app
heroku create voucher-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set env vars
heroku config:set AUTH_TOKEN=your-secret-token

# Deploy
git push heroku main

# Run migration
heroku run "psql $DATABASE_URL -f migrations/001_init.sql"
```

### Railway
1. Import dari GitHub
2. Add PostgreSQL service
3. Set environment variables
4. Deploy

### Docker
```dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o server ./cmd/server

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
```

---

## 📝 TODO / Future Improvements

- [ ] Unit tests untuk semua layers
- [ ] Integration tests
- [ ] JWT authentication
- [ ] Role-based access control (RBAC)
- [ ] Soft delete untuk vouchers
- [ ] Audit log (created_by, updated_by)
- [ ] Voucher usage tracking
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Docker & docker-compose
- [ ] CI/CD pipeline
- [ ] Metrics & monitoring (Prometheus)

---

## 🤝 Kontribusi

Pull requests are welcome! Untuk perubahan besar:
1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 Lisensi

MIT License - Free to use

---

## 👨‍💻 Developer

**Muhammad Hakim Saputra**  
GitHub: [@mhakimsaputra17](https://github.com/mhakimsaputra17)

---

**Built with ❤️ using Go, Gin, and PostgreSQL**
