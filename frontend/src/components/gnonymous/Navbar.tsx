'use client'
 
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
 
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Knowledge', href: '#knowledge' },
]
 
export default function Navbar() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
 
    // Initial check
    const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))
    setIsLoggedIn(!!token)
 
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
 
  const handleNavClick = (href: string) => {
    setIsMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
 
  const handleSignOut = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    router.push('/')
  }
 
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault()
                handleNavClick('#home')
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <Terminal className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
            <span className="font-bold text-lg tracking-wider">
              GNONYMOUS
            </span>
          </Link>
 
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="px-4 py-2 text-sm text-[--text-2] hover:text-foreground transition-colors rounded-md hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            
            <div className="w-px h-4 bg-white/10 mx-2" />
 
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-2"
            >
              Intelligence OS
            </Link>
 
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="ml-3 px-4 py-2 text-sm font-medium bg-white/5 text-[--text-2] border border-white/10 rounded-md hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-3 px-4 py-2 text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md hover:bg-emerald-500/20 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
 
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[--text-2] hover:text-foreground transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
 
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link.href)
                  }}
                  className="block px-4 py-3 text-sm text-[--text-2] hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/dashboard"
                className="block px-4 py-3 text-sm text-emerald-400"
              >
                Intelligence OS
              </Link>
              {isLoggedIn ? (
                 <button
                 onClick={handleSignOut}
                 className="block w-full px-4 py-3 text-sm font-medium text-red-400 bg-red-500/5 border border-red-500/10 rounded-md text-center mt-2"
               >
                 Disconnect Profile
               </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-3 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-center mt-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
