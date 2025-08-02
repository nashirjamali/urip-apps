"use client";

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@xellar/kit';
import { UnprotectedRoute } from '@/providers/UnprotectedRoute';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, LockIcon, ShieldCheck, Zap } from 'lucide-react';

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
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4 md:p-8">
                <motion.div
                    className="w-full max-w-md"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Logo and Branding */}
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">Welcome to</h1>
                            <img src="/urip.png" alt="Urip Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <p className="text-blue-200">Connect your wallet to continue</p>
                    </motion.div>

                    {/* Login Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl text-white">
                            <CardHeader className="space-y-1 pb-2">
                                <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                                <CardDescription className="text-blue-200 text-center">
                                    Connect with your Web3 wallet to access your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {!address ? (
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-white/20" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-transparent px-2 text-blue-200">Select Wallet</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <ConnectButton className="w-full" />
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        className="py-8 flex flex-col items-center space-y-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
                                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                                <Zap className="w-6 h-6 text-blue-400" />
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-lg font-medium">Authenticating...</p>
                                            <p className="text-sm text-blue-200 mt-1">Connecting to your account</p>
                                        </div>

                                        {/* Loading Progress Steps */}
                                        <div className="w-full max-w-xs mt-4">
                                            <div className="flex justify-between mb-1 text-xs text-blue-200">
                                                <span>Verifying wallet</span>
                                                <span>Loading profile</span>
                                                <span>Redirecting</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
                                                <motion.div
                                                    className="bg-blue-500 h-1.5 rounded-full"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 3, ease: "easeInOut" }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 pt-0">
                                <div className="w-full border-t border-white/10 my-2"></div>

                                {/* Security Features */}
                                <div className="grid grid-cols-2 gap-4 text-xs text-blue-200">
                                    <div className="flex items-center">
                                        <ShieldCheck className="w-4 h-4 mr-2 text-blue-300" />
                                        <span>Secure Connection</span>
                                    </div>
                                    <div className="flex items-center">
                                        <LockIcon className="w-4 h-4 mr-2 text-blue-300" />
                                        <span>End-to-End Encrypted</span>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    {/* Features */}
                    <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { title: "Asset Management", description: "Manage all your assets in one place" },
                            { title: "DeFi Integration", description: "Access DeFi protocols seamlessly" },
                            { title: "Real-time Trading", description: "Execute trades with minimal latency" }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <h3 className="font-medium text-white">{feature.title}</h3>
                                <p className="text-xs text-blue-200 mt-1">{feature.description}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Custom styling for shadow glow effect */}
            <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3);
        }
      `}</style>
        </UnprotectedRoute>
    );
} 