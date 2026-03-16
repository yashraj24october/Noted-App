<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/stack-MERN-green?style=for-the-badge" />
<img src="https://img.shields.io/badge/license-MIT-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" />

# 📝 Noted

### *A beautiful, full-featured note-taking app built for real people.*

**Write · Organize · Share · Focus**

---

[Features](#-features) · [Screenshots](#-screenshots) · [Quick Start](#-quick-start) · [API Docs](#-api-reference) · [Deployment](#-deployment) · [Admin Guide](#-admin-guide)

</div>

---

## 🌟 What is Noted?

**Noted** is a self-hosted, open-source note-taking app built with the MERN stack. It's designed to be clean, fast, and genuinely useful — not bloated. Write in Markdown, organize with Notebooks, embed images, and share notes publicly with a single link.

Whether you're a student organizing lecture notes, a developer keeping code snippets, or anyone who just needs a clean place to think — Noted works for you.

---

## ✨ Features

### For Users

#### 📝 Writing Experience
- **Rich Markdown editor** — bold, italic, headings, code blocks, lists, blockquotes, dividers
- **Live split preview** — see rendered markdown as you type
- **Auto-save** — changes saved automatically every 1.5 seconds, never lose work
- **Image support** — embed images via toolbar button, drag & drop, or paste from clipboard
- **Image controls** — resize by dragging, align left/center/right, quick size presets (25% / 50% / 75% / 100%)

#### 🗂️ Organization
- **Notebooks** — group related notes into color-coded folders with custom emoji icons
- **Tags** — add multiple tags per note, filter by tag from the sidebar
- **Subjects** — academic subject/course labeling for students
- **Priority levels** — High / Medium / Low with visual indicators
- **Pin & Favorite** — mark important notes for quick access
- **Archive** — keep notes without cluttering your main view
- **Trash** — soft delete with restore support

#### 🔍 Finding Notes
- **Character-by-character search** — results appear as you type
- **Search across notes AND notebooks** simultaneously
- **Filter by** priority, tag, subject, or any combination
- **Sort by** newest, oldest, recently edited, title, or word count

#### 🌙 Personalization
- **Dark mode** — soft dark theme, easy on the eyes
- **Light mode** — warm beige palette, comfortable for long sessions
- **System preference detection** — automatically matches your OS theme on first load
- **8 note background colors** — white, warm, blue, green, rose, amber, slate, sand
- **Grid / List view** toggle

#### 🔗 Sharing
- **Public share links** — share any note with anyone, no login required
- **Revoke anytime** — disable a share link with one click
- **Beautiful shared page** — branded read-only view with theme toggle for visitors

#### 🔐 Account
- **Secure auth** — httpOnly cookie-based JWT (no localStorage tokens)
- **Auto token refresh** — sessions extend seamlessly, no surprise logouts
- **Change password** — from your profile settings
- **Forgot password** — contact admin for a reset (see below)

---

### For Admins (App Owner)

#### 📊 Admin Dashboard
Access a private admin panel protected by **email + password + signed admin token** (3-layer security).

- **Platform stats** — total users, active today, active this week/month, new signups
- **Content stats** — total notes and notebooks across all users
- **Auto-expires** — admin session lasts 15 minutes, then re-verification required

#### 👥 User Management
- **Full user list** — name, email, avatar, join date, last active time
- **Per-user stats** — note count and notebook count per user
- **Live activity** — green dot indicator for users active today
- **Search & sort** — find users by name/email, sort by newest/last active/most notes
- **Reset password** — set a temporary password for any user; they'll be forced to change it on next login

#### 🛡️ Privacy & Security
- Admin panel is **invisible to regular users** — they see only a community user count
- All admin routes require both `OWNER_EMAIL` match and a valid signed admin token
- Detailed stats (names, emails) are **never exposed** to non-admin users
- Refresh tokens are signed with a separate `JWT_REFRESH_SECRET`

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Vite 5 |
| **Styling** | Tailwind CSS 3 + CSS Variables (full dark/light theme system) |
| **Fonts** | Instrument Serif · DM Sans · DM Mono |
| **HTTP** | Axios with auto-refresh interceptor |
| **Backend** | Node.js 20, Express 4 |
| **Database** | MongoDB 7 + Mongoose |
| **Auth** | JWT (httpOnly cookies) + bcryptjs |
| **File Upload** | Multer + MD5 deduplication |
| **Toasts** | react-hot-toast |
| **Dates** | date-fns |
| **Dev** | nodemon, concurrently |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** running locally (or a MongoDB Atlas URI)
- **npm** v8+

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/noted-app.git
cd noted-app
npm run install-all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/noted_app

# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_64_char_random_string_here
JWT_REFRESH_SECRET=a_different_64_char_random_string_here

# Admin panel access (your email + a separate secret)
OWNER_EMAIL=your@email.com
ADMIN_SECRET=another_random_string_here
```

### 3. Configure Frontend

```bash
cd frontend
```

Create `frontend/.env`:

```env
# Must match OWNER_EMAIL in backend — enables admin panel click for this account
VITE_OWNER_EMAIL=your@email.com
```

### 4. Start Development

```bash
# From the root noted-app/ directory:
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:3000 |
| Backend (Express) | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

---

## 📁 Project Structure

```
noted-app/
├── backend/
│   ├── models/
│   │   ├── User.js              ← User schema with auth fields
│   │   ├── Note.js              ← Notes with tags, priority, notebooks[]
│   │   ├── Notebook.js          ← Notebook folders
│   │   └── UploadedImage.js     ← Image deduplication by MD5 hash
│   ├── routes/
│   │   ├── auth.js              ← Register, login, refresh, logout, change-password
│   │   ├── notes.js             ← Full CRUD + pin/fav/archive/trash/share
│   │   ├── notebooks.js         ← Notebook CRUD + add/remove notes
│   │   ├── images.js            ← Upload, serve, delete images
│   │   ├── shared.js            ← Public share link (no auth)
│   │   ├── tags.js              ← Tag aggregation
│   │   └── users.js             ← Admin stats, user list, password reset
│   ├── middleware/
│   │   └── auth.js              ← JWT protect middleware (cookie-based)
│   ├── uploads/                 ← Uploaded images (gitignored)
│   ├── server.js                ← Express app + MongoDB connect
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      ← Session, login/logout, token refresh
│   │   │   ├── NotesContext.jsx     ← Notes state, all mutations
│   │   │   ├── NotebooksContext.jsx ← Notebooks state, add/remove notes
│   │   │   └── ThemeContext.jsx     ← Dark/light mode, localStorage persist
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx         ← Login, register, forgot/force-change password
│   │   │   ├── DashboardPage.jsx    ← Main app shell, all modals
│   │   │   └── SharedNotePage.jsx   ← Public read-only note view
│   │   └── components/
│   │       ├── Sidebar.jsx          ← Navigation, notebooks list, community widget
│   │       ├── StatsPanel.jsx       ← Dashboard stats cards with animations
│   │       ├── NotesGrid.jsx        ← Note cards, CardMenu, Add to Notebook
│   │       ├── NoteEditor.jsx       ← Markdown editor + image upload/resize
│   │       ├── NoteViewPage.jsx     ← Read-only note panel with fullscreen
│   │       ├── NotebooksPanel.jsx   ← Notebook grid, notebook view, add notes modal
│   │       ├── ShareModal.jsx       ← Generate/revoke share links
│   │       ├── AppStatsWidget.jsx   ← Community badge + owner admin panel
│   │       ├── ThemeToggle.jsx      ← Animated sun/moon toggle
│   │       └── Tooltip.jsx          ← Portal-based, never clipped
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── DEPLOYMENT.md               ← Complete VPS deployment guide
└── package.json                ← Root dev scripts
```

---

## 🔌 API Reference

### Auth  `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | Public | Create account, sets cookies |
| `POST` | `/login` | Public | Login, sets cookies |
| `POST` | `/refresh` | Cookie | Rotate tokens silently |
| `GET`  | `/me` | Cookie | Get current user + update lastActive |
| `POST` | `/logout` | Public | Clear cookies |
| `POST` | `/change-password` | Cookie | Verify current pw + set new |

### Notes  `/api/notes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/` | List notes (filters: search, tag, subject, priority, pinned, favorites, archived, trashed) |
| `GET`  | `/stats` | Dashboard statistics aggregation |
| `POST` | `/` | Create note |
| `PUT`  | `/:id` | Update note |
| `DELETE` | `/:id` | Soft delete (trash) |
| `DELETE` | `/:id?permanent=true` | Hard delete |
| `PUT`  | `/:id/restore` | Restore from trash |
| `POST` | `/:id/duplicate` | Duplicate note |

### Notebooks  `/api/notebooks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/` | List notebooks with note counts (supports `?search=`) |
| `POST` | `/` | Create notebook |
| `PUT`  | `/:id` | Update notebook |
| `DELETE` | `/:id` | Delete notebook (notes unlinked, not deleted) |
| `GET`  | `/:id/notes` | Notes inside a notebook |
| `POST` | `/:id/notes` | Add notes to notebook `{ noteIds: [] }` |
| `DELETE` | `/:id/notes` | Remove notes from notebook `{ noteIds: [] }` |

### Shared  `/api/shared`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/:token` | **Public** | Fetch shared note by token |
| `POST` | `/:id/share` | Cookie | Generate share token |
| `DELETE` | `/:id/share` | Cookie | Revoke share token |

### Images  `/api/images`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload` | Cookie | Upload image (multipart/form-data, field: `image`) |
| `GET`  | `/:fileName` | **Public** | Serve image file |
| `DELETE` | `/:fileName` | Cookie | Delete image + metadata |

### Admin  `/api/users` *(requires x-admin-token header)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/public-stats` | Total users + notes (public, all users) |
| `POST` | `/admin-verify` | Verify password → returns admin token |
| `GET`  | `/app-stats` | Full platform stats (owner only) |
| `GET`  | `/all-users` | Full user list with per-user stats (owner only) |
| `POST` | `/reset-password` | Reset user's password + force change (owner only) |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Signs 15-minute access tokens |
| `JWT_REFRESH_SECRET` | **Yes** | Signs 7-day refresh tokens (must differ from JWT_SECRET) |
| `NODE_ENV` | No | `development` or `production` |
| `OWNER_EMAIL` | No | Your email — enables admin panel access |
| `ADMIN_SECRET` | No | Signs admin tokens (required if OWNER_EMAIL is set) |
| `FRONTEND_URL` | No | Your domain in production (e.g. `https://noted.yourdomain.com`) |
| `BASE_URL` | No | Base URL for image links in production |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OWNER_EMAIL` | No | Must match backend OWNER_EMAIL — makes Community badge clickable for admin |

---


## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     AUTH FLOW                           │
├─────────────────────────────────────────────────────────┤
│  Login → 2 httpOnly cookies set:                        │
│    access_token   (15 min JWT, path: /)                 │
│    refresh_token  (7 day JWT, path: /api/auth/refresh)  │
│                                                         │
│  Every request → browser sends access_token cookie      │
│  Token expires  → axios interceptor calls /refresh      │
│                → new cookies issued silently            │
│  Refresh expires → user redirected to login             │
├─────────────────────────────────────────────────────────┤
│                   ADMIN PANEL FLOW                      │
├─────────────────────────────────────────────────────────┤
│  Layer 1: VITE_OWNER_EMAIL check (frontend)             │
│  Layer 2: OWNER_EMAIL === req.user.email (backend)      │
│  Layer 3: bcrypt.compare(password, DB hash)             │
│  Layer 4: Short-lived admin JWT (15 min, ADMIN_SECRET)  │
│           stored in React memory only — never persisted │
└─────────────────────────────────────────────────────────┘
```

---

## 👤 User Guide

### Getting started

1. **Register** at `/auth` — enter your name, email, and password
2. **Create your first note** — click `+ New Note` in the top right
3. **Organize** — create Notebooks to group related notes
4. **Find anything** — use the search bar to filter notes and notebooks instantly

### Markdown cheatsheet

| Syntax | Result |
|--------|--------|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `` `code` `` | `code` |
| `# Heading 1` | Large heading |
| `## Heading 2` | Medium heading |
| `- item` | Bullet list |
| `> quote` | Blockquote |
| `---` | Horizontal rule |

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + S` | Save note |
| `Esc` | Close panel / exit fullscreen |
| `F` | Toggle fullscreen in note view |

### Adding images to notes

Three ways to embed an image:
1. Click the **🖼 toolbar button** → select file
2. **Drag & drop** an image file onto the editor
3. **Ctrl + V** to paste an image from clipboard

Once added, switch to **Split Preview** and hover the image to:
- Align left / center / right using the top control bar
- Drag the **right edge handle** to resize freely
- Click quick size presets: 25% / 50% / 75% / 100%

### Forgot your password?

Click **"Forgot password?"** on the login page. Your app admin will:
1. Set a temporary password for your account
2. Send it to you via email
3. You log in → you'll be prompted to set a new password immediately

---

## 🛡️ Admin Guide

### Accessing the admin panel

1. Log in with the owner account (`OWNER_EMAIL`)
2. Click the **🟢 Community** badge at the bottom of the sidebar (shows 🔒 for owner)
3. Enter your account password
4. Admin panel opens — session valid for 15 minutes

### Resetting a user's password

1. Open admin panel → click **"View all users →"**
2. Find the user → click **🔑 reset** button next to their name
3. Enter a temporary password
4. Share the temp password with the user (via email/WhatsApp)
5. User logs in → they'll be forced to set a new password immediately

### Understanding the stats

| Stat | Description |
|------|-------------|
| Active today | Users whose `lastActive` timestamp is today |
| Active this week | Users active in the last 7 days |
| New this week | Accounts created in the last 7 days |
| Total notes | All non-trashed notes across all users |
| Recent signups | Last 5 registered users with join date and last seen time |

---

## 📜 Scripts

```bash
# Development (runs both frontend + backend)
npm run dev

# Install all dependencies (root + backend + frontend)
npm run install-all

# Build frontend for production
npm run build

# Start backend only (production)
npm run start
```

---

## 🗺️ Roadmap

- [ ] Password reset via email (SMTP)
- [ ] Profile page (change name, avatar, preferences)
- [ ] Note templates
- [ ] Export notes as PDF / Markdown file
- [ ] Collaborative notes (real-time with WebSockets)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ by **Yash Raj**

*MCA Student · Full Stack Developer*

⭐ Star this repo if you found it useful!

</div>
