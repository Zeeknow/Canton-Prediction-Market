import React, { useState } from 'react';
import { Market, Outcome } from '../types';

interface MarketCardProps {
  market: Market;
  onPlaceBet: (marketId: string, choice: 'yes' | 'no', amount: number) => void;
}

const MarketCard: React.FC<MarketCardProps> = ({ market, onPlaceBet }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedChoice, setSelectedChoice] = useState<'yes' | 'no' | null>(null);

  const totalPool = market.yesPool + market.noPool;
  const yesPercentage = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;
  const noPercentage = 100 - yesPercentage;
  
  const yesOdds = totalPool > 0 && market.yesPool > 0 ? `x${((market.yesPool + market.noPool) / market.yesPool).toFixed(2)}` : null;
  const noOdds = totalPool > 0 && market.noPool > 0 ? `x${((market.yesPool + market.noPool) / market.noPool).toFixed(2)}` : null;
  
  const isResolved = market.outcome !== Outcome.UNRESOLVED;

  const handleBet = () => {
    if (selectedChoice && betAmount > 0 && !isResolved) {
      onPlaceBet(market.id, selectedChoice, betAmount);
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.02] ${isResolved ? 'opacity-60' : ''}`}>
      <div>
        <p className="text-lg font-semibold text-gray-100">{market.question}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm font-medium text-gray-400 mb-1">
            <span>YES: {Math.round(yesPercentage)}%</span>
            <span>NO: {Math.round(noPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 flex overflow-hidden">
            <div
              className="bg-green-500 h-2.5"
              style={{ width: `${yesPercentage}%` }}
            ></div>
            <div
              className="bg-red-500 h-2.5"
              style={{ width: `${noPercentage}%` }}
            ></div>
          </div>
          <div className="text-center text-sm mt-2 text-gray-500">
            Total Pool: ${totalPool.toLocaleString()}
          </div>
        </div>
      </div>
      
      {isResolved ? (
         <div className="mt-6 text-center py-2 bg-gray-700 rounded-md">
            <p className="font-bold text-lg">Resolved: <span className={market.outcome === Outcome.YES ? 'text-green-400' : 'text-red-400'}>{market.outcome}</span></p>
         </div>
      ) : (
        <div className="mt-6">
            <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                    onClick={() => setSelectedChoice('yes')}
                    className={`py-2 px-3 rounded-md font-semibold transition-colors flex justify-center items-center gap-2 ${selectedChoice === 'yes' ? 'bg-green-600 text-white ring-2 ring-green-400' : 'bg-gray-700 hover:bg-green-800/50'}`}>
                    <span>Bet YES</span>
                    {yesOdds && <span className="text-xs bg-green-800/50 text-green-200 rounded-full px-2 py-0.5">{yesOdds}</span>}
                </button>
                <button 
                    onClick={() => setSelectedChoice('no')}
                    className={`py-2 px-3 rounded-md font-semibold transition-colors flex justify-center items-center gap-2 ${selectedChoice === 'no' ? 'bg-red-600 text-white ring-2 ring-red-400' : 'bg-gray-700 hover:bg-red-800/50'}`}>
                    <span>Bet NO</span>
                    {noOdds && <span className="text-xs bg-red-800/50 text-red-200 rounded-full px-2 py-0.5">{noOdds}</span>}
                </button>
            </div>
            <div className="flex items-center space-x-2">
                <input
                type="number"
                value={betAmount}
                min="1"
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Amount"
                />
                <button
                    onClick={handleBet}
                    disabled={!selectedChoice || betAmount <= 0}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Place Bet
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MarketCard;
