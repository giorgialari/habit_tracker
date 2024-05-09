import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }
  //BehaviourSubject che passa un oggetto con {number, month}
  private dateSource = new BehaviorSubject<any>({});
  selectedDate = this.dateSource.asObservable();

  changeDate(date: any) {
    this.dateSource.next(date);
  }

}
