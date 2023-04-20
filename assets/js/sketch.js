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
  img = [],
  storedResults = [],
  charElements = [null, null],
  autoDraw = false;
const canvaSize = 500;
const shapeType = ["SQUARE", "CIRCLE"];
const notice = document.querySelector(".notice");
const chartDOM = document.getElementById("char-1");
const chartDOM2 = document.getElementById("char-2");

// Main params for used in the GUI
const PARAMS = {
  currentImage: Object.keys(images)[0], // Define here the index of the selected default image
  shapeNumber: 3,
  shapeType: shapeType[1],
  shapeSize: 5,
  classify: true,
  redraw: () => redraw(),
  autodraw: () => make100draw(),
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
  gui.add(PARAMS, "classify").onChange(() => redraw());
  gui.add(PARAMS, "redraw");
  gui.add(PARAMS, "autodraw").name("plot graphs");
}

function initChar() {
  const data1 = {
    labels: ["Probability of output"],
    datasets: [
      {
        label: shapeType[0],
        data: [0],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const data2 = {
    labels: ["Probability of output"],
    datasets: [
      {
        label: shapeType[1],
        data: [0],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        pointBackgroundColor: "rgb(75, 192, 192)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const config1 = {
    type: "radar",
    data: data1,
    options: {
      plugins: {
        title: {
          display: true,
          text: `Generation with ${shapeType[0]} (based on 100 generations)`,
        },
        filler: {
          propagate: false,
        },
        "samples-filler-analyser": {
          target: "chart-analyser",
        },
      },
      interaction: {
        intersect: false,
      },
    },
  };
  const config2 = {
    type: "radar",
    data: data2,
    options: {
      plugins: {
        title: {
          display: true,
          text: `Generation with ${shapeType[1]} (based on 100 generations)`,
        },
        filler: {
          propagate: false,
        },
        "samples-filler-analyser": {
          target: "chart-analyser",
        },
      },
      interaction: {
        intersect: false,
      },
    },
  };

  charElements[0] = new Chart(chartDOM, config1);
  charElements[1] = new Chart(chartDOM2, config2);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
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
  stroke(0);

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

function countOccurrences(arr) {
  let cleanedArr = arr.map((item) => item.replace(",", ""));
  return cleanedArr.reduce((obj, item) => {
    obj[item] = obj[item] ? obj[item] + 1 : 1;
    return obj;
  }, {});
}

function handleResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  if (autoDraw) {
    for (const result of results) {
      storedResults.push(result.label);
    }
  } else {
    displayResult(results);
  }
}

function updateChar(charIndex) {
  sortedData = countOccurrences(storedResults);
  dataKeys = Object.keys(sortedData);
  dataValues = Object.values(sortedData);
  valueToPercent = dataValues.map(
    (value) => (value / dataValues.reduce((acc, val) => acc + val, 0)) * 100
  );

  charElements[charIndex].data.labels = dataKeys.map((item) =>
    truncateString(item, 20)
  );
  charElements[charIndex].data.datasets[0].data = valueToPercent;
  charElements[charIndex].update();
}

async function make100draw() {
  autoDraw = true;
  storedResults = [];
  const currentValue = PARAMS.shapeType;

  PARAMS.shapeType = shapeType[0];
  for (let i = 0; i < 100; i++) {
    redraw();
    await sleep(10);
  }
  updateChar(0);

  PARAMS.shapeType = shapeType[1];
  for (let i = 0; i < 100; i++) {
    redraw();
    await sleep(10);
  }
  updateChar(1);

  PARAMS.shapeType = currentValue;
  autoDraw = false;
}

function displayResult(results) {
  notice.innerHTML = "";

  for (const result of results) {
    notice.innerHTML += `<div>${result.label} (${nf(result.confidence, 0, 2)})`;
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
  initChar();
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
  drawShapes();
  PARAMS.classify && classifier.classify(canvas, handleResult);
}
