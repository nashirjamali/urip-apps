import { Particles } from "@/components/magicui/particles";
import BlurText from "@/components/ui/BlurText/BlurText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Squares from "@/components/ui/Squares/Squares";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  Users,
  TrendingUp,
  Shield,
  Vote,
  BarChart3,
  Wallet,
  Zap,
  Crown,
  Eye,
  Layers,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Meteors } from "@/components/magicui/meteors";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ShinyButton } from "@/components/magicui/shiny-button";

export default function TrackInvestment() {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute w-screen h-screen">
        <Squares borderColor="#3E3C3C" />
      </div>
      <Particles
        className="absolute inset-0"
        quantity={50}
        ease={80}
        color="#F77A0E"
        refresh
      />
      <Meteors number={15} />

      <div className="relative z-10 pt-28 pb-20">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-20">
            <div className="flex items-center justify-center">
              <BlurText
                text="Two Investment Tracks"
                className="text-6xl md:text-7xl font-bold tracking-tighter text-white"
              />
            </div>
            <div className="relative">
              <AnimatedShinyText className="mx-auto max-w-[700px] text-gray-300 text-xl md:text-3xl font-medium">
                Choose the investment strategy that suits your needs and
                preferences
              </AnimatedShinyText>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#F77A0E] to-transparent" />
            </div>
          </div>

          {/* Main Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Direct Asset Investment Card */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl">
              <BorderBeam size={300} duration={15} delay={0} />
              <CardHeader className="pb-10 pt-10">
                <div className="flex items-center gap-6 mb-8">
                  <div className="p-5 bg-black rounded-2xl">
                    <Wallet className="h-10 w-10 text-[#F77A0E]" />
                  </div>
                  <div>
                    <CardTitle className="text-black text-4xl font-bold mb-3">
                      Direct Asset Investment
                    </CardTitle>
                    <Badge className="bg-[#F77A0E] text-white text-base px-4 py-2 font-semibold">
                      Individual Control
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-700 text-xl leading-relaxed font-medium">
                  Buy tokens representing individual assets with full ownership
                  transparency and complete control over your investment
                  decisions.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-10 px-10 pb-10">
                {/* Key Features Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      icon: Shield,
                      title: "Full Control",
                      desc: "Complete asset ownership",
                    },
                    {
                      icon: Eye,
                      title: "Transparency",
                      desc: "Track specific performance",
                    },
                    {
                      icon: TrendingUp,
                      title: "Lower Fees",
                      desc: "No intermediaries",
                    },
                    {
                      icon: Zap,
                      title: "Instant Access",
                      desc: "Immediate trading",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="p-6 bg-black rounded-2xl border-2 border-transparent hover:border-[#F77A0E] transition-all duration-300"
                    >
                      <feature.icon className="h-8 w-8 text-[#F77A0E] mb-4" />
                      <h4 className="font-bold text-white text-lg mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400 text-base">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Available Assets */}
                <div className="space-y-6">
                  <h4 className="font-bold text-black text-2xl flex items-center gap-3">
                    <Layers className="h-7 w-7 text-[#F77A0E]" />
                    Available Assets
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        name: "Tokenized Stocks",
                        desc: "AAPL, TSLA, GOOGL, MSFT",
                      },
                      {
                        name: "Commodities",
                        desc: "Gold, Silver, Oil, Copper",
                      },
                      {
                        name: "Real Estate",
                        desc: "Fractional property ownership",
                      },
                      {
                        name: "Government Bonds",
                        desc: "US Treasury & Corporate bonds",
                      },
                    ].map((asset, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-black text-lg">
                            {asset.name}
                          </span>
                          <p className="text-gray-600 text-base mt-1">
                            {asset.desc}
                          </p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-[#F77A0E]" />
                      </div>
                    ))}
                  </div>
                </div>

                <ShimmerButton className="w-full py-6 text-xl font-bold">
                  <span className="flex items-center justify-center gap-3">
                    Start Direct Investment
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </ShimmerButton>
              </CardContent>
            </Card>

            {/* DAO-Managed Fund Card */}
            <Card className="bg-gradient-to-br from-[#F77A0E] to-[#E6690D] border-0 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl">
              <BorderBeam
                size={300}
                duration={15}
                delay={7}
                colorFrom="#FFFFFF"
                colorTo="#FFFFFF"
              />
              <CardHeader className="pb-10 pt-10">
                <div className="flex items-center gap-6 mb-8">
                  <div className="p-5 bg-white rounded-2xl">
                    <Crown className="h-10 w-10 text-[#F77A0E]" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-4xl font-bold mb-3">
                      DAO-Managed Investment
                    </CardTitle>
                    <Badge className="bg-white text-[#F77A0E] text-base px-4 py-2 font-bold">
                      Community Governed
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-orange-50 text-xl leading-relaxed font-medium">
                  Invest in diversified portfolios through $URIP tokens managed
                  by decentralized community governance with professional
                  oversight.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-10 px-10 pb-10">
                {/* DAO Governance Features */}
                <div className="p-8 bg-white rounded-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <Vote className="h-8 w-8 text-[#F77A0E]" />
                    <h4 className="font-bold text-black text-2xl">
                      DAO Governance Features
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    {[
                      {
                        title: "Democratic Voting",
                        desc: "Community decides investment strategies",
                        icon: Users,
                      },
                      {
                        title: "Proposal System",
                        desc: "Submit & vote on rebalancing decisions",
                        icon: BarChart3,
                      },
                      {
                        title: "Transparent Governance",
                        desc: "All decisions recorded on-chain",
                        icon: Eye,
                      },
                      {
                        title: "Token-Based Voting",
                        desc: "Voting power based on $URIP holdings",
                        icon: Coins,
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="p-3 bg-[#F77A0E] rounded-lg">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="font-bold text-black text-lg">
                            {feature.title}
                          </span>
                          <p className="text-gray-600 text-base mt-2">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium Features Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      icon: Users,
                      title: "Professional",
                      desc: "Expert management",
                    },
                    {
                      icon: TrendingUp,
                      title: "Auto-Rebalance",
                      desc: "Automated optimization",
                    },
                    {
                      icon: BarChart3,
                      title: "Real-time",
                      desc: "Live performance tracking",
                    },
                    {
                      icon: Vote,
                      title: "Quarterly",
                      desc: "Governance meetings",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white rounded-2xl border-2 border-transparent hover:border-orange-200 transition-all duration-300"
                    >
                      <feature.icon className="h-8 w-8 text-[#F77A0E] mb-4" />
                      <h4 className="font-bold text-black text-lg mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-base">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <ShinyButton className="w-full py-6 text-xl font-bold">
                  <span className="flex items-center justify-center gap-3">
                    Join DAO Investment
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </ShinyButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
