import {Component, OnDestroy} from '@angular/core';
import {Subscription, tap} from "rxjs";
import {GameTimerService} from "./game-timer.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {flickerAnimation} from "./game-timer.animation";

@Component({
  selector: 'app-game-timer',
  standalone: true,
  imports: [],
  animations: [
    trigger('flicker', [
      transition('* <=> *', useAnimation(flickerAnimation, {
        params: {timing: '0.2s'}
      }))
    ])
  ],
  templateUrl: './game-timer.component.html',
  styleUrl: './game-timer.component.scss'
})
export class GameTimerComponent implements OnDestroy {
  strokeDashoffset = 0;
  strokeTransitionEnabled = false;

  flicker: boolean = false;

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
        this.updateFlickerAnimation(timeLeft, duration);
      })
    ).subscribe();
  }

  updateStrokeDashoffset(timeLeft: number, duration: number) {
    const pathLength = 923.63;
    const progress = 1 - (timeLeft / duration);
    const offset = Math.min(pathLength, Math.abs(progress * pathLength));

    this.strokeDashoffset = -offset;
  }

  updateFlickerAnimation(timeLeft: number, duration: number) {
    const flickerThreshold = duration * 0.2;
    if (timeLeft <= flickerThreshold) {
      this.flicker = !this.flicker;
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
