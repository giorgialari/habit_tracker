import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { HabitService } from './_shared/services/habit.service';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, filter, take } from 'rxjs';
import { BETA_HABITS, BETA_USER_SETUP_DATA } from './_shared/data/beta_habits';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private _storage: Storage | null = null;
  private storageReady = new BehaviorSubject<boolean>(false);

  constructor(
    private primengConfig: PrimeNGConfig,
    private habitService: HabitService,
    private storage: Storage
  ) {
    this.init();
  }
  async init() {
    this._storage = await this.storage.create();
    this.storageReady.next(true);
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.betaSetup();

    this.betaDataHabits();
  }
  private async waitForStorageReady() {
    await this.storageReady
      .pipe(
        filter((ready) => ready),
        take(1)
      )
      .toPromise();
  }

  async betaSetup() {
    await this.waitForStorageReady();
    const setup = BETA_USER_SETUP_DATA;

    await this._storage?.set('user_setup_data', setup);
  }

  async betaDataHabits() {
    await this.waitForStorageReady();
    const habits = BETA_HABITS;

    await this._storage?.set('user_habits', habits);
  }
}
