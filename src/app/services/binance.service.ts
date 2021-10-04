import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { interval } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  selectedSymbol: string = '';
  activePrice: number = 0;

  constructor(
    private httpClient: HttpClient,
    private socket: Socket
  ) { }

  async getSymbols(): Promise<string[]> {
    const { apiUrl } = environment;
    const symbols = await this.httpClient.get(`${apiUrl}/symbols`).toPromise();
    return symbols as string[];
  }

  setSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    this.socket.emit('symbol', { symbol });
  }

  getPrice() {
    return this.socket.fromEvent('price');
  }
}
