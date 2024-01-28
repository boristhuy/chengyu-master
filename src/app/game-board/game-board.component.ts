import {Component, OnInit, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GameCanvasComponent} from "./game-canvas/game-canvas.component";
import {GameTimerComponent} from "./game-timer/game-timer.component";

@Component({
  selector: 'chengyu-game-board',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    GameCanvasComponent,
    GameTimerComponent
  ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  chengyus = [
    "众所周知",
    "前所未有",
    "不可思议",
    "千方百计",
    "先发制人",
  ];

  currentChengyuIndex = 0;
  shuffledChengyu = '';
  selectedChengyuChars: ChengyuCharElement[] = [];

  correctChengyu = false;
  incorrectChengyu = false;

  checkboxes = {
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false
  };

  @ViewChild('canvasComp')
  canvasComponent!: GameCanvasComponent;

  ngOnInit(): void {
    this.startGame();
  }

  private startGame(): void {
    const currentChengyu = this.chengyus[this.currentChengyuIndex];
    this.shuffledChengyu = shuffle(currentChengyu);
    this.selectedChengyuChars = [];
  }

  selectChengyuChar(chengyuChar: string, elementId: string, event: Event) {
    event.preventDefault();

    const existingChengyuCharIndex = this.selectedChengyuChars.findIndex(val => val.elementId === elementId);
    if (existingChengyuCharIndex === -1) {
      this.selectedChengyuChars.push({chengyuChar, elementId});
      // @ts-ignore
      this.checkboxes[elementId] = true;
      this.redrawCanvas();
    } else if (existingChengyuCharIndex === this.selectedChengyuChars.length - 1) {
      this.selectedChengyuChars.pop();
      // @ts-ignore
      this.checkboxes[elementId] = false;
      this.redrawCanvas();
    }

    // Win condition
    setTimeout(() => {
      if (this.selectedChengyuChars.length === 4) {
        if (this.isSelectedChengyuCharsCorrect()) {
          if (this.isLastChengyu()) {
            this.startGame();
          } else {
            this.handleCorrectChengyu();
          }
        } else {
          this.handleIncorrectChengyu();
        }
      }
    }, 1500)
  }

  private redrawCanvas() {
    this.canvasComponent.clearCanvas();

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

  private handleCorrectChengyu() {
    this.correctChengyu = true;
    this.currentChengyuIndex = this.currentChengyuIndex + 1;
    const currentChengyu = this.chengyus[this.currentChengyuIndex];
    this.shuffledChengyu = shuffle(currentChengyu);
    this.resetSelectedChengyu();

    setTimeout(() => {
      this.correctChengyu = false;
    }, 250);
  }

  private handleIncorrectChengyu() {
    this.incorrectChengyu = true;
    this.resetSelectedChengyu();
    setTimeout(() => {
      this.incorrectChengyu = false;
    }, 250);
  }

  private resetSelectedChengyu() {
    this.selectedChengyuChars = [];
    this.redrawCanvas();
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

export interface ChengyuCharElement {
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

