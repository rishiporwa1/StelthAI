import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FormField, Input, PasswordInput } from '../components/UI'
import styles from './Auth.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm] = useState({ username:'', email:'', first_name:'', last_name:'', password:'', password2:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.username.trim())   e.username  = 'Required'
    if (!form.email.trim())      e.email     = 'Required'
    if (!form.password)          e.password  = 'Required'
    if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.password2) e.password2 = 'Passwords do not match'
    setErrors(e); return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true); setErrors({})
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      if (typeof err === 'object') setErrors(err)
      else setErrors({ api: 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={`${styles.card} ${styles.wide}`}>
        <Link to="/" className={styles.logo}>TechNova</Link>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.sub}>Join TechNova today</p>

        <div className={styles.form}>
          <div className={styles.row}>
            <FormField label="First Name" error={errors.first_name}>
              <Input placeholder="Rishi" value={form.first_name} onChange={e => set('first_name', e.target.value)} />
            </FormField>
            <FormField label="Last Name" error={errors.last_name}>
              <Input placeholder="Porwal" value={form.last_name} onChange={e => set('last_name', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Username *" error={errors.username}>
            <Input placeholder="rishi_p" value={form.username} onChange={e => set('username', e.target.value)} />
          </FormField>
          <FormField label="Email *" error={errors.email}>
            <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </FormField>
          <div className={styles.row}>
            <FormField label="Password *" error={errors.password}>
              <PasswordInput placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} />
            </FormField>
            <FormField label="Confirm Password *" error={errors.password2}>
              <PasswordInput placeholder="Repeat password" value={form.password2} onChange={e => set('password2', e.target.value)} />
            </FormField>
          </div>
          {errors.api && <p className={styles.error}>{errors.api}</p>}
          <button className={styles.btnPrimary} onClick={submit} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </div>

        <p className={styles.switch}>
          Already have an account? <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
