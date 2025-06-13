// src/app/layout.tsx
import './globals.css'
import { Fredoka } from 'next/font/google'

const fredoka = Fredoka({ subsets: ['latin'] })

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={fredoka.className}>
      <body>{children}</body>
    </html>
  )
}