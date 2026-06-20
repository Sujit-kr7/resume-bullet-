import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const go = () => navigate('/generator')

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">

      {/* System label */}
      <p className="font-mono text-xs tracking-[0.25em] uppercase text-gray-dim border border-black px-3 py-1 mb-8">
        SYSTEM LOGIN
      </p>

      {/* Heading */}
      <h1 className="font-sans font-bold text-5xl sm:text-6xl text-black tracking-tight mb-2 text-center">
        GET IN THE GRID
      </h1>
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-gray-dim mb-10 text-center">
        AUTHENTICATE YOUR SESSION BELOW
      </p>

      {/* Card */}
      <div className="w-full max-w-md">

        {/* Social Auth */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            id="google-btn"
            onClick={go}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            id="github-btn"
            onClick={go}
            className="btn-black flex items-center justify-center gap-2"
          >
            {/* Github icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            Github
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-black" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-dim whitespace-nowrap">
            MANUAL OVERRIDE
          </span>
          <div className="flex-1 h-px bg-black" />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="label-mono flex items-center gap-1.5 mb-2">
            <span className="text-black">■</span> VECTOR ID (EMAIL)
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dim" />
            <input
              id="email-input"
              type="email"
              placeholder="user@bullet.gen"
              className="input-brutal pl-9"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="label-mono flex items-center gap-1.5">
              <span className="text-black">■</span> ACCESS CODE (PASSWORD)
            </label>
            <button className="font-mono text-[10px] tracking-widest uppercase text-gray-dim hover:text-black transition-colors">
              FORGOT?
            </button>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dim" />
            <input
              id="password-input"
              type="password"
              placeholder="·········"
              className="input-brutal pl-9"
            />
          </div>
        </div>

        {/* CTA */}
        <button
          id="login-btn"
          onClick={go}
          className="btn-black w-full py-4 text-base"
        >
          EXECUTE ROUTINE →
        </button>

        {/* Dashed divider */}
        <div className="my-6 border-t border-dashed border-gray-mid" />

        {/* Sign up */}
        <p className="text-center text-sm text-gray-dim font-sans">
          No active session vector?{' '}
          <button
            onClick={go}
            className="text-black font-bold underline underline-offset-2 hover:text-gray-dim transition-colors"
          >
            Initialize Account
          </button>
        </p>
      </div>
    </div>
  )
}
