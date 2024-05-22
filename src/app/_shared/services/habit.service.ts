import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Habit } from '../../habit-dashboard/_models/habits.interface';
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

  public async setHabit(habit: Habit): Promise<void> {
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
    const habits: Habit[] = await this.getAllHabits();
    return habits.find(h => h.id === id) || null;
  }

  public async removeHabit(id: number): Promise<void> {
    let habits: Habit[] = await this.getAllHabits();
    habits = habits.filter(h => h.id !== id);
    await this._storage?.set('user_habits', habits);
  }

  public async getAllHabits(): Promise<Habit[]> {
    return await this._storage?.get('user_habits') || [];
  }
}
