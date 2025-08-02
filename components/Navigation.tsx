"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDisconnect } from 'wagmi'
import { useWalletStore } from '@/stores/useWalletStore'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  BarChart3, 
  AreaChart, 
  LineChart, 
  Vote, 
  RefreshCw, 
  ChevronDown 
} from 'lucide-react'

const Navigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { disconnect } = useDisconnect()
  const { setAddress, setBalance } = useWalletStore()
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/trade', label: 'Trade', icon: AreaChart },
    { href: '/portfolio', label: 'Portfolio', icon: LineChart },
    { href: '/dao', label: 'DAO', icon: Vote }
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    // Disconnect wallet
    disconnect()
    
    // Redirect to home page
    router.push('/')
  }

  return (
    <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section: Logo & Navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <img src="/urip.png" alt="Urip Logo" className="w-8 h-8 object-contain" />
            <span className="text-white font-bold text-lg hidden sm:block">Urip</span>
          </Link>
          
          {/* Navigation Items */}
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`font-medium flex items-center gap-2 transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-400 font-semibold border-b-2 border-blue-400 pb-[2px]'
                      : 'text-gray-300 hover:text-blue-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Section: Actions & User Info */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white bg-gray-800/50 rounded-full h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <div className="hidden md:block text-left">
                <div className="font-medium text-white">James Dias</div>
                <div className="text-xs text-gray-300">100 Voting Power</div>
              </div>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-gray-900/95 backdrop-blur-lg border-gray-800 text-gray-200"
            >
              <DropdownMenuItem className="hover:bg-gray-800">Profile</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800">Settings</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800" onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navigation 