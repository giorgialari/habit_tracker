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

  async ready(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
  }

  async getTabOrder() {
    await this.ready();
    return this._storage?.get('user_custom_setup_tabs');
  }

  async setTabOrder(tabs: any[]) {
    await this.ready();
    return this._storage?.set('user_custom_setup_tabs', tabs);
  }
}
