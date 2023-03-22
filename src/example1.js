let T;

let size = 80;
let a, b, n1, n2, n3;
let m;
let rotation;

let resolution = 3;

let palette = ['#EDAE49', '#D1495B', '#00798C', '#003D5B'];
let bg, st;

let buffer;

function supershape(theta) {
  var part1 = (1 / a) * cos((theta * m) / 4);
  part1 = abs(part1);
  part1 = pow(part1, n2);

  var part2 = (1 / b) * sin((theta * m) / 4);
  part2 = abs(part2);
  part2 = pow(part2, n3);

  var part3 = pow(part1 + part2, 1 / n1);

  if (part3 === 0) {
    return 0;
  }

  return 1 / part3;
}

function setup() {
  createAdaptiveCanvas(300, 400);

  T = new ArtTest();
  T.addInfo('hash', tokenData.hash);
  T.printInfo();

  R = new Random();

  (a = R.random_num(-0.4, 0.4)),
    (b = R.random_num(-1, 1)),
    (n1 = R.random_num(1, 10)),
    (n2 = R.random_num(0, 2)),
    (n3 = -1.8);
  m = R.random_int(3, 12);

  bg = R.random_choice(palette);
  st = R.random_choice(palette);
  while (st == bg) {
    st = R.random_choice(palette);
  }

  rotation = 0;

  buffer = createAdaptiveGraphics(
    scaler.width(),
    scaler.height(),
    renderSuperShape
  );  
}

function draw() {
  background(bg);

  translate(scaler.width() / 2, scaler.height() / 2);
  rotate(radians(rotation));
  translate(-scaler.width() / 2, -scaler.height() / 2);

  image(buffer.graphics(),0,0);

  rotation++;
  T.checkReady(10);
}

function renderSuperShape(buffer) {
  let c = color(st);
  c.setAlpha(40);
  buffer.noFill();
  buffer.stroke(c);

  buffer.translate(scaler.width() / 2, scaler.height() / 2);

  for (let i = resolution; i < size; i += resolution) {
    radius = i;
    for (var angle = 0; angle < 360; angle += 1) {
      var r = supershape(angle);
      var x = radius * r * cos(angle);
      var y = radius * r * sin(angle);
      buffer.ellipse(x, y, 10, 10);
    }
  }
}

window.addEventListener(
  'resize',
  function (event) {
    rotation = 0;
  },
  true
);