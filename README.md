# 📝 Noted — Enterprise MERN Note-Taking App
### Vite + React + Tailwind CSS + Node.js + Express + MongoDB

---

## ✨ Features

- **Markdown editor** with live preview (bold, italic, headings, code, lists, blockquotes)
- **Pin, favorite, archive, trash** with restore support
- **Color-coded notes** — 8 background themes
- **Tags system** with filtering + sidebar tag cloud
- **Subject tracking** — organize by academic subject
- **Priority levels** — High / Medium / Low with progress bars
- **Full-text search** across title, content, tags, subject
- **Auto-save** for existing notes (1.5s debounce)
- **Stats dashboard** — counts, priority breakdown, top tags
- **Grid & List view** modes
- **JWT authentication** — register / login / logout
- **Responsive** sidebar with mobile overlay

---

## 🛠 Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | React 18, React Router v6               |
| Build Tool  | **Vite 5**                              |
| Styling     | **Tailwind CSS 3** (custom design system)|
| Fonts       | Instrument Serif, DM Sans, DM Mono      |
| HTTP Client | Axios                                   |
| Backend     | Node.js, Express 4                      |
| Database    | MongoDB + Mongoose                       |
| Auth        | JWT + bcryptjs                           |
| Toasts      | react-hot-toast                          |
| Dates       | date-fns                                 |
| Dev Tools   | nodemon, concurrently                    |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Install dependencies

```bash
cd noted-app
npm run install-all
```

### 2. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/noted_app
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Run in development

```bash
# From the root noted-app/ directory:
npm run dev
```

This starts:
- **Backend** → `http://localhost:5000`
- **Frontend (Vite)** → `http://localhost:3000`

---

## 📁 Project Structure

```
noted-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   ├── tags.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── index.html              ← Vite entry point
│   ├── vite.config.js          ← Vite config with proxy
│   ├── tailwind.config.js      ← Custom design tokens
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx            ← React root
│       ├── App.jsx             ← Router + providers
│       ├── index.css           ← @tailwind directives
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── NotesContext.jsx
│       ├── pages/
│       │   ├── AuthPage.jsx
│       │   └── DashboardPage.jsx
│       └── components/
│           ├── Sidebar.jsx
│           ├── StatsPanel.jsx
│           ├── NotesGrid.jsx
│           └── NoteEditor.jsx
│
└── package.json                ← Root scripts
```

---

## 🎨 Tailwind Design System

Custom tokens defined in `tailwind.config.js`:

```js
colors: {
  canvas:   '#f0ebe0',   // page background
  page:     '#ede8dd',   // main content bg
  card:     '#ffffff',   // card surfaces
  inp:      '#f7f4ef',   // input backgrounds
  sidebar:  '#1a1c23',   // dark sidebar
  primary:  '#1a1c23',   // main text
  secondary:'#6b6b78',   // muted text
  tertiary: '#a0a0ac',   // subtle text
  accent:   '#5c6ac4',   // indigo primary
  danger:   '#e05555',   // red
  warning:  '#d4891a',   // amber
  success:  '#3d9a5e',   // green
}

fontFamily: {
  serif: 'Instrument Serif'  // display headings
  sans:  'DM Sans'           // body text
  mono:  'DM Mono'           // counts, tags, code
}
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Description    |
|--------|-----------------------|----------------|
| POST   | `/api/auth/register`  | Create account |
| POST   | `/api/auth/login`     | Login          |
| GET    | `/api/auth/me`        | Get current user |

### Notes
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/notes`                | Get all notes (+ filters)|
| GET    | `/api/notes/stats`          | Statistics               |
| POST   | `/api/notes`                | Create note              |
| PUT    | `/api/notes/:id`            | Update note              |
| DELETE | `/api/notes/:id`            | Soft delete (trash)      |
| DELETE | `/api/notes/:id?permanent=true` | Hard delete          |
| PUT    | `/api/notes/:id/restore`    | Restore from trash       |
| POST   | `/api/notes/:id/duplicate`  | Duplicate                |

### Query params for `GET /api/notes`
`search`, `tag`, `subject`, `priority`, `archived`, `trashed`, `favorites`, `pinned`, `sort`, `page`, `limit`

---

## 🏗 Production Build

```bash
# Build frontend
cd frontend && npm run build

# Serve static files from Express (add to backend/server.js):
import path from 'path'
app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'))
)
```

---

## 📌 MCA Student Tips

| Subject    | Suggested Tags              |
|------------|-----------------------------|
| DBMS       | #dbms #sql #normalization   |
| Algorithms | #algo #graph #dp #sorting   |
| OS         | #os #process #memory        |
| CN         | #cn #tcp #osi #routing      |
| Web Dev    | #web #react #nodejs #api    |

Use **Pin** for current week's active topics.
Use **Archive** for completed chapters.
Use **High priority** for exam-critical notes.

---

MIT License
