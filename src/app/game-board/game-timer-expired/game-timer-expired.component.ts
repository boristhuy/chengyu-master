import {Component, inject} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-game-timer-expired',
  standalone: true,
  imports: [],
  templateUrl: './game-timer-expired.component.html',
  styleUrl: './game-timer-expired.component.scss'
})
export class GameTimerExpiredComponent {
  activeModal = inject(NgbActiveModal);
}
