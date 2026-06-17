import { useState, useEffect, createContext, useContext } from 'react'
import { auth } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (auth.isLoggedIn()) {
      auth.me()
        .then(setUser)
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const res = await auth.login(credentials)
    setUser(res.user || await auth.me())
    return res
  }

  const register = async (data) => {
    const res = await auth.register(data)
    localStorage.setItem('access_token', res.access)
    localStorage.setItem('refresh_token', res.refresh)
    setUser(res.user)
    return res
  }

  const logout = async () => {
    await auth.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
