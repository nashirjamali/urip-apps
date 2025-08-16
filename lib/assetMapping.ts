import { AssetDetail, AssetNews } from "@/types/asset";
import {
  ASSET_ICONS,
  ASSET_DETAILS,
  NEWS_KEYWORDS,
  NEWS_CONFIG,
} from "@/constants/assets";

/**
 * Get asset icon URL for a given symbol
 */
export function getAssetIcon(symbol: string, assetType: string): string {
  if (ASSET_ICONS[symbol]) {
    return ASSET_ICONS[symbol];
  }

  return ASSET_ICONS.DEFAULT;
}

/**
 * Get detailed asset information
 */
export function getAssetDetail(symbol: string): AssetDetail | null {
  return ASSET_DETAILS[symbol] || null;
}

/**
 * Format price from contract (8 decimals) to display format
 */
export function formatAssetPrice(priceRaw: bigint): string {
  try {
    const price = Number(priceRaw) / 1e8;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    console.error("Error formatting price:", error);
    return "$0.00";
  }
}

/**
 * Format last updated timestamp
 */
export function formatLastUpdated(timestamp: bigint): Date {
  try {
    return new Date(Number(timestamp) * 1000);
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return new Date();
  }
}

/**
 * Fetch latest news for an asset
 */
export async function fetchAssetNews(symbol: string): Promise<AssetNews[]> {
  try {
    const keyword = NEWS_KEYWORDS[symbol];
    if (!keyword) {
      console.warn(`No news keyword found for symbol: ${symbol}`);
      return [];
    }

    // Use NewsAPI.org if API key is available
    if (NEWS_CONFIG.NEWS_API_KEY) {
      return await fetchFromNewsAPI(keyword);
    }

    return getMockNews(symbol);
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    return getMockNews(symbol);
  }
}

/**
 * Fetch news from NewsAPI.org
 */
async function fetchFromNewsAPI(keyword: string): Promise<AssetNews[]> {
  const url = new URL(NEWS_CONFIG.NEWS_API_BASE_URL!);
  url.searchParams.append("q", keyword);
  url.searchParams.append("apiKey", NEWS_CONFIG.NEWS_API_KEY!);
  url.searchParams.append("pageSize", NEWS_CONFIG.DEFAULT_PAGE_SIZE.toString());
  url.searchParams.append("sortBy", NEWS_CONFIG.DEFAULT_SORT_BY);
  url.searchParams.append("language", NEWS_CONFIG.DEFAULT_LANGUAGE);

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);
  url.searchParams.append("from", fromDate.toISOString().split("T")[0]);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`NewsAPI request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== "ok") {
    throw new Error(`NewsAPI error: ${data.message}`);
  }

  return data.articles.map(
    (article: any): AssetNews => ({
      title: article.title,
      description: article.description || "",
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
      imageUrl: article.urlToImage,
    })
  );
}

/**
 * Get mock news data for development/fallback
 */
function getMockNews(symbol: string): AssetNews[] {
  const mockNewsData: Record<string, AssetNews[]> = {
    tAAPL: [
      {
        title: "Apple Reports Strong Q4 Earnings Driven by iPhone Sales",
        description:
          "Apple Inc. exceeded analysts' expectations with robust iPhone sales contributing to quarterly revenue growth.",
        url: "https://example.com/apple-earnings",
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        source: "Financial Times",
        imageUrl: "/images/news/apple-earnings.jpg",
      },
      {
        title:
          "New Apple Vision Pro Features Announced at Developer Conference",
        description:
          "Apple unveiled new AR/VR capabilities for Vision Pro, targeting enterprise and creative markets.",
        url: "https://example.com/apple-vision-pro",
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        source: "TechCrunch",
        imageUrl: "/images/news/apple-vision.jpg",
      },
    ],
  };

  return mockNewsData[symbol] || [];
}

/**
 * Calculate price change percentage (mock implementation)
 * In a real app, you'd compare with previous day's price
 */
export function calculatePriceChange(
  currentPrice: bigint,
  symbol: string
): number {
  const mockChanges: Record<string, number> = {
    tAAPL: 2.34,
    tNVDA: 3.45,
  };

  return mockChanges[symbol] || 0;
}

/**
 * Format market cap, employees, etc.
 */
export function formatLargeNumber(value: string): string {
  if (/[A-Za-z]/.test(value)) {
    return value;
  }

  const num = parseFloat(value.replace(/[,$]/g, ""));
  if (isNaN(num)) return value;

  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;

  return `$${num.toFixed(0)}`;
}

/**
 * Determine if an asset is considered "active" based on last update time
 */
export function isAssetActive(lastUpdated: Date): boolean {
  const now = new Date();
  const diffHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

  return diffHours < 24;
}
