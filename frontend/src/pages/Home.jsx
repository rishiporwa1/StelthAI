import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { services as servicesApi } from '../services/api'
import { SectionHeader, Card, Badge, Spinner } from '../components/UI'
import styles from './Home.module.css'

const STRENGTHS = [
  { icon: '⚙️', title: 'Custom Software Development', desc: 'Tailored solutions built to your exact specifications.' },
  { icon: '🤖', title: 'AI & Data Science',           desc: 'ML models and analytics that drive intelligent decisions.' },
  { icon: '🌐', title: 'Web & Mobile Apps',            desc: 'Modern, responsive applications for every platform.' },
  { icon: '🎓', title: 'IT Training Programs',         desc: 'Industry-oriented courses bridging academia and practice.' },
  { icon: '🚀', title: 'Internship & Placement',       desc: 'Structured mentoring and career support.' },
  { icon: '🔬', title: 'Research & Innovation',        desc: 'Technical guidance for academic & industry research.' },
]

const PROCESS = [
  { num: '01', title: 'Requirement Analysis', desc: 'Understanding your goals and constraints' },
  { num: '02', title: 'System Design',        desc: 'Architecture and technology planning' },
  { num: '03', title: 'Development & Testing',desc: 'Agile build cycles with QA at every stage' },
  { num: '04', title: 'Deployment',           desc: 'Seamless launch on your infrastructure' },
  { num: '05', title: 'Maintenance & Support',desc: 'Ongoing updates and technical assistance' },
]

const WHY = [
  { title: 'Experienced Team',    desc: 'Developers, data scientists, and researchers with deep domain expertise.' },
  { title: 'Practical Exposure',  desc: 'Industry-aligned projects and real-world case studies.' },
  { title: 'Affordable Solutions',desc: 'Quality technology services at competitive pricing.' },
  { title: 'Custom Training',     desc: 'Programs tailored for students, professionals, and organizations.' },
  { title: 'End-to-End Support',  desc: 'From ideation to deployment and beyond.' },
  { title: 'Innovation-First',    desc: 'Committed to research-driven, forward-looking solutions.' },
]

const FALLBACK_SERVICES = [
  { id:1, name:'Software Development', tag:'CORE',   items:[{name:'ERP Systems'},{name:'Automation Software'},{name:'AI & ML Applications'},{name:'Cloud-Based Apps'}] },
  { id:2, name:'Web Development',      tag:'WEB',    items:[{name:'Business Websites'},{name:'E-commerce Platforms'},{name:'Portals & Dashboards'},{name:'UI/UX Design'}] },
  { id:3, name:'Mobile Apps',          tag:'MOBILE', items:[{name:'Android Applications'},{name:'Cross-platform Apps'},{name:'Enterprise Mobile'}] },
  { id:4, name:'IT Services',          tag:'OPS',    items:[{name:'System Maintenance'},{name:'Technical Consulting'},{name:'Software Testing'},{name:'DB Optimization'}] },
]

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      <div className={styles.heroGrid} />
      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <span className={styles.dot} /> Technology · Training · Research
        </div>
        <h1 className={styles.heroTitle}>
          Innovating Ideas into<br />
          <span className={styles.gradient}>Intelligent Digital</span><br />
          Solutions
        </h1>
        <p className={styles.heroSub}>
          We empower businesses, students, and researchers through practical technology solutions
          and skill development programs.
        </p>
        <div className={styles.heroActions}>
          <a href="#services" className={styles.btnPrimary}>Explore Services</a>
          <Link to="/contact" className={styles.btnOutline}>Contact Us</Link>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>50<span>+</span></div>
            <div className={styles.statLabel}>Projects Delivered</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>200<span>+</span></div>
            <div className={styles.statLabel}>Students Trained</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>10<span>+</span></div>
            <div className={styles.statLabel}>Research Areas</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    servicesApi.list()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const raw = data?.results ?? data
  const display = Array.isArray(raw) ? raw : FALLBACK_SERVICES

  return (
    <section className={styles.sectionDark} id="services">
      <div className={styles.container}>
        <SectionHeader
          label="Services"
          title="What We Build"
          sub="End-to-end digital solutions customized to your organization's needs."
        />
        {loading ? (
          <div className={styles.center}><Spinner size={32} /></div>
        ) : (
          <div className={styles.servicesGrid}>
            {display.map((s) => (
              <Card key={s.id} className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>
                  <Badge color="accent">{s.tag}</Badge> {s.name}
                </h3>
                <ul className={styles.serviceList}>
                  {s.items.map((item, i) => (
                    <li key={i}>{item.name}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Strengths */}
      <section className={styles.sectionLight}>
        <div className={styles.container}>
          <SectionHeader
            label="What We Do"
            title="Our Core Strengths"
            sub="A multidisciplinary team committed to solving real-world problems."
          />
          <div className={styles.strengthsGrid}>
            {STRENGTHS.map((s, i) => (
              <div className={styles.strengthCard} key={i}>
                <div className={styles.strengthIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className={styles.section} id="about">
        <div className={styles.container}>
          <div className={styles.aboutLayout}>
            <div>
              <p className={styles.sectionLabel}>About Us</p>
              <h2 className={styles.sectionTitle}>Technology + Education + Implementation</h2>
              <p className={styles.muted} style={{ marginBottom: '2rem' }}>
                We are a multidisciplinary technology company focused on delivering reliable digital
                products and building future-ready professionals.
              </p>
              {[
                ['01', 'Innovation',      'Developing modern solutions using the latest technologies.'],
                ['02', 'Education',       'Building strong technical foundations that translate into real careers.'],
                ['03', 'Implementation', 'Applying knowledge to actual industry challenges.'],
              ].map(([num, title, desc]) => (
                <div className={styles.pillar} key={num}>
                  <span className={styles.pillarNum}>{num}</span>
                  <div>
                    <h3>{title}</h3>
                    <p className={styles.muted}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.vmCards}>
              <Card>
                <h4 className={styles.vmLabel}>Our Vision</h4>
                <p className={styles.muted}>
                  To become a leading center for technology solutions and skill development,
                  recognized for innovation, quality, and research excellence.
                </p>
              </Card>
              <Card>
                <h4 className={styles.vmLabel}>Our Mission</h4>
                <p className={styles.muted}>
                  To provide affordable, scalable, and intelligent digital solutions while nurturing
                  skilled professionals for the global technology ecosystem.
                </p>
              </Card>
              <div className={styles.quoteCard}>
                <p>"Bridging the gap between theory and industry practice."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />

      {/* Process */}
      <section className={styles.section} id="process">
        <div className={styles.container}>
          <SectionHeader
            label="How We Work"
            title="Our Development Process"
            sub="Structured practices ensuring quality, reliability, and scalability."
          />
          <div className={styles.processRow}>
            {PROCESS.map((s, i) => (
              <div className={styles.step} key={i}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3>{s.title}</h3>
                <p className={styles.muted}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className={styles.sectionDark} id="why">
        <div className={styles.container}>
          <SectionHeader label="Why Choose Us" title="Built Different" />
          <div className={styles.whyGrid}>
            {WHY.map((w, i) => (
              <Card key={i}>
                <h3 className={styles.whyTitle}>{w.title}</h3>
                <p className={styles.muted}>{w.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2>Ready to Build Something?</h2>
            <p className={styles.muted}>Let's turn your ideas into intelligent digital solutions.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginTop:'1.5rem' }}>
              <Link to="/contact" className={styles.btnPrimary}>Get in Touch</Link>
              <Link to="/training" className={styles.btnOutline}>View Courses</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}