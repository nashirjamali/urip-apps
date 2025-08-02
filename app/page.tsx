import Header from "@/components/ui/Header/Header";
import HeroSection from "@/components/partials/LandingPage/HeroSection";
import LiskSection from "@/components/partials/LandingPage/LiskSection";
import ProblemSection from "@/components/partials/LandingPage/ProblemSection";
import TrackInvestment from "@/components/partials/LandingPage/TrackInvestment";
import CoreFeatureSection from "@/components/partials/LandingPage/CoreFeatureSection";
import CTASection from "@/components/partials/LandingPage/CTASection";
import Footer from "@/components/ui/Footer/Footer";

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
      <Footer />
    </div>
  );
}
