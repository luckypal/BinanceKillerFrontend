import { Injectable } from '@angular/core';
import { BinanceService } from 'src/app/services/binance.service';
import { BinanceArticle, NewCoin } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private readonly binanceService: BinanceService,
  ) { }

  async requestPermission() {
    let permission = await Notification.requestPermission();
    console.log('permission', permission);
    if (permission == 'granted') {
      // new Notification('Scouting for Sniper.', {
      //   body: 'We found a new coin. ()',
      //   icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/256/Binance-Coin-icon.png'
      // });

      this.subscribeNewCoin();
    }
  }

  subscribeNewCoin() {
    this.binanceService.getNewCoin()
      .subscribe((data) => {
        const { article, newCoin } = data as { article: BinanceArticle, newCoin: NewCoin };

        let title = `${newCoin.title} (${newCoin.symbol})`
        const notification = new Notification(title, {
          body: article.title,
          icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/256/Binance-Coin-icon.png',
        });
        newCoin.title = newCoin.title.replace(/ /g, '-');
        notification.addEventListener('click', () => {
          const marketLink = `https://coinmarketcap.com/currencies/${newCoin.title}`;
          window.open(marketLink, '_blank');
        })
        setTimeout(() => {
          const binanceLink = `https://www.binance.com/en/support/announcement/${article.code}`;
          window.open(binanceLink, 'BinanceKiller');
        }, 500)
      })
  }
}
