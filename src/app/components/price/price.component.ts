import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BinanceService } from 'src/app/services/binance.service';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
  prevPrice: number = 0;
  activePrice: number = 0;

  constructor(
    private readonly binanceService: BinanceService,
    private readonly orderService: OrdersService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.binanceService.getPrice()
      .subscribe((data: any) => {
        const { symbol, price } = data;
        if (symbol != this.binanceService.selectedSymbol) return;

        this.prevPrice = this.activePrice;
        this.activePrice = price;
        this.binanceService.activePrice = price;

        const { primaryUsdt } = environment;
        this.orderService.getBalances(primaryUsdt);
        this.cdr.detectChanges();
      })
  }

  isDown() {
    return this.prevPrice > this.activePrice;
  }

  isUp() {
    return this.prevPrice < this.activePrice;
  }

}
