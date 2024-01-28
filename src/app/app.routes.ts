import {Routes} from '@angular/router';
import {GameBoardComponent} from "./game-board/game-board.component";
import {StartComponent} from "./start/start.component";

export const routes: Routes = [
  {
    path: 'start',
    component: StartComponent
  },
  {
    path: 'game',
    component: GameBoardComponent
  }
];
