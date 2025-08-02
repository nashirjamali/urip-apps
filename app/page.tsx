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
import Header from "@/components/ui/Header/Header";
import HeroSection from "@/components/partials/LandingPage/HeroSection";
import LiskSection from "@/components/partials/LandingPage/LiskSection";
import ProblemSection from "@/components/partials/LandingPage/ProblemSection";
import TrackInvestment from "@/components/partials/LandingPage/TrackInvestment";
import CoreFeatureSection from "@/components/partials/LandingPage/CoreFeatureSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <LiskSection />
        <ProblemSection />
        <TrackInvestment />
        <CoreFeatureSection />

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
