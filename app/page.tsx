import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, Zap, Eye, Coins } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header/Header";

const HeroSection = () => (
  <section className="w-full py-12 md:py-24 lg:py-32 border-b-2 border-black">
    <div className="container px-4 md:px-6 mx-auto">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Badge className="bg-white text-black border-2 border-black px-4 py-1">
          Leading DeFi Platform for Traditional Assets
        </Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-black">
            Democratizing Global Investment with{" "}
            <span className="underline">Blockchain</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-black md:text-xl">
            URIP bridges traditional finance and DeFi, providing easy,
            transparent, and cost-effective global investment access to
            everyone.
          </p>
        </div>
        <div className="space-x-4">
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg border-2 border-black">
            Start Investing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="border-2 border-black text-black hover:bg-gray-100 px-8 py-3 text-lg bg-white"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Statistics Section */}
        <section
          id="stats"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 border-b-2 border-black"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2 p-6 border-2 border-black bg-white">
                <div className="text-4xl font-bold text-black">$100M+</div>
                <div className="text-sm text-black">
                  Target Total Value Locked
                </div>
              </div>
              <div className="space-y-2 p-6 border-2 border-black bg-white">
                <div className="text-4xl font-bold text-black">500+</div>
                <div className="text-sm text-black">
                  Supported Traditional Assets
                </div>
              </div>
              <div className="space-y-2 p-6 border-2 border-black bg-white">
                <div className="text-4xl font-bold text-black">100K+</div>
                <div className="text-sm text-black">Target Active Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section
          id="solution"
          className="w-full py-12 md:py-24 lg:py-32 border-b-2 border-black"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6 p-6 border-2 border-black">
                <div className="space-y-2">
                  <Badge className="bg-white text-black border-2 border-black">
                    Current Problems
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter text-black">
                    Traditional Finance Limitations
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
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
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
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
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
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
              <div className="space-y-6 p-6 border-2 border-black bg-gray-100">
                <div className="space-y-2">
                  <Badge className="bg-black text-white">URIP Solution</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter text-black">
                    Innovative DeFi Platform
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
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
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
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
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 border-b-2 border-black">
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
              <Card className="border-2 border-black bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center mb-4">
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
              <Card className="border-2 border-black bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center mb-4">
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
                  <div className="p-4 border-2 border-black bg-gray-100">
                    <h4 className="font-bold text-black mb-2">
                      🏛️ DAO GOVERNANCE FEATURES:
                    </h4>
                    <ul className="space-y-2 text-sm text-black">
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                        <span>
                          <strong>Democratic Voting:</strong> Community decides
                          investment strategies
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                        <span>
                          <strong>Proposal System:</strong> Submit & vote on
                          rebalancing decisions
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                        <span>
                          <strong>Transparent Governance:</strong> All decisions
                          recorded on-chain
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
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
          className="w-full py-12 md:py-24 lg:py-32 border-b-2 border-black"
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
              <Card className="text-center border-2 border-black bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center mx-auto mb-4">
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
              <Card className="text-center border-2 border-black bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center mx-auto mb-4">
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
              <Card className="text-center border-2 border-black bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center mx-auto mb-4">
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
              <Card className="text-center border-2 border-black bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center mx-auto mb-4">
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
          className="w-full py-12 md:py-24 lg:py-32 bg-black text-white border-b-2 border-black"
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 border-b-2 border-black">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 p-8 border-2 border-black bg-white">
              <h2 className="text-3xl font-bold tracking-tighter text-black">
                Ready to Start Global Investment?
              </h2>
              <p className="mx-auto max-w-[600px] text-black md:text-lg">
                Join the DeFi revolution and access global markets easily,
                securely, and transparently.
              </p>
              <div className="space-x-4">
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg border-2 border-black">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-gray-100 px-8 py-3 text-lg bg-white"
                >
                  Contact Team
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t-2 border-black">
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
