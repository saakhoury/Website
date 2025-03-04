'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ColorPickerProps {
  colors: string[]
  setColors: (colors: string[]) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, setColors }) => {
  const [isOpen, setIsOpen] = useState(false)

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors]
    newColors[index] = color
    setColors(newColors)
  }

  return (
    <>
      {/* Button */}
      <div className="fixed top-0 right-0 z-40 p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-gray-400 hover:text-white transition-colors duration-300 
                     px-3 py-1 rounded-sm border border-white/10 hover:bg-white/[0.02]"
        >
          Customize Cursor
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-black rounded-sm border border-white/10 w-[280px] shadow-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Cursor Colors</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-8 h-8 rounded-sm bg-transparent cursor-pointer"
                      />
                      <span className="text-xs text-gray-400">Color {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ColorPicker 