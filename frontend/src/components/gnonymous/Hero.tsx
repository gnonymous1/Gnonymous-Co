'use client'
 
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
 
export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg" />
 
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle absolute top-1/4 left-1/4 w-1 h-1 bg-emerald-500/20 rounded-full" />
        <div className="particle absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-400/15 rounded-full" />
        <div className="particle absolute bottom-1/3 left-1/2 w-1 h-1 bg-emerald-300/10 rounded-full" />
      </div>
 
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
 
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full status-dot" />
            Systems Operational
          </span>
        </motion.div>
 
        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-4"
        >
          <span className="text-sm sm:text-base font-mono text-emerald-400/60 tracking-[0.4em] uppercase">
            GN + Onymous
          </span>
        </motion.div>
 
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          GNONYMOUS
        </motion.h1>
 
        {/* Gradient accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-32 h-[2px] mx-auto mb-8 gradient-accent origin-center"
        />
 
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="text-lg sm:text-xl md:text-2xl text-[--text-2] font-light max-w-3xl mx-auto mb-4"
        >
          Data Engineer &bull; AI Solutions &bull; API Architect &bull;{' '}
          <span className="text-foreground font-normal">Top-Level Project Manager</span>
        </motion.p>
 
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="text-sm sm:text-base text-[--text-3] max-w-xl mx-auto font-mono"
        >
          From sovereign AI gateways to full-stack deployments — engineered by Ghulam Nabi Kalhoro
        </motion.p>
 
        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-medium hover:bg-emerald-500/20 transition-all text-sm"
          >
            View Projects
          </a>
          <a
            href="#terminal"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#terminal')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-6 py-3 text-[--text-2] hover:text-foreground border border-white/10 rounded-lg font-medium hover:border-white/20 transition-all text-sm"
          >
            Access Terminal →
          </a>
        </motion.div>
      </div>
 
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-[--text-3] uppercase tracking-[0.3em] font-mono">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-[--text-3] bounce-slow" />
      </motion.div>
    </section>
  )
}
