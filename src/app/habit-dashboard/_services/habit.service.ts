import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Habit } from '../_models/habits.interface';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    console.log('Storage initialized:', this._storage);
  }

  public setHabit(habit: Habit) {
    this._storage?.set(habit.id.toString(), habit);
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
      console.log('getAllHabits', this.storage);
      await this._storage.forEach((value, key, iterationNumber) => {
        console.log('Value:', value);
        habits.push(value);
        console.log(value);
      });
    }
    return habits;
  }

}
