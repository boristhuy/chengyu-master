import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameCanvasComponent} from "./game-canvas/game-canvas.component";
import {animate, keyframes, query, stagger, style, transition, trigger} from "@angular/animations";
import {GameScoreComponent} from "./game-score/game-score.component";
import {GameTimerComponent} from "./game-timer/game-timer.component";
import {gameBoardAnimation} from "./game-board.animation";

@Component({
  selector: 'chengyu-game-board',
  standalone: true,
  animations: gameBoardAnimation,
  imports: [
    CommonModule,
    FormsModule,
    GameCanvasComponent,
    ReactiveFormsModule,
    GameScoreComponent,
    GameTimerComponent,
  ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements AfterViewInit {

  chengyus = [
    "学而不厌",
    "温故知新",
    "好学不倦",
    "勤学好问",
    "学无止境",
  ];

  currentChengyuIndex = -1;
  shuffledChengyu = '';
  selectedChengyuChars: ChengyuCharElement[] = [];

  correctChengyu = false;
  incorrectChengyu = false;

  score = 0;

  checkboxes = {
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false
  };

  @ViewChild('gameCanvas')
  canvasComponent!: GameCanvasComponent;

  @ViewChild(GameTimerComponent, {static: false})
  timerComponent!: GameTimerComponent;

  ngAfterViewInit(): void {
    Promise.resolve().then(() => (this.selectNextChengyu()));
  }

  selectChengyuChar(chengyuChar: string, elementId: string, event: Event) {
    event.preventDefault();

    const existingChengyuCharIndex = this.selectedChengyuChars.findIndex(val => val.elementId === elementId);
    if (existingChengyuCharIndex === -1) {
      this.selectedChengyuChars.push({chengyuChar, elementId});
      // @ts-ignore
      this.checkboxes[elementId] = true;
      this.redrawLines();
    } else if (existingChengyuCharIndex === this.selectedChengyuChars.length - 1) {
      this.selectedChengyuChars.pop();
      // @ts-ignore
      this.checkboxes[elementId] = false;
      this.redrawLines();
    }

    if (this.selectedChengyuChars.length === 4) {
      setTimeout(() => {
        this.validateSelectedChengyu();
      }, 500)
    }
  }

  onGameTimerEnded() {
    this.selectNextChengyu();
  }

  validateSelectedChengyu(): void {
    if (this.isSelectedChengyuCharsCorrect()) {
      this.handleCorrectChengyu();
    } else {
      this.handleIncorrectChengyu();
    }
  }

  redrawLines(): void {
    this.canvasComponent?.clearCanvas();

    if (this.selectedChengyuChars.length <= 1) {
      return;
    }

    const elementIds = this.selectedChengyuChars.map(v => v.elementId);
    for (let i = 0; i < elementIds.length - 1; i++) {
      const startElement = document.getElementById(elementIds[i]);
      const endElement = document.getElementById(elementIds[i + 1]);

      if (startElement && endElement) {
        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();

        // Calculate the center positions
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;
        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.top + endRect.height / 2;

        // Draw line on the canvas
        this.canvasComponent.drawLine(startX, startY, endX, endY);
      }
    }
  }

  isSelectedChengyuCharsCorrect(): boolean {
    const currentChengyu = this.chengyus[this.currentChengyuIndex];
    return currentChengyu === this.selectedChengyuChars
      .map(char => char.chengyuChar)
      .join('');
  }

  handleCorrectChengyu(): void {
    this.timerComponent.stopTimer();
    this.computeScore();
    this.correctChengyu = true;
  }

  handleIncorrectChengyu(): void {
    this.incorrectChengyu = true;
  }

  selectNextChengyu(): void {
    this.resetSelectedChengyu();

    if (this.isLastChengyu()) {
      return;
    }

    this.currentChengyuIndex = this.currentChengyuIndex + 1;
    const currentChengyu = this.chengyus[this.currentChengyuIndex];
    this.shuffledChengyu = shuffle(currentChengyu);

    this.timerComponent.startTimer();
  }

  computeTimeBonus(remainingTime: number): number {
    return remainingTime * 10;
  }

  onCorrectChengyuAnimationDone() {
    // TODO fix animation done callback being triggered on first load
    if (this.correctChengyu) {
      this.correctChengyu = false;
      this.selectNextChengyu();
    }
  }

  onIncorrectChengyuAnimationDone() {
    // TODO fix animation done callback being triggered on first load
    if (this.incorrectChengyu) {
      this.incorrectChengyu = false;
      this.resetSelectedChengyu();
    }
  }

  computeScore(): void {
    const basePoint = 100;

    const remainingTime = this.timerComponent.getRemainingTime();
    const timeBonus = this.computeTimeBonus(remainingTime);

    this.score += basePoint + timeBonus;
  }

  resetSelectedChengyu() {
    this.selectedChengyuChars = [];
    this.redrawLines();
    this.resetCheckboxes();
  }

  resetCheckboxes() {
    Object.keys(this.checkboxes).forEach(key => {
      // @ts-ignore
      this.checkboxes[key] = false;
    });
  }

  isLastChengyu() {
    return this.currentChengyuIndex === this.chengyus.length - 1;
  }
}

interface ChengyuCharElement {
  chengyuChar: string;
  elementId: string;
}

function shuffle(input: string): string {
  let characters = input.split('');
  for (let i = characters.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  return characters.join('');
}

