import * as moment from 'moment';
import { Component, Input, OnInit } from '@angular/core';
import { News } from 'src/app/models/news.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  @Input('data')
  data?: News;

  constructor() { }

  ngOnInit(): void {
  }

  get link() {
    return `https://www.binance.com/en/support/announcement/${this.data?.id}`;
  }

  get innerData() {
    const dates: string[] = this.data?.data;
    return dates.map(date => {
      const fromNow = moment.utc(date).utcOffset(-5).fromNow();
      return `${date} (${fromNow})`;
    });
  }

  get createdAt() {
    const { createdAt } = this.data!;
    const date = moment(createdAt).format('YYYY-MM-DD HH:mm:ss');
    const fromNow = moment(createdAt).fromNow()
    return `${date} --- ${fromNow}`;
  }
}
