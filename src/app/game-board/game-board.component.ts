import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameCanvasComponent} from "./game-canvas/game-canvas.component";
import {GameScoreComponent} from "./game-score/game-score.component";
import {GameTimerComponent} from "./game-timer/game-timer.component";
import {gameBoardAnimation} from "./game-board.animation";
import {ChengyuCharElement, GameBoardService} from "./game-board.service";
import {map, Observable, Subject, takeUntil, tap} from "rxjs";
import {HanziComponent} from "./hanzi/hanzi.component";
import {HotkeyDirective} from "./hotkey.directive";
import {GameTimerService} from "./game-timer/game-timer.service";
import {GameScoreService} from "./game-score/game-score.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-game-board',
  standalone: true,
  animations: gameBoardAnimation,
  imports: [
    CommonModule,
    FormsModule,
    GameCanvasComponent,
    GameScoreComponent,
    GameTimerComponent,
    ReactiveFormsModule,
    HanziComponent,
    HotkeyDirective,
  ],
  providers: [GameBoardService, GameScoreService, GameTimerService],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements AfterViewInit, OnDestroy {
  private destroySubject = new Subject<void>();

  currentChengyu$!: Observable<string>;
  selectedChengyuChars$!: Observable<string[]>;

  correctChengyu = false;
  incorrectChengyu = false;

  checkboxes = {
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false
  };

  @ViewChild(GameCanvasComponent)
  canvasComponent!: GameCanvasComponent;

  constructor(private gameBoardService: GameBoardService, private router: Router) {
    this.currentChengyu$ = this.gameBoardService.currentChengyu$;

    this.selectedChengyuChars$ = this.gameBoardService.selectedChengyuChars$.pipe(
      tap(chengyuChars => {
        this.updateAllCheckboxes(chengyuChars);
        this.redrawLinesBetweenChengyuChars(chengyuChars);
      }),
      map(chengyuChars => chengyuChars.map(c => c.chengyuChar))
    );

    this.gameBoardService.isValidChengyu$.pipe(
      takeUntil(this.destroySubject),
      tap(validChengyu => {
        if (validChengyu) {
          this.handleCorrectChengyu();
        } else {
          this.handleIncorrectChengyu();
        }
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => (this.gameBoardService.getNextChengyu()));
  }

  selectChengyuChar(chengyuChar: ChengyuCharElement) {
    this.gameBoardService.selectChengyuChar(chengyuChar);
  }

  skipChengyu() {
    this.gameBoardService.getNextChengyu();
  }

  onCorrectChengyuAnimationDone() {
    // TODO fix animation done callback being triggered on first load
    if (this.correctChengyu) {
      this.correctChengyu = false;
      this.gameBoardService.getNextChengyu();
    }
  }

  onIncorrectChengyuAnimationDone() {
    // TODO fix animation done callback being triggered on first load
    if (this.incorrectChengyu) {
      this.incorrectChengyu = false;
      this.gameBoardService.clearSelectedChengyuChars();
    }
  }

  private handleCorrectChengyu(): void {
    this.correctChengyu = true;
  }

  private handleIncorrectChengyu(): void {
    this.incorrectChengyu = true;
  }

  private redrawLinesBetweenChengyuChars(chengyuChars: ChengyuCharElement[]): void {
    this.canvasComponent?.clearCanvas();

    if (chengyuChars.length <= 1) {
      return;
    }

    const elementIds = chengyuChars.map(v => v.elementId);
    for (let i = 0; i < elementIds.length - 1; i++) {
      const startElement = document.getElementById(elementIds[i]);
      const endElement = document.getElementById(elementIds[i + 1]);

      if (startElement && endElement) {
        this.canvasComponent.drawLine(startElement, endElement);
      }
    }
  }

  private updateAllCheckboxes(selectedChars: ChengyuCharElement[]) {
    // @ts-ignore
    Object.keys(this.checkboxes).forEach(key => this.checkboxes[key] = false);

    // @ts-ignore
    selectedChars.forEach(char => this.checkboxes[char.elementId] = true);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
