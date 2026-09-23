import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import TextField from '../components/TextField.jsx'
import { Logo, LogoMark } from '../components/Logo.jsx'
import {
  ActivityIcon,
  AtSignIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  WalletIcon,
} from '../components/Icons.jsx'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { api } from '../lib/api'

const INITIAL_FORM = { firstName: '', lastName: '', username: '', password: '' }

const STRENGTH_LABELS = ['Too short', 'Weak', 'Good', 'Strong']
const STRENGTH_BARS = [
  'bg-rose-400',
  'bg-rose-400',
  'bg-amber-400',
  'bg-emerald-500',
]

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: 'Bank-grade security',
    text: 'Every request is signed with a JWT that the API verifies on each call.',
  },
  {
    icon: SendIcon,
    title: 'Instant transfers',
    text: 'Send money to any PayFlow user with just a user id and an amount.',
  },
  {
    icon: ActivityIcon,
    title: 'Live balance',
    text: 'Your wallet balance is fetched fresh on every visit — never cached.',
  },
]

function validate(values) {
  const errors = {}

  if (!values.firstName.trim()) errors.firstName = 'First name is required.'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.'

  const username = values.username.trim()
  if (!username) errors.username = 'Username is required.'
  else if (username.length < 3) errors.username = 'Use at least 3 characters.'

  if (!values.password) errors.password = 'Password is required.'
  else if (values.password.length < 6) errors.password = 'Use at least 6 characters.'

  return errors
}

function passwordStrength(password) {
  if (password.length < 6) return 0

  let score = 1
  if (password.length >= 10 || /[^A-Za-z0-9]/.test(password)) score += 1
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1

  return score
}

export default function Signup() {
  const { isAuthenticated, signIn } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = (location.state && location.state.from) || '/dashboard'
  const strength = passwordStrength(form.password)

  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const errors = validate(form)
    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length) return

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim().toLowerCase(),
      password: form.password,
    }

    setSubmitting(true)

    try {
      const data = await api.signup(payload)

      // The backend answers 200 with only a message when inputs are rejected.
      if (!data.token) {
        setFormError(data.message || 'We could not create your account. Please try again.')
        return
      }

      signIn(data.token, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
      })
      toast.success(`Welcome to PayFlow, ${payload.firstName}!`)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-[-8rem] h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-aqua-300/20 blur-3xl" />

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(150deg,#081123_0%,#142a6e_52%,#2049d6_100%)] p-10 lg:flex xl:p-14">
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-aqua-400/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-brand-400/25 blur-3xl" />
          <div className="relative z-10 inline-flex items-center gap-3">
            <LogoMark size="lg" />
            <span className="text-xl font-bold tracking-tight text-white">
              Pay
              <span className="bg-gradient-to-r from-aqua-200 to-aqua-400 bg-clip-text text-transparent">
                Flow
              </span>
            </span>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-aqua-100 backdrop-blur">
              <SparklesIcon size={14} />
              Instant transfers, zero clutter
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-[2.75rem]">
              Your money,
              <br />
              <span className="bg-gradient-to-r from-aqua-200 via-aqua-300 to-brand-200 bg-clip-text text-transparent">
                in perfect flow.
              </span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-brand-100/80">
              Open a PayFlow wallet in seconds and move money to anyone on the network — with a
              balance that is always live and never out of date.
            </p>

            <ul className="mt-9 space-y-4">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-aqua-200 backdrop-blur">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-brand-100/70">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 animate-float-slow rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-aqua-100">
                <WalletIcon size={14} />
                Wallet preview
              </span>
              <ShieldCheckIcon size={16} className="text-aqua-200" />
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-white">₹ 24,500.00</p>
            <div className="mt-4 flex items-end gap-1.5">
              {[38, 62, 46, 78, 58, 92, 70].map((height, index) => (
                <span
                  key={index}
                  style={{ height }}
                  className="w-full rounded-full bg-gradient-to-t from-aqua-400/40 to-aqua-200/90"
                />
              ))}
            </div>
          </div>
        </aside>

        <main className="relative flex items-center justify-center px-4 py-10 sm:px-8 lg:py-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center gap-3 text-center lg:hidden">
              <Logo size="lg" />
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-card backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-ink-900">Create your wallet</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                  Four details and you are ready to send money across the PayFlow network.
                </p>
              </div>

              {formError ? (
                <Alert tone="error" title="We could not create your account" className="mb-5">
                  {formError}
                </Alert>
              ) : null}

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="First name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Arijul"
                    autoComplete="given-name"
                    icon={UserIcon}
                    error={fieldErrors.firstName}
                    required
                  />
                  <TextField
                    label="Last name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Kader"
                    autoComplete="family-name"
                    icon={UserIcon}
                    error={fieldErrors.lastName}
                    required
                  />
                </div>

                <TextField
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="arijulkader"
                  autoComplete="username"
                  icon={AtSignIcon}
                  hint="Lowercase, at least 3 characters — this is your PayFlow handle."
                  error={fieldErrors.username}
                  maxLength={30}
                  required
                />

                <div>
                  <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    icon={LockIcon}
                    error={fieldErrors.password}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
                      >
                        {showPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                      </button>
                    }
                    required
                  />

                  {form.password ? (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex flex-1 gap-1.5">
                        {[0, 1, 2].map((index) => (
                          <span
                            key={index}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                              index < strength ? STRENGTH_BARS[strength] : 'bg-ink-100'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="w-16 text-right text-xs font-medium text-ink-400">
                        {STRENGTH_LABELS[strength]}
                      </span>
                    </div>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  loadingText="Creating your wallet..."
                  rightIcon={ChevronRightIcon}
                >
                  Create wallet
                </Button>
              </form>

              <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-ink-50/80 p-3.5 text-xs leading-relaxed text-ink-500">
                <LockIcon size={15} className="mt-0.5 shrink-0 text-ink-400" />
                <p>
                  Your password goes straight to the PayFlow API. Only the signed session token it
                  returns is kept in this browser.
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-ink-400">
              Connected to the existing backend · <span className="font-mono">POST /api/v1/user/signup</span>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
