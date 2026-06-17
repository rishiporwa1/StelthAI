import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { dashboard as dashApi } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { Card, Spinner } from '../components/UI'
import styles from './Dashboard.module.css'

function StatBox({ label, value, sub, color = 'accent' }) {
  return (
    <div className={`${styles.statBox} ${styles['statBox_' + color]}`}>
      <p className={styles.statValue}>{value ?? '—'}</p>
      <p className={styles.statLabel}>{label}</p>
      {sub && <p className={styles.statSub}>{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isLoggedIn) navigate('/login')
  }, [authLoading, isLoggedIn, navigate])

  const { data: stats, loading: statsLoading } = useFetch(
    () => user?.is_staff ? dashApi.stats() : Promise.resolve(null),
    [user]
  )

  if (authLoading) return <div className={styles.center}><Spinner size={40} /></div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.sub}>Welcome back, {user?.first_name || user?.username} 👋</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/contact" className={styles.btnOutline}>Contact Page</Link>
          </div>
        </div>

        {/* Profile card */}
        <Card className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <h2 className={styles.profileName}>{user?.first_name} {user?.last_name}</h2>
            <p className={styles.profileMeta}>@{user?.username} · {user?.email}</p>
            {user?.is_staff && <span className={styles.adminBadge}>Admin</span>}
          </div>
          <Link to="/profile/edit" className={styles.btnOutline} style={{ marginLeft: 'auto' }}>
            Edit Profile
          </Link>
        </Card>

        {/* Admin stats */}
        {user?.is_staff && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Site Overview</h3>
            {statsLoading ? (
              <div className={styles.center}><Spinner /></div>
            ) : stats ? (
              <>
                <div className={styles.statsGrid}>
                  <StatBox label="Total Contacts"      value={stats.contacts?.total}      sub={`${stats.contacts?.new} new`}          color="accent" />
                  <StatBox label="In Progress"         value={stats.contacts?.in_progress}                                            color="teal"   />
                  <StatBox label="Applications"        value={stats.applications?.total}  sub={`${stats.applications?.received} new`} color="red"    />
                  <StatBox label="Shortlisted"         value={stats.applications?.shortlisted}                                        color="accent" />
                  <StatBox label="Active Courses"      value={stats.courses}                                                          color="teal"   />
                  <StatBox label="Team Members"        value={stats.team}                                                             color="accent" />
                </div>
                <div className={styles.adminLinks}>
                  <a href="/admin/" target="_blank" rel="noreferrer" className={styles.adminLink}>
                    🛠 Open Django Admin Panel →
                  </a>
                </div>
              </>
            ) : (
              <p className={styles.muted}>Stats unavailable. Make sure the Django backend is running.</p>
            )}
          </div>
        )}

        {/* Quick links */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <div className={styles.quickGrid}>
            {[
              { label:'Browse Courses',    to:'/training',  icon:'🎓' },
              { label:'View Job Openings', to:'/careers',   icon:'💼' },
              { label:'Meet the Team',     to:'/team',      icon:'👥' },
              { label:'Contact Us',        to:'/contact',   icon:'✉️' },
            ].map(({ label, to, icon }) => (
              <Link to={to} key={label} className={styles.quickCard}>
                <span className={styles.quickIcon}>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
