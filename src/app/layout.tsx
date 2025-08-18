'use client'
import { useState } from 'react'
import { Space_Grotesk, Manrope } from 'next/font/google'
import './globals.css'
import CursorFollower from '@/components/CursorFollower'
import ColorPicker from '@/components/ColorPicker'

const manrope = Manrope({ 
  subsets: ['latin'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
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
    <html lang="en" className={`${manrope.className} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </head>
      <body>
        {children}
        <CursorFollower colors={cursorColors} />
        <ColorPicker colors={cursorColors} setColors={setCursorColors} />
      </body>
    </html>
  )
}
