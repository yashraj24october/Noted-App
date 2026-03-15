import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

function LoadingDots() {
  return (
    <span className="flex gap-1.5 items-center">
      <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-dot1" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-dot2" />
      <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-dot3" />
    </span>
  )
}

function Field({ label, type = 'text', placeholder, value, onChange, required, minLength }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 5 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background:  'var(--bg-input)',
          border:      `1px solid ${focused ? 'var(--accent)' : 'var(--border-md)'}`,
          borderRadius: 9,
          padding:     '10px 14px',
          fontSize:    14,
          color:       'var(--text-primary)',
          outline:     'none',
          transition:  'all 0.18s',
          boxShadow:   focused ? '0 0 0 3px var(--accent-light)' : 'none',
        }}
      />
    </div>
  )
}

export default function AuthPage() {
  const [mode,    setMode]    = useState('login')   // 'login' | 'register'
  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()
  const navigate            = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const switchMode = (m) => {
    setMode(m)
    setForm({ name: '', email: '', password: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        await register(form.name, form.email, form.password)
        toast.success("Account created — let's get to work!")
      }
      navigate('/')
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
      style={{ background: 'var(--bg-canvas)' }}
    >
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--accent) 1px, transparent 0)',
          backgroundSize:  '28px 28px',
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-[420px] rounded-2xl p-10 animate-slide-up"
        style={{
          background:  'var(--bg-card)',
          border:      '1px solid var(--border-soft)',
          boxShadow:   'var(--shadow-xl)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: '#1a1c23', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            📝
          </div>
          <span style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 28, color: 'var(--text-primary)' }}>
            Noted
          </span>
        </div>

        {/* Heading */}
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 23, textAlign: 'center', color: 'var(--text-primary)', marginBottom: 5 }}>
          {mode === 'login' ? 'Welcome back' : 'Get started'}
        </h1>
        <p style={{ fontSize: 13.5, textAlign: 'center', color: 'var(--text-tertiary)', marginBottom: 26 }}>
          {mode === 'login' ? 'Sign in to your workspace' : 'Create your note-taking workspace'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <Field label="Full name" placeholder="Your name" value={form.name} onChange={set('name')} required />
          )}

          <Field label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />

          <Field label="Password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={set('password')} required minLength={6} />

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 4, padding: '11px',
              background: loading ? 'var(--accent)' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 9,
              fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              boxShadow: 'var(--shadow-accent)',
              transition: 'all 0.18s',
            }}
          >
            {loading ? <LoadingDots /> : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {/* Switch mode */}
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)', marginTop: 20 }}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: 500, fontSize: 13 }}>
                Sign up free
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: 500, fontSize: 13 }}>
                Sign in
              </button>
            </>
          )}
        </p>

        {/* Demo hint */}
        {mode === 'login' && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-soft)', borderRadius: 9, textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', fontFamily: "'DM Mono',monospace" }}>
            💡 Yash@noted.app · v1.0.0
          </div>
        )}
      </div>
    </div>
  )
}