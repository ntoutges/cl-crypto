/*
  tokenData: {
    [str]: {
      flags: {
        [flag1]: desc,
        [flat2]: desc,
        ...
      },
      params: {
        [params]: {
          [param1]: desc,
          [param2]: desc,
          ...
        }
      },
      validate: (Token) => string // empty string indicates no problem
    }
  }
*/

let tokenData = {};
export function initTokens(lTokenData = {}) {
  tokenData = lTokenData;
}

export function extractText(text) {
  const strs = [];
  
  let quoteEnder = null; // not currently inside quotes
  let workingStr = "";
  for (let char of text) {
    if (quoteEnder) { // ignore spaces
      if (char == quoteEnder) {
        if (workingStr.length > 0) strs.push(workingStr + quoteEnder);
        workingStr = "";
        quoteEnder = null;
      }
      else workingStr += char;
    }
    else {
      if (char == " " && workingStr.length > 0) {
        strs.push(workingStr);
        workingStr = "";
      }
      else if (char == "\"" || char == "\'") {
        if (workingStr.length > 0) strs.push(workingStr);
        workingStr = "";
        quoteEnder = char;
        workingStr += char;
      }
      else workingStr += char;
    }
  }
  if (workingStr.length > 0) {
    if (quoteEnder) workingStr += quoteEnder; // prevent quote starting without ending
    strs.push(workingStr);
  }

  return strs;
}

export function extractParameters(extractedText) {
  const parameters = [];
  for (let text of extractedText) {
    if (text[0] != "-") {
      if (
        (text[0] == "\"" && text[text.length-1] == "\"")
        || (text[0] == "\'" && text[text.length-1] == "\'")
      ) text = text.substring(1,text.length-1); // remove start/end quotes
      
      parameters.push(text);
    }
  }
  return parameters;
}

export function extractFlags(extractedText) {
  const flags = [];
  for (const text of extractedText) {
    if (text[0] == "-") {
      flags.push(text.substring(1)); // remove "-" from flag
    }
  }
  return flags;
}

// very basic command system, only allow one command per line, b/c lazy
export function tokenize(text) {
  let extracted = extractText(text);
  if (extracted.length == 0) return "";
  const type = extracted[0];

  if (!(type in tokenData)) return `Unrecognized command: \"${type}\"`;

  extracted.splice(0,1); // remove [type] from [extracted]
  const params = extractParameters(extracted);
  const flags = extractFlags(extracted);

  // ensure flags are valid
  for (const flag of flags) {
    if (!(flag in tokenData[type].flags)) return `Unrecognized flag -${flag} on command \"${type}\"`;
  }

  const expectedParams = tokenData[type].params;
  if (params.length > Object.keys(expectedParams).length) return `Too many parameters (${params.length}) for ${type}. Expected ${Object.keys(tokenData[type].params).length}`;
  if (params.length < Object.keys(expectedParams).length) return `Not enough parameters (${params.length}) for ${type}. Expected ${Object.keys(tokenData[type].params).length}`;

  const paramsMap = {};
  let i = 0;
  for (let key in expectedParams) {
    paramsMap[key] = params[i];
    i++;
  }

  // data is valid
  const token = new Token({
    type,
    flags,
    params: paramsMap
  });

  const output = (tokenData[type].validate) ? tokenData[type].validate(token) : "";
  if (output.length != 0) return output; // error

  return token;
}

export class Token {
  constructor({
    type,
    flags,
    params
  }) {
    this.type = type;
    this.flags = new Set();
    for (const flag of flags) { this.flags.add(flag); }
    this.params = params;
  }
}