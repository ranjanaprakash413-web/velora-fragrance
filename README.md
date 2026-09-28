# VELORA — Luxury 3D Animated Fragrance E-Commerce

VELORA is a production-grade full-stack e-commerce web platform for a luxury fragrance maison. It features an interactive **Three.js / React Three Fiber 3D perfume bottle canvas**, **Framer Motion transitions**, a persistent SQLite/PostgreSQL database, real JWT authentication, a server-validated 4-step checkout workflow, and public deployment blueprints.

---

## 🏛️ System Architecture

- **Frontend**: React 19, Vite 6, Three.js, React Three Fiber, React Three Drei, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js (ES Modules), Helmet, CORS, Morgan, Express Rate Limit, Bcrypt, JWT.
- **Database**: SQLite with persistent disk storage (`server/data/velora.sqlite`), ACID compliance, WAL journaling, and foreign key constraints. (Deployable to managed PostgreSQL on Neon, Supabase, or Render).
- **Deployment**:
  - Frontend: Vercel (SPA routing configured in `vercel.json`).
  - Backend: Render or Railway (configured in `render.yaml`).

---

## 🚀 Quick Start (Local Development)

### 1. Start the Backend API Server
```bash
# Option A: From root directory
npm run server:dev

# Option B: From server directory
cd server
npm install
npm run dev
```
The API server will automatically initialize tables, seed the 4 luxury perfumes and initial customer reviews, and listen on **http://localhost:5000**.
- Health Check: `http://localhost:5000/api/health`

### 2. Start the Frontend Development Server
In a new terminal window:
```bash
# In the project root directory
npm run dev
```
The frontend will start at **http://localhost:3000** (or 5173) and connect automatically to `http://localhost:5000/api`.

---

## 🔒 Demo Credentials & Seeding

The database is pre-seeded with:
- **Admin Account**: `admin@velora.com` / `VeloraAdmin2026!`
- **Customer Account**: `customer@velora.com` / `VeloraCustomer2026!`
- **Catalog**: 4 Signature Perfumes (VELORA Noir, VELORA Gold, VELORA Oud, VELORA Bloom) with full olfactive notes, size variants (30ml, 50ml, 100ml), and pricing.
- **Reviews**: 6 verified customer testimonials.

---

## 📡 API Reference

### Products
- `GET /api/products` — Retrieve all products (Supports `?category=...&search=...&sortBy=...&page=1&limit=20`)
- `GET /api/products/featured` — Retrieve featured fragrances
- `GET /api/products/:id` — Retrieve detailed single fragrance specification

### Authentication
- `POST /api/auth/register` — Register new customer account (`{ name, email, password }`)
- `POST /api/auth/login` — Login and receive JWT (`{ email, password }`)
- `GET /api/auth/me` — Current user profile and order metrics (Requires `Authorization: Bearer <token>`)

### Orders
- `POST /api/orders` — Create validated order with server-side price checking (Supports guest & authenticated checkout)
- `GET /api/orders/my-orders` — User order history (Requires `Authorization: Bearer <token>`)
- `GET /api/orders/:id` — Retrieve order receipt

### Community & Inquiries
- `GET /api/reviews` — Fetch customer reviews
- `POST /api/reviews` — Submit review (`{ name, rating, text, productId, productName }`)
- `POST /api/newsletter` — Subscribe to VELORA newsletter
- `POST /api/contact` — Submit concierge inquiry

---

## 🌐 Production Deployment Guide

### A. Deploy Frontend to Vercel
1. Push your repository to GitHub / GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Environment Variable:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
8. Click **Deploy**. Vercel will build the frontend with `vercel.json` SPA rewrite rules.

### B. Deploy Backend to Render
1. Create an account on [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your repository.
4. Set **Root Directory** to `server`.
5. Environment: **Node**.
6. Build Command: `npm install`.
7. Start Command: `node server.js`.
8. Under **Environment Variables**, set:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: A secure 64-character random string
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`
9. Under **Disks** (optional for SQLite persistence across restarts):
   - Mount Path: `/data`
   - Set `DATABASE_FILE`: `/data/velora.sqlite`
10. Click **Create Web Service**.
