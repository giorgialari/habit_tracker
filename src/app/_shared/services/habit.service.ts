import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Habit } from '../../habit-dashboard/_models/habits.interface';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as moment from 'moment';

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

  public async setHabits(newHabit: Habit, dates: Date[]): Promise<void> {
    await this.waitForStorageReady();
    const habits: Habit[] = await this.getAllHabits();

    for (const date of dates) {
      const habitDate = moment(date).startOf('day').format('YYYY-MM-DD'); // Formatta la data come stringa YYYY-MM-DD
      const habitToSave = { ...newHabit, startDate: habitDate, id: this.generateUniqueId() }; // Genera id univoco

      habits.push(habitToSave); // Aggiungi la nuova abitudine configurata alla lista delle abitudini
    }
    await this._storage?.set('user_habits', habits); // Salva l'array aggiornato nello storage
  }

  private generateUniqueId(): number {
    return Date.now() + Math.floor(Math.random() * 1000); // Genera un id univoco
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

  public generateRepetitionDates(startDate: Date, frequency: string[], endDate?: Date): Date[] {
    const dates: Date[] = [];
    const dayMap: any = {
      'mon': 1,
      'tue': 2,
      'wed': 3,
      'thu': 4,
      'fri': 5,
      'sat': 6,
      'sun': 0
    };

    let currentDate = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    while (!end || currentDate <= end) {
      if (frequency.includes(Object.keys(dayMap).find(key => dayMap[key] === currentDate.getDay())!)) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }


}
