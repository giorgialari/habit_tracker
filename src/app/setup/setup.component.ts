import { Component, OnInit } from '@angular/core';
import { IContent, IStep } from './stepper/models/stepper.interface';
import { contents, steps } from './stepper/models/mock';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
  _steps: IStep[] = steps;
  _contents: IContent = contents;
  constructor() { }

  ngOnInit() { }

}
