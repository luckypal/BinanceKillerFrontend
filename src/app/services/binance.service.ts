import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  selectedSymbol: string = '';
  activePrice: string = '';

  constructor(
    private httpClient: HttpClient
  ) {
    const { updateInterval } = environment;
    interval(updateInterval).subscribe(x => {
      if (!this.selectedSymbol) return null;
      const { serverUrl } = environment;
      this.httpClient
        .get(`${serverUrl}/price/${this.selectedSymbol}`, {})
        .subscribe((data) => {
          this.activePrice = data as string;
        })
      return null;
    });
  }

  async getSymbols(): Promise<string[]> {
    const { serverUrl } = environment;
    const symbols = await this.httpClient.get(`${serverUrl}/symbols`).toPromise();
    return symbols as string[];
  }

  getPrices(symbol: string) {
    this.selectedSymbol = symbol;

    // this.httpClient.post(`${serverUrl}/price/${symbol}`, {}, {
    //   observe: 'events',
    //   reportProgress: true,
    //   responseType: 'json',
    // }).pipe(map(data => {
    //   console.log('AAAAAA', data)
    //   return data;
    // })).subscribe(data => {
    //   console.log('DATA', data);
    // });
  }
}
