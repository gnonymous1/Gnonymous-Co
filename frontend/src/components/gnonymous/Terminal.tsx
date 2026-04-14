'use client'
 
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionWrapper, { childVariants } from './SectionWrapper'
 
interface TerminalCommand {
  command: string
  output: string[]
}
 
const commands: TerminalCommand[] = [
  {
    command: 'sovereign-heart status',
    output: [
      '╔══════════════════════════════════════════════╗',
      '║  SOVEREIGN HEART — System Status            ║',
      '╚══════════════════════════════════════════════╝',
      '',
      '  ● Gateway Engine      ██████████ ACTIVE',
      '  ● Token Manager       ██████████ RUNNING',
      '  ● Audit Logger        ██████████ SYNCED',
      '  ● Health Monitor      ██████████ HEALTHY',
      '',
      '  Uptime: 47d 13h 22m | Requests: 12.4M | Errors: 0',
    ],
  },
  {
    command: 'sh gateway monitor --ebpf',
    output: [
      '╔══════════════════════════════════════════════╗',
      '║  eBPF Kernel Monitoring — Live Feed         ║',
      '╚══════════════════════════════════════════════╝',
      '',
      '  [kernel] syscall trace:   847,293 events/s',
      '  [kernel] network pkt:     2.1M pkt/s',
      '  [kernel] mem allocs:      12,491 allocs/s',
      '',
      '  LLM Provider Health:',
      '    ✓ OpenAI      23ms p99   99.97% uptime',
      '    ✓ Anthropic   31ms p99   99.99% uptime',
      '    ✓ Mistral     18ms p99   99.95% uptime',
      '',
      '  eBPF programs loaded: 7 | Maps active: 23',
    ],
  },
  {
    command: 'sovereign-heart tokens --audit',
    output: [
      '╔══════════════════════════════════════════════╗',
      '║  Token Audit Log — Last 24h                 ║',
      '╚══════════════════════════════════════════════╝',
      '',
      '  Tenant: GNON-CORP',
      '    Tokens issued:   847   |  Revoked: 3',
      '    Rate limit:      99.2% |  Quota: 94.1%',
      '',
      '  Tenant: STARTUP-X',
      '    Tokens issued:   231   |  Revoked: 0',
      '    Rate limit:      100%  |  Quota: 67.3%',
      '',
      '  ⚠ No anomalies detected. All tenants compliant.',
    ],
  },
  {
    command: 'sh deploy --zero-trust',
    output: [
      '╔══════════════════════════════════════════════╗',
      '║  Zero-Trust Deployment Validation           ║',
      '╚══════════════════════════════════════════════╝',
      '',
      '  Validating trust boundaries...',
      '    ✓ mTLS certificates     — Valid',
      '    ✓ Service mesh          — Enforced',
      '    ✓ Network policies      — 47 rules active',
      '    ✓ RBAC constraints      — Locked',
      '    ✓ Secret encryption     — AES-256-GCM',
      '',
      '  Deployment: sovereign-heart v3.2.1',
      '  Status: ✅ ZERO-TRUST VERIFIED — Ready for production',
    ],
  },
]
 
export default function Terminal() {
  const [currentCmdIndex, setCurrentCmdIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [isTypingCommand, setIsTypingCommand] = useState(true)
  const [isShowingOutput, setIsShowingOutput] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })
  const terminalEndRef = useRef<HTMLDivElement>(null)
 
  const currentCmd = commands[currentCmdIndex]
 
  const resetTerminal = useCallback(() => {
    setTypedText('')
    setOutputLines([])
    setIsTypingCommand(true)
    setIsShowingOutput(false)
  }, [])
 
  // Typing effect for command
  useEffect(() => {
    if (!isInView) return
 
    if (isTypingCommand) {
      const cmd = currentCmd.command
      if (typedText.length < cmd.length) {
        const timer = setTimeout(() => {
          setTypedText(cmd.slice(0, typedText.length + 1))
        }, 30 + Math.random() * 40)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setIsTypingCommand(false)
          setIsShowingOutput(true)
        }, 400)
        return () => clearTimeout(timer)
      }
    }
  }, [isTypingCommand, typedText, currentCmd.command, isInView])
 
  // Show output lines one by one
  useEffect(() => {
    if (!isInView || !isShowingOutput) return
 
    const allLines = currentCmd.output
    if (outputLines.length < allLines.length) {
      const timer = setTimeout(() => {
        setOutputLines((prev) => [...prev, allLines[prev.length]])
      }, 50)
      return () => clearTimeout(timer)
    } else {
      // All output shown, wait then move to next command
      const timer = setTimeout(() => {
        const nextIndex = (currentCmdIndex + 1) % commands.length
        setCurrentCmdIndex(nextIndex)
        resetTerminal()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isShowingOutput, outputLines, currentCmd.output, currentCmdIndex, resetTerminal, isInView])
 
  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [outputLines, typedText])
 
  return (
    <SectionWrapper id="terminal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={childVariants} className="text-center mb-10">
          <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-3 block">
            {'// Live Interface'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            The Terminal
          </h2>
          <p className="text-[--text-2] mt-3 max-w-lg mx-auto">
            Real-time command interface for Gnonymous Intelligence Suite
          </p>
        </motion.div>
 
        <motion.div
          ref={ref}
          variants={childVariants}
          className="rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-emerald-500/5 glow-emerald"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-xs text-[--text-3] font-mono">
              gnonymous@intelligence-os:~
            </span>
          </div>
 
          {/* Terminal body */}
          <div className="bg-black/50 p-4 sm:p-6 font-mono text-sm min-h-[340px] max-h-[400px] overflow-y-auto">
            {/* Current command */}
            <div className="flex items-start gap-0">
              <span className="text-emerald-400 font-bold shrink-0">$ </span>
              <span className="text-foreground">
                {typedText}
                {isTypingCommand && (
                  <span className="cursor-blink text-emerald-400">▊</span>
                )}
              </span>
            </div>
 
            {/* Output */}
            {outputLines.length > 0 && (
              <div className="mt-3 space-y-0.5">
                {outputLines.map((line, i) => (
                  <div
                    key={`${currentCmdIndex}-${i}`}
                    className={`${
                      line.includes('✓') || line.includes('✅')
                        ? 'text-emerald-400'
                        : line.includes('⚠')
                        ? 'text-yellow-400'
                        : line.includes('●')
                        ? 'text-emerald-300'
                        : line.includes('║') || line.includes('╔') || line.includes('╚')
                        ? 'text-emerald-500/60'
                        : 'text-emerald-400/70'
                    }`}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            )}
 
            {/* Blinking cursor when output is shown */}
            {!isTypingCommand && isShowingOutput && outputLines.length === currentCmd.output.length && (
              <div className="mt-3">
                <span className="text-emerald-400 font-bold">$ </span>
                <span className="cursor-blink text-emerald-400">▊</span>
              </div>
            )}
 
            <div ref={terminalEndRef} />
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
