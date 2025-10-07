# 🎫 Voucher Management System - Frontend

Modern, responsive web application for managing discount vouchers built with **React 18**, **TypeScript**, and **Tailwind CSS 4.1**.

## ✨ Features

- 🔐 **Authentication**: Dummy login system with token-based auth
- 📊 **Voucher Management**: Full CRUD operations for vouchers
- 🔍 **Search & Filter**: Real-time search by voucher code
- 📈 **Sorting**: Sort by expiry date or discount percentage
- 📄 **Pagination**: Client-side pagination (10 items per page)
- 📤 **CSV Export**: Download vouchers as CSV file
- 📥 **CSV Import**: Bulk upload vouchers via CSV with preview
- 💾 **Local Storage**: Data persists in browser localStorage
- 🎨 **Modern UI**: Clean, minimalist design with smooth animations
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- ⚡ **Performance**: Optimized with React and Vite

## 🛠️ Tech Stack

- **React 18** - Latest stable React
- **TypeScript 5.3** - Type safety and better DX
- **Vite 5** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1** - Via Play CDN (no build step needed)
- **React Router v6** - Declarative client-side routing
- **LocalStorage** - Client-side data persistence

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm >= 9.0.0

## 🚀 Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### 3. Login

Use any email and password to login (dummy authentication)

**Example:**
- Email: `admin@example.com`
- Password: `password`

## 📦 Installation Details

Only these packages are needed (Tailwind via CDN):

```bash
# Dependencies
pnpm add react@18 react-dom@18 react-router-dom@6

# Dev Dependencies
pnpm add -D vite@5 @vitejs/plugin-react@4 typescript@5 @types/react@18 @types/react-dom@18
```

## 🎯 Features in Detail

### 📊 Voucher Management
- ✅ **Create**: Add new vouchers with real-time validation
- ✅ **Read**: View all vouchers with search and sort
- ✅ **Update**: Edit existing voucher details
- ✅ **Delete**: Remove vouchers with confirmation modal
- ✅ **Stats**: Real-time statistics (total, active, expired)

### 📥 CSV Import
- Upload CSV files with multiple vouchers
- Preview data before uploading (first 5 rows)
- Validation for duplicate voucher codes
- Detailed error reporting per row
- Download sample CSV template

### 📤 CSV Export
- Download all vouchers as CSV
- Proper CSV formatting
- Opens directly in Excel/Google Sheets

### 💾 Data Persistence
- All data stored in browser localStorage
- Survives page refresh
- Pre-loaded with 12 sample vouchers
- Easy to reset (clear localStorage)

## 🎨 Sample Data

The app comes with **12 pre-loaded vouchers**:

| Code | Discount | Expiry Date | Status |
|------|----------|-------------|--------|
| SUMMER2025 | 25% | 2025-12-31 | ✅ Active |
| WELCOME10 | 10% | 2025-11-30 | ✅ Active |
| FLASH50 | 50% | 2025-06-15 | ✅ Active |
| NEWYEAR2025 | 30% | 2025-01-31 | ❌ Expired |
| BLACKFRIDAY | 40% | 2025-11-29 | ✅ Active |
| STUDENT15 | 15% | 2025-12-31 | ✅ Active |
| EARLYBIRD | 20% | 2025-03-31 | ✅ Active |
| WEEKEND20 | 20% | 2025-12-31 | ✅ Active |
| VALENTINE | 35% | 2025-02-14 | ❌ Expired |
| SPRING2025 | 25% | 2025-05-31 | ✅ Active |
| LOYALTY50 | 50% | 2025-12-31 | ✅ Active |
| FIRSTBUY | 12% | 2025-12-31 | ✅ Active |

## 📁 Project Structure

```
src/
├── data/                  # Mock data and helpers
│   └── mockVouchers.ts   # 12 pre-loaded vouchers
├── components/           # Reusable UI components
│   ├── common/          # Button, Input, Modal, Toast, Spinner
│   ├── layout/          # Header, Layout
│   └── voucher/         # Voucher-specific components
├── context/             # AuthContext, ToastContext
├── hooks/               # useAuth, useToast, useVouchers
├── pages/               # Login, VoucherList, VoucherForm, CSVUpload
├── types/               # TypeScript type definitions
├── utils/               # CSV, formatters, validators
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Minimal global styles
```

## 🔧 Available Scripts

```bash
pnpm dev      # Start development server (http://localhost:3000)
pnpm build    # Build for production (output: dist/)
pnpm preview  # Preview production build
```

## 🎨 Tailwind CSS 4.1 via Play CDN

### Configuration

All Tailwind config is in `index.html`:

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

### Custom Styles

```html
<style type="text/tailwindcss">
  @layer utilities {
    .my-custom-class {
      @apply ...;
    }
  }
</style>
```

### Benefits

- ✅ No build step for CSS
- ✅ Instant Tailwind updates
- ✅ Built-in plugins (forms, typography)
- ✅ Smaller dependencies
- ✅ Faster setup

## 📱 Responsive Design

Fully responsive with Tailwind breakpoints:

- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md, lg)
- **Desktop**: `> 1024px` (xl, 2xl)

## 🧪 Testing the App

### Create a Voucher
1. Click "Create Voucher" button
2. Fill in the form:
   - Voucher Code: `TEST2025`
   - Discount: `20`
   - Expiry Date: `2025-12-31`
3. Click "Create Voucher"
4. See success toast notification

### Upload CSV
1. Go to "CSV Upload" page
2. Click "Download Sample CSV"
3. Upload the downloaded file
4. Preview data
5. Click "Upload"

### Export CSV
1. Go to "Vouchers" page
2. Click "Export CSV" button
3. CSV file downloads automatically

## 🔄 Reset Data

To reset to original sample data, open browser console:

```javascript
localStorage.removeItem('vouchers_data');
// Then refresh the page
```

## 🚀 Production Build

```bash
pnpm build
```

Output: `dist/` folder

Deploy to:
- ✅ Vercel
- ✅ Netlify  
- ✅ GitHub Pages
- ✅ Any static hosting

## 🐛 Known Limitations

**Dummy Data Mode:**
- Data only in browser localStorage
- No backend validation
- Single user mode
- Not shared across devices/browsers

**For Production:** Connect to Golang backend API

## 📊 Performance

- **First Load**: < 1s
- **CRUD Operations**: < 500ms (simulated delay)
- **Search**: Real-time (useTransition)
- **Bundle Size**: ~150KB (gzipped)

## 🎯 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - Free to use for learning and projects

## 👨‍💻 Developer

Built by: **@mhakimsaputra17**  
Date: **2025-10-07**

---

## 🔜 Next Steps

- [ ] Connect to Golang backend (Gin + pgx)
- [ ] Add real authentication (JWT)
- [ ] Add voucher usage tracking
- [ ] Add analytics dashboard
- [ ] Add user roles & permissions
- [ ] Add email notifications
- [ ] Add QR code generation

---

**Happy Coding! 🚀**

Built with ❤️ using React 18, TypeScript, Vite, and Tailwind CSS 4.1

---

## 📞 Support

For questions or issues:
- GitHub: [@mhakimsaputra17](https://github.com/mhakimsaputra17)
- Email: Contact via GitHub

**Star ⭐ this repo if you find it helpful!**
```