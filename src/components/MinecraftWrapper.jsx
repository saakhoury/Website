'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import MinecraftScene with client-side only rendering
const MinecraftScene = dynamic(() => import('./MinecraftScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square flex items-center justify-center bg-black/10 rounded">
      <motion.div 
        className="text-white/50 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading Minecraft world...
      </motion.div>
    </div>
  )
})

// Fallback component in case of errors
const FallbackAnimation = () => {
  const blocks = [
    { size: 70, color: "#5a8c3e", delay: 0.3, x: -20, y: 20 },  // Grass
    { size: 70, color: "#634223", delay: 0.4, x: 20, y: -20 },  // Dirt
    { size: 70, color: "#7e7e7e", delay: 0.5, x: -30, y: -10 }, // Stone
    { size: 70, color: "#3853a4", delay: 0.6, x: 15, y: 30 }    // Water
  ]
  
  return (
    <div className="w-full aspect-square flex items-center justify-center bg-black/20 overflow-hidden rounded">
      <div className="relative w-full h-full flex items-center justify-center">
        {blocks.map((block, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ 
              width: block.size, 
              height: block.size, 
              backgroundColor: block.color,
              borderRadius: '4px'
            }}
            initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1, 1, 1],
              x: [0, block.x, block.x, block.x],
              y: [0, block.y, block.y, block.y],
              rotate: [0, 0, 45, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 8,
              delay: block.delay,
              repeatType: "reverse",
              times: [0, 0.2, 0.5, 1]
            }}
          />
        ))}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute z-10 bg-black/70 py-2 px-4 rounded text-center"
        >
          <p className="text-white/90 text-sm">
            Minecraft world temporarily unavailable
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// Main wrapper with error handling
export default function MinecraftWrapper() {
  const [hasError, setHasError] = useState(false)
  
  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])
  
  if (hasError) {
    return <FallbackAnimation />
  }
  
  return (
    <>
      <MinecraftScene />
      <p className="text-xs text-center text-gray-400/70 mt-4">
        Explore the Minecraft world! Click and drag to look around.
      </p>
    </>
  )
} 