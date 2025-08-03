"use client";

import React from "react";
import { TrendingUp, Wallet, BarChart3, Vote, ArrowRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  className = "",
}) => {
  const actions = [
    {
      title: "Start Trading",
      description: "Buy and sell tokenized assets",
      icon: TrendingUp,
      color: "from-[#F77A0E] to-[#E6690D]",
      href: "/trade",
    },
    {
      title: "View Portfolio",
      description: "Track your investments",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      href: "/portfolio",
    },
    {
      title: "Connect Wallet",
      description: "Link your crypto wallet",
      icon: Wallet,
      color: "from-purple-500 to-purple-600",
      href: "#",
    },
    {
      title: "DAO Governance",
      description: "Vote on fund managers",
      icon: Vote,
      color: "from-blue-500 to-blue-600",
      href: "/dao",
    },
  ];

  return (
    <GlassCard className={`p-6 ${className}`}>
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-xl font-semibold text-white">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <button
                key={index}
                className="group relative p-4 rounded-lg bg-gradient-to-br from-gray-800/70 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:from-gray-700/80 hover:to-gray-800/70 hover:border-[#F77A0E]/30 transition-all duration-200 hover:scale-[1.02] text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#F77A0E] transition-colors" />
                </div>

                <h3 className="font-medium text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </GlassCard>
  );
};
