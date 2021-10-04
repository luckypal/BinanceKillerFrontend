import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { BinanceService } from '../services/binance.service';
import { LastOrderStatus, OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  myControl = new FormControl();
  symbols: string[] = [];
  filteredSymbols?: Observable<string[]>;

  symbol = '';
  leverage = 1;
  amount = 0;

  orderStatus: LastOrderStatus = LastOrderStatus.INITIATE;

  constructor(
    public readonly binanceService: BinanceService,
    public readonly ordersService: OrdersService
  ) { }

  async ngOnInit() {
    this.symbols = await this.binanceService.getSymbols();
    this.filteredSymbols = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.symbols.filter(symbol => symbol.toLowerCase().includes(filterValue));
  }

  get isSelectable() {
    return this.orderStatus == LastOrderStatus.INITIATE
  }

  get isBuyable() {
    return this.symbol && this.orderStatus == LastOrderStatus.INITIATE
  }

  get isBuyComplate() {
    return this.orderStatus == LastOrderStatus.BUY
  }

  get isSellComplete() {
    return this.orderStatus == LastOrderStatus.SELL
  }

  get orders() {
    return this.ordersService.orders;
  }

  onSelectSymbol(symbol: string) {
    this.symbol = symbol;
    this.binanceService.setSymbol(symbol);
  }

  getBalance() {
    const { balances } = this.ordersService;
    if (!balances) return 0;
    return Math.floor(balances.total.TOTAL * 100) / 100;
  }

  getAmountChange() {
    const { balances, lastBalance } = this.ordersService;
    if (!balances) return 0;
    const changes = balances.total.TOTAL - lastBalance;
    return Math.floor(changes * 100) / 100;
  }

  onChangeLeverage(value: any) {
    this.leverage = value;
  }

  onChangeAmount(amount: any) {
    this.amount = amount;
  }

  onBuy() {
    this.ordersService.buy(this.symbol, this.leverage, this.amount);
    this.orderStatus = LastOrderStatus.BUY;
  }

  onBuyComplete() {
    this.ordersService.buyComplete();
    this.orderStatus = LastOrderStatus.INITIATE;
  }

  onSell() {
    this.ordersService.sell(this.symbol, this.leverage, this.amount);
    this.orderStatus = LastOrderStatus.SELL;
  }

  onSellComplete() {
    this.ordersService.sellComplete();
    this.orderStatus = LastOrderStatus.INITIATE;
  }
}
