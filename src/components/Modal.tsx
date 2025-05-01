'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  experience: {
    title: string
    company: string
    period: string
    longDescription: string
    projects: {
      title: string
      description: string
    }[]
    skills?: string[]
  } | null
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, experience }) => {
  if (!experience) return null

  return (
    <AnimatePresence mode="wait">
      {isOpen && experience && (
        <>
          {/* Backdrop with blur and gradient */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            onClick={onClose}
          >
            {/* Dark overlay with blur */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-slow" />
          </motion.div>

          {/* Modal Card */}
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-4xl pointer-events-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Modern Card Design with Floating Effect */}
              <div className="relative overflow-hidden shadow-2xl
                            before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:z-10
                            after:absolute after:inset-0 after:bg-[#111112] after:z-20">
                {/* Animated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 animate-border-flow" />
                
                {/* Content Container */}
                <div className="relative z-30">
                  {/* Header Section with Dynamic Gradient */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-shimmer" />
                    <div className="relative p-8 pb-6 bg-black/95">
                      <div className="flex items-start justify-between">
                        <div>
                          <motion.h2 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-2xl font-light text-white mb-2"
                          >
                            {experience.title}
                          </motion.h2>
                          <motion.p 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm text-[#9A9AA2] flex items-center gap-2"
                          >
                            <span className="w-2 h-2 bg-blue-500/50 animate-pulse" />
                            {experience.company} • {experience.period}
                          </motion.p>
                        </div>
                        <motion.button 
                          onClick={onClose}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-[#9A9AA2] hover:text-white transition-colors p-2
                                   bg-white/5 hover:bg-white/10"
                        >
                          ✕
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 bg-[#111112] space-y-8">
                    {experience.company === 'Coinbase AM' || experience.company === 'Coinbase' || experience.company === 'HammingAI' ? (
                      <div className="flex items-center justify-center h-32">
                        <span className="text-xl text-white/80 font-semibold">Coming soon.</span>
                      </div>
                    ) : (
                      <>
                        {/* Overview with animated highlight */}
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-medium text-white/90 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500" />
                            Overview
                          </h3>
                          <p className="text-[#9A9AA2] leading-relaxed pl-4 border-l border-white/5">
                            {experience.longDescription}
                          </p>
                        </motion.div>

                        {/* Projects Grid with hover effects */}
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-medium text-white/90 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-gradient-to-r from-purple-500 to-pink-500" />
                            Key Projects
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                            {experience.projects.map((project, index) => (
                              <motion.div 
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 * index }}
                                className="group p-4 bg-[#18181A] hover:bg-[#1C1C1E]
                                         border border-white/5 hover:border-white/10
                                         transition-all duration-300 relative overflow-hidden"
                              >
                                {/* Animated gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative">
                                  <h4 className="text-sm font-medium text-white mb-2 group-hover:text-white/90 transition-colors">
                                    {project.title}
                                  </h4>
                                  <p className="text-sm text-[#9A9AA2] leading-relaxed group-hover:text-[#ADADB5] transition-colors">
                                    {project.description}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Skills with animated tags */}
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-medium text-white/90 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-gradient-to-r from-pink-500 to-blue-500" />
                            Technologies
                          </h3>
                          <div className="flex flex-wrap gap-2 pl-4">
                            {experience.skills?.map((skill, index) => (
                              <motion.span 
                                key={index}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1 text-sm text-[#9A9AA2] bg-[#18181A] 
                                         border border-white/5 hover:border-white/10 hover:bg-[#1C1C1E]
                                         transition-all duration-300"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal 