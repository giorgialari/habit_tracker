import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TabUserOrderService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getTabOrder() {
    return this._storage?.get('user_custom_setup');
  }

  async setTabOrder(tabs: any[]) {
    return this._storage?.set('user_custom_setup', tabs);
  }
}