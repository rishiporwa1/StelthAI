# TechNova — React + Vite Frontend

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build → dist/
```

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router + layout
├── index.css             # Global CSS variables & resets
│
├── services/
│   └── api.js            # All Django API calls (auth, contact, courses…)
│
├── hooks/
│   ├── useAuth.jsx       # Auth context + login/logout/register
│   └── useFetch.js       # Generic data fetching hook
│
├── components/
│   ├── Navbar.jsx / .module.css
│   ├── Footer.jsx / .module.css
│   └── UI.jsx / .module.css    # Button, Card, Badge, FormField, Input…
│
└── pages/
    ├── Home.jsx           # Landing page — hero, strengths, about, services, process, why
    ├── Training.jsx       # Courses with level filter
    ├── Team.jsx           # Team members grid
    ├── Careers.jsx        # Job listings + apply modal
    ├── Contact.jsx        # Contact form → POST /api/contact/
    ├── Login.jsx          # JWT login
    ├── Register.jsx       # User registration
    └── Dashboard.jsx      # Profile + admin stats
```

## Pages & Routes

| Route        | Page         | Auth Required |
|--------------|--------------|---------------|
| `/`          | Home         | No            |
| `/training`  | Training     | No            |
| `/team`      | Team         | No            |
| `/careers`   | Careers      | No            |
| `/contact`   | Contact      | No            |
| `/login`     | Login        | No            |
| `/register`  | Register     | No            |
| `/dashboard` | Dashboard    | Yes (redirect)|

## Backend Connection

The Vite dev server proxies `/api/*` to `http://localhost:8000` (configured in `vite.config.js`).

All pages have **fallback static data** so they render even without the Django backend running.

Once Django is running:
```bash
# Run Django backend
cd ../technova_backend
python manage.py runserver

# In another terminal, run React
cd ../technova-frontend
npm run dev
```

## Auth Flow

- JWT tokens stored in `localStorage` (access + refresh)
- Auto-refresh on 401 via `api.js`
- `useAuth` hook exposes `user`, `login`, `logout`, `register`, `isLoggedIn`
- Protected routes redirect to `/login`
