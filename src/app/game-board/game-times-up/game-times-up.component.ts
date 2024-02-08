import {Component, inject} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-game-times-up',
  standalone: true,
  imports: [],
  templateUrl: './game-times-up.component.html',
  styleUrl: './game-times-up.component.scss'
})
export class GameTimesUpComponent {
  activeModal = inject(NgbActiveModal);
}
