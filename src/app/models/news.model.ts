export enum NewsSource {
  Binance = 'Binance'
}

export interface News {
  id: string;
  from: NewsSource;
  title: string;
  data: any;
  createdAt: number;
}