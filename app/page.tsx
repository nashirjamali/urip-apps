"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  ArrowRight,
  BarChart3,
  Wallet,
  RefreshCw,
  Shield,
  Award,
  Activity,
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"

// Data configuration
const platformData = {
  stats: {
    totalVolume: 45.2,
    dailyVolume: 2.1,
    totalValueLocked: 12.5,
    activeUsers: 12456,
    averageReturn: 18.5,
    syntheticAssets: 3,
    securityIncidents: 0,
    smartContractAudits: 3,
  },
  assets: [
    {
      id: "sNASDAQ",
      name: "Nasdaq 100 Index",
      symbol: "sNASDAQ",
      price: 145.23,
      change: 0.8,
      volume: 2.3,
      description: "Track the performance of top 100 non-financial stocks on NASDAQ",
      color: "blue",
    },
    {
      id: "sGOLD",
      name: "Gold Spot Price",
      symbol: "sGOLD",
      price: 1856.45,
      change: -0.3,
      volume: 1.8,
      description: "Digital gold that tracks real-time spot gold prices globally",
      color: "yellow",
    },
    {
      id: "sS&P",
      name: "S&P 500 Index",
      symbol: "sS&P",
      price: 4234.67,
      change: 1.2,
      volume: 3.1,
      description: "Mirror the performance of America's top 500 companies",
      color: "green",
    },
  ],
  faqs: [
    {
      question: "How are synthetic assets different from owning real assets?",
      answer:
        "Synthetic assets track the price of real assets without requiring ownership. You gain exposure to price movements through tokens backed by collateral.",
    },
    {
      question: "What happens if Chainlink oracles fail?",
      answer:
        "We use multiple oracle sources and have fallback mechanisms to ensure price accuracy and system stability.",
    },
    {
      question: "Are my funds safe on the platform?",
      answer: "Yes, funds are secured through audited smart contracts, multi-sig wallets, and insurance coverage.",
    },
    {
      question: "What fees do you charge?",
      answer: "We charge 0.3% swap fees and 0.1% annual management fees. No hidden costs or broker fees.",
    },
    {
      question: "Can I withdraw my funds anytime?",
      answer: "Yes, you can swap back to USDT or withdraw anytime. Transactions are processed instantly.",
    },
    {
      question: "How accurate are the token prices?",
      answer: "Token prices are updated every 30 seconds using Chainlink price feeds, ensuring high accuracy.",
    },
  ],
}

export default function SynthFiLandingPage() {
  const router = useRouter()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [animatedStats, setAnimatedStats] = useState({
    totalVolume: 0,
    totalValueLocked: 0,
    activeUsers: 0,
    averageReturn: 0,
  })
  const [scrolled, setScrolled] = useState(false) // Reintroduce scrolled state
  const [activeSection, setActiveSection] = useState("hero") // Track active section
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Mobile menu state
  const { address } = useAccount();
  useEffect(() => {
    if (address) {
      router.push('/dashboard')
    }
  }, [address])
  // Animate statistics on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        totalVolume: platformData.stats.totalVolume,
        totalValueLocked: platformData.stats.totalValueLocked,
        activeUsers: platformData.stats.activeUsers,
        averageReturn: platformData.stats.averageReturn,
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Handle scroll for header transparency and size
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Track active section with intersection observer
  useEffect(() => {
    const sections = ["hero", "about", "how-it-works", "assets", "faq"]

    const handleScroll = () => {
      const scrollY = window.scrollY + 100 // Offset for header

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementBottom = elementTop + rect.height

          if (scrollY >= elementTop && scrollY < elementBottom) {
            setActiveSection(sectionId)
            console.log("Active section:", sectionId) // Debug log
            break
          }
        }
      }
    }

    // Initial check
    handleScroll()

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  // Dynamic padding for hero section based on header height
  const heroPaddingTop = scrolled ? "pt-[72px]" : "pt-[96px]" // Adjust values as needed for header height

  return (
    <div className="min-h-screen bg-dark-bg-primary text-dark-text-primary overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20 z-0"></div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-300 ${scrolled ? "py-3 backdrop-blur-md shadow-lg" : "py-4"
          }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/urip.png" alt="Urip Logo" className="w-8 h-8 object-contain" />
            <span className="text-white text-xl font-semibold">Urip</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 bg-slate-800/50 backdrop-blur-sm rounded-full px-8 py-3 border border-slate-700/50">
            <button
              onClick={() => scrollToSection("hero")}
              className={`font-medium pb-1 transition-colors ${activeSection === "hero"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`font-medium pb-1 transition-colors ${activeSection === "about"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={`font-medium pb-1 transition-colors ${activeSection === "how-it-works"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("assets")}
              className={`font-medium pb-1 transition-colors ${activeSection === "assets"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              Assets
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className={`font-medium pb-1 transition-colors ${activeSection === "faq"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-300 hover:text-white"
                }`}
            >
              Faq
            </button>
          </div>

          {/* Desktop Contact Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
            >
              Connect Wallet
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50">
            <div className="px-6 py-4 space-y-4">
              <button
                onClick={() => {
                  scrollToSection("hero")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${activeSection === "hero"
                    ? "text-blue-400 bg-slate-800/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                  }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection("about")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${activeSection === "about"
                    ? "text-blue-400 bg-slate-800/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                  }`}
              >
                Why Us
              </button>
              <button
                onClick={() => {
                  scrollToSection("how-it-works")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${activeSection === "how-it-works"
                    ? "text-blue-400 bg-slate-800/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                  }`}
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  scrollToSection("assets")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${activeSection === "assets"
                    ? "text-blue-400 bg-slate-800/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                  }`}
              >
                Assets
              </button>
              <button
                onClick={() => {
                  scrollToSection("faq")
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${activeSection === "faq"
                    ? "text-blue-400 bg-slate-800/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                  }`}
              >
                Faq
              </button>
              <div className="pt-4 border-t border-slate-700/50">
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className={`relative ${heroPaddingTop} pb-20 px-4 min-h-[70vh] flex items-center`}>
        {/* Light beam effect */}
        <div className="absolute top-0 right-1/4 w-1/2 h-full bg-gradient-to-b from-dark-glow-blue/30 to-transparent blur-3xl opacity-50 z-0"></div>
        <div className="absolute top-0 right-1/4 w-1/2 h-full bg-gradient-to-b from-dark-glow-blue/10 to-transparent blur-xl opacity-70 z-0"></div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Side - Text Content */}
          <div className="space-y-8 animate-fade-in">
            <Badge variant="outline" className="border-dark-text-secondary text-dark-text-secondary px-3 py-1">
              [ 150+ organizations ]
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-dark-text-primary leading-tight">
              Invest in Traditional Assets with{" "}
              <span className="bg-gradient-to-r from-dark-accent-blue to-dark-accent-purple bg-clip-text text-transparent">
                Crypto Simplicity
              </span>
            </h1>
            <p className="text-xl text-dark-text-secondary leading-relaxed max-w-lg">
              Trade tokenized Nasdaq, Gold, and S&P 500 with instant settlement. Access traditional markets 24/7 through
              synthetic tokens backed by real asset prices.
            </p>
            <Button className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90 px-8 py-4 text-lg font-semibold rounded-lg group glow-effect">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Side - Floating 3D-like Icons */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-96 h-96">
              {/* Glowing Background Effect */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"></div>

              {/* 3D Cards Stack */}
              <div className="relative z-10 transform rotate-12">
                {/* Top Card */}
                <div className="absolute top-0 right-8 w-32 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl transform -rotate-12 border border-blue-300/30">
                  <div className="absolute inset-2 bg-white/20 rounded-xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/80 rounded-lg transform rotate-45"></div>
                  </div>
                </div>

                {/* Middle Card */}
                <div className="absolute top-12 left-8 w-36 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl shadow-2xl transform rotate-6 border border-purple-300/30">
                  <div className="absolute inset-2 bg-white/20 rounded-xl flex items-center justify-center">
                    <div className="w-10 h-6 bg-white/80 rounded-md flex items-center justify-center">
                      <div className="w-6 h-2 bg-blue-600 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card */}
                <div className="absolute top-24 right-4 w-40 h-28 bg-gradient-to-br from-blue-300 to-purple-500 rounded-2xl shadow-2xl transform -rotate-6 border border-blue-300/30">
                  <div className="absolute inset-2 bg-white/20 rounded-xl flex items-center justify-center">
                    <div className="w-12 h-8 bg-white/80 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Re-purposed for bottom features) */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <Activity className="w-6 h-6 text-dark-glow-blue" />
                <h3 className="text-lg font-bold text-dark-text-primary">Asset Swapping</h3>
              </div>
              <p className="text-dark-text-secondary text-sm">
                Direct peer-to-peer transactions with real-world assets
              </p>
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <Lock className="w-6 h-6 text-dark-glow-blue" />
                <h3 className="text-lg font-bold text-dark-text-primary">Shared Ownership</h3>
              </div>
              <p className="text-dark-text-secondary text-sm">
                Shared ownership through fractionalization of physical assets
              </p>
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <CheckCircle className="w-6 h-6 text-dark-glow-blue" />
                <h3 className="text-lg font-bold text-dark-text-primary">Carbon Integrity</h3>
              </div>
              <p className="text-dark-text-secondary text-sm">
                Reliable carbon credit transactions backed by audit trails
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is SynthFi Section */}
      <section id="about" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">What is SynthFi?</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Explanation */}
            <div className="space-y-6">
              <p className="text-2xl text-dark-text-secondary leading-relaxed">
                SynthFi is a DeFi platform that creates synthetic tokens representing traditional assets. Each token
                (sNASDAQ, sGOLD, sS&P) maintains 1:1 price correlation with real-world assets through Chainlink oracles
                and smart contracts.
              </p>
              <p className="text-xl text-dark-text-secondary leading-relaxed">
                Trade traditional markets with crypto speed and flexibility.
              </p>
            </div>

            {/* Right Side - Feature Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-dark-accent-blue rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">Synthetic Assets</h3>
                  <p className="text-dark-text-secondary text-sm">
                    Trade tokenized versions of real assets without owning the underlying asset
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-dark-accent-purple rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">Price Oracles</h3>
                  <p className="text-dark-text-secondary text-sm">
                    Real-time price feeds from Chainlink ensure accurate pricing
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-dark-glow-blue rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">Smart Contracts</h3>
                  <p className="text-dark-text-secondary text-sm">
                    Automated execution and transparent operations on Ethereum
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-green rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {/* <Urip className="w-6 h-6 text-white" /> */}
                  </div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">Liquidity Pools</h3>
                  <p className="text-dark-text-secondary text-sm">Deep liquidity ensures seamless trading anytime</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">How SynthFi Works</h2>
            <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
              Simple, secure, and transparent investment process
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 relative group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-dark-accent-blue to-dark-glow-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-dark-accent-blue to-dark-glow-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h3 className="text-xl font-bold text-dark-text-primary mb-4" onClick={() => router.push('/login')}>Connect Wallet</h3>
                <div className="space-y-2 text-sm text-dark-text-secondary">
                  <p>Connect your Web3 wallet (MetaMask, WalletConnect)</p>
                  <p>Deposit USDT or ETH as collateral</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 relative group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-dark-accent-purple to-primary-purple rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-dark-accent-purple to-primary-purple rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <h3 className="text-xl font-bold text-dark-text-primary mb-4">Choose Assets</h3>
                <div className="space-y-2 text-sm text-dark-text-secondary">
                  <p>Select from sNASDAQ, sGOLD, sS&P tokens</p>
                  <p>Set your desired allocation percentage</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 relative group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-green to-primary-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary-green to-primary-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <h3 className="text-xl font-bold text-dark-text-primary mb-4">Auto-Rebalance</h3>
                <div className="space-y-2 text-sm text-dark-text-secondary">
                  <p>Enable automatic portfolio rebalancing</p>
                  <p>Set frequency and deviation thresholds</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 relative group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-yellow to-primary-orange rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary-yellow to-primary-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <h3 className="text-xl font-bold text-dark-text-primary mb-4">Track Performance</h3>
                <div className="space-y-2 text-sm text-dark-text-secondary">
                  <p>Monitor real-time portfolio performance</p>
                  <p>Earn returns that mirror traditional markets</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Assets Section */}
      <section id="assets" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">Available Synthetic Assets</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {platformData.assets.map((asset, index) => (
              <Card
                key={asset.id}
                className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${asset.color === "blue"
                        ? "from-dark-accent-blue to-dark-glow-blue"
                        : asset.color === "yellow"
                          ? "from-primary-yellow to-orange-500"
                          : "from-primary-green to-primary-blue"
                        } rounded-lg flex items-center justify-center`}
                    >
                      {asset.color === "blue" ? (
                        <BarChart3 className="w-6 h-6 text-white" />
                      ) : asset.color === "yellow" ? (
                        <DollarSign className="w-6 h-6 text-white" />
                      ) : (
                        <TrendingUp className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <Badge
                      className={`${asset.change > 0
                        ? "bg-green-700/20 text-green-400 border-transparent"
                        : "bg-red-700/20 text-red-400 border-transparent"
                        }`}
                    >
                      {asset.change > 0 ? "+" : ""}
                      {asset.change}%
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-dark-text-primary mb-2">{asset.name}</h3>
                  <div className="text-3xl font-mono font-bold text-dark-text-primary mb-2">
                    ${asset.price.toFixed(2)}
                  </div>
                  <p className="text-dark-text-secondary text-sm mb-4">{asset.description}</p>
                  <div className="text-sm text-dark-text-secondary mb-6">24h Volume: ${asset.volume}M</div>
                  <div
                    className={`h-16 bg-gradient-to-r ${asset.color === "blue"
                      ? "from-dark-accent-blue/20 to-dark-glow-blue/20"
                      : asset.color === "yellow"
                        ? "from-primary-yellow/20 to-orange-400/20"
                        : "from-primary-green/20 to-primary-blue/20"
                      } rounded-lg flex items-end justify-center`}
                  >
                    <div className="text-xs text-dark-text-secondary">Chart visualization</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section id="security" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">Built for Security & Trust</h2>
            <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
              Your investments are protected by industry-leading security measures
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Trust Metrics */}
            <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
              {/* Tambahkan div overlay untuk pola */}
              <div
                className="absolute inset-0 z-0 opacity-10"
                style={{ backgroundImage: 'url("/images/futuristic-pattern.png")' }}
              ></div>
              <CardContent className="p-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-dark-text-primary mb-2">
                      ${platformData.stats.totalValueLocked}M+
                    </div>
                    <div className="text-dark-text-secondary font-medium">Total Value Locked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-dark-text-primary mb-2">
                      {platformData.stats.smartContractAudits}
                    </div>
                    <div className="text-dark-text-secondary font-medium">Smart Contract Audits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-dark-text-primary mb-2">
                      {platformData.stats.activeUsers.toLocaleString()}
                    </div>
                    <div className="text-dark-text-secondary font-medium">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-dark-text-primary mb-2">
                      {platformData.stats.securityIncidents}
                    </div>
                    <div className="text-dark-text-secondary font-medium">Security Incidents</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Security Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-dark-accent-purple rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">Smart Contract Audits</h3>
                  <p className="text-dark-text-secondary text-sm">Verified by CertiK and ConsenSys Diligence</p>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-orange rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">Chainlink Oracles</h3>
                  <p className="text-dark-text-secondary text-sm">Tamper-proof price feeds from multiple sources</p>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-dark-glow-blue rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">Multi-Sig Treasury</h3>
                  <p className="text-dark-text-secondary text-sm">Community-controlled funds with 3/5 multisig</p>
                </CardContent>
              </Card>

              <Card className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-green rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">Insurance Coverage</h3>
                  <p className="text-dark-text-secondary text-sm">Protocol insurance through Nexus Mutual</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 opacity-60">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-primary-green" />
              <span className="font-medium text-dark-text-secondary">CertiK</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-primary-orange" />
              <span className="font-medium text-dark-text-secondary">Chainlink</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-dark-glow-blue" />
              <span className="font-medium text-dark-text-secondary">OpenZeppelin</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-dark-accent-purple" />
              <span className="font-medium text-dark-text-secondary">Ethereum</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {platformData.faqs.map((faq, index) => (
              <Card
                key={index}
                className="bg-dark-bg-secondary border border-dark-border shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="text-lg font-semibold text-dark-text-primary">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-dark-text-secondary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-dark-text-secondary" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-dark-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">Ready to Start Investing?</h2>
            <p className="text-xl text-dark-text-secondary mb-8 leading-relaxed">
              Join thousands of investors building diversified portfolios with synthetic assets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-dark-accent-blue text-white hover:bg-dark-accent-blue/90 px-12 py-4 text-lg font-semibold rounded-lg glow-effect">
                Launch App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-dark-border text-dark-text-primary hover:bg-dark-input px-12 py-4 text-lg font-semibold rounded-lg bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-dark-accent-blue to-dark-accent-purple rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-dark-text-primary">SynthFi</span>
              </div>
              <p className="text-dark-text-secondary text-sm mb-4">
                Bridging traditional finance and DeFi through synthetic asset trading.
              </p>
              <p className="text-dark-text-secondary text-xs">Powered by Ethereum & Chainlink</p>
            </div>

            <div>
              <h4 className="text-dark-text-primary font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-dark-text-secondary text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="hover:text-dark-text-primary transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="hover:text-dark-text-primary transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("assets")}
                    className="hover:text-dark-text-primary transition-colors"
                  >
                    Assets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("security")}
                    className="hover:text-dark-text-primary transition-colors"
                  >
                    Security
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="hover:text-dark-text-primary transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-dark-text-primary font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-dark-text-secondary text-sm">
                <li>
                  <Link href="#" className="hover:text-dark-text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-dark-text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-dark-text-primary transition-colors">
                    Risk Disclosure
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-dark-text-primary font-semibold mb-4">Contact</h4>
              <p className="text-dark-text-secondary text-sm mb-4">support@synthfi.com</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-dark-text-secondary hover:text-dark-text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-dark-text-secondary hover:text-dark-text-primary transition-colors">
                  <span className="sr-only">Discord</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.942 4.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                  </svg>
                </Link>
                <Link href="#" className="text-dark-text-secondary hover:text-dark-text-primary transition-colors">
                  <span className="sr-only">Telegram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.822 6.862l-1.72 8.1c-.13.584-.467.728-.946.453l-2.61-1.927-1.26 1.212c-.14.14-.256.256-.525.256l.188-2.664L12.626 8.2c.23-.205-.05-.318-.357-.113l-4.55 2.864-1.96-.613c-.427-.133-.435-.427.088-.632l7.66-2.953c.357-.133.67.08.555.632z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-dark-border pt-8 text-center">
            <div className="text-dark-text-secondary text-sm">© 2024 SynthFi. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
