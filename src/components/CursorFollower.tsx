'use client'
import React, { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface CursorFollowerProps {
  colors: string[]
}

const CursorFollower: React.FC<CursorFollowerProps> = ({ colors }) => {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { 
    damping: 35,
    stiffness: 200,
    mass: 0.5
  }
  
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 48)
      cursorY.set(e.clientY - 48)
    }

    window.addEventListener('mousemove', moveCursor)
    return () => {
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [cursorX, cursorY])

  const gradientString = `radial-gradient(circle at center, ${colors.join(', ')})`

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        mixBlendMode: 'normal'
      }}
    >
      <motion.div
        className="w-24 h-24 rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          background: gradientString,
          opacity: 0.3,
          filter: 'blur(24px)',
        }}
      />
    </motion.div>
  )
}

export default CursorFollower 