import { useState } from 'react'
import styles from './UI.module.css'

export function Button({ children, variant = 'primary', size = 'md', as: Tag = 'button', className = '', ...props }) {
  return (
    <Tag className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export function Spinner({ size = 24 }) {
  return <div className={styles.spinner} style={{ width: size, height: size }} />
}

export function SectionHeader({ label, title, sub, center = false }) {
  return (
    <div className={`${styles.header} ${center ? styles.center : ''}`}>
      {label && <p className={styles.label}>{label}</p>}
      <h2 className={styles.title}>{title}</h2>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  )
}

export function Card({ children, className = '', hover = true }) {
  return (
    <div className={`${styles.card} ${hover ? styles.cardHover : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Badge({ children, color = 'accent' }) {
  return <span className={`${styles.badge} ${styles['badge_' + color]}`}>{children}</span>
}

export function FormField({ label, error, children }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.fieldLabel}>{label}</label>}
      {children}
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  )
}

export function Input({ ...props }) {
  return <input className={styles.input} {...props} />
}

export function Textarea({ ...props }) {
  return <textarea className={styles.textarea} {...props} />
}

export function Select({ children, ...props }) {
  return <select className={styles.input} {...props}>{children}</select>
}

export function PasswordInput({ value, onChange, placeholder = '••••••••', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={styles.passwordWrapper}>
      <input
        type={visible ? 'text' : 'password'}
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  )
}
