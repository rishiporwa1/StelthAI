import styles from './Conference.module.css'

export default function Conference() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Conference</h1>
        <p className={styles.subtitle}>Join us for cutting-edge tech discussions and networking</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Upcoming Events</h2>
          <p>Stay tuned for our next conference announcements.</p>
        </div>
      </section>
    </div>
  )
}
