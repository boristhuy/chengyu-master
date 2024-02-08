import {inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, delay, ReplaySubject, Subject, takeUntil, tap} from "rxjs";
import {GameTimerService} from "./game-timer/game-timer.service";
import {GameScoreService} from "./game-score/game-score.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GameTimesUpComponent} from "./game-times-up/game-times-up.component";
import {Router} from "@angular/router";

@Injectable()
export class GameBoardService implements OnDestroy {
  private destroySubject = new Subject<void>();

  private modalService = inject(NgbModal);

  chengyus = [
    "学而不厌",
    "温故知新",
    "好学不倦",
    "勤学好问",
    "学无止境",
  ];

  private currentChengyuSubject = new BehaviorSubject('');
  currentChengyu$ = this.currentChengyuSubject.asObservable().pipe(
    tap(() => this.gameTimerService.startTimer(10))
  );

  private selectedChengyuCharsSubject = new BehaviorSubject<ChengyuCharElement[]>([]);
  selectedChengyuChars$ = this.selectedChengyuCharsSubject.asObservable();

  private isValidChengyuSubject = new ReplaySubject(1);
  isValidChengyu$ = this.isValidChengyuSubject.asObservable().pipe(
    delay(500),
    tap(valid => {
      if (valid) {
        this.gameTimerService.stopTimer();
        this.gameScoreService.computeScore(100, this.gameTimerService.getTimeLeft());
      }
    })
  );

  private currentChengyuIndex = -1;

  constructor(private gameTimerService: GameTimerService, private gameScoreService: GameScoreService, private router: Router) {
    gameTimerService.timerExpired$.pipe(
      takeUntil(this.destroySubject),
      tap(() => this.gameTimerExpired())
    ).subscribe();
  }

  getNextChengyu() {
    this.clearSelectedChengyuChars();

    if (this.isLastChengyu()) {
      return;
    }

    this.currentChengyuIndex++;
    this.currentChengyuSubject.next(this.shuffleChengyu(this.chengyus[this.currentChengyuIndex]));
  }

  selectChengyuChar(selectedChengyuChar: ChengyuCharElement) {
    this._selectChengyuChar(selectedChengyuChar);
    this.validateChengyu();
  }

  clearSelectedChengyuChars() {
    this.selectedChengyuCharsSubject.next([]);
  }

  private gameTimerExpired() {
    const modalRef = this.modalService.open(GameTimesUpComponent, {
      centered: true,
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
      modalDialogClass: 'app-modal-container',
      backdropClass: 'app-modal-backdrop'
    });

    modalRef.result.then(
      (result) => {
        if (result === 'play') {
          this.restartGame();
        }
      }
    );
  }

  private restartGame() {
    this.router.navigate(['/game']);
  }

  private validateChengyu() {
    const currentChengyuChars = this.selectedChengyuCharsSubject.value;
    if (currentChengyuChars.length === 4) {
      const validChengyu = this.isValidChengyu();
      this.isValidChengyuSubject.next(validChengyu);
    }
  }

  private _selectChengyuChar(chengyuChar: ChengyuCharElement) {
    let currentChengyuChars = this.selectedChengyuCharsSubject.value;
    const existingChengyuCharIndex = currentChengyuChars.findIndex(c => c.elementId === chengyuChar.elementId);

    if (existingChengyuCharIndex === -1) {
      currentChengyuChars.push(chengyuChar);
    } else if (existingChengyuCharIndex === currentChengyuChars.length - 1) {
      currentChengyuChars.pop();
    }

    this.selectedChengyuCharsSubject.next(currentChengyuChars);
  }

  private isValidChengyu() {
    const currentChengyuChars = this.selectedChengyuCharsSubject.value;
    const correctChengyu = this.chengyus[this.currentChengyuIndex];

    return correctChengyu === currentChengyuChars.map(c => c.chengyuChar).join('');
  }

  private isLastChengyu() {
    return this.currentChengyuIndex === this.chengyus.length - 1;
  }

  private shuffleChengyu(input: string): string {
    let characters = input.split('');
    for (let i = characters.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    return characters.join('');
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}

export interface ChengyuCharElement {
  chengyuChar: string;
  elementId: string;
}
