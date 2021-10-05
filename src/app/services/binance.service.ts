import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  selectedSymbol: string = '';
  activePrice: number = 0;

  constructor(
    private httpClient: HttpClient,
    private socket: Socket,
    private readonly storageService: LocalStorageService
  ) { }

  async getSymbols(): Promise<string[]> {
    const { apiUrl } = environment;
    const symbols = await this.httpClient.get(`${apiUrl}/symbols`).toPromise();
    return symbols as string[];
  }

  setSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    const secretKey = this.storageService.getSecretKey();
    this.socket.emit('symbol', { symbol, secretKey });
  }

  getPrice() {
    return this.socket.fromEvent('price');
  }
}
