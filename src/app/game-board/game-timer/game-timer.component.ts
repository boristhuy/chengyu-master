import {Component, OnDestroy} from '@angular/core';
import {Subscription, tap} from "rxjs";
import {GameTimerService} from "./game-timer.service";

@Component({
  selector: 'app-game-timer',
  standalone: true,
  imports: [],
  templateUrl: './game-timer.component.html',
  styleUrl: './game-timer.component.scss'
})
export class GameTimerComponent implements OnDestroy {
  strokeDashoffset = 0;
  strokeTransitionEnabled = false;

  timerSubscription!: Subscription;

  constructor(private gameTimerService: GameTimerService) {
    this.timerSubscription = this.gameTimerService.timerValue$.pipe(
      tap(timerData => {
        const {timeLeft, duration} = timerData;

        if (timeLeft == duration) {
          this.strokeTransitionEnabled = false;
          this.strokeDashoffset = 0;
          setTimeout(() => this.strokeTransitionEnabled = true, 100);
        }

        this.updateStrokeDashoffset(timeLeft, duration);
      })
    ).subscribe();
  }

  updateStrokeDashoffset(timeLeft: number, duration: number) {
    const pathLength = 923.63;
    const progress = 1 - (timeLeft / duration);
    const offset = Math.min(pathLength, Math.abs(progress * pathLength));

    this.strokeDashoffset = -offset;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
