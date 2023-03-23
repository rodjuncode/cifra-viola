let T, R;

let chart;

function setup() {
  createAdaptiveCanvas(350, 400);

  // test suite
  T = new ArtTest();
  T.addInfo('hash', tokenData.hash);
  T.printInfo();

  // random class
  R = new Random();

  let chartWidth = 200;
  let chartHeight = 300;
  let chartX = scaler.width() / 2 - chartWidth / 2;
  let chartY = scaler.height() / 2 - chartHeight / 2;
  chart = new Chart(
    createVector(chartX, chartY),
    chartWidth,
    chartHeight,
    Chart.STRINGS,
    Chart.FRETS
  );
}

function draw() {
  background(255);

  chart.draw();

  // enable ready for automated tests
  // T.checkReady(0);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if (chart.tool == Chart.NOTE) {
      chart.cursorLeft();
    } else if (chart.tool == Chart.CAPO) {
      chart.capoGrow();
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (chart.tool == Chart.NOTE) {
      chart.cursorRight();
    } else if (chart.tool == Chart.CAPO) {
      chart.capoShrink();
    }
  } else if (keyCode === UP_ARROW) {
    if (chart.tool == Chart.NOTE) {
      chart.cursorUp();
    } else if (chart.tool == Chart.CAPO) {
      chart.capoUp();
    }
  } else if (keyCode === DOWN_ARROW) {
    if (chart.tool == Chart.NOTE) {
      chart.cursorDown();
    } else if (chart.tool == Chart.CAPO) {
      chart.capoDown();
    }
  } else if (keyCode === ENTER) {
    if (chart.tool == Chart.NOTE) {
      chart.setNote();
    } else if (chart.tool == Chart.CAPO) {
      chart.setCapo();
    }
  } else if (keyCode === SHIFT) {
    if (chart.tool == Chart.NOTE) {
      chart.toggleCursor();
    } else if (chart.tool == Chart.CAPO) {
    }
  } else if (keyCode === BACKSPACE) {
    chart.toggleTool();
  }
}

function keyTyped() {
  if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(int(key))) return;
  chart.startFret = key;
}
