import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import Image from "next/image";

export default function ProblemSection() {
  return (
    <section
      id="solution"
      className="w-full relative min-h-screen overflow-hidden bg-black"
    >
      {/* Top Animated Grid Pattern */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-80%] h-[200%] skew-y-12"
        )}
      />

      {/* Bottom Animated Grid Pattern */}
      <AnimatedGridPattern
        numSquares={25}
        maxOpacity={0.08}
        duration={4}
        repeatDelay={1.5}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />

      {/* Additional subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#F77A0E08_1px,transparent_1px),linear-gradient(to_bottom,#F77A0E08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 pt-28 pb-20">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Problems Section */}
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 mb-32">
            <div className="space-y-8 p-8 border border-gray-700/50 rounded-2xl bg-gray-900/20 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="text-3xl font bold text-[#F77A0E] font-bold mb-8">
                  Current Problems
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Traditional Finance Limitations
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  Traditional financial systems create barriers that prevent
                  global access to investment opportunities and limit financial
                  inclusion.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "High Entry Barriers",
                    description:
                      "High minimum investment requirements for diversified portfolios exclude many potential investors",
                  },
                  {
                    title: "Geographic Restrictions",
                    description:
                      "Limited access to international markets due to regulatory and infrastructure constraints",
                  },
                  {
                    title: "High Fees",
                    description:
                      "Management fees, transaction costs, and currency conversion fees reduce returns significantly",
                  },
                ].map((problem, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-3 h-3 bg-[#F77A0E] rounded-full mt-2 group-hover:scale-110 transition-transform duration-200"></div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white text-lg group-hover:text-[#F77A0E] transition-colors duration-200">
                        {problem.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Space for Problems */}
            <div className="flex items-center justify-center p-8">
              <div className="relative w-full max-w-md h-96 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl">
                  <Image
                    src={"/traditional-stocks.png"}
                    width={1000}
                    height={1000}
                    alt="stock trading"
                    className="h-96 w-full bg-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Solutions Section */}
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Image Space for Solutions */}
            <div className="flex items-center justify-center lg:order-1 p-8 bg-gray-900/10 backdrop-blur-sm">
              <Image
                src={"/defi.png"}
                width={1000}
                height={1000}
                alt="stock trading"
                className="h-96 w-full bg-cover"
              />
            </div>

            <div className="space-y-8 lg:order-2 p-8 border border-gray-700/50 rounded-2xl bg-gray-900/20 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="text-3xl font bold text-[#F77A0E] font-bold mb-8">
                  URIP Solution
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Innovative DeFi Platform
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  Our decentralized platform removes traditional barriers and
                  enables global access to investment opportunities through
                  blockchain technology.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "Global Access",
                    description:
                      "Invest in any market from any wallet, breaking down geographical barriers",
                  },
                  {
                    title: "Fractional Ownership",
                    description:
                      "Start investing from just $1, making expensive assets accessible to everyone",
                  },
                  {
                    title: "24/7 Trading",
                    description:
                      "Trade anytime, anywhere - not limited to traditional market hours",
                  },
                ].map((solution, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-3 h-3 bg-[#F77A0E] rounded-full mt-2 group-hover:scale-110 transition-transform duration-200"></div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white text-lg group-hover:text-[#F77A0E] transition-colors duration-200">
                        {solution.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Links */}
              <div className="space-y-3 pt-6">
                {[{ text: "View our Platform", href: "#platform" }].map(
                  (link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="inline-flex items-center space-x-2 text-white hover:text-[#F77A0E] transition-colors duration-200 group"
                    >
                      <span className="border-b border-white group-hover:border-[#F77A0E] transition-colors duration-200">
                        {link.text}
                      </span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
