const $ = document.querySelector.bind(document);

import * as console from "./console.js";
import * as cmd from "./cmd.js";
import * as tokens from "./tokens.js"
import * as vars from "./vars.js";

console.setInitiator("> ");

console.onCmd((line) => {
  console.repeatInput(line);
  const token = cmd.tokenize(line);
  if (typeof token == "string") { // error
    console.addLine("%c(background-color:#890000;color:red)" + token);
    return;
  }
  tokens.run(token);
});


cmd.initTokens(tokens.tokensData)
tokens.attachConsole(console.addLine);
tokens.attachClear(console.clear);

vars.init();