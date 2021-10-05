import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Order } from '../models/order.model';

const STORAGE_KEY = 'orders';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(
    @Inject(LOCAL_STORAGE)
    private storage: StorageService) { }

  public load(): Order[] {
    const orders = this.storage.get(STORAGE_KEY) || [];
    return orders;
  }

  public save(orders: Order[]) {
    this.storage.set(STORAGE_KEY, orders);
  }
}