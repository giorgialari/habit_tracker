import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private storage: Storage) {
    this.init();
  }

  //BehaviourSubject che passa un oggetto con {number, month}
  private dateSource = new BehaviorSubject<any>({});
  selectedDate = this.dateSource.asObservable();

  changeDate(date: any) {
    this.dateSource.next(date);
  }

  //Salvo nello ionc storage il boolean di switchDayView per il calendario

  private _storage: Storage | null = null;


  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async ready(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
  }

  async getDayView() {
    await this.ready();
    return this._storage?.get('user_switch_day_view');
  }

  async setDayView(state: boolean) {
    await this.ready();
    return this._storage?.set('user_switch_day_view', state);
  }

}
