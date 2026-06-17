import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormField, Input } from '../components/UI'
import styles from './Auth.module.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    // Simulate API call - you'll need to implement this endpoint in backend
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1500)

    // TODO: Implement actual forgot password API
    // try {
    //   await auth.forgotPassword({ email })
    //   setSuccess(true)
    // } catch (err) {
    //   setError(err?.detail || 'Failed to send reset email')
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>TechNova</Link>
        
        {success ? (
          <>
            <h1 className={styles.title}>Check your email</h1>
            <p className={styles.sub}>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                ← Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Forgot password?</h1>
            <p className={styles.sub}>
              Enter your email and we'll send you instructions to reset your password
            </p>

            <div className={styles.form}>
              <FormField label="Email Address">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                />
              </FormField>
              {error && <p className={styles.error}>{error}</p>}
              
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(255,107,107,0.1)', 
                border: '1px solid rgba(255,107,107,0.2)', 
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--muted)'
              }}>
                ⚠️ <strong>Note:</strong> Password reset functionality is not yet implemented in the backend. 
                Please contact an administrator to reset your password.
              </div>

              <button className={styles.btnPrimary} onClick={submit} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <p className={styles.switch}>
              Remember your password? <Link to="/login" className={styles.switchLink}>Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
