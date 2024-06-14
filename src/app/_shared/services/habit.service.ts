import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Habit } from '../../habit-dashboard/_models/habits.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private _storage: Storage | null = null;
  private storageReady = new BehaviorSubject<boolean>(false);
  private newHabitAdded = new Subject<void>();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.storageReady.next(true);
  }

  private async waitForStorageReady() {
    await this.storageReady
      .pipe(
        filter((ready) => ready),
        take(1)
      )
      .toPromise();
  }

  public getStorageReady() {
    return this.storageReady.asObservable();
  }

  public async setHabit(habit: Habit): Promise<void> {
    await this.waitForStorageReady();
    const habits: Habit[] = await this.getAllHabits();
    const index = habits.findIndex((h) => h.id === habit.id);
    if (index > -1) {
      habits[index] = habit; // Update existing habit
    } else {
      habits.push(habit); // Add new habit
    }
    await this._storage?.set('user_habits', habits);
  }

  public async setHabits(
    newHabit: Habit,
    dates: { start: Date; end: Date }[]
  ): Promise<void> {
    await this.waitForStorageReady();
    const habits: Habit[] = await this.getAllHabits();

    // Ogni "date" è ora un oggetto con "start" e "end"
    for (const date of dates) {
      const habitToSave: Habit = {
        ...newHabit,
        id: this.generateUniqueId(), // Genera un ID univoco per ogni evento
        startDate: date.start.toISOString(), // Imposta la data di inizio specifica per questo evento
        endDate: date.end.toISOString(), // Imposta la data di fine specifica per questo evento
      };

      habits.push(habitToSave); // Aggiungi la nuova abitudine configurata alla lista delle abitudini
    }

    await this._storage?.set('user_habits', habits); // Salva l'array aggiornato nello storage
  }

  //Cerca l'abituine con quell'id e la modifica in base ai dati ricevuti habitToEdit: Habit, dates: { start: Date, end: Date }[]
  public async editHabit(
    habitToEdit: Habit,
    dates: { start: Date; end: Date }[]
  ): Promise<void> {
    await this.waitForStorageReady();
    let habits: Habit[] = await this.getAllHabits();
    habits = habits.filter((h) => +h.id !== +habitToEdit.id); // Rimuovi la vecchia abitudine
    for (const date of dates) {
      const habitToSave: Habit = {
        ...habitToEdit,
        startDate: date.start.toISOString(), // Imposta la data di inizio specifica per questo evento
        endDate: date.end.toISOString(), // Imposta la data di fine specifica per questo evento
      };

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
    return habits.find((h) => +h.id === +id) || null;
  }

  public async removeHabit(id: number): Promise<void> {
    await this.waitForStorageReady();
    let habits: Habit[] = await this.getAllHabits();
    habits = habits.filter((h) => +h.id !== +id);
    await this._storage?.set('user_habits', habits);
  }

  public async removeFutureHabits(idMaster: number): Promise<void> {
    await this.waitForStorageReady();
    let habits: Habit[] = await this.getAllHabits();
    habits = habits.filter((h) => +h.idMaster !== +idMaster);
    await this._storage?.set('user_habits', habits);
  }

  public async getAllHabits(): Promise<Habit[]> {
    await this.waitForStorageReady();
    return (await this._storage?.get('user_habits')) || [];
  }
  public generateRepetitionDates(
    startDate: Date,
    frequency: string[],
    endDate?: Date
  ): { start: Date; end: Date }[] {
    if (!startDate || !endDate) {
      console.error('Both startDate and endDate must be provided');
      return []; // Assicurati che sia startDate che endDate siano definiti
    }

    const events: { start: Date; end: Date }[] = [];
    const dayMap: any = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };

    // Ottieni le ore e i minuti per startDate e endDate
    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();
    const startSeconds = startDate.getSeconds();

    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes();
    const endSeconds = endDate.getSeconds();

    // Converti tutto in secondi per un calcolo più facile
    const startTimeInSeconds =
      startHours * 3600 + startMinutes * 60 + startSeconds;
    const endTimeInSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;

    // Calcola la differenza in secondi
    const durationInSeconds = endTimeInSeconds - startTimeInSeconds;

    // Converti la durata in millisecondi
    const durationInMilliseconds = durationInSeconds * 1000;

    // Imposta il giorno corrente per il primo controllo
    let currentDay = new Date(startDate);

    // Scansiona ogni giorno tra startDate e endDate
    while (currentDay <= endDate) {
      if (
        frequency.includes(
          Object.keys(dayMap).find(
            (key) => dayMap[key] === currentDay.getDay()
          )!
        )
      ) {
        const eventStart = new Date(currentDay);
        eventStart.setHours(startHours, startMinutes, startSeconds, 0); // Imposta l'orario di inizio
        const eventEnd = new Date(
          eventStart.getTime() + durationInMilliseconds
        ); // Imposta l'orario di fine

        // Crea un oggetto evento e aggiungilo all'array
        events.push({ start: new Date(eventStart), end: new Date(eventEnd) });
      }
      currentDay.setDate(currentDay.getDate() + 1); // Vai al giorno successivo
    }

    return events;
  }

  public getNewHabitAdded() {
    return this.newHabitAdded.asObservable();
  }

  public notifyNewHabitAdded() {
    this.newHabitAdded.next();
  }
}
