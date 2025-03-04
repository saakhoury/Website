'use client'
import { useState, useRef, useEffect } from 'react'

interface YearFilterProps {
  selectedYear: number | 'all'
  setSelectedYear: (year: number | 'all') => void
  availableYears: number[]
}

const YearFilter: React.FC<YearFilterProps> = ({ selectedYear, setSelectedYear, availableYears }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-32 px-4 py-3 bg-black border border-white/10
                 text-sm text-gray-400
                 hover:bg-white/[0.02] transition-colors duration-150
                 flex items-center justify-between"
      >
        <span>
          {selectedYear === 'all' ? 'All Years' : selectedYear}
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
            <button
              key="all"
              onClick={() => {
                setSelectedYear('all')
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left text-sm
                        ${selectedYear === 'all' 
                          ? 'text-white bg-white/10' 
                          : 'text-white/90 hover:bg-white/[0.02]'}`}
            >
              All Years
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left text-sm
                          ${selectedYear === year 
                            ? 'text-white bg-white/10' 
                            : 'text-white/90 hover:bg-white/[0.02]'}`}
              >
                {year}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default YearFilter 