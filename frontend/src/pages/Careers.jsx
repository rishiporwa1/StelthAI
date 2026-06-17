import { useState } from 'react'
import { careers as careersApi } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { SectionHeader, Card, Badge, Spinner, FormField, Input, Textarea } from '../components/UI'
import styles from './Careers.module.css'

const TYPE_COLOR = { full_time: 'accent', part_time: 'teal', internship: 'teal', contract: 'red' }

const FALLBACK_JOBS = [
  { id:1, title:'Python / Django Developer', role:'developer',  type:'full_time',  location:'On-site', description:'Build and maintain backend APIs for our platforms.', requirements:'Python, Django, REST APIs, Git. 1+ year experience.' },
  { id:2, title:'React Frontend Developer',  role:'developer',  type:'full_time',  location:'On-site', description:'Develop modern React UIs for our web products.',     requirements:'React, JavaScript, CSS, REST integration.' },
  { id:3, title:'IT Trainer',                role:'trainer',    type:'part_time',  location:'On-site', description:'Conduct training in Python, ML, and Web Dev.',        requirements:'Strong domain knowledge, teaching experience.' },
  { id:4, title:'ML Research Intern',        role:'researcher', type:'internship', location:'On-site', description:'Assist in deep learning and computer vision research.',requirements:'Python, PyTorch/TensorFlow basics, final year.' },
]

function JobCard({ job, onApply }) {
  const [open, setOpen] = useState(false)
  return (
    <Card className={styles.jobCard}>
      <div className={styles.jobTop}>
        <div>
          <h3 className={styles.jobTitle}>{job.title}</h3>
          <div className={styles.jobMeta}>
            <Badge color={TYPE_COLOR[job.type] || 'accent'}>{job.type?.replace('_', ' ')}</Badge>
            <span className={styles.location}>📍 {job.location}</span>
          </div>
        </div>
        <button className={styles.applyBtn} onClick={() => onApply(job)}>Apply →</button>
      </div>
      <p className={styles.desc}>{job.description}</p>
      <button className={styles.toggle} onClick={() => setOpen(p => !p)}>
        {open ? '▲ Hide requirements' : '▼ View requirements'}
      </button>
      {open && <p className={styles.requirements}>{job.requirements}</p>}
    </Card>
  )
}

function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', resume: null })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    if (!form.message.trim()) e.message = 'Cover note is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await careersApi.apply({ ...form, job: job?.id })
      setSuccess(true)
    } catch (err) {
      setErrors({ api: err?.detail || 'Submission failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>
        {success ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✓</div>
            <h3>Application Submitted!</h3>
            <p>We'll review your application and get back to you soon.</p>
            <button className={styles.btnPrimary} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 className={styles.modalTitle}>Apply — {job?.title || 'General Application'}</h2>
            <div className={styles.modalForm}>
              <div className={styles.row}>
                <FormField label="Full Name *" error={errors.name}>
                  <Input placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
                </FormField>
                <FormField label="Email *" error={errors.email}>
                  <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </FormField>
              </div>
              <FormField label="Phone">
                <Input placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </FormField>
              <FormField label="Cover Note *" error={errors.message}>
                <Textarea placeholder="Tell us about yourself and why you're a great fit..." value={form.message} onChange={e => set('message', e.target.value)} />
              </FormField>
              <FormField label="Resume (PDF / DOC)">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className={styles.fileInput}
                  onChange={e => set('resume', e.target.files[0])}
                />
              </FormField>
              {errors.api && <p className={styles.apiError}>{errors.api}</p>}
              <button className={styles.btnPrimary} onClick={submit} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Careers() {
  const { data, loading } = useFetch(() => careersApi.jobs(), [])
  const [selectedJob, setSelectedJob] = useState(null)

  const raw = data?.results ?? data
  const jobs = Array.isArray(raw) ? raw : FALLBACK_JOBS

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.container}>
          <SectionHeader
            label="Careers"
            title="Join Our Team"
            sub="We welcome developers, trainers, and researchers passionate about technology and learning."
            center
          />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.center}><Spinner size={32} /></div>
          ) : (
            <div className={styles.jobList}>
              {jobs.map(job => (
                <JobCard key={job.id} job={job} onApply={setSelectedJob} />
              ))}
            </div>
          )}

          <div className={styles.generalCta}>
            <h3>Don't see a fit?</h3>
            <p>Send us a general application — we're always looking for talented people.</p>
            <button className={styles.btnOutline} onClick={() => setSelectedJob({})}>
              Submit General Application
            </button>
          </div>
        </div>
      </div>

      {selectedJob !== null && (
        <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}