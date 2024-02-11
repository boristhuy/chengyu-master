import {inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, delay, ReplaySubject, Subject, takeUntil, tap} from "rxjs";
import {GameTimerService} from "./game-timer/game-timer.service";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {HanziElement} from "./hanzi/hanzi.component";
import {GameTimerExpiredComponent} from "./game-timer-expired/game-timer-expired.component";
import {GameWinComponent} from "./game-win/game-win.component";

@Injectable()
export class GameBoardService implements OnDestroy {
  private destroySubject = new Subject<void>();

  private modalService = inject(NgbModal);

  private chengyuDefinitions: ChengyuDefinition[] = [
    {
      hanzis: "学而不厌",
      pinyin: ["xué", "ér", "bù", "yàn"],
      meaning: "to have an insatiable desire to learn"
    },
    {
      hanzis: "温故知新",
      pinyin: ["wēn", "gù", "zhī", "xīn"],
      meaning: "learning from the past"
    },
    {
      hanzis: "好学不倦",
      pinyin: ["hào", "xué", "bù", "juàn"],
      meaning: "be never tired of learning"
    },
    {
      hanzis: "勤学好问",
      pinyin: ["qín", "xué", "hǎo", "wèn"],
      meaning: "diligent in learning and eager to ask questions"
    },
    {
      hanzis: "学无止境",
      pinyin: ["xué", "wú", "zhǐ", "jìng"],
      meaning: "there is no end to learning"
    },
  ];

  private chengyus = this.chengyuDefinitions.map(c => c.hanzis);

  private currentChengyuSubject = new BehaviorSubject('');
  currentChengyu$ = this.currentChengyuSubject.asObservable().pipe(
    tap(() => this.gameTimerService.startTimer(15))
  );

  private selectedHanzisSubject = new BehaviorSubject<HanziElement[]>([]);
  selectedHanzi$ = this.selectedHanzisSubject.asObservable();

  private isValidChengyuSubject = new ReplaySubject(1);
  isValidChengyu$ = this.isValidChengyuSubject.asObservable().pipe(
    delay(500),
    tap(valid => {
      if (valid) {
        this.computeScore(100, this.gameTimerService.getTimeLeft());
      }
    })
  );

  private isSkippedChengyuSubject = new ReplaySubject(1);
  isSkippedChengyu$ = this.isSkippedChengyuSubject.asObservable();

  private gameScoreSubject = new BehaviorSubject(0);
  gameScore$ = this.gameScoreSubject.asObservable();

  private currentChengyuIndex = -1;

  constructor(private gameTimerService: GameTimerService, private router: Router) {
    gameTimerService.timerExpired$.pipe(
      takeUntil(this.destroySubject),
      delay(500),
      tap(() => this.handleGameTimerExpired())
    ).subscribe();
  }

  getNextChengyu() {
    if (this.isLastChengyu()) {
      this.handleGameEnd();
      return;
    }

    this.clearSelectedHanzis();

    this.currentChengyuIndex++;
    this.currentChengyuSubject.next(this.shuffleChengyu(this.chengyus[this.currentChengyuIndex]));
  }

  skipChengyu() {
    if (this.isLastChengyu()) {
      this.handleGameEnd();
      return;
    }

    this.clearSelectedHanzis();

    this.gameTimerService.stopTimer();

    this.isSkippedChengyuSubject.next(true);
  }

  selectHanzi(hanzi: HanziElement) {
    this._selectHanzi(hanzi);
    this.validateChengyu();
  }

  clearSelectedHanzis() {
    this.selectedHanzisSubject.next([]);
  }

  private handleGameTimerExpired() {
    const modalRef = this.modalService.open(GameTimerExpiredComponent, modalOptions);
    modalRef.componentInstance.chengyu = this.chengyuDefinitions[this.currentChengyuIndex];

    modalRef.result.then((result) => {
        if (result === 'play') {
          this.restartGame();
        }

        if (result === 'quit') {
          this.quitGame();
        }
      }
    );
  }

  private handleGameEnd() {
    const modalRef = this.modalService.open(GameWinComponent, modalOptions);
    modalRef.componentInstance.score = this.gameScoreSubject.getValue();

    modalRef.result.then((result) => {
        if (result === 'play') {
          this.restartGame();
        }

      if (result === 'quit') {
        this.quitGame();
      }
      }
    );
  }

  private restartGame() {
    this.router.navigate(['/game']);
  }

  private quitGame() {
    this.router.navigate(['/']);
  }

  private validateChengyu() {
    const selectedHanzis = this.selectedHanzisSubject.value;
    if (selectedHanzis.length === 4) {
      const validChengyu = this.isValidChengyu();
      if (validChengyu) {
        this.gameTimerService.stopTimer();
      }

      this.isValidChengyuSubject.next(validChengyu);
    }
  }

  private _selectHanzi(hanziElement: HanziElement) {
    let selectedHanzis = this.selectedHanzisSubject.value;
    const existingHanziIndex = selectedHanzis.findIndex(hanzi => hanzi.elementId === hanziElement.elementId);

    if (existingHanziIndex === -1) {
      selectedHanzis.push(hanziElement);
    } else if (existingHanziIndex === selectedHanzis.length - 1) {
      selectedHanzis.pop();
    }

    this.selectedHanzisSubject.next(selectedHanzis);
  }

  private isValidChengyu() {
    const selectedHanzis = this.selectedHanzisSubject.value;
    const correctChengyu = this.chengyus[this.currentChengyuIndex];

    return correctChengyu === selectedHanzis.map(hanzi => hanzi.hanzi).join('');
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

  private computeScore(basePoint: number, timeLeft: number): void {
    const currentScore = this.gameScoreSubject.getValue();

    const timeBonus = this.computeTimeBonus(timeLeft);
    const addedScore = basePoint + timeBonus;

    this.gameScoreSubject.next(currentScore + addedScore);
  }

  private computeTimeBonus(remainingTime: number): number {
    return remainingTime * 10;
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}

const modalOptions: NgbModalOptions = {
  centered: true,
  size: 'sm',
  backdrop: 'static',
  keyboard: false,
  modalDialogClass: 'modal-container',
  backdropClass: 'modal-backdrop'
};

export interface ChengyuDefinition {
  hanzis: string;
  pinyin: string[];
  meaning: string;
}
