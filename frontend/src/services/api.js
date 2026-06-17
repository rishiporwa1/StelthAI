const BASE = import.meta.env.VITE_API_URL || '/api'

// ── helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('access_token')
}

// Unwrap paginated response automatically
// Django REST returns { count, results: [] } — we just want the array
function unwrap(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return data
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    const refreshed = await refreshToken()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`
      const retry = await fetch(`${BASE}${path}`, { ...options, headers })
      if (!retry.ok) throw new Error(await retry.text())
      return retry.json()
    } else {
      logout()
      throw new Error('Session expired. Please login again.')
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw err
  }

  if (res.status === 204) return null
  return res.json()
}

async function refreshToken() {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('access_token', data.access)
    return true
  } catch {
    return false
  }
}

function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.href = '/login'
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  register: (data) =>
    request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),

  login: async (data) => {
    const res = await request('/auth/login/', { method: 'POST', body: JSON.stringify(data) })
    localStorage.setItem('access_token', res.access)
    localStorage.setItem('refresh_token', res.refresh)
    return res
  },

  logout: async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) {
      await request('/auth/logout/', { method: 'POST', body: JSON.stringify({ refresh }) }).catch(() => {})
    }
    logout()
  },

  me: () => request('/auth/me/'),

  updateMe: (data) => request('/auth/me/', { method: 'PATCH', body: JSON.stringify(data) }),

  changePassword: (data) =>
    request('/auth/change-password/', { method: 'POST', body: JSON.stringify(data) }),

  isLoggedIn: () => !!getToken(),
}

// ── Contact ───────────────────────────────────────────────────────────────────

export const contact = {
  submit: (data) =>
    request('/contact/', { method: 'POST', body: JSON.stringify(data) }),
}

// ── Services ──────────────────────────────────────────────────────────────────

export const services = {
  list: () => request('/services/').then(unwrap),
}

// ── Courses ───────────────────────────────────────────────────────────────────

export const courses = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/courses/${qs ? '?' + qs : ''}`).then(unwrap)
  },
  detail: (slug) => request(`/courses/${slug}/`),
}

// ── Research ──────────────────────────────────────────────────────────────────

export const research = {
  list: () => request('/research/').then(unwrap),
}

// ── Team ──────────────────────────────────────────────────────────────────────

export const team = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/team/${qs ? '?' + qs : ''}`).then(unwrap)
  },
}

// ── Careers ───────────────────────────────────────────────────────────────────

export const careers = {
  jobs: () => request('/jobs/').then(unwrap),

  apply: (data) => {
    const token = getToken()
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v)
    })
    return fetch(`${BASE}/careers/apply/`, { method: 'POST', headers, body: form })
      .then(async (res) => {
        if (!res.ok) throw await res.json()
        return res.json()
      })
  },
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export const testimonials = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/testimonials/${qs ? '?' + qs : ''}`).then(unwrap)
  },
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const dashboard = {
  stats: () => request('/dashboard/stats/'),
}

// ── Admin CRUD ────────────────────────────────────────────────────────────────

function crud(base) {
  return {
    list:   ()     => request(`/admin/${base}/`),
    get:    (id)   => request(`/admin/${base}/${id}/`),
    create: (data) => request(`/admin/${base}/`, { method: 'POST',  body: JSON.stringify(data) }),
    update: (id, data) => request(`/admin/${base}/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id)   => request(`/admin/${base}/${id}/`, { method: 'DELETE' }),
  }
}

export const admin = {
  stats:          () => request('/dashboard/stats/'),
  contacts:       crud('contacts'),
  services:       crud('services'),
  serviceItems:   crud('service-items'),
  courses:        crud('courses'),
  courseFeatures:  crud('course-features'),
  research:       crud('research'),
  team:           crud('team'),
  jobs:           crud('jobs'),
  applications:   crud('applications'),
  testimonials:   crud('testimonials'),
}