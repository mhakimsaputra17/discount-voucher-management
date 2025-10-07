# ⚛️ Discount Voucher Management - Frontend

> **Modern, responsive web application untuk mengelola voucher diskon, dibangun dengan React 19, TypeScript, Vite, dan Tailwind CSS 4.**

Frontend aplikasi yang powerful dan user-friendly untuk manajemen voucher diskon dengan fitur CRUD lengkap, CSV import/export, real-time search, sorting, pagination, dan UI/UX yang modern.

---

## 📋 Daftar Isi

- [Teknologi Stack](#-teknologi-stack)
- [Fitur](#-fitur)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Project Structure](#-project-structure)
- [Komponen Utama](#-komponen-utama)
- [Halaman & Routing](#-halaman--routing)
- [Testing](#-testing)

---

## 🛠️ Teknologi Stack

| Teknologi | Versi Minimal | Deskripsi |
|-----------|---------------|-----------|
| **Node.js** | 18.0.0+ | JavaScript runtime environment |
| **pnpm** | 8.0.0+ | Package manager (disarankan) |
| **npm** | 9.0.0+ | Alternative package manager |
| **React** | 19.1.1+ | UI library dengan hooks modern |
| **TypeScript** | 5.9.3+ | Typed superset JavaScript |
| **Vite** | 7.1.7+ | Lightning-fast build tool |
| **Tailwind CSS** | 4.1.14+ | Utility-first CSS framework |
| **React Router** | 7.9.3+ | Declarative routing untuk React |

### Dependencies (dari package.json)
```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.3",
    "tailwindcss": "^4.1.14"
  },
  "devDependencies": {
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "~5.9.3",
    "vite": "^7.1.7",
    "eslint": "^9.36.0"
  }
}
```

---

## ✨ Fitur

### 🔐 Autentikasi
- Login page dengan dummy authentication
- Token-based auth disimpan di localStorage
- Protected routes dengan redirect
- Logout functionality

### 📊 Voucher Management
- ✅ **Create**: Form create voucher dengan validasi real-time
- ✅ **Read**: List voucher dengan tabel responsive
- ✅ **Update**: Edit voucher dengan form terisi otomatis
- ✅ **Delete**: Hapus voucher dengan konfirmasi modal
- 📊 **Statistics**: Total vouchers, active, expired

### 🔍 Advanced Features
- **Search**: Filter voucher berdasarkan kode (real-time)
- **Sort**: Urutkan berdasarkan expiry date atau discount percent (ASC/DESC)
- **Pagination**: Client-side pagination (10 items per page)
- **Loading States**: Skeleton loaders & spinners
- **Empty States**: Friendly messages saat data kosong

### 📥 CSV Operations
- **Import CSV**: 
  - Upload file CSV
  - Preview 5 row pertama sebelum upload
  - Validasi per-row dengan error reporting
  - Download sample CSV template
  - Duplicate detection
- **Export CSV**: Download semua voucher dalam format CSV

### 🎨 User Interface
- Modern & minimalist design
- Fully responsive (mobile, tablet, desktop)
- Smooth animations & transitions
- Toast notifications (success/error/info)
- Modal dialogs
- Progress bars
- Custom styled form inputs
- Color-coded status badges (Active/Expired)

### ⚡ Performance
- React 19 dengan optimized rendering
- Vite untuk fast development & build
- Code splitting & lazy loading (ready)
- Memoization dengan useMemo/useCallback
- Debounced search

---

## 📦 Prasyarat

Pastikan sistem Anda telah menginstall:

### 1. **Node.js**
```bash
# Cek versi (minimal 18.0.0)
node --version
```
Download dari: https://nodejs.org/

### 2. **Package Manager**

**Opsi A: pnpm (Disarankan)**
```bash
# Install pnpm globally
npm install -g pnpm

# Cek versi (minimal 8.0.0)
pnpm --version
```

**Opsi B: npm**
```bash
# Cek versi (minimal 9.0.0)
npm --version
```

### 3. **Git**
```bash
git --version
```

---

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/mhakimsaputra17/discount-voucher-management.git
cd discount-voucher-management/frontend
```

### 2. Install Dependencies

**Menggunakan pnpm (Disarankan):**
```bash
pnpm install
```

**Menggunakan npm:**
```bash
npm install
```

### 3. Konfigurasi Environment (Optional)

Jika backend berjalan di URL lain, buat file `.env`:
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

**Edit `.env`:**
```env
VITE_API_BASE_URL=http://localhost:8080
```

> **Note:** Default API base URL sudah dikonfigurasi di `src/api/axios.ts` ke `http://localhost:8080`

---

## ⚙️ Konfigurasi

### API Base URL
Edit di `src/api/axios.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

### Tailwind CSS
Konfigurasi Tailwind ada di `index.html`:
```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: { ... }
        }
      }
    }
  }
</script>
```

### TypeScript
Konfigurasi di `tsconfig.json` dan `tsconfig.app.json`

---

## 🎯 Menjalankan Aplikasi

### Development Server
```bash
# Menggunakan pnpm
pnpm dev

# Menggunakan npm
npm run dev
```

Aplikasi akan berjalan di:
- `http://localhost:3000` (jika port 3000 available)
- `http://localhost:5173` (default Vite port)

### Production Build
```bash
# Build
pnpm build
# atau: npm run build

# Preview build
pnpm preview
# atau: npm run preview
```

Output di folder `dist/`

### Linting
```bash
pnpm lint
# atau: npm run lint
```

---

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
│
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component + routing
│   ├── index.css               # Global styles
│   ├── vite-env.d.ts           # Vite type definitions
│   │
│   ├── api/                    # API clients
│   │   └── axios.ts            # Axios instance & interceptors
│   │
│   ├── components/             # Reusable components
│   │   ├── common/             # Generic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   └── voucher/            # Voucher-specific components
│   │       ├── VoucherTable.tsx
│   │       ├── VoucherRow.tsx
│   │       ├── VoucherForm.tsx
│   │       ├── SearchBar.tsx
│   │       ├── Pagination.tsx
│   │       └── CSVUpload.tsx
│   │
│   ├── context/                # React Context
│   │   ├── AuthContext.tsx     # Auth state management
│   │   └── ToastContext.tsx    # Toast notifications
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Auth hook
│   │   ├── useToast.ts         # Toast hook
│   │   ├── useVouchers.ts      # Voucher operations
│   │   └── useSmoothProgress.ts # Progress animation
│   │
│   ├── pages/                  # Route pages
│   │   ├── Login.tsx           # Login page
│   │   ├── Dashboard.tsx       # Dashboard (unused)
│   │   ├── VoucherListPage.tsx # List vouchers
│   │   ├── VoucherFormPage.tsx # Create/Edit form
│   │   └── CSVUploadPage.tsx   # CSV upload
│   │
│   ├── types/                  # TypeScript types
│   │   ├── voucher.ts          # Voucher types
│   │   └── auth.ts             # Auth types
│   │
│   ├── utils/                  # Utility functions
│   │   ├── csv.ts              # CSV parsing/export
│   │   ├── date.ts             # Date formatting
│   │   ├── formatters.ts       # Number/string formatters
│   │   └── validators.ts       # Form validators
│   │
│   └── data/                   # Mock data (optional)
│       └── mockVouchers.ts     # Sample vouchers
│
├── index.html                  # HTML template
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── tsconfig.app.json           # App-specific TS config
├── eslint.config.js            # ESLint configuration
└── README.md                   # Dokumentasi ini
```

---

## 🧩 Komponen Utama

### Context Providers

#### AuthContext
```typescript
// Provides authentication state
const { isAuthenticated, user, login, logout } = useAuth();
```

#### ToastContext
```typescript
// Show notifications
const { showToast } = useToast();
showToast('Success!', 'success');
```

### Custom Hooks

#### useVouchers
```typescript
const {
  vouchers,        // Voucher list
  loading,         // Loading state
  pagination,      // Pagination info
  fetchVouchers,   // Fetch with filters
  createVoucher,   // Create new
  updateVoucher,   // Update existing
  deleteVoucher,   // Delete voucher
  exportCSV,       // Export to CSV
  uploadCSV        // Import CSV
} = useVouchers();
```

#### useSmoothProgress
```typescript
// Animated progress bar
const progress = useSmoothProgress(isLoading);
```

### UI Components

#### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `danger`, `outline`
Sizes: `sm`, `md`, `lg`

#### Input
```tsx
<Input
  label="Voucher Code"
  value={code}
  onChange={(e) => setCode(e.target.value)}
  error={error}
  required
/>
```

#### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Delete"
>
  <p>Are you sure?</p>
</Modal>
```

#### Toast
```tsx
<Toast
  message="Success!"
  type="success"
  onClose={handleClose}
/>
```

Types: `success`, `error`, `info`, `warning`

---

## 📄 Halaman & Routing

### Routes

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/login` | `Login` | Login page (public) |
| `/vouchers` | `VoucherListPage` | List & manage vouchers (protected) |
| `/vouchers/new` | `VoucherFormPage` | Create voucher (protected) |
| `/vouchers/edit/:id` | `VoucherFormPage` | Edit voucher (protected) |
| `/csv-upload` | `CSVUploadPage` | CSV import (protected) |
| `/` | Redirect | → `/vouchers` |

### Protected Routes
```tsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

Auto redirect ke `/login` jika belum auth.

---

## 🎨 Styling

### Tailwind CSS 4.1
Aplikasi menggunakan Tailwind CSS via Vite plugin:

**Custom Theme:**
```javascript
// vite.config.ts
export default {
  theme: {
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      danger: '#ef4444'
    }
  }
}
```

**Utility Classes:**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  // Content
</div>
```

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Example:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  // Responsive grid
</div>
```

---

## 🧪 Testing

### Manual Testing

**1. Login:**
- Buka `http://localhost:3000/login`
- Input email & password apapun
- Klik "Login"
- Redirect ke `/vouchers`

**2. Create Voucher:**
- Klik "Create Voucher"
- Isi form:
  - Voucher Code: `TEST2025`
  - Discount: `25`
  - Expiry Date: `2025-12-31`
- Klik "Create"
- Toast success muncul

**3. Search & Filter:**
- Ketik di search box
- Pilih sort option
- Lihat hasil filter

**4. Upload CSV:**
- Download sample CSV
- Upload file
- Preview data
- Klik upload
- Lihat hasil

**5. Export CSV:**
- Klik "Export CSV"
- File ter-download

### Unit Tests (Future)
```bash
# Run tests
pnpm test
# atau: npm test

# Coverage
pnpm test:coverage
```

---

## ⚡ Performance Optimization

### Implemented
- ✅ React.memo untuk prevent re-renders
- ✅ useMemo/useCallback untuk expensive calculations
- ✅ Debounced search (300ms delay)
- ✅ Lazy loading images
- ✅ Code splitting ready
- ✅ Production build optimization (Vite)

### Build Size
```bash
pnpm build

# Output:
dist/index.html                   0.x kB
dist/assets/index-[hash].js      ~150 kB (gzipped)
dist/assets/index-[hash].css     ~50 kB (gzipped)
```

---

## 🐛 Troubleshooting

### 1. **Port sudah digunakan**
```
Error: Port 3000 is already in use
```
**Solusi:**
- Vite akan auto-increment ke port 3001, 3002, dst
- Atau set manual: `vite --port 3001`

### 2. **Cannot connect to API**
```
Network Error: Failed to fetch
```
**Solusi:**
- Pastikan backend running di `http://localhost:8080`
- Cek CORS settings di backend
- Cek `API_BASE_URL` di `src/api/axios.ts`

### 3. **Build Error**
```
Error: Cannot find module
```
**Solusi:**
```bash
# Clear cache & reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 4. **TypeScript Errors**
```
Type 'X' is not assignable to type 'Y'
```
**Solusi:**
- Cek type definitions di `src/types/`
- Update TypeScript: `pnpm add -D typescript@latest`

### 5. **CSS tidak muncul**
**Solusi:**
- Pastikan Tailwind plugin aktif di `vite.config.ts`
- Restart dev server

---

## 📊 Browser Support

| Browser | Versi Minimal |
|---------|---------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Chrome Mobile | Android 90+ |

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

**Environment Variables di Vercel:**
```
VITE_API_BASE_URL=https://your-api.com
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**netlify.toml:**
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages
```bash
# Build
pnpm build

# Deploy ke gh-pages branch
pnpm add -D gh-pages
```

**package.json:**
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

---

## 📝 Environment Variables

### Development (.env.development)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_ENV=development
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_ENV=production
```

**Akses di code:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 🛠️ Development Tools

### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Vue Plugin (Volar)**
- **ESLint**
- **Prettier**

### Chrome Extensions
- **React Developer Tools**
- **Redux DevTools** (jika pakai Redux)

---

## 📚 Resources

### Documentation
- [React Docs](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

### Learning Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind Components](https://tailwindui.com/)

---

## 📝 TODO / Future Improvements

- [ ] Unit tests dengan Vitest
- [ ] E2E tests dengan Playwright
- [ ] Storybook untuk component library
- [ ] PWA support (offline mode)
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Advanced filtering (multiple criteria)
- [ ] Bulk actions (select & delete multiple)
- [ ] Voucher preview/print
- [ ] Analytics dashboard
- [ ] Real-time updates (WebSocket)
- [ ] Redux/Zustand state management
- [ ] Error boundary
- [ ] Accessibility (a11y) improvements

---

## 🤝 Kontribusi

Contributions are welcome! 

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 Lisensi

MIT License - Free to use for learning and projects

---

## 👨‍💻 Developer

**Muhammad Hakim Saputra**  
GitHub: [@mhakimsaputra17](https://github.com/mhakimsaputra17)  
Email: Contact via GitHub

---

## 🙏 Acknowledgments

- **React Team** - Amazing UI library
- **Tailwind CSS** - Beautiful utility-first CSS
- **Vite Team** - Lightning-fast build tool
- **TypeScript Team** - Type safety
- **Open Source Community** - Inspiration & support

---

**⭐ Star this repo if you find it helpful!**

**Built with ❤️ using React 19, TypeScript, Vite, and Tailwind CSS 4**
