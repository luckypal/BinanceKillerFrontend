import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { News } from 'src/app/models/news.model';

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

  async getNews(): Promise<News[]> {
    const { apiUrl } = environment;
    const data = await this.httpClient.get(`${apiUrl}/news`).toPromise();
    return data as News[];
  }
}
