import { useState } from 'react'
import { courses as coursesApi } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { SectionHeader, Card, Badge, Spinner } from '../components/UI'
import styles from './Training.module.css'

const LEVELS = ['all', 'beginner', 'intermediate', 'advanced']

const FALLBACK = [
  { id:1, title:'Python Programming',         level:'beginner',     duration:'6 weeks',  is_popular:true,  icon:'🐍', features:[{text:'Hands-on projects'},{text:'Certification'},{text:'Mock interviews'}] },
  { id:2, title:'Data Science & ML',          level:'intermediate', duration:'12 weeks', is_popular:true,  icon:'📊', features:[{text:'Industry case studies'},{text:'Certification'},{text:'Resume building'}] },
  { id:3, title:'AI & Deep Learning',         level:'advanced',     duration:'16 weeks', is_popular:true,  icon:'🤖', features:[{text:'Research projects'},{text:'Certification'},{text:'Placement support'}] },
  { id:4, title:'Full Stack Web Development', level:'intermediate', duration:'12 weeks', is_popular:true,  icon:'🌐', features:[{text:'Real projects'},{text:'Certification'},{text:'Mock interviews'}] },
  { id:5, title:'Database Management & SQL',  level:'beginner',     duration:'4 weeks',  is_popular:false, icon:'🗄️', features:[{text:'Hands-on labs'},{text:'Certification'}] },
  { id:6, title:'Cloud Computing',            level:'intermediate', duration:'8 weeks',  is_popular:false, icon:'☁️', features:[{text:'AWS/GCP labs'},{text:'Certification'}] },
  { id:7, title:'Cybersecurity Fundamentals', level:'beginner',     duration:'6 weeks',  is_popular:false, icon:'🔒', features:[{text:'Ethical hacking basics'},{text:'Certification'}] },
]

const LEVEL_COLOR = { beginner: 'teal', intermediate: 'accent', advanced: 'red' }

export default function Training() {
  const [filter, setFilter] = useState('all')
  const { data, loading } = useFetch(() => coursesApi.list(), [])

  const raw = data?.results ?? data
  const all = Array.isArray(raw) ? raw : FALLBACK

  const displayed = filter === 'all' ? all : all.filter(c => c.level === filter)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className={styles.container}>
          <SectionHeader
            label="Training Programs"
            title="Learn. Build. Get Hired."
            sub="Industry-oriented programs for students, professionals, and organizations."
            center
          />
          <div className={styles.filters}>
            {LEVELS.map(l => (
              <button
                key={l}
                className={`${styles.filterBtn} ${filter === l ? styles.active : ''}`}
                onClick={() => setFilter(l)}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container} style={{ padding: '4rem' }}>
        {loading ? (
          <div className={styles.center}><Spinner size={32} /></div>
        ) : (
          <div className={styles.grid}>
            {displayed.map(course => (
              <Card key={course.id} className={styles.courseCard}>
                <div className={styles.courseTop}>
                  <span className={styles.courseIcon}>{course.icon}</span>
                  {course.is_popular && <Badge color="accent">Popular</Badge>}
                </div>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <div className={styles.courseMeta}>
                  <Badge color={LEVEL_COLOR[course.level] || 'accent'}>{course.level}</Badge>
                  <span className={styles.duration}>⏱ {course.duration}</span>
                </div>
                {course.price !== undefined && (
                  <p className={styles.price}>
                    {course.is_free ? 'Free' : course.price ? `₹${course.price}` : 'Contact for pricing'}
                  </p>
                )}
                {course.features?.length > 0 && (
                  <ul className={styles.features}>
                    {course.features.map((f, i) => (
                      <li key={i}>{f.text}</li>
                    ))}
                  </ul>
                )}
                <button className={styles.enroll}>Enroll Now →</button>
              </Card>
            ))}
          </div>
        )}

        <div className={styles.strip}>
          {['🛠️ Hands-on Projects', '📊 Industry Case Studies', '📜 Certification', '📄 Resume Building', '🎯 Mock Interviews'].map((f, i) => (
            <div className={styles.stripItem} key={i}>{f}</div>
          ))}
        </div>
      </div>
    </div>
  )
}