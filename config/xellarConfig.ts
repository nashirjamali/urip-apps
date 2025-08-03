import { defaultConfig } from "@xellar/kit";
import { Config } from "wagmi";

const walletConnectProjectId = "ea054384ce1e0b3b3e78f0cf0891ca6d";
const xellarAppId = "e205e069-b986-400e-b496-e46dc81993a9";

// Lisk Sepolia network configuration
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia',
  network: 'lisk-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Lisk',
    symbol: 'LSK',
  },
  rpcUrls: {
    default: { 
      http: [
        'https://rpc.sepolia-api.lisk.com',
        'https://lisk-sepolia.publicnode.com',
        'https://lisk-sepolia.drpc.org'
      ] 
    },
    public: { 
      http: [
        'https://rpc.sepolia-api.lisk.com',
        'https://lisk-sepolia.publicnode.com',
        'https://lisk-sepolia.drpc.org'
      ] 
    },
  },
  blockExplorers: {
    default: { name: 'Lisk Sepolia Explorer', url: 'https://sepolia-blockscout.lisk.com' },
  },
  testnet: true,
} as const;

export const config = defaultConfig({
  appName: "Urip",
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: "sandbox",
  chains: [liskSepolia],
  ssr: true
}) as Config;