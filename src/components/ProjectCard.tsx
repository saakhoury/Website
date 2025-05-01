'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  project: {
    title: string
    description: string
    tags: string[]
    type: string
    link: string
    image: string
  }
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div 
      className="group relative bg-[#0F0F11]/20 border border-[#1A1A1C] p-5 h-full overflow-hidden
                 hover:border-white/10 transition-colors duration-300
                 before:absolute before:inset-0 before:-z-10 
                 before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent
                 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Background glow effect */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                     
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-14 h-[1px] bg-gradient-to-r from-transparent to-white/10"></div>
        <div className="absolute top-0 right-0 h-14 w-[1px] bg-gradient-to-b from-transparent to-white/10"></div>
      </div>
      
      {/* Content */}
      <div className="space-y-2 relative z-10">
        <h3 className="text-base font-medium text-white/80 flex items-center gap-2">
          {project.title}
          {project.type === 'project' && (
            <span className="inline-block w-1.5 h-1.5 bg-blue-400/60 rounded-full"></span>
          )}
        </h3>
        <p className="text-xs text-gray-400/80 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="text-[10px] text-gray-400/80 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard 