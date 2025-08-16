import { Address } from "viem";

export interface AssetNews {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
}

export interface AssetListItem {
  tokenAddress: Address;
  name: string;
  symbol: string;
  price: string;
  lastUpdated: Date;
  assetType: string;
  assetIcon: string;
}

export interface AssetDetailItem extends AssetListItem {
  companyName: string;
  marketCap: string;
  website: string;
  industry: string;
  country: string;
  sharesOutstanding: string;
  latestNews: AssetNews[];
}

export interface UseSupportedAssetsReturn {
  assetsList: AssetListItem[];
  isLoadingList: boolean;
  listError: string | null;
  refreshList: () => Promise<void>;
  totalAssets: number;
  lastFetched: Date | null;
}

export interface UseAssetDetailReturn {
  assetDetail: AssetDetailItem | null;
  isLoadingDetail: boolean;
  detailError: string | null;
  refreshDetail: () => Promise<void>;
  refreshNews: () => Promise<void>;
  isLoadingNews: boolean;
  newsError: string | null;
}
