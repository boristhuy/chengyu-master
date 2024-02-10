import {Component, inject} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AsyncPipe} from "@angular/common";
import {GameScoreComponent} from "../game-score/game-score.component";

@Component({
  selector: 'app-game-win',
  standalone: true,
  imports: [
    AsyncPipe,
    GameScoreComponent
  ],
  templateUrl: './game-win.component.html',
  styleUrl: './game-win.component.scss'
})
export class GameWinComponent {
  activeModal = inject(NgbActiveModal);

  score = 0;
}
