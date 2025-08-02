import { BoxReveal } from "@/components/magicui/box-reveal";
import { Particles } from "@/components/magicui/particles";
import { Ripple } from "@/components/magicui/ripple";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";

export default function CTASection() {
  return (
    <section
      id="lisk"
      className="relative w-full py-12 md:py-24 lg:py-32 bg-white text-black border-b-2 border-gray-200 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <Particles
          className="absolute inset-0"
          quantity={200}
          ease={100}
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
        <div className="text-center space-y-6 p-8 border-2 border-[#F77A0E] bg-black rounded-md">
          <BoxReveal boxColor="#F77A0E" duration={0.5}>
            <h2 className="text-3xl font-bold tracking-tighter text-white">
              Ready to Start Global Investment?
            </h2>
          </BoxReveal>

          <BoxReveal boxColor="#F77A0E" duration={0.5}>
            <p className="max-w-[600px] text-white md:text-lg text-left">
              Join the DeFi revolution and access global markets easily,
              securely, and transparently.
            </p>
          </BoxReveal>

          <BoxReveal boxColor="#F77A0E" duration={0.5}>
            <div className="space-x-4 pt-4">
              <ShinyButton className="bg-[#F77A0E] text-white hover:bg-[#E06A00] px-8 py-3 text-lg border-2 border-[#F77A0E]">
                <div className="flex gap-2">
                  <p className="font-bold text-white">Get Started</p>
                  <ArrowRight className="ml-2 h-5 w-5 text-white" />
                </div>
              </ShinyButton>
            </div>
          </BoxReveal>
        </div>
      </div>
    </section>
  );
}
