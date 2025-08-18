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
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicongoose.ico?v=2" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicongoose.ico?v=2" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicongoose.ico?v=2" />
        <link rel="icon" type="image/x-icon" href="/favicongoose.ico?v=2" />
      </head>
      <body>
        {children}
        <CursorFollower colors={cursorColors} />
        <ColorPicker colors={cursorColors} setColors={setCursorColors} />
      </body>
    </html>
  )
}
