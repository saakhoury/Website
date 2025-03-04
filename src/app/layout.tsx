'use client'
import { useState } from 'react'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import CursorFollower from '@/components/CursorFollower'
import ColorPicker from '@/components/ColorPicker'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [cursorColors, setCursorColors] = useState([
    '#FF0000',
    '#00FF00',
    '#0000FF',
    'transparent'
  ])

  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body>
        {children}
        <CursorFollower colors={cursorColors} />
        <ColorPicker colors={cursorColors} setColors={setCursorColors} />
      </body>
    </html>
  )
}
