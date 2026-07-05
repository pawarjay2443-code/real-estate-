# Real Estate Platform Backend

A production-ready, highly secure REST API backend for a Real Estate platform (similar to Zillow, 99acres, or Housing.com). This backend features property listings, agent registration/verification, search and geo-nearby filters, booking schedulers, review listings, notifications feeds, wishlists, and complete administrative analytics dashboards.

---

## 🛠️ Tech Stack
- **Runtime & Language:** Node.js + Express.js (TypeScript)
- **Database:** PostgreSQL (via Prisma ORM)
- **Caching:** Redis (search result caching & token blacklist management)
- **Auth:** JWT (Access + Refresh tokens) with Role-Based Access Control (RBAC)
- **Uploads:** Multer (local `/uploads` storage & type-validated uploads)
- **Validation:** Zod schemas
- **API Docs:** Swagger UI via OpenAPI 3.0.0
- **Testing:** Jest + Supertest integration tests

---

## 📁 Directory Structure
```
src/
  config/         # db, redis, env, and swagger config
  modules/        # Feature modules: controllers, services, routes, validations
    auth/         # register, login, refresh-token, logout
    users/        # profile updates, deletion, avatar uploads
    agents/       # application requests, verification profiles
    properties/   # listings filters, geo-queries, image galleries
    inquiries/    # buyer lead registration, owner notifications
    bookings/     # site-visit schedulers and reschedule controls
    reviews/      # ratings feeds, agent score metrics
    favorites/    # property wishlists
    admin/        # administrative filters, system analytics
    notifications/# alert feeds
  middlewares/    # auth token verification, error fallback, rate limiters
  utils/          # logger, Haversine geo-distance, response formatting
  prisma/         # prisma models and databases schema
  tests/          # Jest mock integration tests
  app.ts          # express bootstrap
  server.ts       # database link and server bootstrap
Dockerfile        # Docker image builder settings
docker-compose.yml# Multi-container local orchestration (Postgres, Redis, Express API)
```

---

## 🔑 Environment Variables (.env)
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/realestate?schema=public"

# Caching (Redis)
REDIS_URL="redis://localhost:6379"

# Security & Authentication (JWT)
JWT_ACCESS_SECRET="real_estate_jwt_access_secret_2026_long_key"
JWT_REFRESH_SECRET="real_estate_jwt_refresh_secret_2026_long_key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Email Notifications (Nodemailer SMTP)
EMAIL_HOST="smtp.mailtrap.io"
EMAIL_PORT=2525
EMAIL_USER="your_smtp_username"
EMAIL_PASS="your_smtp_password"
EMAIL_FROM="noreply@realestateapp.com"

# Local Storage
UPLOAD_DIR="./public/uploads"
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & npm
- PostgreSQL (running locally or inside Docker)
- Redis (running locally or inside Docker)

### Option 1: Quick Start with Docker (Recommended)
This starts the entire stack (PostgreSQL, Redis, and Express API) automatically with one command:
```bash
docker-compose up --build
```
The server will boot on `http://localhost:5000`.

### Option 2: Local Installation (Manual)
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migrations:**
   ```bash
   npx prisma migrate dev --schema=src/prisma/schema.prisma
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate --schema=src/prisma/schema.prisma
   ```

4. **Start the server (Development):**
   ```bash
   npm run server:dev
   ```
   The server will start listening at `http://localhost:5000`.

5. **Start Swagger Docs:**
   Open `http://localhost:5000/api-docs` in your browser.

---

## 🧪 Running Tests
We use Jest and Supertest to verify authentication flow, property management permissions, and site visit bookings:
```bash
npm run test
```

---

## 📋 API Endpoints Summary

### Auth Module
- `POST /api/auth/register` — Register new user (Buyer, Seller, Agent)
- `POST /api/auth/login` — Log in and receive Access & Refresh JWTs
- `POST /api/auth/refresh-token` — Rotate Access token using Refresh token
- `POST /api/auth/logout` — Blacklist current token in Redis and log out
- `POST /api/auth/forgot-password` — Simulate sending reset token via SMTP
- `POST /api/auth/reset-password` — Update password using token
- `GET /api/auth/me` — Retrieve active profile info

### Properties Module
- `POST /api/properties` — Create listing (Sellers/Agents/Admins)
- `GET /api/properties` — Retrieve list with pagination and multiple filters (city, type, price, etc.)
- `GET /api/properties/:id` — Retrieve full property details, images, and reviews
- `PUT /api/properties/:id` — Update listing (Owner/Assigned Agent/Admin)
- `DELETE /api/properties/:id` — Delete listing (Owner/Assigned Agent/Admin)
- `POST /api/properties/:id/images` — Upload multiple images (max 10, max 5MB/image)
- `DELETE /api/properties/:id/images/:imageId` — Delete image
- `GET /api/properties/search?query=` — Search listings (case-insensitive text search)
- `GET /api/properties/nearby?lat=&lng=&radius=` — Get properties within radius (Haversine formula utilizing bounding-box DB indexes)

### Bookings Module
- `POST /api/bookings` — Schedule site visit
- `GET /api/bookings/my` — Multi-role scheduler view
- `PATCH /api/bookings/:id` — Reschedule, cancel, or confirm visit status

### Admin Module
- `GET /api/admin/users` — Fetch users lists
- `GET /api/admin/properties` — Fetch properties lists
- `PATCH /api/admin/properties/:id/approve` — Approve listing
- `GET /api/admin/analytics` — Get total listings, users, and cumulative system revenue
- `DELETE /api/admin/users/:id` — Delete user
