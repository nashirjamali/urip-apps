import type { Asset, MutualFund } from "@/types";

export const calculateTotalInvestmentValue = (
  assets: Asset[],
  mutualFund: MutualFund
): number => {
  const assetsTotal = assets.reduce(
    (sum, asset) =>
      sum + parseFloat(asset.investmentValueUSD.replace(/[$,]/g, "")),
    0
  );

  const mutualFundTotal = parseFloat(
    mutualFund.investmentValueUSD.replace(/[$,]/g, "")
  );

  return assetsTotal + mutualFundTotal;
};

export const calculateTotalPnL = (
  assets: Asset[],
  mutualFund: MutualFund
): number => {
  const assetsPnL = assets.reduce(
    (sum, asset) =>
      sum +
      parseFloat(asset.pnlAmount.replace(/[+$,]/g, "")) *
        (asset.isProfitable ? 1 : -1),
    0
  );

  const mutualFundPnL =
    parseFloat(mutualFund.pnlAmount.replace(/[+$,]/g, "")) *
    (mutualFund.isProfitable ? 1 : -1);

  return assetsPnL + mutualFundPnL;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};
