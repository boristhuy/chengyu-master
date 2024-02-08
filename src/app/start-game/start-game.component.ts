import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AsyncPipe, DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-start-game',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    DecimalPipe
  ],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.scss'
})
export class StartGameComponent {

  constructor(private router: Router) {
  }

  startGame() {
    this.router.navigate(['/game']);
  }
}
