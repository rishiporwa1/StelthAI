# TechNova — Django Backend

Full REST API backend for the TechNova website.

## Stack
- **Django 4.2** + **Django REST Framework**
- **SimpleJWT** — access/refresh token auth
- **django-cors-headers** — CORS for React frontend
- **SQLite** (dev) → **PostgreSQL** (prod)

---

## Setup

```bash
# 1. Clone / extract project
cd technova_backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your values

# 5. Run migrations
python manage.py migrate

# 6. Create superuser (for admin panel)
python manage.py createsuperuser

# 7. Seed demo data
python manage.py seed_data

# 8. Start server
python manage.py runserver
```

Server runs at: **http://localhost:8000**
Admin panel at: **http://localhost:8000/admin/**

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | None | Register new user |
| POST | `/api/auth/login/` | None | Login → returns JWT tokens |
| POST | `/api/auth/token/refresh/` | None | Refresh access token |
| POST | `/api/auth/logout/` | Bearer | Blacklist refresh token |
| GET/PATCH | `/api/auth/me/` | Bearer | Get / update profile |
| POST | `/api/auth/change-password/` | Bearer | Change password |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact/` | Submit contact form (rate limited: 5/hr) |
| GET | `/api/services/` | List all services with items |
| GET | `/api/courses/` | List courses (`?popular=true`, `?level=beginner`) |
| GET | `/api/courses/<slug>/` | Course detail |
| GET | `/api/research/` | List research areas |
| GET | `/api/team/` | List team members (`?role=developer`) |
| GET | `/api/jobs/` | List active job openings |
| POST | `/api/careers/apply/` | Submit career application |
| GET | `/api/testimonials/` | List testimonials (`?type=client|student`) |

### Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats/` | Aggregated stats for admin dashboard |

---

## Auth Flow

### Register
```json
POST /api/auth/register/
{
  "username": "rishi",
  "email": "rishi@email.com",
  "first_name": "Rishi",
  "last_name": "Porwal",
  "password": "securepassword",
  "password2": "securepassword"
}
```
Returns: `{ user, access, refresh }`

### Login
```json
POST /api/auth/login/
{ "username": "rishi", "password": "securepassword" }
```
Returns: `{ access, refresh }`

### Using the token
```
Authorization: Bearer <access_token>
```

---

## Connecting to React Frontend

In your React app, use the base URL:
```js
const API = 'http://localhost:8000/api'

// Contact form example
await fetch(`${API}/contact/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message })
})

// Auth example
await fetch(`${API}/auth/login/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})
```

---

## Email Setup (Production)

1. Set `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` in `.env`
2. For Gmail, create an **App Password** (not your account password):
   - Google Account → Security → 2FA → App Passwords
3. Fill `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` in `.env`

In development, emails print to the console by default.

---

## Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Use a strong `SECRET_KEY`
- [ ] Switch to PostgreSQL
- [ ] Set proper `ALLOWED_HOSTS`
- [ ] Run `python manage.py collectstatic`
- [ ] Use gunicorn + nginx
- [ ] Set `CORS_ALLOWED_ORIGINS` to your frontend domain only
