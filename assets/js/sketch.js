let classifier, img, canvas;
const canvaSize = 500;
const resultDOM = document
  .querySelector("#result-remplate-js")
  .content.cloneNode(true);

const images = {
  boat: "assets/images/boat.jpeg",
  bird: "assets/images/mésange_azurée.jpeg",
};
const PARAMS = {
  currentImage: "assets/images/boat.jpeg",
};

// The GUI
const gui = new lil.GUI();
gui.add(PARAMS, "currentImage").options(Object.keys(images));

function preload() {
  //Models available are: 'MobileNet', 'Darknet' and 'Darknet-tiny','DoodleNet'...
  classifier = ml5.imageClassifier("MobileNet");
  img = loadImage(PARAMS.currentImage);
}

function setup() {
  canvas = createCanvas(canvaSize, canvaSize);
  background(200);
  noLoop();

  image(img, 0, 0, canvaSize, canvaSize);

  classifier.classify(canvas, displayResult);
}

function displayResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  console.log(results);

  const body = document.querySelector("body");
  const notice = resultDOM.querySelector(".notice");
  notice.innerHTML = "";

  for (const result of results) {
    notice.innerHTML += `<div>${result.label} (${nf(
      results[0].confidence,
      0,
      2
    )})`;
  }
  body.appendChild(resultDOM);
}
