import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { auth as authApi } from '../services/api'
import { FormField, Input, PasswordInput, Card } from '../components/UI'
import styles from './Dashboard.module.css'

export default function EditProfile() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!authLoading && !isLoggedIn) navigate('/login')
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      })
    }
  }, [authLoading, isLoggedIn, navigate, user])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setPass = (k, v) => setPasswordForm(p => ({ ...p, [k]: v }))

  const updateProfile = async () => {
    setLoading(true)
    setErrors({})
    setSuccess('')
    try {
      await authApi.updateMe(form)
      setSuccess('Profile updated successfully!')
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      setErrors(err || { api: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrors({ confirm_password: 'Passwords do not match' })
      return
    }
    if (passwordForm.new_password.length < 8) {
      setErrors({ new_password: 'Minimum 8 characters' })
      return
    }

    setLoading(true)
    setErrors({})
    setSuccess('')
    try {
      await authApi.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      })
      setSuccess('Password changed successfully!')
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setErrors(err || { api: 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Edit Profile</h1>
            <p className={styles.sub}>Update your account information</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnOutline} onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {success && <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: '8px', color: 'var(--accent3)', marginBottom: '1.5rem' }}>{success}</div>}

        <Card>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Profile Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="First Name" error={errors.first_name}>
                <Input value={form.first_name} onChange={e => set('first_name', e.target.value)} />
              </FormField>
              <FormField label="Last Name" error={errors.last_name}>
                <Input value={form.last_name} onChange={e => set('last_name', e.target.value)} />
              </FormField>
            </div>
            <FormField label="Email" error={errors.email}>
              <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </FormField>
            <FormField label="Username">
              <Input value={user?.username || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Username cannot be changed</p>
            </FormField>
            {errors.api && <p style={{ color: 'var(--accent2)', fontSize: '0.85rem' }}>{errors.api}</p>}
            <button
              onClick={updateProfile}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                alignSelf: 'flex-start'
              }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </Card>

        <Card style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Change Password</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormField label="Current Password" error={errors.old_password}>
              <PasswordInput
                value={passwordForm.old_password}
                onChange={e => setPass('old_password', e.target.value)}
                placeholder="Enter current password"
              />
            </FormField>
            <FormField label="New Password" error={errors.new_password}>
              <PasswordInput
                value={passwordForm.new_password}
                onChange={e => setPass('new_password', e.target.value)}
                placeholder="Min 8 characters"
              />
            </FormField>
            <FormField label="Confirm New Password" error={errors.confirm_password}>
              <PasswordInput
                value={passwordForm.confirm_password}
                onChange={e => setPass('confirm_password', e.target.value)}
                placeholder="Repeat new password"
              />
            </FormField>
            <button
              onClick={changePassword}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                alignSelf: 'flex-start'
              }}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
