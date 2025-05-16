import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interval Trainer',
  description: 'Music intervals ear trainer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
