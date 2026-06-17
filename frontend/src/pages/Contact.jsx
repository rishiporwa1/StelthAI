import { useState } from 'react'
import { contact as contactApi } from '../services/api'
import { SectionHeader, FormField, Input, Textarea, Select } from '../components/UI'
import styles from './Contact.module.css'

const SUBJECTS = [
  { value:'general',   label:'General Inquiry' },
  { value:'software',  label:'Software Development' },
  { value:'training',  label:'Training Programs' },
  { value:'research',  label:'Research Collaboration' },
  { value:'placement', label:'Internship / Placement' },
  { value:'careers',   label:'Careers' },
  { value:'other',     label:'Other' },
]

const INFO = [
  { icon:'📧', label:'Email',        value:'info@yourcompany.com' },
  { icon:'📞', label:'Phone',        value:'+91-XXXXXXXXXX' },
  { icon:'📍', label:'Address',      value:'Your Office Address Here' },
  { icon:'🕐', label:'Office Hours', value:'Monday – Saturday' },
]

export default function Contact() {
  const [form, setForm]     = useState({ name:'', email:'', phone:'', subject:'general', message:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.trim())   e.email   = 'Required'
    if (!form.message.trim()) e.message = 'Required'
    if (form.message.length < 10) e.message = 'At least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await contactApi.submit(form)
      setSuccess(true)
      setForm({ name:'', email:'', phone:'', subject:'general', message:'' })
    } catch (err) {
      const msg = err?.message || err?.detail || 'Something went wrong. Please try again.'
      setErrors({ api: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.container}>
          <SectionHeader label="Contact Us" title="Let's Work Together" sub="Have a project in mind or want to learn more? We'd love to hear from you." center />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.layout}>

            {/* Info */}
            <div className={styles.info}>
              {INFO.map(({ icon, label, value }) => (
                <div className={styles.infoItem} key={label}>
                  <div className={styles.infoIcon}>{icon}</div>
                  <div>
                    <p className={styles.infoLabel}>{label}</p>
                    <p>{value}</p>
                  </div>
                </div>
              ))}

              <div className={styles.policies}>
                <p className={styles.policiesTitle}>Policies</p>
                <p>🔒 <strong>Privacy</strong> — Client & student data stays confidential.</p>
                <p>💳 <strong>Refund</strong> — Training fees refundable per enrollment terms.</p>
                <p>🛟 <strong>Support</strong> — Technical support during working hours.</p>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formWrap}>
              {success ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>✓</div>
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you within 24 business hours.</p>
                  <button className={styles.btnPrimary} onClick={() => setSuccess(false)}>Send Another</button>
                </div>
              ) : (
                <div className={styles.form}>
                  <div className={styles.row}>
                    <FormField label="Full Name *" error={errors.name}>
                      <Input placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
                    </FormField>
                    <FormField label="Email *" error={errors.email}>
                      <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </FormField>
                  </div>
                  <div className={styles.row}>
                    <FormField label="Phone">
                      <Input placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </FormField>
                    <FormField label="Subject">
                      <Select value={form.subject} onChange={e => set('subject', e.target.value)}>
                        {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </Select>
                    </FormField>
                  </div>
                  <FormField label="Message *" error={errors.message}>
                    <Textarea placeholder="Tell us about your project or inquiry..." value={form.message} onChange={e => set('message', e.target.value)} style={{minHeight:'140px'}} />
                  </FormField>
                  {errors.api && <p className={styles.apiError}>{errors.api}</p>}
                  <button className={styles.btnPrimary} onClick={submit} disabled={loading}>
                    {loading ? 'Sending…' : 'Send Message →'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
