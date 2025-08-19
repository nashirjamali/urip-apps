import { PriceChange } from "@/components/ui/PriceChange/PriceChange";

const HoldingsSummary: React.FC<{
  holdings: Array<{
    symbol: string;
    name: string;
    quantity: string;
    value: string;
    pnl: number;
  }>;
  isLoading: boolean;
}> = ({ holdings, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Your Holdings</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Your Holdings</h3>
        <p className="text-gray-400">You don't hold any of this asset yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Your Holdings</h3>
      {holdings.map((holding, index) => (
        <div
          key={index}
          className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
        >
          <div>
            <p className="text-white font-medium">{holding.quantity}</p>
            <p className="text-gray-400 text-sm">{holding.value}</p>
          </div>
          <PriceChange value={holding.pnl} size="sm" />
        </div>
      ))}
    </div>
  );
};

export default HoldingsSummary;
