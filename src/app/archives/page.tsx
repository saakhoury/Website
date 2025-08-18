'use client'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import MinecraftWrapper from '@/components/MinecraftWrapper'

export default function ArchivesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="w-full p-6 sm:p-8 border-b border-[#1A1A1C]">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 text-[#9A9AA2] hover:text-white transition-colors duration-300"
          >
            <FaArrowLeft size={16} />
            <span className="text-sm">Back to Portfolio</span>
          </Link>
        </div>
      </header>

        {/* Page Header */}
        <div className="w-full p-6 sm:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/logos/archivestext.png"
                alt="Archives"
                width={280}
                height={72}
                className="mx-auto"
                priority
              />
            </div>
            
            <div className="max-w-xl mx-auto">
              <p className="text-sm sm:text-base text-[#9A9AA2] leading-relaxed">
                Hidden gems and experimental features from my portfolio. 
                Here you&apos;ll find interactive elements, prototypes, and creative experiments.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive World Section */}
        <section className="w-full p-6 sm:p-8 lg:p-12 bg-gradient-to-b from-[#0A0A0B] via-[#0D0D0F] to-[#0A0A0B]">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
                            <div className="relative p-4 border border-white/[0.03] max-w-3xl mx-auto
                            before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r 
                            before:from-transparent before:via-white/5 before:to-transparent 
                            before:opacity-0 before:-z-10
                            group-hover:before:opacity-100 before:transition-opacity"
              >
                <div className="relative mb-4">
                  <h2 className="text-xs tracking-[0.2em] text-gray-400 uppercase flex items-center gap-3 justify-center">
                    <span className="h-[1px] w-16 bg-gradient-to-r from-gray-400 to-gray-400/50" />
                    INTERACTIVE WORLD (BETA)
                    <span className="h-[1px] w-16 bg-gradient-to-r from-gray-400 to-gray-400/50" />
                  </h2>
                </div>

                <div className="scale-90 transform origin-center">
                  <MinecraftWrapper />
                </div>
              </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
