import { Address } from "viem";

export interface AssetDetail {
  companyName: string;
  marketCap: string;
  website: string;
  industry: string;
  country: string;
  sharesOutstanding: string;
  description: string;
  foundedYear?: number;
  employees?: string;
}

export interface AssetNews {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
}

export interface Asset {
  address: Address;
  name: string;
  symbol: string;
  price: string;
  priceRaw: bigint;
  lastUpdated: Date;
  assetType: string;
  icon: string;
  detail: AssetDetail;
  news?: AssetNews[];
  priceChange24h?: number;
  volume24h?: string;
  isActive: boolean;
}

export interface SupportedAssetsData {
  assets: Asset[];
  totalAssets: number;
  lastFetched: Date;
}
