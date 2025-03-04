'use client'
import { useState } from 'react'

interface TypeFilterProps {
  selectedType: string
  setSelectedType: (type: string) => void
}

const types = ['all', 'project', 'company', 'volunteer', 'music']

export default function TypeFilter({ selectedType, setSelectedType }: TypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-32 px-4 py-3 bg-black border border-white/10
                 text-sm text-gray-400
                 hover:bg-white/[0.02] transition-colors duration-150
                 flex items-center justify-between"
      >
        <span className="capitalize">
          {selectedType === 'all' ? 'All Types' : selectedType}
        </span>
        <span className="opacity-50 text-[10px] ml-2">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-32 bg-black border border-white/10
                       shadow-xl z-40">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left text-sm capitalize
                         ${selectedType === type 
                           ? 'text-white bg-white/10' 
                           : 'text-white/90 hover:bg-white/[0.02]'}`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 