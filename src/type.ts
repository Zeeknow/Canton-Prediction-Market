
export enum MarketCategory {
  COIN = 'Coin Prices',
  SEC = 'SEC',
  SPORTS = 'Sports',
  STOCK = 'Stock'
}

export enum Outcome {
  UNRESOLVED = 'Unresolved',
  YES = 'Yes',
  NO = 'No'
}

export interface Market {
  id: string;
  question: string;
  category: MarketCategory;
  yesPool: number;
  noPool: number;
  outcome: Outcome;
  isSettled: boolean;
  isRedacted: boolean;
}
