import { create } from 'zustand';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: bigint;
  connect: () => void;
  disconnect: () => void;
  setAddress: (address: string | null) => void;
  setBalance: (balance: bigint) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnected: false,
  balance: BigInt(0),
  connect: () => set({ isConnected: true }),
  disconnect: () => set({ isConnected: false, address: null, balance: BigInt(0) }),
  setAddress: (address: string | null) => set({ address, isConnected: !!address }),
  setBalance: (balance: bigint) => set({ balance }),
})); 