"use client";

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@xellar/kit';
import { UnprotectedRoute } from '@/providers/UnprotectedRoute';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, LockIcon, ShieldCheck, Zap, Wallet, TrendingUp, BarChart3, Vote } from 'lucide-react';

// Import dashboard components
import { DashboardLayout } from "@/components/partials/Dashboard/DashboardLayout";
import { ActionButton } from "@/components/partials/Dashboard/ActionButton";
import { GlassCard } from "@/components/partials/Dashboard/GlassCard";

export default function LoginPage() {
    const router = useRouter();
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (address) {
            setIsLoading(true);

            // First delay to show loading state
            const loadingTimer = setTimeout(() => {
                // Second delay to simulate authentication process
                const redirectTimer = setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);

                return () => clearTimeout(redirectTimer);
            }, 1000);

            return () => clearTimeout(loadingTimer);
        }
    }, [address, router]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <UnprotectedRoute>
            <DashboardLayout className="min-h-screen bg-black text-white">
                {/* Main Container with better positioning */}
                <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-md">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="space-y-8"
                        >
                            {/* Header Section - Centered and prominent */}
                            <motion.div variants={itemVariants} className="text-center">
                                <div className="flex items-center justify-center space-x-4 mb-6">
                                    <h1 className="text-5xl font-bold text-white">Welcome to</h1>
                                    <img src="/urip.png" alt="Urip Logo" className="w-20 h-20 object-contain" />
                                </div>
                                <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                                    Connect your wallet to access the future of tokenized investments
                                </p>
                            </motion.div>

                            {/* Login Card - Centered and focused */}
                            <motion.div variants={itemVariants}>
                                <GlassCard className="p-10 relative overflow-hidden">
                                    {/* Decorative background element */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F77A0E]/10 via-transparent to-transparent rounded-bl-full" />
                                    
                                    <CardHeader className="px-0 pb-8">
                                        <CardTitle className="text-4xl font-bold text-white text-center mb-2">Sign In</CardTitle>
                                        <CardDescription className="text-gray-400 text-center text-lg leading-relaxed">
                                            Connect with your Web3 wallet to access your account
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-0">
                                        {!address ? (
                                            <div className="space-y-8">
                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <span className="w-full border-t border-gray-700/50" />
                                                    </div>
                                                    <div className="relative flex justify-center text-sm uppercase">
                                                        <span className="bg-black px-6 text-gray-400 font-medium tracking-wider">Select Wallet</span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <ConnectButton className="w-full" />
                                                </div>

                                                {/* Security Features - Better positioned */}
                                                <div className="grid grid-cols-2 gap-6 text-sm text-gray-400 mt-8 pt-6 border-t border-gray-700/30">
                                                    <div className="flex items-center">
                                                        <ShieldCheck className="w-5 h-5 mr-3 text-[#F77A0E]" />
                                                        <span className="font-medium">Secure Connection</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <LockIcon className="w-5 h-5 mr-3 text-[#F77A0E]" />
                                                        <span className="font-medium">End-to-End Encrypted</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <motion.div
                                                className="py-12 flex flex-col items-center space-y-8"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-full border-4 border-t-transparent border-[#F77A0E] animate-spin"></div>
                                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                                        <Zap className="w-10 h-10 text-[#F77A0E]" />
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-2xl font-medium text-white mb-2">Authenticating...</p>
                                                    <p className="text-gray-400">Connecting to your account</p>
                                                </div>

                                                {/* Loading Progress Steps - Better positioned */}
                                                <div className="w-full max-w-sm mt-8">
                                                    <div className="flex justify-between mb-3 text-xs text-gray-400 font-medium">
                                                        <span>Verifying wallet</span>
                                                        <span>Loading profile</span>
                                                        <span>Redirecting</span>
                                                    </div>
                                                    <div className="w-full bg-gray-800/50 rounded-full h-3 mb-6">
                                                        <motion.div
                                                            className="bg-gradient-to-r from-[#F77A0E] to-[#E6690D] h-3 rounded-full"
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 3, ease: "easeInOut" }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </UnprotectedRoute>
    );
} 