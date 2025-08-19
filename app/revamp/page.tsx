import type React from "react";
import Link from "next/link";
import { PrimaryLayout } from "@/components/revamp/layout/PrimaryLayout";
import { Header } from "@/components/revamp/layout/Header";
import { Footer } from "@/components/revamp/layout/Footer";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { TrendingUp, Vote, PieChart, ArrowRight, Zap, Shield, Globe } from "lucide-react";

const RevampHomePage: React.FC = () => {
  return (
    <PrimaryLayout theme="dark">
      <Header theme="dark" />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Trade the Future with{" "}
            <span className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] bg-clip-text text-transparent">
              URIP
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience next-generation tokenized asset trading with advanced portfolio management, 
            DAO governance, and seamless DeFi integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ActionButton variant="primary" size="lg">
              <TrendingUp className="w-5 h-5 mr-2" />
              Start Trading
            </ActionButton>
            <ActionButton variant="secondary" size="lg" theme="dark">
              <Globe className="w-5 h-5 mr-2" />
              Explore Platform
            </ActionButton>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/revamp/trading">
            <GlassCard theme="dark" variant="bordered" className="p-8 group cursor-pointer hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Trading</h3>
                <p className="text-gray-300 mb-6">
                  Trade tokenized assets and invest in diversified mutual funds with real-time market data.
                </p>
                <div className="flex items-center justify-center text-[#F77A0E] group-hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-2">Explore Trading</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </GlassCard>
          </Link>
          
          <Link href="/revamp/governance">
            <GlassCard theme="dark" variant="bordered" className="p-8 group cursor-pointer hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Vote className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Governance</h3>
                <p className="text-gray-300 mb-6">
                  Participate in DAO governance and vote on fund management decisions and strategies.
                </p>
                <div className="flex items-center justify-center text-[#F77A0E] group-hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-2">Join DAO</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </GlassCard>
          </Link>
          
          <Link href="/revamp/portfolio">
            <GlassCard theme="dark" variant="bordered" className="p-8 group cursor-pointer hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Portfolio</h3>
                <p className="text-gray-300 mb-6">
                  Monitor your investments, track performance, and manage your tokenized asset portfolio.
                </p>
                <div className="flex items-center justify-center text-[#F77A0E] group-hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-2">View Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </GlassCard>
          </Link>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose URIP?</h2>
          <p className="text-xl text-gray-300">Advanced technology meets intuitive design</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard theme="dark" variant="default" className="p-6 text-center">
            <Zap className="w-12 h-12 text-[#F77A0E] mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-3">Lightning Fast</h4>
            <p className="text-gray-300">Execute trades instantly with our optimized blockchain integration</p>
          </GlassCard>
          
          <GlassCard theme="dark" variant="default" className="p-6 text-center">
            <Shield className="w-12 h-12 text-[#F77A0E] mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-3">Secure & Trusted</h4>
            <p className="text-gray-300">Bank-grade security with decentralized architecture</p>
          </GlassCard>
          
          <GlassCard theme="dark" variant="default" className="p-6 text-center">
            <Globe className="w-12 h-12 text-[#F77A0E] mx-auto mb-4" />
            <h4 className="text-xl font-bold text-white mb-3">Global Access</h4>
            <p className="text-gray-300">Trade global markets 24/7 from anywhere in the world</p>
          </GlassCard>
        </div>
      </section>
      
      <Footer theme="dark" />
    </PrimaryLayout>
  );
};

export default RevampHomePage;
