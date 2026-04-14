'use client'
 
import { motion } from 'framer-motion'
import SectionWrapper, { childVariants } from './SectionWrapper'
import { Database, Cpu, Lock, Server, Code, BarChart3, Workflow, Layers } from 'lucide-react'
 
const expertiseAreas = [
  {
    icon: <Database className="w-5 h-5 text-emerald-400" />,
    title: 'Data Engineering',
    label: 'PIPELINES & ETL',
    description: 'Transforming raw, fragmented data into fully integrated dashboards and real-time analytics pipelines. From ingestion to visualization — structured, clean, and actionable.',
    status: 'PRODUCTION',
  },
  {
    icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    title: 'AI Solutions',
    label: 'INTELLIGENCE',
    description: 'Designing and deploying AI-powered systems — from LLM gateways with Zero-Trust guardrails to agentic workflows. Sovereign Heart AI Gateway is the flagship.',
    status: 'DEPLOYED',
  },
  {
    icon: <Workflow className="w-5 h-5 text-emerald-400" />,
    title: 'API Architecture',
    label: 'INTEGRATION',
    description: 'Building high-throughput, secure API layers that connect systems seamlessly. Multi-tenant token management, rate limiting, and real-time audit logging baked in.',
    status: 'ACTIVE',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
    title: 'Project Portfolio',
    label: 'DELIVERY',
    description: 'A proven track record of projects implemented and deployed end-to-end. Full-cycle from architecture design through development, testing, and production rollout.',
    status: 'SHIPPED',
  },
  {
    icon: <Layers className="w-5 h-5 text-emerald-400" />,
    title: 'Project Build-Up',
    label: 'SCALING',
    description: 'Taking projects from zero to production-grade. Infrastructure provisioning, CI/CD pipelines, monitoring, and scaling strategies that handle real traffic from day one.',
    status: 'SCALED',
  },
  {
    icon: <Server className="w-5 h-5 text-emerald-400" />,
    title: 'Top-Level Project Management',
    label: 'LEADERSHIP',
    description: 'Leading cross-functional teams with a technical-first approach. Architecture reviews, sprint planning, stakeholder communication, and delivery accountability at scale.',
    status: 'OPERATIONAL',
  },
]
 
export default function ExecutiveSummary() {
  return (
    <SectionWrapper id="expertise" className="grid-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={childVariants} className="text-center mb-16">
          <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-3 block">
            {'// Core Expertise'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            What I Build
          </h2>
          <p className="text-[--text-2] mt-3 max-w-lg mx-auto">
            Senior Architect & Full Stack Programmer — from raw data to production systems
          </p>
        </motion.div>
 
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {expertiseAreas.map((area) => (
            <motion.div
              key={area.title}
              variants={childVariants}
              className="glass glass-hover rounded-xl p-6 group"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  {area.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{area.title}</h3>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-widest">{area.label}</p>
                </div>
              </div>
 
              <p className="text-sm text-[--text-2] leading-relaxed mb-5">
                {area.description}
              </p>
 
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full status-dot" />
                  <span className="text-[10px] text-[--text-3] font-mono tracking-wider">{area.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
