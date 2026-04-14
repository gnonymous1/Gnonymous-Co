'use client'
 
import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
 
interface SectionWrapperProps {
  children: ReactNode
  id?: string
  className?: string
}
 
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1],
      staggerChildren: 0.1,
    },
  },
}
 
export const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}
 
export default function SectionWrapper({ children, id, className = '' }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
 
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={sectionVariants}
      className={`relative py-20 md:py-28 ${className}`}
    >
      {children}
    </motion.section>
  )
}
