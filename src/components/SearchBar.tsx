'use client'
import { motion } from 'framer-motion'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <input
        type="text"
        placeholder="Search projects & past experiences..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08]
                 text-sm text-white placeholder-gray-500
                 focus:border-white/20 focus:outline-none focus:ring-0
                 transition-all duration-300"
      />
    </motion.div>
  )
} 