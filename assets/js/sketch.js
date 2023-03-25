// The GUI
var GUI = lil.GUI;
const gui = new GUI();
gui.add(document, "title");
obj = { number1: 0.533, number2: 50 };
gui.add(obj, "number1", 0, 1); // min, max
gui.add(obj, "number2", 0, 100, 10); // min, max, step
