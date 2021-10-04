import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {

  constructor(
    private httpClient: HttpClient
  ) { }

  async getSymbols(): Promise<string[]> {
    const { serverUrl } = environment;
    const symbols = await this.httpClient.get(`${serverUrl}/symbols`).toPromise();
    return symbols as string[];
  }
}
