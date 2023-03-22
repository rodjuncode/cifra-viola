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
  let chartX = scaler.width()/2 - chartWidth/2;
  let chartY = scaler.height()/2 - chartHeight/2;
  chart = new Chart(createVector(chartX,chartY),chartWidth,chartHeight,Chart.STRINGS,Chart.FRETS);

}

function draw() {
  background(255);

  chart.draw();

  // enable ready for automated tests
  // T.checkReady(0);
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    chart.cursorLeft();
  } else if (keyCode === RIGHT_ARROW) {
    chart.cursorRight();
  } else if (keyCode === UP_ARROW) {
    chart.cursorUp();
  } else if (keyCode === DOWN_ARROW) {
    chart.cursorDown();
  } else if (keyCode === ENTER) {
    chart.click();
  } else if (keyCode === CONTROL) {
    chart.toggleCursor();
  }

}