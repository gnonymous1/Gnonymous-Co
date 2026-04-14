'use client'
 
import { motion } from 'framer-motion'
import SectionWrapper, { childVariants } from './SectionWrapper'
import { ArrowRight, Mail } from 'lucide-react'
 
export default function Contact() {
  return (
    <SectionWrapper id="contact" className="grid-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={childVariants}
          className="glass rounded-2xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none" />
 
          <div className="relative z-10">
            <motion.div variants={childVariants}>
              <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4 block">
                {'// Establish Contact'}
              </span>
            </motion.div>
 
            <motion.h2
              variants={childVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              Ready to Build
              <br />
              Something{' '}
              <span className="text-emerald-400">Sovereign</span>?
            </motion.h2>
 
            <motion.p
              variants={childVariants}
              className="text-[--text-2] max-w-lg mx-auto mb-8 leading-relaxed"
            >
              Whether you need a secure AI gateway, a full-stack MVP, or long-term
              technical leadership — let&apos;s discuss your mission.
            </motion.p>
 
            <motion.div
              variants={childVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="mailto:contact@gnonymous.ai"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-medium hover:bg-emerald-500/20 transition-all text-sm group"
              >
                <Mail className="w-4 h-4" />
                contact@gnonymous.ai
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black border border-white rounded-lg font-medium hover:bg-white/90 transition-all text-sm group"
              >
                Schedule a Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
 
            <motion.p
              variants={childVariants}
              className="text-xs text-[--text-4] mt-8 font-mono"
            >
              Response within 24h • Encrypted communication available
            </motion.p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
