import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Services',   to: '/#services'   },
  { label: 'Training',   to: '/training'    },
  { label: 'Research',   to: '/#research'   },
  { label: 'Team',       to: '/team'        },
  { label: 'Careers',    to: '/careers'     },
  { label: 'Conference', to: '/conference'  },
  { label: 'Contact',    to: '/contact'     },
]

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo}>TechNova</Link>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {NAV_LINKS.map(({ label, to }) => (
          <li key={label}>
            <a href={to} className={styles.link} onClick={() => setMenuOpen(false)}>{label}</a>
          </li>
        ))}
        {isLoggedIn && (
          <li><NavLink to="/dashboard" className={styles.link} onClick={() => setMenuOpen(false)}>Dashboard</NavLink></li>
        )}
      </ul>

      <div className={styles.actions}>
        <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {isLoggedIn ? (
          <>
            {user?.is_staff && (
              <Link to="/admin-panel" className={styles.btnOutline} style={{ borderColor:'rgba(108,99,255,0.4)', color:'var(--accent)' }}>🛡️ Admin</Link>
            )}
            <span className={styles.username}>Hi, {user?.first_name || user?.username}</span>
            <button className={styles.btnOutline} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.btnOutline}>Login</Link>
            <Link to="/register" className={styles.btnPrimary}>Sign Up</Link>
          </>
        )}
      </div>

      <button className={styles.hamburger} onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
        <span className={menuOpen ? styles.barOpen : ''} />
        <span className={menuOpen ? styles.barOpen : ''} />
        <span className={menuOpen ? styles.barOpen : ''} />
      </button>
    </nav>
  )
}
