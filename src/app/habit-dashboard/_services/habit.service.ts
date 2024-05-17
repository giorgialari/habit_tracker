import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Habit } from '../_models/habits.interface';
import { BehaviorSubject } from 'rxjs';

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
  public getStorageReady() {
    return this.storageReady.asObservable();
  }
  public setHabit(habit: Habit) {
    this._storage?.set(habit.id.toString(), habit);
    this.getAllHabits();
  }

  public async getHabit(id: number): Promise<Habit | null> {
    try {
      return await this._storage?.get(id.toString());
    } catch (error) {
      console.error('Error fetching habit', error);
      return null;
    }
  }

  public async removeHabit(id: number) {
    await this._storage?.remove(id.toString());
  }

  public async getAllHabits(): Promise<Habit[]> {
    const habits: Habit[] = [];
    if (this._storage) {  // Assicurati che _storage non sia null
      await this._storage.forEach((value, key, iterationNumber) => {
        habits.push(value);
      });
    }
    return habits;
  }

}
