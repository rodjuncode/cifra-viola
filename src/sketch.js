let T, R;

function setup() {
  createAdaptiveCanvas(300, 400);

  // test suite
  T = new ArtTest();
  T.addInfo('hash', tokenData.hash);
  T.printInfo();

  // random class
  R = new Random();

}

function draw() {
  background(200);

  // enable ready for automated tests
  T.checkReady(0);
}