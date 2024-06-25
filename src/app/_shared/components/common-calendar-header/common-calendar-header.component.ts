import { Component, Input, OnInit } from '@angular/core';
import { CustomCalendarView } from '../../models/enum';

@Component({
  selector: 'common-calendar-header',
  templateUrl: './common-calendar-header.component.html',
  styleUrls: ['./common-calendar-header.component.scss'],
})
export class CommonCalendarHeaderComponent implements OnInit {
  @Input() viewDate: Date = new Date();
  @Input() view: CustomCalendarView = CustomCalendarView.Day;

  constructor() {}
  ngOnInit() {}
}
