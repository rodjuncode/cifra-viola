class Chart {
  constructor(position, width, height, stringsQty, fretsQty) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.strings = stringsQty;
    this.frets = fretsQty;
    this.startFret = 1;
    this.cursor = createVector(0, 0);
    this.cursorVisible = true;
    this.chord = [];
    for (let i = 0; i < this.strings; i++) {
      this.chord.push(createVector(i, 0));
    }
    this.title = 'D';
    this.tunning = ['D', 'A', 'F#', 'D', 'A'];
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    translate(0, this.fretY(0.25));
    this.drawTitle();
    translate(0, this.fretY(0.15) + map(this.frets,Chart.MIN_FRETS,Chart.MAX_FRETS,this.fretY(0.35),0));
    if (this.startFret > 1) {
      this.drawStartFret();
    }
    this.drawLines();
    if (this.cursorVisible) {
      this.drawCursor();
    }
    this.drawChord();
    pop();
  }

  drawTitle() {
    push();
    textSize(map(this.frets,Chart.MIN_FRETS,Chart.MAX_FRETS,75,65));
    textAlign(CENTER);
    text(this.title, this.width / 2, 0);
    pop();
  }

  drawStartFret() {
    push();
    textSize(30);
    textAlign(CENTER);
    text(this.startFret, -this.stringX(0.75), this.fretY(1.5) * 1.1);
    pop();
  }

  drawLines() {
    push();
    translate(0, this.fretY(1));
    noFill();
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < this.strings; i++) {
      line(this.stringX(i), 0, this.stringX(i), this.height - this.fretY(1));
    }
    for (let i = 0; i < this.frets + 1; i++) {
      line(0, this.fretY(i), this.width, this.fretY(i));
    }
    pop();
  }

  drawCursor() {
    push();
    translate(0, this.fretY(1));
    if (this.cursor.y == 0) {
      noFill();
      strokeWeight(5);
      stroke(Chart.CURSOR_COLOR);
    } else {
      noStroke();
      fill(Chart.CURSOR_COLOR);
    }
    ellipse(
      this.stringX(this.cursor.x),
      this.fretY(this.cursor.y) + this.fretY(1) / 2 - this.fretY(1),
      this.fretY(1) / 1.5,
      this.fretY(1) / 1.5
    );
    pop();
  }

  drawChord() {
    push();
    translate(0, this.fretY(1));
    for (let i = 0; i < this.chord.length; i++) {
      let note = this.chord[i];
      if (note.y == 0) {
        noFill();
        strokeWeight(5);
        stroke(0);
      } else {
        noStroke();
        fill(0);
      }
      ellipse(
        this.stringX(note.x),
        this.fretY(note.y) + this.fretY(1) / 2 - this.fretY(1),
        this.fretY(1) / 2,
        this.fretY(1) / 2
      );
    }
    pop();
  }

  stringX(n) {
    return (n * this.width) / (this.strings - 1);
  }

  fretY(n) {
    return (n * this.height) / (this.frets + 1);
  }

  cursorUp() {
    if (!this.cursorVisible) return;
    if (this.cursor.y == 0) {
      this.cursor.y = this.frets;
    } else {
      this.cursor.y--;
    }
  }

  cursorDown() {
    if (!this.cursorVisible) return;
    if (this.cursor.y == this.frets) {
      this.cursor.y = 0;
    } else {
      this.cursor.y++;
    }
  }

  cursorLeft() {
    if (!this.cursorVisible) return;
    if (this.cursor.x == 0) {
      this.cursor.x = this.strings - 1;
    } else {
      this.cursor.x--;
    }
  }

  cursorRight() {
    if (!this.cursorVisible) return;
    if (this.cursor.x == this.strings - 1) {
      this.cursor.x = 0;
    } else {
      this.cursor.x++;
    }
  }

  click() {
    if (this.cursorVisible) {
      if (this.hasNoteAtCursor() >= 0) {
        this.removeNote();
      } else {
        this.insertNote();
      }
    }
  }

  hasNoteAtCursor() {
    let index = -1;
    for (let i = 0; i < this.chord.length; i++) {
      if (
        this.chord[i].x == this.cursor.x &&
        this.chord[i].y == this.cursor.y
      ) {
        index = i;
        break;
      }
    }
    return index;
  }

  removeNote() {
    let i = this.hasNoteAtCursor();
    this.chord.splice(i, 1);
  }

  insertNote() {
    for (let i = 0; i < this.chord.length; i++) {
      if (this.chord[i].x == this.cursor.x) {
        this.chord.splice(i, 1);
        break;
      }
    }
    this.chord.push(createVector(this.cursor.x, this.cursor.y));
  }

  toggleCursor() {
    this.cursorVisible = !this.cursorVisible;
  }

  fretsQtyUp() {
    this.frets++;
    if (this.frets > Chart.MAX_FRETS) {
      this.frets = Chart.MAX_FRETS;
    }
    this.resize();
  }

  fretsQtyDown() {
    this.frets--;
    if (this.frets < Chart.MIN_FRETS) {
      this.frets = Chart.MIN_FRETS;
    }
    this.resize();
  }

  resize() {
    this.width = this.strings * Chart.FRETS_WIDTH;
    this.height = this.frets * Chart.FRETS_HEIGHT;
    this.position.x = scaler.width() / 2 - this.width / 2;
    this.position.y = scaler.height() / 2 - this.height / 2;
    this.clean();
  }

  clean() {
    for (let i = this.chord.length - 1; i >= 0; i--) {
      if (this.chord[i].y >= this.frets - 1) {
        this.chord.splice(i, 1);
      }
    }
    if (this.cursor.y >= this.frets - 1) {
      this.cursor.y = this.frets;
    }
  }

  static FRETS_WIDTH = 35;
  static FRETS_HEIGHT = 70;
  static MAX_FRETS = 7;
  static MIN_FRETS = 4;
  static STRINGS = 5;
  static CURSOR_COLOR = '#ffa500';
  static CHROMATIC_SCALE = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
}
