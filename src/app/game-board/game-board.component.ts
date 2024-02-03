import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameCanvasComponent} from "./game-canvas/game-canvas.component";
import {animate, style, transition, trigger} from "@angular/animations";
import {GameScoreComponent} from "./game-score/game-score.component";
import {GameTimerComponent} from "./game-timer/game-timer.component";

@Component({
  selector: 'chengyu-game-board',
  standalone: true,
  animations: [
    trigger('charSelected', [
      transition(':enter', [
        style({opacity: 0, transform: 'scale(0)'}),
        animate('0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)', style({opacity: 1, transform: 'scale(1)'})),
      ]),
    ])
  ],
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
    "众所周知",
    "前所未有",
    "不可思议",
    "千方百计",
    "先发制人",
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
  private canvasComponent!: GameCanvasComponent;

  @ViewChild(GameTimerComponent, {static: false})
  private timerComponent!: GameTimerComponent;

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
      }, 1000)
    }
  }

  goToNextChengyu() {
    this.correctChengyu = true;

    this.selectNextChengyu();

    setTimeout(() => {
      this.correctChengyu = false;
    }, 250);
  }

  handleTimerEnded() {
    this.goToNextChengyu();
  }

  private validateSelectedChengyu(): void {
    if (this.isSelectedChengyuCharsCorrect()) {
      if (this.isLastChengyu()) {
        // TODO
      } else {
        this.handleCorrectChengyu();
      }
    } else {
      this.handleIncorrectChengyu();
    }
  }

  private redrawLines(): void {
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

  private isSelectedChengyuCharsCorrect(): boolean {
    const currentChengyu = this.chengyus[this.currentChengyuIndex];
    return currentChengyu === this.selectedChengyuChars.map(char => char.chengyuChar).join('');
  }

  private handleCorrectChengyu(): void {
    this.timerComponent.stopTimer();

    this.computeScore();
  }

  private selectNextChengyu(): void {
    this.resetSelectedChengyu();

    this.currentChengyuIndex = this.currentChengyuIndex + 1;
    const currentChengyu = this.chengyus[this.currentChengyuIndex];
    this.shuffledChengyu = shuffle(currentChengyu);

    this.timerComponent.startTimer();
  }

  private computeScore(): void {
    const basePoint = 100;

    const remainingTime = this.timerComponent.getRemainingTime();
    const timeBonus = this.computeTimeBonus(remainingTime);

    this.score += basePoint + timeBonus;
  }

  private computeTimeBonus(remainingTime: number): number {
    return remainingTime * 10;
  }

  private handleIncorrectChengyu(): void {
    this.incorrectChengyu = true;

    this.resetSelectedChengyu();

    setTimeout(() => {
      this.incorrectChengyu = false;
    }, 250);
  }

  private resetSelectedChengyu() {
    this.selectedChengyuChars = [];
    this.redrawLines();
    this.resetCheckboxes();
  }

  private resetCheckboxes() {
    Object.keys(this.checkboxes).forEach(key => {
      // @ts-ignore
      this.checkboxes[key] = false;
    });
  }

  private isLastChengyu() {
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

