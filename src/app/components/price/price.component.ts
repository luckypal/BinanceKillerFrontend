import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BinanceService } from 'src/app/services/binance.service';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
  activePrice: string = '';

  constructor(
    private readonly binanceService: BinanceService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const { updateInterval } = environment;
    interval(updateInterval).subscribe(_ => {
      this.activePrice = this.binanceService.activePrice;
      this.cdr.detectChanges();
    });
  }

}
