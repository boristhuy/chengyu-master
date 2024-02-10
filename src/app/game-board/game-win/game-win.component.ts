import {Component, inject} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-game-win',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './game-win.component.html',
})
export class GameWinComponent {
  activeModal = inject(NgbActiveModal);

  score = 0;
}
