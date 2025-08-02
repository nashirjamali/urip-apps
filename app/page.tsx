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
import CTASection from "@/components/partials/LandingPage/CTASection";

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
        <CTASection />
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
