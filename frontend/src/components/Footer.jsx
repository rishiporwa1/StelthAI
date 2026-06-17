import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const LINKS = [
  { label: 'Services', to: '/#services' },
  { label: 'Training', to: '/training' },
  { label: 'Careers',  to: '/careers'  },
  { label: 'Contact',  to: '/contact'  },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>TechNova</div>
      <ul className={styles.links}>
        {LINKS.map(({ label, to }) => (
          <li key={label}><a href={to}>{label}</a></li>
        ))}
      </ul>
      <p className={styles.copy}>© {new Date().getFullYear()} TechNova. All rights reserved.</p>
    </footer>
  )
}
