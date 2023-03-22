class ArtTest {
  constructor() {
    this.info = {};
    this.reset();
  }

  addInfo(key, value) {
    this.info[key] = value;
  }

  reset() {
    this.frame = 0;
  }

  printInfo() {
    Object.keys(this.info).forEach((key) => {
      this.message(key,this.info[key]);
    });
  }

  checkReady(cycles) {
    if (!cycles) return;
    this.frame++;
    if (this.frame <= cycles) return;
    this.message('ready');
    noLoop();
    this.reset();
    this.unitTests();
  }

  unitTests() {
    // to be implemented
  }

  message(header, content) {
    if (header) {
      if (content) {
        console.log('[' + ArtTest.name + ']:' + header, content);
      } else {
        console.log('[' + ArtTest.name + ']:' + header);
      }
    }
  }
  static name = 'ArtTest.js';
}

window.addEventListener(
  'resize',
  function (event) {
    loop();
  },
  true
);

