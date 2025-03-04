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
  index: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  // Project-type specific background gradients with more neutral colors
  const backgroundGradients = {
    'project': 'bg-gradient-to-br from-[#2A2A2D]/10 via-[#2A2A2D]/5 to-transparent',
    'volunteer': 'bg-gradient-to-br from-[#2D2A2D]/10 via-[#2D2A2D]/5 to-transparent',
    'company': 'bg-gradient-to-br from-[#2A2D2D]/10 via-[#2A2D2D]/5 to-transparent',
    'music': 'bg-gradient-to-br from-[#2D2D2A]/10 via-[#2D2D2A]/5 to-transparent'
  }

  const bgGradient = backgroundGradients[project.type] || backgroundGradients.project

  return (
    <div className="group relative bg-[#0F0F11]/20 border border-[#1A1A1C] p-4 h-full
                    before:absolute before:inset-0 before:-z-10 
                    before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent
                    hover:before:opacity-100 before:transition-opacity cursor-pointer
                    hover:border-[#2A2A2C] transition-all duration-300">
      {/* Image Container with Background Gradient */}
      <div className={`relative w-full h-48 mb-4 overflow-hidden rounded-sm ${bgGradient}`}>
        <div className="absolute inset-0 bg-black/30" />
        <img
          src={project.image}
          alt={project.title}
          className="relative z-10 object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-light text-white/90">{project.title}</h3>
        <p className="text-sm text-gray-400/80 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs text-gray-400/80 bg-white/5 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard 