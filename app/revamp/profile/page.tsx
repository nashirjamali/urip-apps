"use client";

import React, { useState } from "react";
import { PrimaryLayout } from "@/components/revamp/layout/PrimaryLayout";
import { Header } from "@/components/revamp/layout/Header";
import { Footer } from "@/components/revamp/layout/Footer";
import { GlassCard } from "@/components/revamp/ui/GlassCard";
import { ActionButton } from "@/components/revamp/ui/ActionButton";
import { AuthWrapper } from "@/components/revamp/auth/AuthWrapper";
import { useAccount } from "wagmi";
import { 
  User, 
  Settings, 
  HelpCircle,
  Wallet,
  Moon,
  Sun,
  Camera,
  Copy,
  Check,
  Edit3,
  Mail,
  Users,
  FileText,
  ExternalLink
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("account");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: "Crypto Trader",
    bio: "Passionate about DeFi and tokenized assets",
    avatar: null,
    email: "user@example.com",
    twitter: "@cryptotrader",
    website: "https://example.com"
  });

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "support", label: "Support", icon: HelpCircle }
  ];

  // Mock data - only keep what we need
  const connectedWallets = [
    { address: address, type: "MetaMask", isPrimary: true, lastUsed: "2 hours ago" }
  ];

  // Format address
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Copy address
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return renderAccountTab();
      case "support":
        return renderSupportTab();
      default:
        return renderAccountTab();
    }
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* Profile Information */}
      <GlassCard theme="dark" variant="default" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-[#F77A0E]" />
            Profile Information
          </h3>
          <ActionButton
            variant={isEditing ? "primary" : "secondary"}
            size="sm"
            theme="dark"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? "Save" : "Edit"}
          </ActionButton>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#F77A0E] to-[#E6690D] rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#F77A0E] rounded-full flex items-center justify-center hover:bg-[#E6690D] transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Display Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.displayName}
                    onChange={(e) => setUserInfo({...userInfo, displayName: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                ) : (
                  <p className="text-white font-medium">{userInfo.displayName}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                ) : (
                  <p className="text-white font-medium">{userInfo.email}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Bio</label>
              {isEditing ? (
                <textarea
                  value={userInfo.bio}
                  onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white resize-none"
                />
              ) : (
                <p className="text-gray-300">{userInfo.bio}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Twitter</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.twitter}
                    onChange={(e) => setUserInfo({...userInfo, twitter: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                ) : (
                  <p className="text-blue-400">{userInfo.twitter}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={userInfo.website}
                    onChange={(e) => setUserInfo({...userInfo, website: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                ) : (
                  <a href={userInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center">
                    {userInfo.website}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Connected Wallets */}
      <GlassCard theme="dark" variant="default" className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-[#F77A0E]" />
          Connected Wallets
        </h3>

        <div className="space-y-4">
          {connectedWallets.map((wallet, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{wallet.type}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-400 text-sm">{formatAddress(wallet.address)}</p>
                    <button onClick={copyAddress} className="text-gray-400 hover:text-white">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {wallet.isPrimary && (
                  <span className="bg-[#F77A0E] text-white text-xs px-2 py-1 rounded-full">Primary</span>
                )}
                <p className="text-gray-400 text-xs mt-1">Last used: {wallet.lastUsed}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Theme Preferences */}
      <GlassCard theme="dark" variant="default" className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-[#F77A0E]" />
          Theme Preferences
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isDarkMode ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-gray-400" />}
            <div>
              <p className="text-white font-medium">Theme</p>
              <p className="text-gray-400 text-sm">Choose your preferred theme</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDarkMode(false)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${!isDarkMode ? 'bg-[#F77A0E] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
            >
              Light
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${isDarkMode ? 'bg-[#F77A0E] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
            >
              Dark
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderSupportTab = () => (
    <div className="space-y-6">
      <GlassCard theme="dark" variant="default" className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-[#F77A0E]" />
          Help & Support
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <HelpCircle className="w-6 h-6 text-[#F77A0E]" />
              <h4 className="text-white font-medium">Knowledge Base</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">Browse our comprehensive help articles</p>
            <ActionButton variant="ghost" size="sm" theme="dark">
              Browse Articles
            </ActionButton>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <Mail className="w-6 h-6 text-[#F77A0E]" />
              <h4 className="text-white font-medium">Contact Support</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">Get help from our support team</p>
            <ActionButton variant="ghost" size="sm" theme="dark">
              Send Message
            </ActionButton>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-6 h-6 text-[#F77A0E]" />
              <h4 className="text-white font-medium">Community</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">Join our Discord and Telegram</p>
            <ActionButton variant="ghost" size="sm" theme="dark">
              Join Community
            </ActionButton>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-6 h-6 text-[#F77A0E]" />
              <h4 className="text-white font-medium">Documentation</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">Technical documentation and guides</p>
            <ActionButton variant="ghost" size="sm" theme="dark">
              View Docs
            </ActionButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  return (
    <AuthWrapper requireAuth={true}>
      <PrimaryLayout theme="dark">
        <Header theme="dark" />
        
        <div className="container mx-auto px-6 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">Manage your account preferences and settings</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:w-64">
              <GlassCard theme="dark" variant="default" className="p-4 sticky top-6">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-[#F77A0E] text-white'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </GlassCard>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>
        </div>
        
        <Footer theme="dark" />
      </PrimaryLayout>
    </AuthWrapper>
  );
};

export default ProfilePage;
