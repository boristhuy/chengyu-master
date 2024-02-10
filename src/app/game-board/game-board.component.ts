import {AfterViewInit, Component, OnDestroy, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameCanvasComponent} from "./game-canvas/game-canvas.component";
import {GameScoreComponent} from "./game-score/game-score.component";
import {GameTimerComponent} from "./game-timer/game-timer.component";
import {gameBoardAnimation} from "./game-board.animation";
import {GameBoardService} from "./game-board.service";
import {map, Observable, Subject, takeUntil, tap} from "rxjs";
import {HanziComponent, HanziElement} from "./hanzi/hanzi.component";
import {HotkeyDirective} from "./hotkey.directive";
import {GameTimerService} from "./game-timer/game-timer.service";
import {ChengyuComponent} from "./chengyu/chengyu.component";


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
    ChengyuComponent,
  ],
  providers: [GameBoardService, GameTimerService],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements AfterViewInit, OnDestroy {
  private destroySubject = new Subject<void>();

  currentChengyu$!: Observable<string>;
  selectedHanzis$!: Observable<string[]>;

  correctChengyu = false;
  incorrectChengyu = false;

  @ViewChildren(HanziComponent)
  hanziComponents!: QueryList<HanziComponent>;

  @ViewChild(GameCanvasComponent)
  canvasComponent!: GameCanvasComponent;

  gameScore$!: Observable<number>;

  constructor(private gameBoardService: GameBoardService) {
    this.currentChengyu$ = this.gameBoardService.currentChengyu$;

    this.selectedHanzis$ = this.gameBoardService.selectedHanzi$.pipe(
      tap(selectedHanzis => {
        this.refreshAllHanzis(selectedHanzis);
        this.refreshAllLinesBetweenHanzis(selectedHanzis);
      }),
      map(selectedHanzis => selectedHanzis.map(hanzi => hanzi.hanzi))
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

    this.gameScore$ = this.gameBoardService.gameScore$;
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => (this.gameBoardService.getNextChengyu()));
  }

  selectHanzi(hanzi: HanziElement) {
    this.gameBoardService.selectHanzi(hanzi);
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
      this.gameBoardService.clearSelectedHanzis();
    }
  }

  private handleCorrectChengyu(): void {
    this.correctChengyu = true;
  }

  private handleIncorrectChengyu(): void {
    this.incorrectChengyu = true;
  }

  private refreshAllLinesBetweenHanzis(hanziElements: HanziElement[]): void {
    this.canvasComponent?.clearCanvas();

    if (hanziElements.length <= 1) {
      return;
    }

    const elementIds = hanziElements.map(v => v.elementId);
    for (let i = 0; i < elementIds.length - 1; i++) {
      const startElement = document.getElementById(elementIds[i]);
      const endElement = document.getElementById(elementIds[i + 1]);

      if (startElement && endElement) {
        this.canvasComponent.drawLine(startElement, endElement);
      }
    }
  }

  private refreshAllHanzis(hanziElements: HanziElement[]) {
    this.hanziComponents?.forEach(hanziComponent => hanziComponent.checked = false);

    hanziElements.forEach(hanziElement => {
      const matchingComponent = this.hanziComponents.find(component => component.id === hanziElement.elementId);
      if (matchingComponent) {
        matchingComponent.checked = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
