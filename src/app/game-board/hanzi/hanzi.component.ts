import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HotkeyDirective} from "../hotkey.directive";
import {ChengyuCharElement} from "../game-board.service";

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
  checked!: boolean;

  @Input()
  hotkey!: string;

  @Input()
  value!: string;

  @Output()
  clicked = new EventEmitter<ChengyuCharElement>();

  onClicked(event: Event) {
    event.preventDefault();
    this.clicked.next({chengyuChar: this.value, elementId: this.id})
  }
}
