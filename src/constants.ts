
import { Market, MarketCategory, Outcome } from './types';

export const MOCK_MARKETS: Market[] = [
  {
    id: '1',
    question: 'Will ETH pass $4000 in 1hr?',
    category: MarketCategory.COIN,
    yesPool: 2500,
    noPool: 1500,
    outcome: Outcome.UNRESOLVED,
    isSettled: false,
    isRedacted: false,
  },
  {
    id: '2',
    question: 'Will XRP ETF be accepted before Q1 2026?',
    category: MarketCategory.SEC,
    yesPool: 12000,
    noPool: 8000,
    outcome: Outcome.UNRESOLVED,
    isSettled: false,
    isRedacted: false,
  },
  {
    id: '3',
    question: 'Will Tottenham win Man utd?',
    category: MarketCategory.SPORTS,
    yesPool: 5000,
    noPool: 7500,
    outcome: Outcome.YES,
    isSettled: true,
    isRedacted: false,
  },
  {
    id: '4',
    question: 'Will Tesla launch a solar factory before Q1 2026?',
    category: MarketCategory.STOCK,
    yesPool: 10000,
    noPool: 2000,
    outcome: Outcome.NO,
    isSettled: true,
    isRedacted: true,
  },
];
