'use client'
 
import { Shield, Globe, ExternalLink, Cpu } from 'lucide-react'
 
export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-sm tracking-widest uppercase">GNONYMOUS</span>
            <span className="font-light text-sm text-[--text-3] tracking-widest uppercase">Intelligence OS</span>
          </div>
 
          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md text-[--text-4] hover:text-foreground hover:bg-white/5 transition-all"
              aria-label="GitHub"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md text-[--text-4] hover:text-foreground hover:bg-white/5 transition-all"
              aria-label="LinkedIn"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md text-[--text-4] hover:text-foreground hover:bg-white/5 transition-all"
              aria-label="Twitter"
            >
              <Cpu className="w-4 h-4" />
            </a>
          </div>
        </div>
 
        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[--text-4] font-mono">
            &copy; {new Date().getFullYear()} Ghulam Nabi Kalhoro. All rights reserved.
          </p>
          <p className="text-xs text-[--text-4]/60 font-mono tracking-wider">
            Engineered with precision. Secured by design.
          </p>
        </div>
      </div>
    </footer>
  )
}
