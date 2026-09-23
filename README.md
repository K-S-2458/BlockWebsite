# The Chronicle — Modern Editorial Blogging Platform

A full-stack, magazine-inspired publication platform where registered authors can write, edit, and delete their own long-form essays, and authenticated readers can engage in threaded discussions. Public visitors can freely read essays and comments without an account.

Built with an editorial aesthetic: high-contrast serif typography (*Playfair Display* / *Fraunces*), generous reading line-height (1.75), a warm off-white (`#FAF7F2`) and charcoal (`#1F1D1A`) palette, terracotta accents (`#C1502E`), light/dark mode persistence, tactile feedback, and shimmering skeleton loaders.

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router 7, Tailwind CSS, Lucide Icons, Axios, React Hook Form, Zod
- **Backend**: Node.js, Express, TypeScript, Zod, bcryptjs, jsonwebtoken, cookie-parser, express-rate-limit, helmet, cors
- **Database & ORM**: PostgreSQL 18, Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with `httpOnly` secure cookies + `Authorization: Bearer <token>` fallback

---

## Architectural Highlights

1. **Decoupled Architecture**: Completely independent Express REST API and Vite React frontend with proxy integration.
2. **Security & Auth**:
   - `httpOnly` cookies prevent XSS theft of session tokens.
   - Passwords hashed using `bcrypt` with 12 salt rounds.
   - Rate limiting on `/api/auth/login` to thwart brute-force attempts.
   - Centralized error handler returning consistent `{ "error": "message" }` shapes with proper status codes (400, 401, 403, 404, 500).
   - Strict ownership checks (`auth+own`) on post/comment edits and deletions (403 Forbidden for non-owners).
3. **Database Schema & Cascading**:
   - `User` has many `Post`s and many `Comment`s.
   - `Post` belongs to `User` and has many `Comment`s.
   - Deleting a `Post` cascades automatically to delete all of its associated `Comment`s.
4. **Modern Editorial Reading UX**:
   - Single-column feed with estimated reading time (`x min read`), excerpt truncation, author avatar, and relative dates.
   - Centered reading column (`max-w-[680px]`) for optimal optical line length.
   - Live Markdown preview during post composition with headers, blockquotes, bold text, code, and bullet lists.
   - Threaded comments with author badges and inline editing for comment owners.
   - Light/Dark mode with persistence across sessions via `localStorage`.
   - Accessible top-right toast notifications for feedback.

---

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma models (User, Post, Comment)
│   │   └── seed.ts              # Database seed script with sample articles
│   ├── src/
│   │   ├── controllers/         # Auth, Post, and Comment route controllers
│   │   ├── middleware/          # JWT auth, rate limiter, centralized error handler
│   │   ├── routes/              # Modular Express routes
│   │   ├── validators/          # Zod input validation schemas
│   │   ├── app.ts               # Express configuration & security
│   │   ├── index.ts             # Server entry point & DB connection
│   │   └── prisma.ts            # Prisma client singleton
│   ├── .env                     # Backend environment configuration
│   ├── .env.example             # Template for environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, Skeletons, EmptyState, Avatar, Modals
│   │   ├── context/             # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/               # HomePage, PostDetailPage, CreatePost, EditPost, Profile, Auth
│   │   ├── services/            # Axios instance with interceptors
│   │   ├── utils/               # Reading time calculator, relative dates, markdown parser
│   │   ├── App.tsx              # Router & providers
│   │   ├── index.css            # Tailwind & font imports
│   │   └── main.tsx             # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js       # Editorial theme configuration
│   └── vite.config.ts           # Vite proxy setup to :5000
├── package.json                 # Root orchestrator scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18+ (tested on v24.x)
- **npm**: v9+
- **PostgreSQL**: v14+ running locally or in Docker

### 1. Database Configuration

Create a PostgreSQL database named `blog_db`:

```sql
CREATE DATABASE blog_db;
```

In `backend/.env`, configure your database credentials:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:punniyam@localhost:5432/blog_db?schema=public"
JWT_SECRET="editorial_super_secret_jwt_key_2026_modern_blog"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
```

A template is also available at `backend/.env.example`.

### 2. Install Dependencies

From the project root:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or from the root directory:
```bash
npm run install:all
```

### 3. Run Prisma Migrations & Seed Data

In `backend/`:

```bash
# Push database schema to PostgreSQL
npm run prisma:push

# Populate database with editorial seed articles, users, and comments
npm run prisma:seed
```

#### Demo User Credentials (from seed):
- `elena@editorial.com` / `password123`
- `marcus@editorial.com` / `password123`
- `clara@editorial.com` / `password123`

---

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```
The REST API will be running on `http://localhost:5000`.

### Start the Frontend Client

```bash
cd frontend
npm run dev
```
The Vite dev server will be running on `http://localhost:5173`.

---

## API Endpoints Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public (Rate-Limited) | Authenticate user credentials, set `httpOnly` cookie + return JWT |
| `POST` | `/api/auth/logout` | Public / Auth | Clear session cookie |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |

### Posts (`/api/posts`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | Paginated list of posts (`?page`, `?limit`, `?search`, `?author`) |
| `GET` | `/api/posts/:id` | Public | Get single post with author information & comment count |
| `POST` | `/api/posts` | Authenticated | Create a new blog post |
| `PUT` | `/api/posts/:id` | Auth + Owner | Update post (returns 403 if not author) |
| `DELETE` | `/api/posts/:id` | Auth + Owner | Delete post and cascade delete comments (returns 403 if not author) |

### Comments (`/api/posts/:id/comments` & `/api/comments/:id`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts/:id/comments` | Public | List all comments for a post ordered chronologically |
| `POST` | `/api/posts/:id/comments` | Authenticated | Submit a comment to a post |
| `PUT` | `/api/comments/:id` | Auth + Owner | Edit comment content (returns 403 if not author) |
| `DELETE` | `/api/comments/:id` | Auth + Owner | Delete comment (returns 403 if not author) |

---

## Frontend Routes

- `/` — Magazine feed with search, category tags, author cards, reading time, and pagination
- `/login` — Login form with inline error validation
- `/register` — Account registration form
- `/posts/:id` — Full essay view with centered 680px column, author actions, and comment thread
- `/posts/new` — Protected post authoring studio with live Markdown preview
- `/posts/:id/edit` — Protected author-only post editor with live Markdown preview
- `/profile` — Protected author dashboard listing all published articles with quick edit/delete

---

## Verification & Testing

Both the backend and frontend have been verified end-to-end:
1. **Prisma & Postgres**: Schema pushed, tables created, seed executed cleanly.
2. **API Tests**:
   - Registration, login rate-limiting, session retrieval (`/api/auth/me`).
   - Post creation, pagination queries, full text search.
   - Comment threading, inline editing, and deletion.
   - Authorization validation: 403 Forbidden verified when unauthorized users attempt to edit/delete other users' posts or comments.
   - Cascade delete verified when a post is removed.
3. **Frontend Build**: TypeScript type checks and Vite production build passed without errors.
