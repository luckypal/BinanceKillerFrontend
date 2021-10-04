import * as moment from 'moment';
import { Component, Input, OnInit } from '@angular/core';
import { Order, OrderSide } from 'src/app/models/order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @Input('order')
  order?: Order;

  constructor() { }

  ngOnInit(): void {
  }

  get isBuy() {
    return this.order?.side == OrderSide.BUY;
  }

  get isSell() {
    return this.order?.side == OrderSide.SELL;
  }

  printDate(date: number) {
    return moment(this.order!.createdAt)
    .format('MM-DD HH:mm:ss')
  }
}
