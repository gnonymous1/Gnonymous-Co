'use client'
 
import Navbar from '@/components/gnonymous/Navbar'
import Hero from '@/components/gnonymous/Hero'
import Terminal from '@/components/gnonymous/Terminal'
import ExecutiveSummary from '@/components/gnonymous/ExecutiveSummary'
import Projects from '@/components/gnonymous/Projects'
import Knowledge from '@/components/gnonymous/Knowledge'
import Contact from '@/components/gnonymous/Contact'
import Footer from '@/components/gnonymous/Footer'
 
export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-emerald-500/30">
      <Navbar />
      <Hero />
      <ExecutiveSummary />
      <Terminal />
      <Projects />
      <Knowledge />
      <Contact />
      <Footer />
    </main>
  )
}
