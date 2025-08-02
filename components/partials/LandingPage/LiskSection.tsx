import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Layers, Network, Zap, Rocket, Coins } from "lucide-react";
import type React from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Particles } from "@/components/magicui/particles";
import { Ripple } from "@/components/magicui/ripple";
import { Meteors } from "@/components/magicui/meteors";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  content,
  delay = 0,
}: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  content: string;
  delay?: number;
}) => (
  <div className="relative group">
    <Card className="relative overflow-hidden border-2 border-gray-800 bg-black hover:bg-gray-900 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#F77A0E]/30">
      <BorderBeam
        size={250}
        duration={12}
        delay={delay}
        colorFrom="#F77A0E"
        colorTo="#FF8C42"
      />

      <CardHeader className="relative z-10">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <Icon className="h-6 w-6 text-black" />
        </div>
        <CardTitle className="text-[#F77A0E] text-xl">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-300 text-2xl font-bold">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-gray-200 text-sm leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  </div>
);

const LiskLogo = () => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 276 326"
    height={20}
    width={20}
  >
    <title>lisk</title>
    <path
      d="M138.16,0L108.88,48.7,214.58,229.84,128.83,326s67.4-.4,67,0S276,235.43,276,235.43ZM99.71,66.66L0,236.23,78.57,326h29.55l43.2-50.28h-48L61,228.65l67.8-115.31Z"
      fill="black"
    />
  </svg>
);

export default function LiskSection() {
  return (
    <section
      id="lisk"
      className="relative w-full py-12 md:py-24 lg:py-32 bg-white text-black border-b-2 border-gray-200 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color="#000000"
          refresh
        />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#F77A0E] rounded-full animate-pulse" />
          <div
            className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-black rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#F77A0E] rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-black rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-[#F77A0E] rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
      </div>

      {/* Ripple Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Ripple mainCircleSize={300} mainCircleOpacity={0.03} numCircles={3} />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="relative inline-block">
            <div className="bg-white text-white border-2 border-black px-6 py-2 text-base font-semibold flex items-center gap-2 rounded-full">
              <LiskLogo />
              <p className="text-black">Powered by Lisk</p>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black">
            Built on Lisk Layer 2 Infrastructure
          </h2>

          <p className="mx-auto max-w-[800px] text-gray-600 md:text-xl leading-relaxed">
            URIP leverages Lisk's advanced blockchain technology to provide
            seamless, scalable, and developer-friendly DeFi solutions
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <FeatureCard
            icon={Layers}
            title="Layer 2 Scaling"
            description="Leveraging Lisk's Ethereum-compatible Layer 2 solution"
            content="Fast transactions, low fees, and full EVM compatibility for seamless DeFi operations"
            delay={3}
          />

          <FeatureCard
            icon={Network}
            title="Modular Architecture"
            description="Utilizing Lisk's modular blockchain design for flexibility"
            content="Customizable modules for asset tokenization, governance, and cross-chain interoperability"
            delay={6}
          />

          <FeatureCard
            icon={Coins}
            title="Real-World Asset Tokenization"
            description="Exploring RWA tokenization solutions on Lisk blockchain"
            content="Facilitating access to financial services and improving supply chain management through asset tokenization"
            delay={9}
          />
        </div>
      </div>
    </section>
  );
}
