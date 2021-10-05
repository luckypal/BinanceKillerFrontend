import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  async auth(secretKey: string): Promise<boolean> {
    const { apiUrl } = environment;
    const { result } = (await this.httpClient.post(`${apiUrl}/auth`, { secretKey }).toPromise()) as any;
    return result as boolean;
  }
}
