import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Order } from '../models/order.model';
import { LastOrderStatus } from './orders.service';

const STORAGE_KEY = 'data';
const SECRET_KEY = 'secretKey';

export interface StorageData {
  symbol: string;
  leverage: number;
  amount: number;
  lastOrder: LastOrderStatus;
  orders: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(
    @Inject(LOCAL_STORAGE)
    private storage: StorageService) { }

  public load(): StorageData {
    const data = this.storage.get(STORAGE_KEY) || null;
    return data;
  }

  public save(data: StorageData) {
    this.storage.set(STORAGE_KEY, data);
  }

  public saveSecretKey(secretKey: string) {
    this.storage.set(SECRET_KEY, secretKey);
  }

  public getSecretKey(): string {
    return this.storage.get(SECRET_KEY) || null;
  }
}