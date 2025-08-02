import Link from "next/link";
import React from "react";
import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Globe,
  Shield,
  FileText,
  Users,
  TrendingUp,
  Zap,
  Building2,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Dashboard", href: "/dashboard", icon: TrendingUp },
        { label: "Portfolio", href: "/portfolio", icon: Building2 },
        { label: "DAO Governance", href: "/dao", icon: Users },
        { label: "Trading", href: "/trading", icon: Zap },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs", icon: FileText },
        { label: "API Reference", href: "/api", icon: Globe },
        { label: "Smart Contracts", href: "/contracts", icon: Shield },
        { label: "Tokenomics", href: "/tokenomics", icon: TrendingUp },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About URIP", href: "/about", icon: Building2 },
        { label: "Our Team", href: "/team", icon: Users },
        { label: "Careers", href: "/careers", icon: Zap },
        { label: "Press Kit", href: "/press", icon: FileText },
      ],
    },
  ];

  const socialLinks = [
    {
      label: "Twitter",
      href: "https://twitter.com/urip_defi",
      icon: Twitter,
      hoverColor: "hover:text-blue-400",
    },
    {
      label: "GitHub",
      href: "https://github.com/urip-defi",
      icon: Github,
      hoverColor: "hover:text-gray-300",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/urip-defi",
      icon: Linkedin,
      hoverColor: "hover:text-blue-500",
    },
    {
      label: "Discord",
      href: "https://discord.gg/urip",
      icon: MessageCircle,
      hoverColor: "hover:text-indigo-400",
    },
  ];

  const legalLinks = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Risk Disclosure", href: "/risk-disclosure" },
    { label: "Cookie Policy", href: "/cookies" },
  ];

  return (
    <footer className="relative bg-black text-white">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br bg-black opacity-95"></div>

      {/* Orange accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F77A0E] via-[#FF8C00] to-[#F77A0E]"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <Image src="/urip.png" height={48} width={48} alt="logo" />
                <div>
                  <h3 className="text-2xl font-bold text-white">URIP</h3>
                  <p className="text-sm text-gray-400">
                    Bridging TradFi with DeFi
                  </p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed max-w-md">
                The premier DeFi platform for tokenizing traditional assets.
                Access global markets with transparency, security, and the power
                of blockchain technology.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-[#F77A0E] font-bold text-xl">$100M+</div>
                  <div className="text-gray-400 text-sm">
                    Total Value Locked
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <div className="text-[#F77A0E] font-bold text-xl">500+</div>
                  <div className="text-gray-400 text-sm">Supported Assets</div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Stay Updated</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F77A0E] transition-colors"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-[#F77A0E] to-[#E6690D] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#F77A0E]/25 transition-all duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="font-semibold text-white text-lg">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group flex items-center space-x-2 text-gray-300 hover:text-[#F77A0E] transition-colors duration-200"
                        >
                          <IconComponent className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <div className="text-center lg:text-left">
                <p className="text-gray-400 text-sm">
                  © {currentYear} URIP. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Built on Lisk Blockchain • Powered by DeFi Innovation
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm hidden sm:block">
                  Follow us:
                </span>
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.hoverColor} transition-all duration-200 hover:bg-gray-700 hover:scale-110`}
                      aria-label={social.label}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>

              {/* Contact */}
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:contact@urip.io"
                  className="text-sm hover:text-[#F77A0E] transition-colors duration-200"
                >
                  contact@urip.io
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-6 pt-6 border-t border-gray-700/30">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-400 hover:text-[#F77A0E] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600 text-xs">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t border-gray-700/30">
              <p className="text-xs text-gray-500 text-center lg:text-left leading-relaxed">
                <Shield className="inline h-3 w-3 mr-1" />
                URIP is a decentralized platform. Cryptocurrency investments
                carry risk. Past performance does not guarantee future results.
                Please read our risk disclosure before investing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F77A0E]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-24 h-24 bg-[#F77A0E]/5 rounded-full blur-2xl"></div>
    </footer>
  );
}
