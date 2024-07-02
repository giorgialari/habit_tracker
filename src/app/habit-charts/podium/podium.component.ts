import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-podium',
  templateUrl: './podium.component.html',
  styleUrls: ['./podium.component.scss']
})
export class PodiumComponent implements OnInit, OnChanges {

  @Input() primo: any;
  @Input() secondo: any;
  @Input() terzo: any;

  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
  }
}
