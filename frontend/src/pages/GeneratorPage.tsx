import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { useResumeAnalysis } from '../hooks/useResumeAnalysis'
import { AnalysisResult, ProjectAnalysis } from '../types'
import { FileText, Copy, Check, AlertTriangle, RotateCcw, History, User, LogOut } from 'lucide-react'

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onReset }: { onReset: () => void }) {
  const navigate = useNavigate()
  return (
    <header className="border-b-2 border-black bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-mono font-bold text-lg tracking-widest uppercase">
          BULLET_GEN
        </span>
        <nav className="flex items-center gap-6">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noreferrer"
            className="btn-outline py-1.5 px-3 text-xs"
          >
            Built for Digital Heroes
          </a>
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
              Sujit Kumar
            </span>
            <span className="font-mono text-[10px] tracking-widest text-gray-dim">
              sujitkumarsamn@gmail.com
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-black py-1.5 px-4 text-xs"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}

// ─── Drop Zone ────────────────────────────────────────────────────────────────
function DropZone({ onFile, file, disabled }: {
  onFile: (f: File) => void
  file: File | null
  disabled?: boolean
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (accepted) => accepted[0] && onFile(accepted[0]),
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled,
  })

  if (file) {
    return (
      <div className="drop-zone p-6 flex items-center gap-4 border-2 border-black bg-gray-brutal">
        <FileText size={28} />
        <div className="flex-1 min-w-0">
          <p className="font-mono font-bold text-sm truncate">{file.name}</p>
          <p className="font-mono text-xs text-gray-dim mt-0.5">
            {(file.size / 1024).toFixed(0)} KB · LOADED
          </p>
        </div>
        {!disabled && (
          <button
            onClick={(e) => { e.stopPropagation(); onFile(null as any) }}
            className="font-mono text-xs uppercase tracking-widest text-gray-dim hover:text-black border border-gray-mid px-2 py-1"
          >
            CLEAR
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`drop-zone p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all
        ${isDragActive && !isDragReject ? 'active' : ''}
        ${isDragReject ? 'reject' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <FileText size={36} className="text-gray-dim mb-4" strokeWidth={1.5} />
      <p className="font-mono font-bold text-sm tracking-widest uppercase mb-1">
        {isDragReject ? 'UNSUPPORTED FORMAT' : isDragActive ? 'DROP NOW' : 'DROP FILE HERE'}
      </p>
      <p className="font-mono text-xs text-gray-dim tracking-wider">
        PDF, DOCX or MD
      </p>
    </div>
  )
}

// ─── Analyzing State ──────────────────────────────────────────────────────────
function AnalyzingPanel({ fileName }: { fileName: string }) {
  return (
    <div className="card-brutal p-8 text-center animate-fade-in">
      <div className="border-2 border-black p-8 mb-6">
        <FileText size={40} className="mx-auto mb-4 text-gray-dim" strokeWidth={1} />
        <p className="font-mono text-xs tracking-widest uppercase text-gray-dim mb-1">
          {fileName}
        </p>
        <p className="font-mono font-bold text-sm tracking-widest uppercase mt-4 cursor-blink">
          ■ ANALYZING PIXELS
        </p>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-gray-brutal border border-black overflow-hidden">
        <div className="h-full bg-black progress-animate" />
      </div>
      <p className="font-mono text-xs text-gray-dim mt-2 tracking-widest">
        PROCESSING WITH GEMINI 2.5 FLASH...
      </p>
    </div>
  )
}

// ─── ATS Intel Card ──────────────────────────────────────────────────────────
function ATSIntelCard({ result }: { result: AnalysisResult }) {
  const score = result.atsScore

  const getScoreTag = (s: number) => {
    if (s >= 75) return <span className="tag tag-green">✓ ATS READY</span>
    if (s >= 50) return <span className="tag tag-black">~ NEEDS WORK</span>
    return <span className="tag tag-red">✕ LOW SCORE</span>
  }

  return (
    <div className="card-brutal animate-fade-in">
      <div className="section-header px-5 pt-4">
        <span>⊚ ATS INTEL</span>
        <span className="ml-auto font-mono text-2xl font-bold">{score}</span>
        <span className="font-mono text-xs text-gray-dim">/100</span>
        {getScoreTag(score)}
      </div>

      <div className="px-5 pb-5 space-y-3">
        {/* Score bar */}
        <div className="h-2 bg-gray-brutal border border-black overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-1000"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Issues */}
        {result.globalMissingKeywords && result.globalMissingKeywords.length > 0 && (
          <div className="pt-2">
            <p className="label-mono flex items-center gap-1.5 text-red-brutal mb-2">
              <AlertTriangle size={11} /> MISSING KEYWORDS
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.globalMissingKeywords.map((kw, i) => (
                <span key={i} className="tag tag-red">{kw}</span>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {result.summary && (
          <div className="pt-2 border-t border-gray-mid">
            <p className="label-mono mb-1.5">ANALYSIS</p>
            <p className="text-xs text-gray-dim font-sans leading-relaxed">{result.summary}</p>
          </div>
        )}

        {/* Strengths */}
        {result.strengths && result.strengths.length > 0 && (
          <div className="pt-2 border-t border-gray-mid">
            <p className="label-mono text-green-brutal mb-1.5">✓ STRENGTHS DETECTED</p>
            <div className="flex flex-wrap gap-1.5">
              {result.strengths.map((s, i) => (
                <span key={i} className="tag tag-green">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Metric suggestions */}
        {result.projects[0]?.metricSuggestions?.length > 0 && (
          <div className="pt-2 border-t border-gray-mid">
            <p className="label-mono mb-1.5">↑ METRIC INJECTION</p>
            {result.projects[0].metricSuggestions.slice(0, 3).map((m, i) => (
              <p key={i} className="text-xs font-mono text-gray-dim mt-1">→ {m}</p>
            ))}
          </div>
        )}

        {/* Generic keywords row */}
        {result.projects[0]?.missingKeywords?.length > 0 && (
          <div className="pt-2 border-t border-gray-mid">
            <p className="label-mono mb-1.5">GENERIC KEYWORDS</p>
            <div className="flex flex-wrap gap-1">
              {result.projects[0].missingKeywords.slice(0, 5).map((k, i) => (
                <span key={i} className="tag tag-black">{k}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── God-Mode Bullets Card ───────────────────────────────────────────────────
function GodModeBulletsCard({ projects }: { projects: ProjectAnalysis[] }) {
  const [copied, setCopied] = useState(false)

  const allBullets = projects.flatMap(p =>
    p.improvedBullets.map(b => `• ${b}`)
  )

  const copyAll = async () => {
    await navigator.clipboard.writeText(allBullets.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card-brutal animate-fade-in stagger-1">
      <div className="section-header px-5 pt-4">
        <span>★ GOD-MODE BULLETS</span>
        <button
          onClick={copyAll}
          className="ml-auto btn-black py-1 px-3 text-[10px] flex items-center gap-1"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? 'COPIED' : 'Copy All'}
        </button>
      </div>

      <div className="px-5 pb-5 space-y-5">
        {projects.map((project, pi) => (
          <div key={pi} className={pi > 0 ? 'pt-4 border-t border-gray-mid' : ''}>
            {projects.length > 1 && (
              <p className="label-mono mb-3 text-gray-dim">{project.projectName}</p>
            )}
            <ul className="space-y-3">
              {project.improvedBullets.map((bullet, bi) => (
                <BulletRow key={bi} bullet={bullet} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function BulletRow({ bullet }: { bullet: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(bullet)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <li className="group flex items-start gap-3 p-2 hover:bg-gray-brutal transition-colors">
      <span className="text-black mt-0.5 flex-shrink-0 font-mono">•</span>
      <p className="text-sm font-sans leading-relaxed flex-1">{bullet}</p>
      <button
        onClick={copy}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-dim hover:text-black"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </li>
  )
}

// ─── Past Drops ───────────────────────────────────────────────────────────────
function PastDropCard({ name, date, bullets }: { name: string; date: string; bullets: number }) {
  return (
    <div className="card-brutal p-4 hover:bg-gray-brutal transition-colors cursor-pointer">
      <FileText size={20} className="text-gray-dim mb-3" strokeWidth={1.5} />
      <p className="font-mono text-xs font-bold uppercase tracking-wider truncate">{name}</p>
      <p className="font-mono text-[10px] text-gray-dim mt-1">{date} · {bullets} bullets extracted</p>
    </div>
  )
}

// ─── Main Generator Page ──────────────────────────────────────────────────────
export default function GeneratorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetRole, setTargetRole] = useState('Frontend Developer')
  const [jobDesc, setJobDesc] = useState('')
  const [showJD, setShowJD] = useState(false)

  const { status, result, error, analyze, reset } = useResumeAnalysis()

  const isLoading = status === 'uploading' || status === 'analyzing'
  const isSuccess = status === 'success'

  const handleAnalyze = () => {
    if (!file || !targetRole.trim()) return
    analyze(file, targetRole, jobDesc)
  }

  const handleReset = () => {
    setFile(null)
    reset()
  }

  const handleClearFile = (f: File | null) => {
    if (f === null) setFile(null)
    else setFile(f)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onReset={handleReset} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="font-sans font-bold text-4xl sm:text-5xl tracking-tight mb-3 leading-tight">
            ■ LEVEL UP YOUR STATS
          </h1>
          <p className="font-sans text-gray-dim text-sm max-w-lg leading-relaxed">
            Drop your subdued resume. Our logic engine strips the fluff, analyzes ATS patterns, and synthesizes high-impact, god-mode bullet points.
          </p>
        </div>

        {/* Upload + role selector */}
        {!isSuccess && (
          <div className="mb-8">
            {/* Drop zone */}
            <DropZone
              onFile={handleClearFile}
              file={file}
              disabled={isLoading}
            />

            {/* Role + analyze row */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                id="role-input"
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="TARGET ROLE (e.g. Frontend Developer)"
                disabled={isLoading}
                className="input-brutal flex-1 font-mono text-sm uppercase tracking-wider placeholder:text-gray-dim placeholder:font-mono placeholder:text-xs placeholder:tracking-widest"
              />
              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={!file || !targetRole.trim() || isLoading}
                className="btn-black px-8 py-3 whitespace-nowrap"
              >
                {isLoading ? 'PROCESSING...' : 'EXECUTE ANALYSIS →'}
              </button>
            </div>

            {/* Optional JD toggle */}
            <button
              onClick={() => setShowJD(!showJD)}
              className="mt-3 font-mono text-[10px] tracking-widest uppercase text-gray-dim hover:text-black transition-colors"
            >
              {showJD ? '▲ HIDE' : '▼ ADD JOB DESCRIPTION (ENABLES MATCH SCORE)'}
            </button>
            {showJD && (
              <textarea
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="PASTE JOB DESCRIPTION HERE..."
                rows={5}
                disabled={isLoading}
                className="input-brutal mt-3 font-mono text-xs tracking-wide resize-none"
              />
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 border-2 border-red-brutal bg-red-50 flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-brutal flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-red-brutal">ERROR</p>
                  <p className="text-sm text-red-brutal mt-0.5">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analyzing overlay */}
        {isLoading && file && (
          <div className="mb-8">
            <AnalyzingPanel fileName={file.name} />
          </div>
        )}

        {/* Results */}
        {isSuccess && result && (
          <>
            {/* Reset bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-gray-dim">ANALYSIS COMPLETE</p>
                <p className="font-sans font-bold text-sm mt-0.5">
                  {file?.name} · ATS Score: <span className="font-mono">{result.atsScore}/100</span>
                </p>
              </div>
              <button onClick={handleReset} className="btn-outline py-2 px-4 text-xs flex items-center gap-2">
                <RotateCcw size={13} /> NEW DROP
              </button>
            </div>

            {/* Two-column results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
              <ATSIntelCard result={result} />
              <GodModeBulletsCard projects={result.projects} />
            </div>
          </>
        )}

        {/* Past Drops (static demo) */}
        <div className="mt-4">
          <div className="section-header">
            <span>↻ PAST DROPS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PastDropCard name="FRONTEND_DEV_V2.PDF" date="Oct 24, 2024" bullets={17} />
            <PastDropCard name="FULLSTACK_RESUME_FINAL.PDF" date="Oct 11, 2024" bullets={12} />
            <PastDropCard name="OLD_RESUME_2023.DOCX" date="Sep 20, 2024" bullets={9} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest uppercase text-gray-dim">
            IMPACT UTILITY
          </span>
          <div className="flex gap-6">
            {['TERMS', 'PRIVACY', 'SUPPORT'].map(l => (
              <button key={l} className="font-mono text-[10px] tracking-widest uppercase text-gray-dim hover:text-black transition-colors">
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
