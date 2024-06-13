import { Directive, HostBinding, Input, HostListener, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appShakeIfInvalid]'
})
export class ShakeIfInvalidDirective implements OnInit {
  @Input() appShakeIfInvalid: boolean = false;
  shakeClass: boolean = false;

  constructor(@Optional() @Self() private control: NgControl) {}

  ngOnInit(): void {
    // Assicurati di resettare lo stato ogni volta che appShakeIfInvalid cambia.
    // Ciò assicura che l'animazione possa essere riattivata.
    this.resetShake();
  }

  ngOnChanges(): void {
    this.resetShake();
  }

  @HostBinding('class.shake-animation') get shake() {
    // Aggiungi e rimuovi la classe di animazione per triggerare l'animazione
    return this.shakeClass && this.control && this.control.invalid;
  }

  private resetShake() {
    if (this.appShakeIfInvalid && this.control && this.control.invalid) {
      this.shakeClass = true;
      // Imposta un timeout per rimuovere la classe, permettendo l'animazione di ripetersi
      setTimeout(() => this.shakeClass = false, 820); // 820 ms dovrebbe essere leggermente più lungo della durata dell'animazione
    }
  }

  @HostListener('click')
  onClick() {
    this.resetShake();
  }
}
