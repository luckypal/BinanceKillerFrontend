import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { BinanceService } from '../services/binance.service';
import { PriceComponent } from '../components/price/price.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  myControl = new FormControl();
  symbols: string[] = [];
  filteredSymbols?: Observable<string[]>;

  constructor(
    public readonly binanceService: BinanceService
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

  onSelectSymbol(symbol: string) {
    this.binanceService.setSymbol(symbol);
  }

  onBuy() {
  }

  onBuyComplete() {
  }

  onSell() {
  }

  onSellComplete() {
  }
}
