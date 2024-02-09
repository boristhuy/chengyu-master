import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HotkeyDirective} from "../hotkey.directive";

@Component({
  selector: 'app-hanzi',
  standalone: true,
  imports: [
    HotkeyDirective
  ],
  templateUrl: './hanzi.component.html',
  styleUrl: './hanzi.component.scss'
})
export class HanziComponent {
  @Input()
  id!: string;

  @Input()
  hotkey!: string;

  @Input()
  value!: string;

  @Output()
  clicked = new EventEmitter<HanziElement>();

  checked: boolean = false;

  onClicked(event: Event) {
    event.preventDefault();

    this.checked = !this.checked;

    this.clicked.next({hanzi: this.value, elementId: this.id})
  }
}

export interface HanziElement {
  hanzi: string;
  elementId: string;
}
