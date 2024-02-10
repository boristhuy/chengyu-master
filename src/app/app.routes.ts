import {Routes} from '@angular/router';
import {GameBoardComponent} from "./game-board/game-board.component";
import {StartGameComponent} from "./start-game/start-game.component";

export const routes: Routes = [
  {
    path: '',
    component: StartGameComponent
  },
  {
    path: 'game',
    component: GameBoardComponent,
    data: {reloadOnSameRoute: true}
  }
];
