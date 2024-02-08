import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[hotkey]',
  standalone: true
})
export class HotkeyDirective {

  @Input()
  hotkey!: string;

  constructor(private el: ElementRef) {
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.hotkey) {
      if (event.code === this.hotkey.trim()) {
        event.preventDefault();
        this.el.nativeElement.click();
      }
    }
  }

}
