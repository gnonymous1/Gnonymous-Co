'use client'
 
import { motion } from 'framer-motion'
import SectionWrapper, { childVariants } from './SectionWrapper'
import { BookOpen, Lightbulb, Clock } from 'lucide-react'
 
export default function Knowledge() {
  return (
    <SectionWrapper id="knowledge" className="grid-bg-dense">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={childVariants} className="text-center mb-16">
          <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-3 block">
            {'// Intel Library'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Knowledge
          </h2>
          <p className="text-[--text-2] mt-3 max-w-lg mx-auto">
            Technical deep-dives and strategic insights from the field
          </p>
        </motion.div>
 
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {/* Engineering Logs */}
          <motion.div
            variants={childVariants}
            className="glass glass-hover rounded-xl p-6 sm:p-8 group cursor-default"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Engineering Logs</h3>
                <p className="text-xs text-[--text-3]">Technical deep-dives</p>
              </div>
            </div>
 
            {/* Code snippet preview */}
            <div className="rounded-lg bg-black/40 border border-white/5 p-4 mb-5 font-mono text-xs overflow-hidden">
              <div className="text-[--text-4] mb-2">{'// eBPF kernel probe'}</div>
              <div>
                <span className="text-emerald-400/70">SEC</span>
                <span className="text-[--text-2]">(</span>
                <span className="text-yellow-400/70">&quot;kprobe/tcp_sendmsg&quot;</span>
                <span className="text-[--text-2]">)</span>
              </div>
              <div className="text-emerald-400/60">
                int <span className="text-foreground/70">trace_tcp</span>
                <span className="text-[--text-2]">(</span>
                <span className="text-[--text-3]">struct pt_regs *ctx</span>
                <span className="text-[--text-2]">)</span>
                <span className="text-[--text-2]">{'{'}</span>
              </div>
              <div className="pl-4 text-[--text-3]">
                <span className="text-emerald-400/50">u64</span> ts = bpf_ktime...
              </div>
              <div className="text-[--text-4]">{'  ...'}</div>
              <div className="text-[--text-2]">{'}'}</div>
            </div>
 
            <p className="text-sm text-[--text-2] leading-relaxed mb-5">
              In-depth articles on eBPF monitoring, Zero-Trust architecture, Go performance
              optimization, and building production AI gateways.
            </p>
 
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/15 text-emerald-400/60 text-xs font-mono">
                <Clock className="w-3 h-3" />
                Coming Soon
              </span>
            </div>
          </motion.div>
 
          {/* Management Insights */}
          <motion.div
            variants={childVariants}
            className="glass glass-hover rounded-xl p-6 sm:p-8 group cursor-default"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Management Insights</h3>
                <p className="text-xs text-[--text-3]">Strategic perspectives</p>
              </div>
            </div>
 
            {/* Article preview list */}
            <div className="space-y-3 mb-5">
              {[
                'Zero-Trust in Law Enforcement: A Framework',
                'Managing AI Risk in Sovereign Infrastructure',
                'Bridging Physical & Digital Security Operations',
              ].map((title, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <div className="w-1 h-1 rounded-full bg-emerald-400/50 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground/70">{title}</p>
                    <p className="text-xs text-[--text-4] font-mono mt-1">
                      {['8 min read', '12 min read', '6 min read'][i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
 
            <p className="text-sm text-[--text-2] leading-relaxed mb-5">
              Strategic articles on AI governance, security operations management, and
              the intersection of technology with institutional frameworks.
            </p>
 
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/15 text-emerald-400/60 text-xs font-mono">
                <Clock className="w-3 h-3" />
                Coming Soon
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
