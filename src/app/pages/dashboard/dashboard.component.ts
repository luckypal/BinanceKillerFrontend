import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Title } from "@angular/platform-browser";

import { BinanceService } from '../../services/binance.service';
import { LastOrderStatus, OrdersService } from '../../services/orders.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';

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
    private router: Router,
    private titleService: Title,
    public readonly binanceService: BinanceService,
    public readonly ordersService: OrdersService,
    private readonly storageService: LocalStorageService
  ) { }

  async ngOnInit() {
    const secretKey = this.storageService.getSecretKey();
    if (!secretKey) {
      this.router.navigate(['/']);
      return;
    }

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
    let totalBalance = balances.total.TOTAL;
    let changes = totalBalance - lastBalance;

    changes = Math.floor(changes * 100) / 100;
    totalBalance = Math.floor(balances.total.TOTAL * 100) / 100;

    if (changes) this.titleService.setTitle(`${changes} - Binkiller`);
    else this.titleService.setTitle(`${totalBalance} - Binkiller`);
    return changes;
  }

  onChangeLeverage(value: any) {
    this.leverage = value;
  }

  onChangeAmount(amount: any) {
    this.amount = amount;
  }

  onBuy() {
    if (this.amount == 0) {
      alert('Use amount');
      return;
    }
    this.ordersService.buy(this.symbol, this.leverage, this.amount);
    this.orderStatus = LastOrderStatus.BUY;
  }

  onBuyComplete() {
    this.ordersService.buyComplete();
    this.orderStatus = LastOrderStatus.INITIATE;
  }

  onSell() {
    if (this.amount == 0) {
      alert('Use amount');
      return;
    }
    this.ordersService.sell(this.symbol, this.leverage, this.amount);
    this.orderStatus = LastOrderStatus.SELL;
  }

  onSellComplete() {
    this.ordersService.sellComplete();
    this.orderStatus = LastOrderStatus.INITIATE;
  }
}
