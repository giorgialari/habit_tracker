import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
})
export class ConfirmDeleteModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() hide = new EventEmitter();
  deleteFutureEvents: boolean = false;
  @Output() deleteFutureEventsEmitter = new EventEmitter();
  confirmDelete:  boolean = false;
  @Output() confirmDeleteEventEmitter = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.confirmDelete = false;
    this.confirmDeleteEventEmitter.emit(this.confirmDelete);

    this.deleteFutureEvents = false;
    this.deleteFutureEventsEmitter.emit(this.deleteFutureEvents);
  }

  ngOnChanges() {
    if (this.visible) {
      setTimeout(() => {
        const icon = document.querySelector('.warning-icon');
        icon?.classList.add('shake');

        // Rimuove l'animazione dopo che è stata eseguita per permettere future animazioni
        icon?.addEventListener(
          'animationend',
          () => {
            icon.classList.remove('shake');
          },
          { once: true }
        );
      }, 100);
    }
  }

  onChangeDeleteFutureEvents(event: boolean) {
    this.deleteFutureEventsEmitter.emit(event);
  }

  onDelete() {
    this.confirmDelete = true;
    this.confirmDeleteEventEmitter.emit(this.confirmDelete);
    this.onHide();
  }

  onHide() {
    this.visible = false;
    this.hide.emit(this.visible);
  }
}
