'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ExperienceCardProps {
  experience: {
    title: string
    company: string
    logo: string
  }
  index: number
}

export default function ExperienceCard({ experience, index }: ExperienceCardProps) {
  // Company-specific gradient colors
  const gradientColors = {
    'Coinbase AM': {
      from: 'from-blue-600/[0.15]',
      via: 'via-blue-500/[0.1]',
      to: 'to-blue-400/[0.05]',
      logoFrom: 'from-blue-600/25',
      logoVia: 'via-blue-500/20',
      logoTo: 'to-blue-400/15'
    },
    'HammingAI': {
      from: 'from-purple-600/[0.15]',
      via: 'via-indigo-500/[0.1]',
      to: 'to-blue-400/[0.05]',
      logoFrom: 'from-purple-600/25',
      logoVia: 'via-indigo-500/20',
      logoTo: 'to-blue-400/15'
    },
    'NGen Canada': {
      from: 'from-orange-600/[0.15]',
      via: 'via-amber-500/[0.1]',
      to: 'to-yellow-400/[0.05]',
      logoFrom: 'from-orange-600/25',
      logoVia: 'via-amber-500/20',
      logoTo: 'to-yellow-400/15'
    },
    'UW Blueprint': {
      from: 'from-sky-600/[0.15]',
      via: 'via-blue-500/[0.1]',
      to: 'to-indigo-400/[0.05]',
      logoFrom: 'from-sky-600/25',
      logoVia: 'via-blue-500/20',
      logoTo: 'to-indigo-400/15'
    },
    'Front Row Ventures': {
      from: 'from-rose-600/[0.15]',
      via: 'via-pink-500/[0.1]',
      to: 'to-red-400/[0.05]',
      logoFrom: 'from-rose-600/25',
      logoVia: 'via-pink-500/20',
      logoTo: 'to-red-400/15'
    },
    'InLoop': {
      from: 'from-teal-600/[0.15]',
      via: 'via-cyan-500/[0.1]',
      to: 'to-emerald-400/[0.05]',
      logoFrom: 'from-teal-600/25',
      logoVia: 'via-cyan-500/20',
      logoTo: 'to-emerald-400/15'
    }
  }

  const colors = gradientColors[experience.company] || {
    from: 'from-blue-600/[0.15]',
    via: 'via-indigo-600/[0.1]',
    to: 'to-purple-600/[0.08]',
    logoFrom: 'from-blue-500/25',
    logoVia: 'via-indigo-500/20',
    logoTo: 'to-purple-500/15'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className={`h-32 bg-black border border-white/10 
                    group-hover:border-white/20
                    group-hover:bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to}
                    transition-all duration-300 ease-out
                    p-6 flex items-center gap-6`}
      >
        {/* Logo Container */}
        <div className={`h-full aspect-square relative flex items-center justify-center
                      bg-white/[0.02] rounded-sm overflow-hidden
                      group-hover:bg-gradient-to-br ${colors.logoFrom} ${colors.logoVia} ${colors.logoTo}
                      transition-all duration-300`}
        >
          <div className="w-3/4 h-3/4 relative">
            <Image
              src={experience.logo}
              alt={`${experience.company} logo`}
              fill
              className="object-contain filter brightness-90 group-hover:brightness-100
                       transition-all duration-300"
            />
          </div>
        </div>

        {/* Text Container */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-base text-white/80 font-medium tracking-wide
                       group-hover:text-white/95 transition-colors"
          >
            {experience.company}
          </h3>
          <p className="text-[13px] text-gray-400/80 font-light mt-1
                      group-hover:text-gray-400/90"
          >
            {experience.title}
          </p>
        </div>
      </div>
    </motion.div>
  )
} 