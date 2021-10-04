
export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface Order {
  signalId: string;
  orderId: string;
  symbol: string;
  price: number;
  amount: number;
  leverage: number;
  fee: number;
  side: OrderSide;
  createdAt: number;
  finishedAt: number;
};
