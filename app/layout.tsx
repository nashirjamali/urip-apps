import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Pastikan baris ini ada!

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SynthFi - Invest in Traditional Assets with Crypto Simplicity",
  description: "Trade tokenized Nasdaq, Gold, and S&P 500 with instant settlement.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
