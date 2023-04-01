let T, R;

let chart;

let writingChordName = false;

function setup() {
  createAdaptiveCanvas(500, 600);

  // test suite
  T = new ArtTest();
  T.addInfo('hash', tokenData.hash);
  T.printInfo();

  // random class
  R = new Random();

  let chartWidth = Chart.STRINGS * Chart.FRETS_WIDTH;
  let chartHeight = Chart.MIN_FRETS * Chart.FRETS_HEIGHT;
  let chartX = scaler.width() / 2 - chartWidth / 2;
  let chartY = scaler.height() / 2 - chartHeight / 2;
  chart = new Chart(
    createVector(chartX, chartY),
    chartWidth,
    chartHeight,
    Chart.STRINGS,
    Chart.MIN_FRETS
  );
}

function draw() {
  background(255);

  chart.draw();

  // enable ready for automated tests
  // T.checkReady(0);
}

function keyPressed() {
  if (writingChordName) {
    if (keyCode === ENTER) {
      writingChordName = false;
    } else if (keyCode === BACKSPACE) {
      chart.title = chart.title.slice(0, -1);
    } else if (isPrintable(keyCode)) {
      chart.title += key;
    }
    return;
  }

  if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(int(key))) {
    chart.startFret = key;
  } else if (keyCode === LEFT_ARROW) {
    chart.cursorLeft();
  } else if (keyCode === RIGHT_ARROW) {
    chart.cursorRight();
  } else if (keyCode === UP_ARROW) {
    chart.cursorUp();
  } else if (keyCode === DOWN_ARROW) {
    chart.cursorDown();
  } else if (keyCode === ENTER) {
    chart.click();
  } else if (key === 's') {
    chart.toggleCursor();
  } else if (keyCode === 187 && keyIsDown(SHIFT)) {
    chart.fretsQtyUp();
  } else if (keyCode === 189 && keyIsDown(SHIFT)) {
    chart.fretsQtyDown();
  } else if (key === 'n') {
    writingChordName = true;
    chart.title = '';
  }
}

// function that checks if keyCode is a letter, number, space, parenthesis, slash, sharp
function isPrintable(keyCode) {
  return (
    (keyCode >= 48 && keyCode <= 57) ||
    (keyCode >= 65 && keyCode <= 90) ||
    (keyCode >= 97 && keyCode <= 122) ||
    keyCode === 32 ||
    keyCode === 40 ||
    keyCode === 41 ||
    keyCode === 47 ||
    keyCode === 35 ||
    keyCode === 191
  );
}

