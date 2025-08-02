import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from '../providers/Web3Provider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { LanguageProvider } from '../providers/LanguageProvider';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zap",
  description: "Zap mobile application",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <Web3Provider>
              {children}
            </Web3Provider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
