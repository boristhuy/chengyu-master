import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameCanvasComponent} from "./game-canvas/game-canvas.component";
import {GameScoreComponent} from "./game-score/game-score.component";
import {GameTimerComponent} from "./game-timer/game-timer.component";
import {gameBoardAnimation} from "./game-board.animation";
import {GameBoardService} from "./game-board.service";
import {distinctUntilChanged, filter, fromEvent, map, Observable, Subject, take, takeUntil, tap} from "rxjs";
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
  templateUrl: './game-board.component.html'
})
export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroySubject = new Subject<void>();

  currentChengyu$!: Observable<string>;
  selectedHanzis$!: Observable<string[]>;

  correctChengyu = false;
  incorrectChengyu = false;
  skippedChengyu = false;

  @ViewChildren(HanziComponent)
  hanziComponents!: QueryList<HanziComponent>;

  @ViewChild('gameContainer', {static: true})
  gameHanzisContainer!: ElementRef;

  @ViewChild(GameCanvasComponent)
  canvasComponent!: GameCanvasComponent;

  gameScore$!: Observable<number>;

  constructor(private gameBoardService: GameBoardService) {
  }

  ngOnInit() {
    this.currentChengyu$ = this.gameBoardService.currentChengyu$;

    this.subscribeToSelectedHanzis();
    this.subscribeToValidChengyu();
    this.subscribeToSkippedChengyu();
    this.subscribeToTouchMoveEvents();

    this.gameScore$ = this.gameBoardService.gameScore$;
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => (this.gameBoardService.getNextChengyu()));
  }

  selectHanzi(hanzi: HanziElement) {
    this.gameBoardService.selectHanzi(hanzi);
  }

  skipChengyu() {
    this.gameBoardService.skipChengyu();
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

  onSkippedChengyuAnimationDone() {
    // TODO fix animation done callback being triggered on first load
    if (this.skippedChengyu) {
      this.skippedChengyu = false;
      this.gameBoardService.getNextChengyu();
    }
  }

  private subscribeToSelectedHanzis() {
    this.selectedHanzis$ = this.gameBoardService.selectedHanzi$.pipe(
      tap(selectedHanzis => {
        this.refreshAllHanzis(selectedHanzis);
        this.refreshAllLinesBetweenHanzis(selectedHanzis);
      }),
      map(selectedHanzis => selectedHanzis.map(hanzi => hanzi.hanzi))
    );
  }

  private subscribeToValidChengyu() {
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

  private subscribeToSkippedChengyu() {
    this.gameBoardService.isSkippedChengyu$.pipe(
      takeUntil(this.destroySubject),
      tap(() => this.skippedChengyu = true)
    ).subscribe();
  }

  private subscribeToTouchMoveEvents() {
    fromEvent(this.gameHanzisContainer.nativeElement, 'touchmove').pipe(
      takeUntil(this.destroySubject),
      map((event: any) => {
        event.preventDefault();
        const touch = event.touches[0];
        return document.elementsFromPoint(touch.clientX, touch.clientY);
      }),
      filter(elements => elements.length > 0),
      distinctUntilChanged((prevElements, currElements) => prevElements[0].id === currElements[0].id),
      tap(elements => this.processTouchedElements(elements)),
    ).subscribe();
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

  private processTouchedElements(elements: Element[]): void {
    elements.forEach(el => {
      const matchingComponent = this.hanziComponents.find(component => component.id === el.id);
      if (matchingComponent) {
        matchingComponent.click();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
