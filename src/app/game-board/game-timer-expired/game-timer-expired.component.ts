import {Component, inject} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ChengyuDefinition} from "../game-board.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-game-timer-expired',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './game-timer-expired.component.html'
})
export class GameTimerExpiredComponent {
  activeModal = inject(NgbActiveModal);

  chengyu!: ChengyuDefinition;
}
