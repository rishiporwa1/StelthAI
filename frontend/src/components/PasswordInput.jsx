import { useState } from 'react'
import styles from './UI.module.css'

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
