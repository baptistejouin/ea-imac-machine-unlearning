// Our images (add path our new image here)
const images = {
  boat: "assets/images/boat.jpeg",
  bird: "assets/images/mésange_azurée.jpeg",
  sunflower: "assets/images/sunflower.jpeg",
  polar_bear: "assets/images/polar_bear.jpeg",
};

// Essential variables for our program
let classifier,
  canvas,
  img = [];
const canvaSize = 500;
const shapeType = ["SQUARE", "CIRCLE"];
const notice = document.querySelector(".notice");

// Main params for used in the GUI
const PARAMS = {
  currentImage: Object.keys(images)[0], // Define here the index of the selected default image
  shapeNumber: 3,
  shapeType: shapeType[1],
  shapeSize: 5,
  strokeWeight: 1,
  color: ('#000000'),
  classify: false,
  redraw: () => redraw(),
};

// GUI with the "lil GUI" library
function initGUI() {
  const gui = new lil.GUI();
  gui
    .add(PARAMS, "currentImage")
    .options(Object.keys(images))
    .onChange(() => redraw());
  const shapeFolder = gui.addFolder("Shape");
  shapeFolder
    .add(PARAMS, "shapeType")
    .options(shapeType)
    .onChange(() => redraw());
  shapeFolder
    .add(PARAMS, "shapeNumber")
    .min(0)
    .max(30)
    .step(1)
    .onChange(() => redraw());
  shapeFolder
    .add(PARAMS, "shapeSize")
    .min(1)
    .max(20)
    .step(0.5)
    .onChange(() => redraw());
  shapeFolder
    .add(PARAMS, "strokeWeight")
    .min(1)
    .max(10)
    .step(0.5)
    .onChange(() => redraw());
  shapeFolder
    .addColor(PARAMS, "color")
    .onChange(() => redraw());

  gui.add(PARAMS, "classify").onChange(() => redraw());
  gui.add(PARAMS, "redraw");
}

const getRandomInt = (min, max) => Math.floor(Math.random() * max + min);

// random circles
function circles(d) {
  let pos_x = random(canvaSize);
  let pos_y = random(canvaSize);
  for (let i = 0; i < 20; i++) {
    const delta1 = random(10 * PARAMS.shapeSize);
    const delta2 = random(10 * PARAMS.shapeSize);
    const delta3 = random(2 * PARAMS.shapeSize, 6 * PARAMS.shapeSize);
    const size = d + delta3;
    ellipse(pos_x + delta1 - size, pos_y + delta2 - size, size);
  }
}

// random squares
function squares(d) {
  let delta1;
  let delta2;
  let pos_x = random(canvaSize);
  let pos_y = random(canvaSize);
  for (let i = 0; i < 3; i++) {
    delta1 = random(10 * PARAMS.shapeSize);
    delta2 = random(10 * PARAMS.shapeSize);
    delta3 = random(10 * PARAMS.shapeSize, 20 * PARAMS.shapeSize);
    square(pos_x + delta1, pos_y + delta2, d + delta3);
  }
}

function drawShapes() {
  noFill();
  stroke(PARAMS.color);
  strokeWeight(PARAMS.strokeWeight);
  for (let i = 0; i < PARAMS.shapeNumber; i++) {
    const f = 1.2;
    switch (PARAMS.shapeType) {
      case "SQUARE":
        squares((20 + i) * f);
        break;
      case "CIRCLE":
        circles((20 + i) * f);
      default:
        break;
    }
  }

}

function displayResult(error, results) {
  notice.innerHTML = "";

  if (error) {
    console.error(error);
    return;
  }

  console.log(results);

  for (const result of results) {
    notice.innerHTML += `<div>${result.label} (${nf(
      results[0].confidence,
      0,
      2
    )})`;
  }
}

function preload() {
  //Models available are: 'MobileNet', 'Darknet' and 'Darknet-tiny','DoodleNet'...
  classifier = ml5.imageClassifier("MobileNet");

  for (const key in images) {
    if (Object.hasOwnProperty.call(images, key)) {
      img[key] = loadImage(images[key]);
    }
  }
}

function setup() {
  canvas = createCanvas(canvaSize, canvaSize);
  canvas.parent("canvas-1");
  background(200);
  initGUI();
  noLoop();
}

function draw() {
  image(
    img[PARAMS.currentImage],
    0,
    0,
    canvaSize,
    canvaSize,
    0,
    0,
    img[PARAMS.currentImage].width,
    img[PARAMS.currentImage].height,
    COVER,
    CENTER
  );
  // image(img[PARAMS.currentImage], 0, 0, canvaSize, canvaSize, img.width, img.height, CONTAIN, LEFT);
  drawShapes();
  PARAMS.classify && classifier.classify(canvas, displayResult);
}
