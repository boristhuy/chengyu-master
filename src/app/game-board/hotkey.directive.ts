import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[hotkey]',
  standalone: true
})
export class HotkeyDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const hotkey = this.el.nativeElement.getAttribute('hotkey');
    if (hotkey) {
      if (event.code === hotkey.trim()) {
        event.preventDefault();
        this.el.nativeElement.click();
      }
    }
  }

}
