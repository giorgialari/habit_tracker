import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { RefreshService } from '../../services/refresh-trigger.service';

@Component({
  selector: 'common-navigation-header',
  templateUrl: './common-navigation-header.component.html',
  styleUrls: ['./common-navigation-header.component.scss'],
})
export class CommonNavigationHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Output() back = new EventEmitter();
  constructor(
    private location: Location,
    private refreshService: RefreshService
  ) {}
  ngOnInit() {}
  goBack() {
    this.location.back();
    this.triggerRefresh();
  }

  triggerRefresh() {
    this.refreshService.forceRefresh();
  }

  backEmitter() {
    this.back.emit();
  }
}
