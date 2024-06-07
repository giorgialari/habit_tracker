import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { RefreshService } from '../../services/refresh-trigger.service';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent implements OnInit {
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
