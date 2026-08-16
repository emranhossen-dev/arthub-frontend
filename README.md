# 🎨 ArtHub – Online Art Marketplace (Client)

A modern, full-stack digital platform connecting art lovers, collectors, and emerging independent artists worldwide.

## 🔗 Live Links & Repositories
- **Live Frontend App**: [https://arthubemran.netlify.app](https://arthubemran.netlify.app)
- **Backend API Server**: [https://github.com/emranhossen-dev/arthub-server.git](https://github.com/emranhossen-dev/arthub-server.git)
- **Frontend Client Repo**: [https://github.com/emranhossen-dev/arthub-frontend.git](https://github.com/emranhossen-dev/arthub-frontend.git)

---

## 🔑 Admin Credentials
- **Admin Email**: `admin@arthub.com`
- **Admin Password**: `Admin@123`

---

## ✨ Key Features

### 🌐 Public Features & Landing Page
- **Hero Carousel Banner**: Auto-rotating high-resolution digital art carousel with CTA triggers.
- **Featured Artworks**: Live MERN API integration fetching latest 6 artworks from MongoDB.
- **Art Categories Grid**: Explore paintings, digital art, sculptures, photography, and drawing.
- **Top Artists Spotlight**: Highlight top artists with avatars and sales badges.
- **Browse Artworks Page**: Public access with real-time multi-field search (title, artist, category, description), category filtering, min/max price range, sorting (newest, price low to high, price high to low), and responsive pagination.
- **Artwork Details View**: High-resolution image (ImgBB), details, community comments, and owner management controls.

### 🛡️ Authentication & Role-Based Access
- **BetterAuth Integration**: Secure email/password and Google OAuth login.
- **Role Selection**: Register as **User (Buyer)** or **Artist** during sign-up.
- **ProtectedRoute HOC**: Persistent auth check preventing login redirect bouncing on page refresh.

### 💼 Role-Specific Dashboards
- **Buyer Dashboard (`/dashboard/user`)**: Purchase history table, bought artworks collection, and Subscription Tier Management (Free, Pro $9.99, Premium $19.99).
- **Artist Dashboard (`/dashboard/artist`)**: Upload new artwork form with client-side ImgBB upload, pre-filled edit modal, live gallery management, and delete controls.
- **Admin Dashboard (`/dashboard/admin`)**: Analytics cards overview (total artworks, total sales, registered users, platform revenue) and user role management table (switch roles between user, artist, admin).

### 🚀 Challenge & Optional Features
- **Community Comment System**: Authenticated users can post and delete comments on artworks.
- **Stripe Payment Gateway**: Secure checkout sessions for artwork purchases and subscription tier upgrades.
- **Subscription Purchase Limits**: Enforced tier limits (Free: 3 items, Pro: 9 items, Premium: Unlimited).
- **Sold Out Badge**: Purchased items display "Sold Out" badges and disable purchase triggers.

---

## 🛠️ Tech Stack & Packages Used

### Frontend Stack:
- **Framework**: Next.js 16.3.1 (App Router, Turbopack)
- **Language**: JavaScript (ES6+), React 19
- **Styling**: Tailwind CSS v4, HeroUI v3
- **Icons**: `@gravity-ui/icons`
- **Authentication**: `better-auth`
- **Theme**: `next-themes` (Dark Mode)

---

## 🚀 Getting Started Locally

1. **Clone Repository**:
   ```bash
   git clone https://github.com/emranhossen-dev/arthub-frontend.git
   cd arthub-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure `.env`**:
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/artworks
   NEXT_PUBLIC_COMMENTS_API_URL=http://localhost:5000/api/comments
   NEXT_PUBLIC_PAYMENTS_API_URL=http://localhost:5000/api/payments
   NEXT_PUBLIC_ADMIN_API_URL=http://localhost:5000/api/admin
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
