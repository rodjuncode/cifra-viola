class Chart {
    constructor(position, width, height, stringsQty, fretsQty) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.strings = stringsQty;
        this.frets = fretsQty;
        this.cursor = createVector(0,0);
        this.cursorVisible = true;
        this.chord = [];
        this.title = "Bb7#9b9#11#5/Ab";
    }

    draw() {
        push();
        translate(this.position.x,this.position.y);
        this.drawLines();
        if (this.cursorVisible) {
           this.drawCursor();   
        }
        this.drawChord();     
        pop();
    }

    drawLines() {
        push();
        translate(0,this.fretY(1));
        noFill();
        stroke(0);
        strokeWeight(2);
        for (let i = 0; i < this.strings; i++) {
            line(this.stringX(i),0,this.stringX(i),this.height - this.fretY(1));
        }
        for (let i = 0; i <= this.frets + 1; i++) {
            line(0,this.fretY(i),this.width,this.fretY(i));
        }      
        pop();  

    }

    drawCursor() {
        push();
        translate(0,this.fretY(1));
        if (this.cursor.y == 0) {
            noFill();
            strokeWeight(5);
            stroke(Chart.CURSOR_COLOR);
        } else {
            noStroke();
            fill(Chart.CURSOR_COLOR);
        }
        ellipse(this.stringX(this.cursor.x), this.fretY(this.cursor.y) + this.fretY(1)/2 - this.fretY(1), this.fretY(1)/2,this.fretY(1)/2);
        pop();
    }

    drawChord() {
        push();
        translate(0,this.fretY(1));
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
            ellipse(this.stringX(note.x), this.fretY(note.y) + this.fretY(1)/2 - this.fretY(1), this.fretY(1)/2.5,this.fretY(1)/2.5);
        }
        pop();
    }

    stringX(n) {
        return n*this.width/(this.strings-1);
    }

    fretY(n) {
        return n*this.height/(this.frets + 1);
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
            if (this.chord[i].x == this.cursor.x && this.chord[i].y == this.cursor.y) {
                index = i;
                break
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
        this.chord.push(createVector(this.cursor.x,this.cursor.y));
    }
   
    toggleCursor() {
        this.cursorVisible = !this.cursorVisible;
    }

    static FRETS = 4;
    static STRINGS = 5;
    static CURSOR_COLOR = '#ffa500';

}