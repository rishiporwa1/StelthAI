import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { admin } from '../services/api'
import styles from './AdminPanel.module.css'

/* ── Section config ─────────────────────────────────────────────────────── */
const SECTIONS = [
  { key:'overview',      label:'Overview',       icon:'📊' },
  { key:'contacts',      label:'Contacts',       icon:'✉️' },
  { key:'courses',       label:'Courses',        icon:'🎓' },
  { key:'services',      label:'Services',       icon:'⚙️' },
  { key:'team',          label:'Team',           icon:'👥' },
  { key:'jobs',          label:'Jobs',           icon:'💼' },
  { key:'applications',  label:'Applications',   icon:'📄' },
  { key:'testimonials',  label:'Testimonials',   icon:'⭐' },
  { key:'research',      label:'Research',       icon:'🔬' },
]

/* ── Field definitions per section ──────────────────────────────────────── */
const FIELD_DEFS = {
  contacts: [
    { key:'name',       label:'Name',    type:'text' },
    { key:'email',      label:'Email',   type:'email' },
    { key:'phone',      label:'Phone',   type:'text' },
    { key:'subject',    label:'Subject',  type:'select', options:['general','software','training','research','placement','careers','other'] },
    { key:'message',    label:'Message', type:'textarea' },
    { key:'status',     label:'Status',  type:'select', options:['new','in_progress','resolved','spam'] },
    { key:'admin_notes',label:'Admin Notes', type:'textarea' },
  ],
  courses: [
    { key:'title',      label:'Title',       type:'text', required:true },
    { key:'slug',       label:'Slug',        type:'text', required:true },
    { key:'description',label:'Description', type:'textarea', required:true },
    { key:'level',      label:'Level',       type:'select', options:['beginner','intermediate','advanced'] },
    { key:'duration',   label:'Duration',    type:'text' },
    { key:'price',      label:'Price',       type:'number' },
    { key:'is_free',    label:'Free',        type:'checkbox' },
    { key:'is_popular', label:'Popular',     type:'checkbox' },
    { key:'is_active',  label:'Active',      type:'checkbox' },
    { key:'icon',       label:'Icon',        type:'text' },
    { key:'order',      label:'Order',       type:'number' },
  ],
  services: [
    { key:'name',       label:'Name',        type:'text', required:true },
    { key:'slug',       label:'Slug',        type:'text', required:true },
    { key:'tag',        label:'Tag',         type:'text' },
    { key:'description',label:'Description', type:'textarea' },
    { key:'icon',       label:'Icon',        type:'text' },
    { key:'order',      label:'Order',       type:'number' },
    { key:'is_active',  label:'Active',      type:'checkbox' },
  ],
  team: [
    { key:'name',       label:'Name',        type:'text', required:true },
    { key:'designation',label:'Designation', type:'text', required:true },
    { key:'role',       label:'Role',        type:'select', options:['developer','trainer','researcher','management'] },
    { key:'bio',        label:'Bio',         type:'textarea' },
    { key:'email',      label:'Email',       type:'email' },
    { key:'linkedin',   label:'LinkedIn',    type:'url' },
    { key:'github',     label:'GitHub',      type:'url' },
    { key:'is_active',  label:'Active',      type:'checkbox' },
    { key:'order',      label:'Order',       type:'number' },
  ],
  jobs: [
    { key:'title',       label:'Title',        type:'text', required:true },
    { key:'role',        label:'Role',         type:'select', options:['developer','trainer','researcher','management'] },
    { key:'type',        label:'Type',         type:'select', options:['full_time','part_time','internship','contract'] },
    { key:'description', label:'Description',  type:'textarea', required:true },
    { key:'requirements',label:'Requirements', type:'textarea', required:true },
    { key:'location',    label:'Location',     type:'text' },
    { key:'is_active',   label:'Active',       type:'checkbox' },
  ],
  applications: [
    { key:'name',    label:'Name',    type:'text' },
    { key:'email',   label:'Email',   type:'email' },
    { key:'phone',   label:'Phone',   type:'text' },
    { key:'message', label:'Message', type:'textarea' },
    { key:'status',  label:'Status',  type:'select', options:['received','reviewing','shortlisted','rejected','hired'] },
  ],
  testimonials: [
    { key:'name',       label:'Name',        type:'text', required:true },
    { key:'designation',label:'Designation', type:'text' },
    { key:'type',       label:'Type',        type:'select', options:['client','student'] },
    { key:'content',    label:'Content',     type:'textarea', required:true },
    { key:'rating',     label:'Rating',      type:'number' },
    { key:'is_active',  label:'Active',      type:'checkbox' },
  ],
  research: [
    { key:'name',       label:'Name',        type:'text', required:true },
    { key:'description',label:'Description', type:'textarea' },
    { key:'style',      label:'Style',       type:'select', options:['a','b','c'] },
    { key:'is_active',  label:'Active',      type:'checkbox' },
  ],
}

/* ── Table column definitions ───────────────────────────────────────────── */
const TABLE_COLS = {
  contacts:     ['name','email','subject','status','created_at'],
  courses:      ['title','level','duration','price','is_active','order'],
  services:     ['name','tag','order','is_active'],
  team:         ['name','designation','role','is_active','order'],
  jobs:         ['title','role','type','location','is_active'],
  applications: ['name','email','status','created_at'],
  testimonials: ['name','type','rating','is_active','created_at'],
  research:     ['name','style','is_active'],
}

const BADGE_KEYS = ['status','is_active']
const READ_ONLY_SECTIONS = ['contacts','applications']

/* ── Helpers ────────────────────────────────────────────────────────────── */
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}

function cellValue(row, col) {
  const v = row[col]
  if (col === 'created_at') return formatDate(v)
  if (col === 'is_active') return v ? 'Active' : 'Inactive'
  if (col === 'price') return v != null ? `₹${v}` : 'Free'
  if (v === true) return 'Yes'
  if (v === false) return 'No'
  if (v == null) return '—'
  return String(v)
}

function badgeClass(col, val) {
  if (col === 'is_active') return val ? styles.badge_active : styles.badge_inactive
  return styles['badge_' + val] || ''
}

/* ═══════════════════════════════════════════════════════════════════════════
   Admin Panel Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function AdminPanel() {
  const { user, loading: authLoading, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [section, setSection]     = useState('overview')
  const [data, setData]           = useState([])
  const [stats, setStats]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState(null) // { mode:'edit'|'create'|'delete', item }
  const [form, setForm]           = useState({})
  const [saving, setSaving]       = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!isLoggedIn || !user?.is_staff)) navigate('/login')
  }, [authLoading, isLoggedIn, user, navigate])

  // Fetch data for current section
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (section === 'overview') {
        const s = await admin.stats()
        setStats(s)
      } else {
        const res = await admin[section].list()
        setData(Array.isArray(res) ? res : res?.results || [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [section])

  useEffect(() => { fetchData() }, [fetchData])

  // Modal helpers
  const openCreate = () => {
    const defaults = {}
    ;(FIELD_DEFS[section] || []).forEach(f => {
      if (f.type === 'checkbox') defaults[f.key] = true
      else if (f.type === 'number') defaults[f.key] = 0
      else defaults[f.key] = ''
    })
    setForm(defaults)
    setModal({ mode:'create' })
  }

  const openEdit = (item) => {
    setForm({ ...item })
    setModal({ mode:'edit', item })
  }

  const openDelete = (item) => {
    setModal({ mode:'delete', item })
  }

  const closeModal = () => { setModal(null); setForm({}); setSaving(false) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal.mode === 'create') {
        await admin[section].create(form)
      } else if (modal.mode === 'edit') {
        await admin[section].update(modal.item.id, form)
      } else if (modal.mode === 'delete') {
        await admin[section].delete(modal.item.id)
      }
      closeModal()
      fetchData()
    } catch (err) {
      console.error(err)
      alert(typeof err === 'object' ? JSON.stringify(err) : 'Operation failed')
      setSaving(false)
    }
  }

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Filter
  const filtered = data.filter(row => {
    if (!search) return true
    const q = search.toLowerCase()
    return Object.values(row).some(v => v != null && String(v).toLowerCase().includes(q))
  })

  if (authLoading) return <div className={styles.center}><div className={styles.spinner} /></div>

  const cols = TABLE_COLS[section] || []
  const fields = FIELD_DEFS[section] || []
  const canCreate = !READ_ONLY_SECTIONS.includes(section)

  return (
    <div className={styles.layout}>
      {/* Mobile toggle */}
      <button className={styles.mobileToggle} onClick={() => setSidebarOpen(p => !p)}>☰</button>
      <div className={`${styles.mobileOverlay} ${sidebarOpen ? styles.mobileOverlayShow : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.sidebarLogo}>TechNova</Link>
          <span className={styles.sidebarTag}>Admin Panel</span>
        </div>
        <nav className={styles.sidebarNav}>
          {SECTIONS.map(s => (
            <button
              key={s.key}
              className={`${styles.sidebarItem} ${section === s.key ? styles.sidebarItemActive : ''}`}
              onClick={() => { setSection(s.key); setSearch(''); setSidebarOpen(false) }}
            >
              <span className={styles.sidebarIcon}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link to="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {section === 'overview' ? (
          <OverviewSection stats={stats} loading={loading} setSection={setSection} />
        ) : (
          <>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>{SECTIONS.find(s=>s.key===section)?.label}</h1>
                <p className={styles.pageSub}>{filtered.length} record{filtered.length!==1?'s':''}</p>
              </div>
            </div>

            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input className={styles.searchInput} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {canCreate && (
                <button className={styles.btnCreate} onClick={openCreate}>+ New</button>
              )}
            </div>

            {loading ? (
              <div className={styles.center}><div className={styles.spinner} /></div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>📭</div>
                <p className={styles.emptyText}>No records found</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {cols.map(c => <th key={c}>{c.replace(/_/g,' ')}</th>)}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(row => (
                      <tr key={row.id}>
                        {cols.map(c => (
                          <td key={c}>
                            {BADGE_KEYS.includes(c) ? (
                              <span className={`${styles.badge} ${badgeClass(c, c==='is_active' ? row[c] : row[c])}`}>
                                {cellValue(row, c)}
                              </span>
                            ) : cellValue(row, c)}
                          </td>
                        ))}
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.btnIcon} title="Edit" onClick={() => openEdit(row)}>✏️</button>
                            <button className={`${styles.btnIcon} ${styles.btnIconDanger}`} title="Delete" onClick={() => openDelete(row)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modal.mode === 'create' ? 'Create New' : modal.mode === 'edit' ? 'Edit Record' : 'Confirm Delete'}
              </h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>

            {modal.mode === 'delete' ? (
              <>
                <div className={styles.modalBody}>
                  <p className={styles.confirmText}>
                    Are you sure you want to delete <strong>{modal.item.name || modal.item.title || `#${modal.item.id}`}</strong>?
                  </p>
                  <p className={styles.confirmWarn}>This action cannot be undone.</p>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.btnCancel} onClick={closeModal}>Cancel</button>
                  <button className={styles.btnDelete} onClick={handleSave} disabled={saving}>
                    {saving ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.modalBody}>
                  {fields.map(f => (
                    <FieldWidget key={f.key} field={f} value={form[f.key]} onChange={v => setField(f.key, v)} />
                  ))}
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.btnCancel} onClick={closeModal}>Cancel</button>
                  <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Field Widget ───────────────────────────────────────────────────────── */
function FieldWidget({ field, value, onChange }) {
  const { key, label, type, options } = field

  if (type === 'checkbox') {
    return (
      <label className={styles.fieldCheckLabel}>
        <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
        {label}
      </label>
    )
  }

  if (type === 'select') {
    return (
      <div>
        <label className={styles.fieldLabel}>{label}</label>
        <select className={styles.fieldSelect} value={value || ''} onChange={e => onChange(e.target.value)}>
          <option value="">— Select —</option>
          {options.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
        </select>
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div>
        <label className={styles.fieldLabel}>{label}</label>
        <textarea className={styles.fieldTextarea} value={value || ''} onChange={e => onChange(e.target.value)} rows={4} />
      </div>
    )
  }

  return (
    <div>
      <label className={styles.fieldLabel}>{label}</label>
      <input className={styles.fieldInput} type={type} value={value ?? ''} onChange={e => onChange(type === 'number' ? e.target.value : e.target.value)} />
    </div>
  )
}

/* ── Overview Section ───────────────────────────────────────────────────── */
function OverviewSection({ stats, loading, setSection }) {
  if (loading) return <div className={styles.center}><div className={styles.spinner} /></div>

  const cards = [
    { label:'Total Contacts',  value:stats?.contacts?.total,        sub:`${stats?.contacts?.new || 0} new`, color:'accent',  section:'contacts' },
    { label:'In Progress',     value:stats?.contacts?.in_progress,  color:'teal',    section:'contacts' },
    { label:'Applications',    value:stats?.applications?.total,    sub:`${stats?.applications?.received || 0} new`, color:'red', section:'applications' },
    { label:'Shortlisted',     value:stats?.applications?.shortlisted, color:'purple', section:'applications' },
    { label:'Active Courses',  value:stats?.courses,                color:'accent',  section:'courses' },
    { label:'Team Members',    value:stats?.team,                   color:'teal',    section:'team' },
    { label:'Open Jobs',       value:stats?.jobs,                   color:'red',     section:'jobs' },
    { label:'Testimonials',    value:stats?.testimonials,           color:'purple',  section:'testimonials' },
    { label:'Services',        value:stats?.services,               color:'accent',  section:'services' },
    { label:'Research Areas',  value:stats?.research,               color:'teal',    section:'research' },
  ]

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSub}>Complete system overview at a glance</p>
        </div>
      </div>
      <div className={styles.statsGrid}>
        {cards.map(c => (
          <div
            key={c.label}
            className={`${styles.statCard} ${styles['statCard_' + c.color]}`}
            style={{ cursor:'pointer' }}
            onClick={() => setSection(c.section)}
          >
            <p className={styles.statNumber}>{c.value ?? '—'}</p>
            <p className={styles.statLabel}>{c.label}</p>
            {c.sub && <p className={styles.statSub}>{c.sub}</p>}
          </div>
        ))}
      </div>
    </>
  )
}
