import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FormField, PasswordInput, Input } from '../components/UI'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ username:'', password:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = async () => {
    if (!form.username || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err?.detail || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => { if (e.key === 'Enter') submit() }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>TechNova</Link>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your account</p>

        <div className={styles.form}>
          <FormField label="Username">
            <Input placeholder="your_username" value={form.username}
              onChange={e => set('username', e.target.value)} onKeyDown={onKeyDown} />
          </FormField>
          <FormField label="Password">
            <PasswordInput placeholder="••••••••" value={form.password}
              onChange={e => set('password', e.target.value)} onKeyDown={onKeyDown} />
          </FormField>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btnPrimary} onClick={submit} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>

        <p className={styles.switch}>
          Don't have an account? <Link to="/register" className={styles.switchLink}>Sign up</Link>
        </p>
        <p className={styles.switch} style={{ marginTop: '0.5rem' }}>
          <Link to="/forgot-password" className={styles.switchLink}>Forgot password?</Link>
        </p>
      </div>
    </div>
  )
}
