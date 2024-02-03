import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {finalize, Subscription, takeWhile, tap, timer} from "rxjs";

@Component({
  selector: 'chengyu-game-timer',
  standalone: true,
  imports: [],
  templateUrl: './game-timer.component.html',
  styleUrl: './game-timer.component.scss'
})
export class GameTimerComponent implements OnDestroy {
  timerInitialTime = 30;
  timerRemainingTime = this.timerInitialTime;

  timerSubscription!: Subscription;

  @Output()
  timerEnded = new EventEmitter<void>();

  strokeDashoffset = 0;
  strokeTransitionEnabled = false;

  startTimer() {
    this.strokeTransitionEnabled = false;
    this.strokeDashoffset = 0;

    setTimeout(() => {
      this.strokeTransitionEnabled = true;
      this.iniTimer();
    }, 100);
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  getRemainingTime(): number {
    return this.timerRemainingTime;
  }

  private iniTimer() {
    this.timerRemainingTime = this.timerInitialTime;

    this.timerSubscription = timer(0, 1000).pipe(
      takeWhile(() => this.timerRemainingTime > 0),
      tap(() => {
        this.timerRemainingTime--;
        this.updateStrokeDashoffset();
      }),
      finalize(() => this.timerEnded.next())
    ).subscribe();
  }

  private updateStrokeDashoffset() {
    const pathLength = 852;

    const offset = (1 - this.timerRemainingTime / this.timerInitialTime) * pathLength;

    this.strokeDashoffset = -offset;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
