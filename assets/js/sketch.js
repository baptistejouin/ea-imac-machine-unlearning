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
const resultDOM = document
  .querySelector("#result-remplate-js")
  .content.cloneNode(true);
const notice = resultDOM.querySelector(".notice");
const body = document.querySelector("body");

// Main params for used in the GUI
const PARAMS = {
  currentImage: Object.keys(images)[0], // Define here the index of the selected default image
  shapeNumber: 12,
  shapeType: shapeType[0],
  minShapeSize: 50,
  maxShapeSize: 100,
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
    .add(PARAMS, "minShapeSize")
    .min(10)
    .max(500)
    .onChange(() => redraw());
  shapeFolder
    .add(PARAMS, "maxShapeSize")
    .min(10)
    .max(500)
    .onChange(() => redraw());
  gui.add(PARAMS, "redraw");
}

const getRandomInt = (min, max) => Math.floor(Math.random() * max + min);

function drawShapes() {
  noFill();
  stroke(0);

  for (let i = 0; i < PARAMS.shapeNumber; i++) {
    const size = getRandomInt(PARAMS.minShapeSize, PARAMS.maxShapeSize);
    let coord_x = canvaSize - getRandomInt(0, canvaSize - size) - size / 2;
    let coord_y = canvaSize - getRandomInt(0, canvaSize - size) - size / 2;

    switch (PARAMS.shapeType) {
      case "SQUARE":
        for (let j = 0; j < 3; j++) {
          square(coord_x, coord_y, size - (j + getRandomInt(50, 100)));
        }
        break;
      case "CIRCLE":
        for (let j = 0; j < 3; j++) {
          circle(coord_x, coord_y, size - (j + getRandomInt(50, 100)));
        }
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

  body.appendChild(resultDOM);
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
  background(200);
  initGUI();
  noLoop();
}

function draw() {
  image(img[PARAMS.currentImage], 0, 0, canvaSize, canvaSize);
  drawShapes();
  classifier.classify(canvas, displayResult);
}
