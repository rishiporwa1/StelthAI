import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Navbar       from './components/Navbar'
import Footer       from './components/Footer'
import Particles    from './components/Particles'
import Home         from './pages/Home'
import Training     from './pages/Training'
import Team         from './pages/Team'
import Careers      from './pages/Careers'
import Contact      from './pages/Contact'
import Conference   from './pages/Conference'
import Login        from './pages/Login'
import Register     from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard    from './pages/Dashboard'
import EditProfile  from './pages/EditProfile'
import AdminPanel   from './pages/AdminPanel'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function AuthLayout({ children }) {
  return <main>{children}</main>
}

export default function App() {
  return (
    <AuthProvider>
      {/* Global particle background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <Particles
          particleCount={120}
          particleSpread={10}
          speed={0.06}
          particleColors={['#6c63ff', '#00d4aa', '#ff6b6b', '#ffffff']}
          alphaParticles={true}
          particleBaseSize={170}
          sizeRandomness={1.2}
          cameraDistance={22}
          moveParticlesOnHover={true}
          disableRotation={false}
          pixelRatio={window.devicePixelRatio}
        />
      </div>

      {/* Page content sits above particles */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          {/* Auth pages */}
          <Route path="/login"    element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />

          {/* Main pages */}
          <Route path="/"          element={<Layout><Home /></Layout>} />
          <Route path="/training"  element={<Layout><Training /></Layout>} />
          <Route path="/team"      element={<Layout><Team /></Layout>} />
          <Route path="/careers"   element={<Layout><Careers /></Layout>} />
          <Route path="/contact"   element={<Layout><Contact /></Layout>} />
          <Route path="/conference" element={<Layout><Conference /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/profile/edit" element={<Layout><EditProfile /></Layout>} />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
                <h1 style={{ fontSize:'4rem', fontFamily:'var(--font-display)', fontWeight:800, color:'var(--muted)' }}>404</h1>
                <p style={{ color:'var(--muted)' }}>Page not found.</p>
                <a href="/" style={{ color:'var(--accent)', fontWeight:600 }}>← Back to Home</a>
              </div>
            </Layout>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}