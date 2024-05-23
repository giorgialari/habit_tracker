import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Habit } from '../../habit-dashboard/_models/habits.interface';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private _storage: Storage | null = null;
  private storageReady = new BehaviorSubject<boolean>(false);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.storageReady.next(true);
  }

  private async waitForStorageReady() {
    await this.storageReady.pipe(
      filter(ready => ready),
      take(1)
    ).toPromise();
  }

  public getStorageReady() {
    return this.storageReady.asObservable();
  }

  public async setHabit(habit: Habit): Promise<void> {
    await this.waitForStorageReady();
    const habits: Habit[] = await this.getAllHabits();
    const index = habits.findIndex(h => h.id === habit.id);
    if (index > -1) {
      habits[index] = habit; // Update existing habit
    } else {
      habits.push(habit); // Add new habit
    }
    await this._storage?.set('user_habits', habits);
  }

  public async getHabit(id: number): Promise<Habit | null> {
    await this.waitForStorageReady();
    const habits: Habit[] = await this.getAllHabits();
    return habits.find(h => +h.id === +id) || null;
  }

  public async removeHabit(id: number): Promise<void> {
    await this.waitForStorageReady();
    let habits: Habit[] = await this.getAllHabits();
    habits = habits.filter(h => +h.id !== +id);
    await this._storage?.set('user_habits', habits);
  }

  public async getAllHabits(): Promise<Habit[]> {
    await this.waitForStorageReady();
    return await this._storage?.get('user_habits') || [];
  }
}
