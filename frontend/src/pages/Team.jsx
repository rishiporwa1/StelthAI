import { team as teamApi } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { SectionHeader, Card, Badge, Spinner } from '../components/UI'
import styles from './Team.module.css'

const FALLBACK = [
  { id:1, name:'Dr. Arun Sharma', designation:'Founder & CEO',    role:'management', bio:'Visionary leader with 15+ years in technology and education.' },
  { id:2, name:'Priya Mehta',     designation:'Lead Developer',    role:'developer',  bio:'Full-stack expert specializing in scalable cloud architectures.' },
  { id:3, name:'Rahul Verma',     designation:'Data Science Lead', role:'researcher', bio:'AI researcher with publications in computer vision and NLP.' },
  { id:4, name:'Sunita Patel',    designation:'Training Head',     role:'trainer',    bio:'Certified educator with expertise in Python and ML curriculum design.' },
]

const ROLE_COLOR = { management:'accent', developer:'teal', researcher:'red', trainer:'accent' }
const AVATAR_COLORS = ['#6c63ff', '#00d4aa', '#ff6b6b', '#f9ca24']

function Avatar({ name, index }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div
      className={styles.avatar}
      style={{
        background: `${AVATAR_COLORS[index % 4]}22`,
        border: `2px solid ${AVATAR_COLORS[index % 4]}44`,
      }}
    >
      <span style={{ color: AVATAR_COLORS[index % 4] }}>{initials}</span>
    </div>
  )
}

export default function Team() {
  const { data, loading } = useFetch(() => teamApi.list(), [])

  const raw = data?.results ?? data
  const members = Array.isArray(raw) ? raw : FALLBACK

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.container}>
          <SectionHeader
            label="Our Team"
            title="The People Behind TechNova"
            sub="Developers, data scientists, trainers, and researchers committed to solving real-world problems."
            center
          />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.center}><Spinner size={32} /></div>
          ) : (
            <div className={styles.grid}>
              {members.map((m, i) => (
                <Card key={m.id} className={styles.memberCard}>
                  {m.photo_url
                    ? <img src={m.photo_url} alt={m.name} className={styles.photo} />
                    : <Avatar name={m.name} index={i} />
                  }
                  <h3 className={styles.name}>{m.name}</h3>
                  <p className={styles.designation}>{m.designation}</p>
                  <Badge color={ROLE_COLOR[m.role] || 'accent'}>{m.role}</Badge>
                  {m.bio && <p className={styles.bio}>{m.bio}</p>}
                  <div className={styles.socials}>
                    {m.email    && <a href={`mailto:${m.email}`} className={styles.social}>✉️</a>}
                    {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className={styles.social}>in</a>}
                    {m.github   && <a href={m.github}   target="_blank" rel="noreferrer" className={styles.social}>gh</a>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}