import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Output() back = new EventEmitter();
  constructor(private location: Location) {}
  ngOnInit() {}
  goBack() {
    this.location.back();
  }

  backEmitter() {
    this.back.emit();
  }
}
