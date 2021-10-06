import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Title } from "@angular/platform-browser";

import { BinanceService } from '../../services/binance.service';
import { LastOrderStatus, OrdersService } from '../../services/orders.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import { floor } from 'src/app/pipes/floor.pipe';

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

    const loadedData = this.storageService.load();
    if (!loadedData) {
      this.ordersService.setOrders([]);
      return;
    }

    console.log(loadedData);
    const {
      symbol,
      leverage,
      amount,
      lastOrder,
      orders
    } = loadedData;
    this.symbol = symbol;
    this.leverage = leverage;
    this.amount = amount;
    this.orderStatus = lastOrder;
    this.ordersService.setOrders(orders);
    this.binanceService.setSymbol(symbol);
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
    return balances.total.TOTAL;
  }

  getAmountChange() {
    const { balances, lastBalance } = this.ordersService;
    if (!balances) return 0;
    let totalBalance = balances.total.TOTAL;
    let changes = totalBalance - lastBalance;

    changes = changes;
    totalBalance = balances.total.TOTAL;

    if (changes) this.titleService.setTitle(`${floor(changes)} - Binkiller`);
    else this.titleService.setTitle(`${floor(totalBalance)} - Binkiller`);
    return changes;
  }

  saveToStorage() {
    this.storageService.save({
      symbol: this.symbol,
      leverage: this.leverage,
      amount: this.amount,
      lastOrder: this.orderStatus,
      orders: this.orders
    })
  }

  onChangeLeverage(value: any) {
    this.leverage = value;
    this.saveToStorage();
  }

  onChangeAmount(amount: any) {
    this.amount = amount;
    this.saveToStorage();
  }

  onBuy() {
    this.adjustAmount();
    if (this.amount == 0) {
      alert('Use amount');
      return;
    }
    this.ordersService.buy(this.symbol, this.leverage, this.amount);
    this.orderStatus = LastOrderStatus.BUY;
    this.saveToStorage();
  }

  onBuyComplete() {
    this.ordersService.buyComplete();
    this.orderStatus = LastOrderStatus.INITIATE;
    this.saveToStorage();
    this.adjustAmount();
  }

  onSell() {
    this.adjustAmount();
    if (this.amount == 0) {
      alert('Use amount');
      return;
    }
    this.ordersService.sell(this.symbol, this.leverage, this.amount);
    this.orderStatus = LastOrderStatus.SELL;
    this.saveToStorage();
  }

  onSellComplete() {
    this.ordersService.sellComplete();
    this.orderStatus = LastOrderStatus.INITIATE;
    this.saveToStorage();
    this.adjustAmount();
  }

  adjustAmount() {
    const { balances } = this.ordersService;
    if (!balances) return;
    let totalBalance = balances.total.TOTAL;
    if (this.amount > totalBalance) this.amount = Math.floor(totalBalance);
  }
}
