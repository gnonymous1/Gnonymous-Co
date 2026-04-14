'use client'
 
import { motion } from 'framer-motion'
import SectionWrapper, { childVariants } from './SectionWrapper'
import { ExternalLink, Shield, BarChart3, CheckCircle2 } from 'lucide-react'
 
interface ProjectCardProps {
  project: {
    title: string
    subtitle: string
    role: string
    problem: string
    solution: string
    tech: string[]
    status: { label: string; active: boolean }[]
    icon: React.ReactNode
  }
  index: number
}
 
function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      variants={childVariants}
      className="glass glass-hover rounded-xl overflow-hidden group relative"
    >
      {/* Subtle gradient top border */}
      <div className="h-px gradient-accent" />
 
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              {project.icon}
            </div>
            <div>
              <span className="text-emerald-400 font-mono text-xs tracking-widest">
                PROJECT {['I', 'II', 'III'][index] || index + 1}
              </span>
              <h3 className="text-xl font-bold mt-0.5">{project.title}</h3>
              <p className="text-xs text-[--text-3]">{project.subtitle}</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-[--text-4] group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
        </div>
 
        {/* Role */}
        <div className="mb-6 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
          <p className="text-xs text-emerald-400 font-mono">
            <span className="text-emerald-400/60">ROLE:</span> {project.role}
          </p>
        </div>
 
        {/* Problem & Solution */}
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs text-[--text-4] uppercase tracking-wider font-mono mb-1.5">
              Problem
            </p>
            <p className="text-sm text-[--text-2] leading-relaxed">
              {project.problem}
            </p>
          </div>
          <div>
            <p className="text-xs text-[--text-4] uppercase tracking-wider font-mono mb-1.5">
              Solution
            </p>
            <p className="text-sm text-[--text-1] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>
 
        {/* Tech stack */}
        <div className="mb-6">
          <p className="text-xs text-[--text-4] uppercase tracking-wider font-mono mb-2">
            Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded text-[--text-3]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
 
        {/* Status indicators */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
          {project.status.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${s.active ? 'text-emerald-400' : 'text-emerald-900/40'}`}
              />
              <span
                className={`text-xs font-mono ${
                  s.active ? 'text-emerald-400/80' : 'text-[--text-4]'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
 
const projects = [
  {
    title: 'Sovereign Heart',
    subtitle: 'AI Gateway',
    role: 'Senior Architect & System Engineer',
    problem:
      'Organizations lack centralized, auditable control over AI interactions. Data leaks through LLM providers, no visibility into token usage, and zero enforcement of security policies across AI workloads.',
    solution:
      'A centralized AI gateway with Zero-Trust guardrails, kernel-level monitoring via eBPF, multi-tenant token management, and real-time audit logging. Full visibility and control over every AI interaction.',
    tech: ['Go', 'Redis', 'ClickHouse', 'Docker', 'eBPF'],
    status: [
      { label: 'Active', active: true },
      { label: 'Secured', active: true },
      { label: 'Monitoring', active: true },
    ],
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
  },
  {
    title: 'Integrated Data Platform',
    subtitle: 'Full-Stack Dashboard System',
    role: 'Lead Developer & Data Engineer',
    problem:
      'Raw data scattered across multiple sources with no unified view. Teams relied on manual exports, disconnected spreadsheets, and fragmented reporting — leading to slow decisions.',
    solution:
      'Full raw data transformed into fully integrated, real-time dashboards. Automated ETL pipelines ingest, clean, and structure data. Interactive visualizations with live WebSocket updates.',
    tech: ['Next.js', 'Supabase', 'WebSockets', 'TypeScript', 'Chart.js'],
    status: [
      { label: 'Active', active: true },
      { label: 'Deployed', active: true },
      { label: 'Real-time', active: true },
    ],
    icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
  },
]
 
export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={childVariants} className="text-center mb-16">
          <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-3 block">
            {'// Portfolio'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Projects
          </h2>
          <p className="text-[--text-2] mt-3 max-w-lg mx-auto">
            Implemented and deployed — production systems delivering real value
          </p>
        </motion.div>
 
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
