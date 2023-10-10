const $ = document.querySelector.bind(document);

const inputs = [];
let inputIndex = 0;

let toFocus = false;
$("#console").addEventListener("mousedown", (e) => {
  // e.preventDefault();
  toFocus = true;
});

$("#console").addEventListener("mousemove", e => {
  toFocus = false;
});

$("#console").addEventListener("mouseup", e => {
  if (toFocus) $("#console-input").focus();
})

$("#console-input").addEventListener("mouseup", e => {
  e.stopPropagation();
})

$("#console-input").addEventListener("keydown", e => {
  if (e.key == "Enter") {
    const line = $("#console-input").value;
    cmdCallbacks.forEach(callback => { callback(line); })
    $("#console-input").value = "";
  }
  else if (e.key == "ArrowUp") $("#console-input").value = getLastInput();
  else if (e.key == "ArrowDown") $("#console-input").value = getNextInput();
});

function getLastInput() {
  if (inputIndex > 0) inputIndex--;
  if (inputIndex == inputs.length) return "";
  return inputs[inputIndex];
}

function getNextInput() {
  if (inputIndex < inputs.length) inputIndex++;
  if (inputIndex == inputs.length) return "";
  return inputs[inputIndex];
}



const cmdCallbacks = [];
export function onCmd(callback) {
  cmdCallbacks.push(callback);
}

let initiator = "";
export function setInitiator(lInitiator) {
  $("#input-indicator").innerText = lInitiator;
  initiator = lInitiator;
}

const pattern = /(?:^|%c\((.+?)\))([^%]+)/g;
export function addLine(text) {
  const line = document.createElement("div");
  line.classList.add("lines");
  for (const match of text.matchAll(pattern)) {
    const el = document.createElement("span");
    el.innerText = match[2];
    if (match[1]) { // styling
      const styles = match[1].split(";");
      for (const style of styles) {
        const property = style.split(":")[0];
        const value = style.split(":")[1] ?? "";
        el.style[property] = value;
      }
    }
    line.append(el)
  }
  $("#lines-holder").append(line);

  $("#console").offsetHeight; // trigger reflow
    $("#console").scrollTo(0, $("#console").scrollHeight); // somehow, this scrolls to the bottom
}

export function repeatInput(text) {
  inputs.push(text);
  inputIndex = inputs.length;
  addLine("%c(background-color:#373737)" + initiator + text);
}

export function clear(clearHistory=false) {
  $("#lines-holder").innerHTML = "";

  if (clearHistory) {
    inputs.splice(0);
    inputIndex = 0;
  }
}

// unoverride log
export function log(...args) {
  console.log.apply(console, args);
}