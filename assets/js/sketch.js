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
const resultDOM = document
  .querySelector("#result-remplate-js")
  .content.cloneNode(true);
const body = document.querySelector("body");
const PARAMS = {
  currentImage: Object.keys(images)[0], // Define here the index of the selected default image
};

// GUI with the "lil GUI" library
const gui = new lil.GUI();
gui
  .add(PARAMS, "currentImage")
  .options(Object.keys(images))
  .onChange(() => redraw());

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
  noLoop();
}

function draw() {
  image(img[PARAMS.currentImage], 0, 0, canvaSize, canvaSize);
  classifier.classify(canvas, displayResult);
}

function displayResult(error, results) {
  const notice = resultDOM.querySelector(".notice");

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
