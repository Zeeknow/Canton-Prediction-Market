import React from 'react';
import { Market, MarketCategory } from '../types';
import MarketCard from '../components/MarketCard';
import SequencerPanel from '../components/SequencerPanel';

interface PredictorDashboardProps {
  markets: Market[];
  onPlaceBet: (marketId: string, choice: 'yes' | 'no', amount: number) => void;
}

const PredictorDashboard: React.FC<PredictorDashboardProps> = ({ markets, onPlaceBet }) => {
  // FIX: Explicitly type `categorizedMarkets` to ensure correct type inference for `Object.entries`.
  // This resolves an error where `marketsInCategory` was inferred as `unknown`.
  const categorizedMarkets: Record<MarketCategory, Market[]> = markets.reduce((acc, market) => {
    if (!acc[market.category]) {
      acc[market.category] = [];
    }
    acc[market.category].push(market);
    return acc;
  }, {} as Record<MarketCategory, Market[]>);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Active Markets
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Place your predictions and prove your foresight.
        </p>
      </div>
      
      <div className="space-y-8">
        {Object.entries(categorizedMarkets).map(([category, marketsInCategory]) => (
            <div key={category}>
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4 border-b-2 border-gray-700 pb-2">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketsInCategory.map(market => (
                <MarketCard key={market.id} market={market} onPlaceBet={onPlaceBet} />
                ))}
            </div>
            </div>
        ))}
      </div>

      <div className="mt-16 pt-12 border-t border-gray-700/50">
        <SequencerPanel />
      </div>

    </div>
  );
};

export default PredictorDashboard;
