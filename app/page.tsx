import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  Users,
  Zap,
  Eye,
  Coins,
  Code,
  Layers,
  Network,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/ui/Header/Header";
import { HeroSection } from "@/components/partials/LandingPage/HeroSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Lisk Integration Section */}
        <section
          id="lisk"
          className="w-full py-12 md:py-24 lg:py-32 bg-[#F77A0E] text-white border-b-2 border-[#F77A0E]"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-12">
              <Badge className="bg-white text-[#F77A0E] border-2 border-white">
                Powered by Lisk
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter text-white">
                Built on Lisk's Layer 2 Infrastructure
              </h2>
              <p className="mx-auto max-w-[700px] text-white md:text-lg opacity-90">
                URIP leverages Lisk's advanced blockchain technology to provide
                seamless, scalable, and developer-friendly DeFi solutions
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 border-white bg-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-white rounded-sm flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-[#F77A0E]" />
                  </div>
                  <CardTitle className="text-white">JavaScript SDK</CardTitle>
                  <CardDescription className="text-white/80">
                    Built with Lisk's JavaScript/TypeScript SDK for rapid
                    development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 text-sm">
                    Utilizing familiar programming languages to accelerate
                    development and reduce technical barriers for our team
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-white bg-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-white rounded-sm flex items-center justify-center mb-4">
                    <Layers className="h-6 w-6 text-[#F77A0E]" />
                  </div>
                  <CardTitle className="text-white">Layer 2 Scaling</CardTitle>
                  <CardDescription className="text-white/80">
                    Leveraging Lisk's Ethereum-compatible Layer 2 solution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 text-sm">
                    Fast transactions, low fees, and full EVM compatibility for
                    seamless DeFi operations
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-white bg-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-white rounded-sm flex items-center justify-center mb-4">
                    <Network className="h-6 w-6 text-[#F77A0E]" />
                  </div>
                  <CardTitle className="text-white">
                    Modular Architecture
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Utilizing Lisk's modular blockchain design for flexibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 text-sm">
                    Customizable modules for asset tokenization, governance, and
                    cross-chain interoperability
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 p-6 border-2 border-white bg-white/5 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">
                🚀 Lisk Technology Stack
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Developer Tools:
                  </h4>
                  <ul className="space-y-1 text-sm text-white/90">
                    <li>• Lisk SDK for custom blockchain applications</li>
                    <li>• JavaScript/TypeScript development environment</li>
                    <li>• Comprehensive documentation and tutorials</li>
                    <li>• Command-line tools (Lisk Commander)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Infrastructure Benefits:
                  </h4>
                  <ul className="space-y-1 text-sm text-white/90">
                    <li>• Delegated Proof of Stake consensus</li>
                    <li>• Cross-chain interoperability</li>
                    <li>• Mobile-first design philosophy</li>
                    <li>• High-growth market optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section
          id="solution"
          className="w-full py-12 md:py-24 lg:py-32 border-b-2 border-[#F77A0E]"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6 p-6 border-2 border-[#F77A0E]">
                <div className="space-y-2">
                  <Badge className="bg-white text-[#F77A0E] border-2 border-[#F77A0E]">
                    Current Problems
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter text-black">
                    Traditional Finance Limitations
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F77A0E] rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-black">
                        High Entry Barriers
                      </h3>
                      <p className="text-black">
                        High minimum investment for diversified portfolios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F77A0E] rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-black">
                        Geographic Restrictions
                      </h3>
                      <p className="text-black">
                        Limited access to international markets
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F77A0E] rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-black">High Fees</h3>
                      <p className="text-black">
                        Management fees, transaction costs, and currency
                        conversion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 p-6 border-2 border-[#F77A0E] bg-gray-100">
                <div className="space-y-2">
                  <Badge className="bg-[#F77A0E] text-white">
                    URIP Solution
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter text-black">
                    Innovative DeFi Platform
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F77A0E] rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-black">
                        Global Access
                      </h3>
                      <p className="text-black">
                        Invest in any market from any wallet
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F77A0E] rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-black">
                        Fractional Ownership
                      </h3>
                      <p className="text-black">
                        Invest from $1 for expensive assets
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#F77A0E] rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-black">24/7 Trading</h3>
                      <p className="text-black">
                        Trading not limited to traditional market hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Track Investment */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 border-b-2 border-[#F77A0E]">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-black">
                Two Investment Tracks
              </h2>
              <p className="mx-auto max-w-[600px] text-black md:text-lg">
                Choose the investment strategy that suits your needs and
                preferences
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="border-2 border-[#F77A0E] bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#F77A0E] rounded-sm flex items-center justify-center mb-4">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-black">
                    Track 1: Direct Asset Investment
                  </CardTitle>
                  <CardDescription className="text-black">
                    Buy tokens representing individual assets with full
                    ownership transparency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black">
                      Available Assets:
                    </h4>
                    <ul className="space-y-1 text-sm text-black">
                      <li>• Tokenized Stocks (AAPL, TSLA, GOOGL)</li>
                      <li>• Commodities (Gold, Silver, Oil)</li>
                      <li>• Real Estate (Fractional ownership)</li>
                      <li>• Bonds (Government & Corporate)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#F77A0E] bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#F77A0E] rounded-sm flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-black">
                    Track 2: DAO-Managed Fund Investment
                  </CardTitle>
                  <CardDescription className="text-black">
                    Invest in diversified portfolios through $URIP tokens
                    managed by decentralized community governance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-2 border-[#F77A0E] bg-gray-100">
                    <h4 className="font-bold text-black mb-2">
                      🏛️ DAO GOVERNANCE FEATURES:
                    </h4>
                    <ul className="space-y-2 text-sm text-black">
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-[#F77A0E] rounded-full mt-2"></div>
                        <span>
                          <strong>Democratic Voting:</strong> Community decides
                          investment strategies
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-[#F77A0E] rounded-full mt-2"></div>
                        <span>
                          <strong>Proposal System:</strong> Submit & vote on
                          rebalancing decisions
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-[#F77A0E] rounded-full mt-2"></div>
                        <span>
                          <strong>Transparent Governance:</strong> All decisions
                          recorded on-chain
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-[#F77A0E] rounded-full mt-2"></div>
                        <span>
                          <strong>Token-Based Voting:</strong> Voting power
                          based on $URIP holdings
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black">
                      Additional Features:
                    </h4>
                    <ul className="space-y-1 text-sm text-black">
                      <li>• Professional Management via DAO</li>
                      <li>• Auto-Rebalancing based on community votes</li>
                      <li>• Real-time Performance Tracking</li>
                      <li>• Quarterly governance meetings</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 border-b-2 border-[#F77A0E]"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-black">
                URIP Core Features
              </h2>
              <p className="mx-auto max-w-[600px] text-black md:text-lg">
                Platform combining blockchain security with traditional finance
                ease
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center border-2 border-[#F77A0E] bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#F77A0E] rounded-sm flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-black">High Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black text-sm">
                    Tested smart contracts and trusted custody to protect
                    investor assets
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 border-[#F77A0E] bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#F77A0E] rounded-sm flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-black">
                    Full Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black text-sm">
                    Complete visibility in asset management and fund management
                    decisions
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 border-[#F77A0E] bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#F77A0E] rounded-sm flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-black">
                    Instant Settlement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black text-sm">
                    Blockchain-based settlement replacing traditional T+2 or T+3
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-2 border-[#F77A0E] bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#F77A0E] rounded-sm flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-black">
                    Community Governance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black text-sm">
                    Democratic fund management decisions through DAO governance
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section
          id="about"
          className="w-full py-12 md:py-24 lg:py-32 bg-black text-white border-b-2 border-[#F77A0E]"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6 p-6 border-2 border-white">
                <div className="space-y-2">
                  <Badge className="bg-white text-black">Our Vision</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Future of Global Investment
                  </h2>
                </div>
                <p className="text-white text-lg">
                  To become the leading DeFi platform that democratizes global
                  investment access by seamlessly and transparently connecting
                  traditional finance and decentralized finance.
                </p>
              </div>
              <div className="space-y-6 p-6 border-2 border-white">
                <div className="space-y-2">
                  <Badge className="bg-white text-black">Our Mission</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Four Core Pillars
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold">Accessibility</h3>
                      <p className="text-white text-sm">
                        Global investment access with minimal capital
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold">Transparency</h3>
                      <p className="text-white text-sm">
                        Full transparency in asset management
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold">Innovation</h3>
                      <p className="text-white text-sm">
                        Blockchain technology for financial inclusion
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold">Security</h3>
                      <p className="text-white text-sm">
                        Asset security through tested smart contracts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 border-b-2 border-[#F77A0E]">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 p-8 border-2 border-[#F77A0E] bg-white">
              <h2 className="text-3xl font-bold tracking-tighter text-black">
                Ready to Start Global Investment?
              </h2>
              <p className="mx-auto max-w-[600px] text-black md:text-lg">
                Join the DeFi revolution and access global markets easily,
                securely, and transparently.
              </p>
              <div className="space-x-4">
                <Button className="bg-[#F77A0E] text-white hover:bg-[#E06A00] px-8 py-3 text-lg border-2 border-[#F77A0E]">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-[#F77A0E] text-[#F77A0E] hover:bg-[#F77A0E] hover:text-white px-8 py-3 text-lg bg-white"
                >
                  Contact Team
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t-2 border-[#F77A0E]">
        <p className="text-xs text-black">© 2024 URIP. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs text-black hover:underline">
            Terms & Conditions
          </Link>
          <Link href="#" className="text-xs text-black hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs text-black hover:underline">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
