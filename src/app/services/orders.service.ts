import * as cuid from 'cuid';
import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { Order, OrderSide } from '../models/order.model';
import { BinanceService } from './binance.service';
import { environment } from 'src/environments/environment';

export enum LastOrderStatus {
  INITIATE = "INITIATE",
  BUY = "BUY",
  SELL = "SELL"
}

export interface BaseAmount {
  signalId?: number | string;
  symbol: string;
  from: number;
  to?: number;
  start?: string;
  finish?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  orders: Order[] = [];
  balances: any = null;

  lastBalance: number = 0;
  feePercent = 0.0005;

  constructor(
    private readonly binanceService: BinanceService
  ) {
    // this.orders = [
      // { "signalId": "asdfasdfsdf", "orderId": "ckuc96vzc0000389h4bn05h7i", "symbol": "BTCUSDT", "price": 1000, "amount": 1000, "leverage": 1, "side": OrderSide.BUY, "createdAt": 1633327784040, "finishedAt": 1633327784040 },
      // { "signalId": "asdfasdfsdf", "orderId": "ckuc96xev0001389hz0d1rgbu", "symbol": "BTCUSDT", "price": 1100, "amount": 1000, "leverage": 1, "side": OrderSide.SELL, "createdAt": 1633327785895, "finishedAt": 1633327785895 },
      // { "signalId": "asdfasdfsdf", "orderId": "ckuc96xev0001389hz0d1rgbu", "symbol": "BTCUSDT", "price": 1100, "amount": 1000, "leverage": 5, "side": OrderSide.SELL, "createdAt": 1633327785895, "finishedAt": 1633327785895 }
    // ];

    this.lastBalance = environment.primaryUsdt;
    this.getBalances(this.lastBalance);
  }

  buy(
    symbol: string,
    leverage: number,
    amount: number) {
    const {
      activePrice: price
    } = this.binanceService;
    const fee = (amount * leverage) * this.feePercent;

    const order: Order = {
      signalId: cuid(),
      orderId: cuid(),
      symbol,
      price,
      amount,
      leverage,
      fee,
      side: OrderSide.BUY,
      createdAt: Date.now(),
      finishedAt: Date.now()
    };
    this.orders.push(order);
  }

  buyComplete() {
    if (!this.orders.length) return;
    const lastOrder = this.orders[this.orders.length - 1];
    const {
      activePrice: price
    } = this.binanceService;

    const order: Order = {
      ...lastOrder,
      orderId: cuid(),
      price,
      side: OrderSide.SELL,
      createdAt: Date.now(),
      finishedAt: Date.now()
    }
    this.orders.push(order);
  }

  sell(
    symbol: string,
    leverage: number,
    amount: number) {
    const {
      activePrice: price
    } = this.binanceService;
    const fee = (amount * leverage) * this.feePercent;

    const order: Order = {
      signalId: cuid(),
      orderId: cuid(),
      symbol,
      price,
      amount,
      leverage,
      fee,
      side: OrderSide.SELL,
      createdAt: Date.now(),
      finishedAt: Date.now()
    };
    this.orders.push(order);
  }

  sellComplete() {
    if (!this.orders.length) return;
    const lastOrder = this.orders[this.orders.length - 1];
    const {
      activePrice: price
    } = this.binanceService;

    const order: Order = {
      ...lastOrder,
      orderId: cuid(),
      price,
      side: OrderSide.BUY,
      createdAt: Date.now(),
      finishedAt: Date.now()
    }
    this.orders.push(order);
  }


  calculateBuyAmount(balance: number, amount: number) {
    if (amount > 1) return Math.min(balance, amount);
    return balance * amount;
  }

  getBalances(
    primaryUsdt: number,
  ) {
    const timezoneOffset = -5;
    const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
    const balances: any = {
      SPOT: primaryUsdt,
      LOAN: 0
    };
    const amounts: Record<number | string, BaseAmount> = {};
    let direction = 1;
    let lastAmount = 0;

    this.orders
      .forEach((order, index) => {
        const {
          signalId,
          symbol: coin,
          price,
          leverage,
          fee,
          side: type,
          createdAt,
          amount: buyAmount
        } = order;
        if (!balances[coin]) balances[coin] = 0;
        lastAmount = buyAmount;

        if (index % 2 == 0) direction = type == OrderSide.BUY ? 1 : -1;

        if (type == OrderSide.BUY) {
          if (direction == 1) {
            const amount = this.calculateBuyAmount(balances.SPOT, buyAmount);
            balances.SPOT -= amount;
            balances.LOAN += amount * leverage;
            balances[coin] += amount * leverage / price;
            amounts[signalId] = {
              symbol: coin,
              from: amount,
              start: moment(createdAt).utcOffset(timezoneOffset).format(dateTimeFormat),
            };
          } else {
            const coinAmount = (buyAmount * leverage) / price; // 5.5
            const amount = (coinAmount + balances[coin]) * price; // 500
            balances.SPOT += amount + buyAmount;
            balances.LOAN -= buyAmount * leverage;
            balances[coin] = 0;
            amounts[signalId] = {
              ...amounts[signalId],
              finish: moment(createdAt).utcOffset(timezoneOffset).format(dateTimeFormat),
              to: coinAmount,
            };
          }
        } else {
          if (direction == 1) {
            const amount = amounts[signalId].from;
            const newAmount = (balances[coin] * price) - (amount * (leverage - 1));
            balances.SPOT += newAmount;
            balances.LOAN -= amount * leverage;
            balances[coin] = 0;
            amounts[signalId] = {
              ...amounts[signalId],
              finish: moment(createdAt).utcOffset(timezoneOffset).format(dateTimeFormat),
              to: newAmount,
            };
          } else {
            const amount = this.calculateBuyAmount(balances.SPOT, buyAmount);
            balances.SPOT -= amount;
            balances.LOAN += amount * leverage;
            const coinAmount = amount * leverage / price;
            balances[coin] -= coinAmount;

            amounts[signalId] = {
              symbol: coin,
              from: coinAmount,
              start: moment(createdAt).utcOffset(timezoneOffset).format(dateTimeFormat),
            };
          }
        }
        balances.SPOT -= fee;
      });

    let totalBalance = balances.SPOT - balances.LOAN * direction;
    if (this.orders.length % 2 == 1) totalBalance += lastAmount;
    for (const coin in balances) {
      if (coin == 'SPOT' || coin == 'LOAN') continue;
      const price = this.binanceService.activePrice;
      totalBalance += price * balances[coin];
    }
    if (this.orders.length % 2 == 0) {
      this.lastBalance = totalBalance;
    }

    this.balances = {
      total: {
        TOTAL: totalBalance,
        SPOT: balances.SPOT,
        LOAN: balances.LOAN,
      },
      amounts
    };
    return totalBalance;
  }
}
