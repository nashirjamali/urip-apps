"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Bell, Moon, Sun, ChevronDown, Download, Upload, DollarSign, Filter } from "lucide-react"
import Link from "next/link"

// Placeholder data for the dashboard
const dashboardData = {
  cryptoPrices: [
    { symbol: "DOGE", price: 0.178, change: -4.2, isPositive: false },
    { symbol: "BNB", price: 1985.0, change: 1.0, isPositive: true },
    { symbol: "BTC", price: 2974.0, change: 0.6, isPositive: true },
    { symbol: "USDT", price: 0.972, change: -0.9, isPositive: false },
    { symbol: "USDC", price: 0.294, change: -0.1, isPositive: false },
  ],
  currentBalance: 26960.98,
  balanceChangePercent: 21,
  portfolioValue: 22350,
  marketLeaders: [
    { name: "Bitcoin", value: 10920857.0, change24h: 1249.0, progress: 80 },
    { name: "Ethereum", value: 10920857.0, change24h: 1249.0, progress: 70 },
    { name: "Binance", value: 10920857.0, change24h: 1249.0, progress: 60 },
  ],
}

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(true) // Set to true by default for dark theme

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""} bg-dark-bg-primary text-dark-text-primary`}>
      {/* Top Navigation Bar */}
      <header className="bg-dark-bg-secondary border-b border-dark-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left Section: Earn & More */}
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-dark-text-primary hover:text-dark-accent-blue font-medium">
              Earn
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-dark-text-primary hover:text-dark-accent-blue font-medium focus:outline-none">
                More <ChevronDown className="ml-1 h-4 w-4 text-dark-text-secondary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 bg-dark-bg-secondary border-dark-border text-dark-text-primary"
              >
                <DropdownMenuItem className="hover:bg-dark-input">Settings</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-dark-input">Help</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-dark-input">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Middle Section: Crypto Ticker */}
          <div className="hidden lg:flex flex-1 justify-center overflow-hidden">
            <div className="flex space-x-6 animate-marquee whitespace-nowrap">
              {dashboardData.cryptoPrices.map((crypto, index) => (
                <div key={index} className="flex items-center text-sm text-dark-text-primary">
                  <span className="font-semibold mr-1">{crypto.symbol}:</span>
                  <span className="mr-2">${crypto.price.toFixed(3)}</span>
                  <Badge
                    className={`${
                      crypto.isPositive ? "bg-green-700/20 text-green-400" : "bg-red-700/20 text-red-400"
                    } border-transparent`}
                  >
                    {crypto.isPositive ? "+" : ""}
                    {crypto.change}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Icons & User Info */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-dark-text-secondary hover:text-dark-text-primary">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-dark-text-secondary hover:text-dark-text-primary">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-dark-text-secondary hover:text-dark-text-primary"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-dark-accent-blue flex items-center justify-center text-white font-bold text-sm">
                  JD
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-semibold text-dark-text-primary">James Dias</div>
                  <div className="text-xs text-dark-text-secondary">jamesdias@gmail.com</div>
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-dark-text-secondary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-dark-bg-secondary border-dark-border text-dark-text-primary"
              >
                <DropdownMenuItem className="hover:bg-dark-input">Profile</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-dark-input">Settings</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-dark-input">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-8">
        {/* Deposit/Withdraw/Cash In Buttons */}
        <div className="flex justify-end space-x-4 mb-8">
          <Button className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90 px-6 py-3 rounded-lg flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Deposit</span>
          </Button>
          <Button className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90 px-6 py-3 rounded-lg flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Withdraw</span>
          </Button>
          <Button className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90 px-6 py-3 rounded-lg flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Cash In</span>
          </Button>
        </div>

        {/* Current Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="bg-dark-bg-secondary shadow-lg rounded-xl p-6 border border-dark-border">
              <CardTitle className="text-sm font-medium text-dark-text-secondary mb-4">Current Balance</CardTitle>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-dark-text-primary">
                  {dashboardData.currentBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <Badge className="bg-green-700/20 text-green-400 border-transparent text-sm px-3 py-1 rounded-full">
                  {dashboardData.balanceChangePercent}%
                </Badge>
              </div>
              <p className="text-sm text-dark-text-secondary mt-2">vs last 24 hours</p>
            </Card>
          ))}
        </div>

        {/* Chart and Market Leaders Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Placeholder */}
          <Card className="lg:col-span-2 bg-dark-bg-secondary shadow-lg rounded-xl p-6 border border-dark-border">
            <div className="flex justify-end space-x-2 mb-4">
              {["24H", "1W", "1M", "1Y", "All"].map((range) => (
                <Button
                  key={range}
                  variant="ghost"
                  size="sm"
                  className="text-dark-text-secondary hover:bg-dark-input data-[active=true]:bg-dark-input"
                  data-active={range === "1W"} // Example active state
                >
                  {range}
                </Button>
              ))}
            </div>
            <div className="relative h-64 bg-dark-input rounded-lg flex items-center justify-center text-dark-text-secondary text-sm overflow-hidden">
              {/* Simple line chart visual placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-input to-transparent"></div>
              <div className="absolute inset-0 border-t border-l border-dashed border-dark-border"></div>
              <div className="absolute inset-0 flex items-end justify-around pb-4 text-xs text-dark-text-secondary">
                <span>Monday</span>
                <span>Tuesday</span>
                <span>Wednesday</span>
                <span>Thursday</span>
                <span>Friday</span>
                <span>Saturday</span>
                <span>Sunday</span>
              </div>
              <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 bg-dark-accent-blue text-white text-xs px-3 py-1 rounded-md shadow-md">
                Portfolio Value: ${dashboardData.portfolioValue.toLocaleString()}
              </div>
              {/* Simple line drawing for visual effect */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#8A2BE2" // Bright purple for the line
                  strokeWidth="1"
                  points="0,80 10,70 20,75 30,60 40,65 50,50 60,55 70,40 80,45 90,30 100,35"
                />
                <rect x="35" y="50" width="10" height="30" fill="rgba(138, 43, 226, 0.1)" />{" "}
                {/* Highlight for Wednesday */}
              </svg>
            </div>
          </Card>

          {/* Market Leaders */}
          <Card className="bg-dark-bg-secondary shadow-lg rounded-xl p-6 border border-dark-border">
            <CardTitle className="text-xl font-bold text-dark-text-primary mb-4">Market Leaders</CardTitle>
            <div className="flex space-x-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-dark-text-secondary hover:bg-dark-input data-[active=true]:bg-dark-input"
                data-active={true}
              >
                Week
              </Button>
              <Button variant="ghost" size="sm" className="text-dark-text-secondary hover:bg-dark-input">
                Month
              </Button>
            </div>
            <div className="space-y-4">
              {dashboardData.marketLeaders.map((leader, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-dark-text-primary">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          index === 0 ? "bg-orange-500" : index === 1 ? "bg-purple-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <span className="font-semibold">{leader.name}</span>
                    </div>
                    <span className="text-dark-text-secondary">24h: ${leader.change24h.toFixed(2)}</span>
                  </div>
                  <div className="text-lg font-bold text-dark-text-primary">
                    ${leader.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="w-full bg-dark-input rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        index === 0 ? "bg-orange-500" : index === 1 ? "bg-purple-500" : "bg-gray-400"
                      }`}
                      style={{ width: `${leader.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Find Assets & Filter */}
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Find Assets"
            className="flex-1 bg-dark-input shadow-sm border border-dark-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-dark-accent-blue text-dark-text-primary placeholder-dark-text-secondary"
          />
          <Button
            variant="outline"
            className="bg-dark-bg-secondary shadow-sm border border-dark-border rounded-lg px-4 py-2 flex items-center space-x-2 text-dark-text-primary hover:bg-dark-input"
          >
            <Filter className="h-5 w-5 text-dark-text-secondary" />
            <span>Filter</span>
          </Button>
        </div>
      </main>
    </div>
  )
}
