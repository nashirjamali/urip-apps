"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { LoadingState } from "@/components/ui/States/LoadingState";
import { ErrorState } from "@/components/ui/States/ErrorState";
import {
  PieChart,
  TrendingUp,
  Activity,
  DollarSign,
  Users,
  ArrowLeft,
  RefreshCw,
  BarChart3,
  Target,
  Clock,
  Shield,
} from "lucide-react";
import { useMutualFundInfo } from "@/hooks/contracts/useMutualFundInfo";
import { MutualFundOverview } from "@/components/partials/Trading/MutualFundOverview";
import { MutualFundAllocations } from "@/components/partials/Trading/MutualFundAllocations";
import { MutualFundTradePanel } from "@/components/partials/Trading/MutualFundTradePanel";

const MutualFundPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "allocations">(
    "overview"
  );

  const {
    mutualFundInfo,
    assetAllocations,
    isLoadingFund,
    isLoadingAllocations,
    fundError,
    refreshAll,
  } = useMutualFundInfo();

  const handleBackClick = () => {
    router.push("/trading");
  };

  const handleRefresh = async () => {
    await refreshAll();
  };

  // Loading State
  if (isLoadingFund && isLoadingAllocations) {
    return (
      <Layout theme="dark">
        <PageHeader
          title="URIP Mutual Fund"
          subtitle="Loading fund information..."
          showBackButton
          onBackClick={handleBackClick}
          theme="dark"
        />
        <LoadingState
          message="Fetching mutual fund data from blockchain..."
          size="lg"
        />
      </Layout>
    );
  }

  // Error State
  if (fundError) {
    return (
      <Layout theme="dark">
        <PageHeader
          title="URIP Mutual Fund"
          subtitle="Error loading fund information"
          showBackButton
          onBackClick={handleBackClick}
          theme="dark"
        />
        <ErrorState
          type="generic"
          title="Failed to Load Fund Data"
          message={fundError}
          actions={[
            {
              label: "Retry",
              onClick: handleRefresh,
            },
          ]}
        />
      </Layout>
    );
  }

  return (
    <Layout theme="dark">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-xl flex items-center justify-center mr-4">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    URIP Mutual Fund
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Diversified Portfolio Investment
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isLoadingFund || isLoadingAllocations}
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-400 ${
                    isLoadingFund || isLoadingAllocations ? "animate-spin" : ""
                  }`}
                />
              </button>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${mutualFundInfo?.nav || "1.00"}
                </div>
                <div className="text-sm text-gray-400">Net Asset Value</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-400 text-sm mb-1">
                <DollarSign className="w-4 h-4 mr-1" />
                Total Value
              </div>
              <div className="text-lg font-bold text-white">
                {isLoadingFund ? (
                  <div className="animate-pulse bg-gray-700 h-5 w-20 rounded"></div>
                ) : (
                  `$${mutualFundInfo?.totalAssetValue || "0"}`
                )}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-400 text-sm mb-1">
                <Users className="w-4 h-4 mr-1" />
                Total Supply
              </div>
              <div className="text-lg font-bold text-white">
                {isLoadingFund ? (
                  <div className="animate-pulse bg-gray-700 h-5 w-20 rounded"></div>
                ) : (
                  `${mutualFundInfo?.totalTokens || "0"} URIP`
                )}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-400 text-sm mb-1">
                <Target className="w-4 h-4 mr-1" />
                Assets
              </div>
              <div className="text-lg font-bold text-white">
                {isLoadingAllocations ? (
                  <div className="animate-pulse bg-gray-700 h-5 w-16 rounded"></div>
                ) : (
                  `${assetAllocations.length} Assets`
                )}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center text-gray-400 text-sm mb-1">
                <Shield className="w-4 h-4 mr-1" />
                Status
              </div>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    mutualFundInfo?.isActive ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-sm font-medium text-white">
                  {mutualFundInfo?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "allocations", label: "Asset Allocations", icon: PieChart },
              { id: "performance", label: "Performance", icon: TrendingUp },
              { id: "history", label: "Transaction History", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-[#F77A0E] text-[#F77A0E]"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "overview" && (
              <>
                <MutualFundOverview
                  fundInfo={mutualFundInfo}
                  allocations={assetAllocations}
                  isLoading={isLoadingFund || isLoadingAllocations}
                />
              </>
            )}

            {activeTab === "allocations" && (
              <MutualFundAllocations
                allocations={assetAllocations}
                isLoading={isLoadingAllocations}
                totalValue={mutualFundInfo?.totalAssetValue}
              />
            )}
          </div>

          {/* Right Sidebar - Trading Panel */}
          <div className="space-y-6">
            <MutualFundTradePanel
              fundInfo={mutualFundInfo}
              isLoading={isLoadingFund}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MutualFundPage;
