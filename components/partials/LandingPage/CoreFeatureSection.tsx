import { Meteors } from "@/components/magicui/meteors";
import { Particles } from "@/components/magicui/particles";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Squares from "@/components/ui/Squares/Squares";
import { Eye, Shield, Users, Zap, ExternalLink } from "lucide-react";

export default function CoreFeatureSection() {
  const features = [
    {
      icon: Shield,
      title: "High Security",
      description:
        "Tested smart contracts and trusted custody to protect investor assets with enterprise-grade security protocols.",
      link: "#security",
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description:
        "Complete visibility in asset management and fund management decisions through real-time reporting.",
      link: "#transparency",
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      description:
        "Blockchain-based settlement replacing traditional T+2 or T+3 with immediate transaction finality.",
      link: "#settlement",
    },
    {
      icon: Users,
      title: "Community Governance",
      description:
        "Democratic fund management decisions through DAO governance enabling collective decision-making.",
      link: "#governance",
    },
  ];

  return (
    <section
      id="features"
      className="min-h-screen bg-black text-white relative overflow-hidden"
    >
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
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              URIP Core Features
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-300 text-lg md:text-xl leading-relaxed">
              Platform combining blockchain security with traditional finance
              ease, working with leading protocols to realize our vision.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="group relative bg-gray-900/80 border border-gray-800/50 hover:border-[#F77A0E]/50 transition-all duration-300 hover:bg-gray-900 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white mb-3">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <a
                      href={feature.link}
                      className="inline-flex items-center text-[#F77A0E] hover:text-[#E6690D] font-medium text-sm transition-colors duration-200 group-hover:underline"
                    >
                      Learn more
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#F77A0E]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#F77A0E]/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
