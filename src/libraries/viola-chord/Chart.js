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
    this.capo = 1;
    this.capoAt = -1;
    this.capoLength = this.strings;
    this.capoOn = false;
    this.tool = Chart.NOTE;
    this.notes = [];
    this.title = 'Bb7#9b9#11#5/Ab';
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    if (this.startFret > 1) {
      this.drawStartFret();
    }
    this.drawLines();
    if (this.tool == Chart.NOTE) {
      if (this.cursorVisible) {
        this.drawCursor();
      }
    } else {
      this.drawCapoCursor();
    }
    this.drawChord();
    this.drawCapo();
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
    for (let i = 0; i <= this.frets + 1; i++) {
      line(0, this.fretY(i), this.width, this.fretY(i));
    }
    pop();
  }

  drawCapoCursor() {
    push();
    translate(0, this.fretY(1));
    strokeCap(PROJECT);
    strokeWeight(10);
    stroke(Chart.INTERFACE_COLOR);
    line(
      this.stringX(this.strings - this.capoLength),
      this.fretY(this.capo) - this.fretY(0.5),
      this.stringX(this.strings - 1),
      this.fretY(this.capo) - this.fretY(0.5)
    );
    pop();
  }

  drawCursor() {
    push();
    translate(0, this.fretY(1));
    if (this.cursor.y == 0) {
      noFill();
      strokeWeight(5);
      stroke(Chart.INTERFACE_COLOR);
    } else {
      noStroke();
      fill(Chart.INTERFACE_COLOR);
    }
    ellipse(
      this.stringX(this.cursor.x),
      this.fretY(this.cursor.y) + this.fretY(1) / 2 - this.fretY(1),
      this.fretY(1) / 1.5,
      this.fretY(1) / 1.5
    );
    pop();
  }

  drawCapo() {
    if (!this.capoOn) return;
    push();
    translate(0, this.fretY(1));
    strokeCap(PROJECT);
    strokeWeight(10);
    line(
      this.stringX(this.strings - this.capoLength),
      this.fretY(this.capoAt) - this.fretY(0.5),
      this.stringX(this.strings - 1),
      this.fretY(this.capoAt) - this.fretY(0.5)
    );
    pop();
  }

  drawChord() {
    push();
    translate(0, this.fretY(1));
    for (let i = 0; i < this.notes.length; i++) {
      let note = this.notes[i];
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

  capoUp() {
    if (this.capo == 1) {
      this.capo = this.frets;
    } else {
      this.capo--;
    }
  }

  capoDown() {
    if (this.capo == this.frets) {
      this.capo = 1;
    } else {
      this.capo++;
    }
  }

  capoGrow() {
    if (this.capoLength == this.strings) return;
    this.capoLength++;
  }

  capoShrink() {
    if (this.capoLength == 3) return;
    this.capoLength--;
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

  setNote() {
    if (this.cursorVisible) {
      if (this.hasNoteAtCursor() >= 0) {
        this.removeNote();
      } else {
        this.insertNote();
      }
    }
  }

  setCapo() {
    this.capoAt = this.capo;
    this.capoOn = !this.capoOn;
  }

  hasNoteAtCursor() {
    let index = -1;
    for (let i = 0; i < this.notes.length; i++) {
      if (
        this.notes[i].x == this.cursor.x &&
        this.notes[i].y == this.cursor.y
      ) {
        index = i;
        break;
      }
    }
    return index;
  }

  removeNote() {
    let i = this.hasNoteAtCursor();
    this.notes.splice(i, 1);
  }

  insertNote() {
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].x == this.cursor.x) {
        this.notes.splice(i, 1);
        break;
      }
    }
    this.notes.push(createVector(this.cursor.x, this.cursor.y));
  }

  toggleCursor() {
    this.cursorVisible = !this.cursorVisible;
  }

  toggleTool() {
    if (this.tool == Chart.NOTE) {
      this.tool = Chart.CAPO;
    } else {
      this.tool = Chart.NOTE;
    }
  }

  static FRETS = 4;
  static STRINGS = 5;
  static INTERFACE_COLOR = '#ffa500';
  static NOTE = 'note';
  static CAPO = 'capo';

}
