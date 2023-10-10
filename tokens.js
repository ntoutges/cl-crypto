import * as vars from "./vars.js";
import * as eg from "./ElGamal.js";

export const tokensData = {
  "help": {
    flags: {},
    params: {
      "command": "cmd to be helped with"
    },
    validate: (token) => { return token.params.command in tokensData ? "" : `Cannot help with command %c(background-color:yellow;color:black)\"${token.params.command}\"` }
  },
  "echo": {
    flags: {
      "l": "(l)oud, switch to ALL CAPS!"
    },
    params: {
      "text": "data to be repeated"
    }
  },
  "clear": {
    flags: {
      "h": "Clear history",
      "v": "Clear variables"
    },
    params: {}
  },

  "set": {
    flags: {
      "d": "delete variable (disregards [value])"
    },
    params: {
      "variable": "variable name to set",
      "value": "value to set variable to"
    }
  },
  "get": {
    flags: {},
    params: {
      "variable": "variable name to set"
    }
  },

  "EG-private": {
    flags: {
      "ri": "[p] is paseed by reference (by variable name). Otherwise, value is assumed constant",
      "v": "verbose"
    },
    params: {
      "p": "Large prime used for security",
      "output": "Location to store generated private key"
    },
    validate: (token) => {
      if (token.flags.has("ri")) {
        if (!vars.hasVar(token.params.p)) return `Variable \"${token.params.p}\" does not exist`;
        
        try { token.params.p = BigInt(vars.getVar(token.params.p)); }
        catch (_) { return `\"${token.params.p}\": '${vars.getVar(token.params.p)}' cannot be interpreted as a number`; }
      }
      else {
        try { token.params.p = BigInt(token.params.p) }
        catch (_) { return `\"${token.params.p}\" cannot be interpreted as a number`; }
      }
      return "";
    }
  },
  "EG-public": {
    flags: {
      "ri": "[p] and [r] are paseed by reference (by variable name). Otherwise, values are assumed constants",
      "rp": "private key [b] is passed by reference.",
      "v": "verbose"
    },
    params: {
      "p": "Large prime used for security",
      "r": "Primitive-root in modulus [p]",
      "b": "Private key",
      "output": "Location to store generated public key"
    },
    validate: (token) => {
      if (token.flags.has("ri")) {
        if (!vars.hasVar(token.params.p)) return `Variable \"${token.params.p}\" does not exist`;
        if (!vars.hasVar(token.params.r)) return `Variable \"${token.params.r}\" does not exist`;

        try { token.params.p = BigInt(vars.getVar(token.params.p)); }
        catch (_) { return `\"${token.params.p}\": \'${vars.getVar(token.params.p)}\' cannot be interpreted as a number`; }
        try { token.params.r = BigInt(vars.getVar(token.params.r)); }
        catch (_) { return `\"${token.params.r}\": \'${vars.getVar(token.params.r)}\' cannot be interpreted as a number`; }
      }
      else {
        try { token.params.p = BigInt(token.params.p); }
        catch (_) { return `\"${token.params.p}\" cannot be interpreted as a number`; }
        try { token.params.r = BigInt(token.params.r); }
        catch (_) { return `\"${token.params.r}\" cannot be interpreted as a number`; }
      }
      if (token.flags.has("rp")) {
        if (!vars.hasVar(token.params.b)) return `Variable \"${token.params.b}\" does not exist`;
        try { token.params.b = BigInt(vars.getVar(token.params.b)); }
        catch (_) { return `\"${token.params.b}\": \'${vars.getVar(token.params.b)}\' cannot be interpreted as a number`; }
      }
      else {
        try { token.params.b = BigInt(token.params.b); }
        catch (_) { return `\"${token.params.b}\" cannot be interpreted as a number`; }
      }
      return "";
    }
  },

  "EG-encrypt": {
    flags: {
      "rk": "[p], [r], and [B] are passed by reference (by variable name). Otherwise, values are assumed constants",
      "rm": "Message is passed by reference",
      "v": "verbose"
    },
    params: {
      "p": "Large prime used for security",
      "r": "Primitive-root in modulus [p]",
      "B": "Public key of receiver",
      "m": "Message to encode",
      "output (M)": "Location to store encoded message",
      "output (A)": "Location to store encoded ephermeral key"
    },
    validate: (token) => {
      if (token.flags.has("rk")) {
        if (!vars.hasVar(token.params.p)) return `Variable \"${token.params.p}\" does not exist`;
        if (!vars.hasVar(token.params.r)) return `Variable \"${token.params.r}\" does not exist`;
        if (!vars.hasVar(token.params.B)) return `Variable \"${token.params.B}\" does not exist`;

        try { token.params.p = BigInt(vars.getVar(token.params.p)); }
        catch (_) { return `\"${token.params.p}\": \'${vars.getVar(token.params.p)}\' cannot be interpreted as a number`; }
        try { token.params.r = BigInt(vars.getVar(token.params.r)); }
        catch (_) { return `\"${token.params.r}\": \'${vars.getVar(token.params.r)}\' cannot be interpreted as a number`; }
        try { token.params.B = BigInt(vars.getVar(token.params.B)); }
        catch (_) { return `\"${token.params.B}\": \'${vars.getVar(token.params.B)}\' cannot be interpreted as a number`; }
      }
      else {
        try { token.params.p = BigInt(token.params.p); }
        catch (_) { return `\"${token.params.p}\" cannot be interpreted as a number`; }
        try { token.params.r = BigInt(token.params.r); }
        catch (_) { return `\"${token.params.r}\" cannot be interpreted as a number`; }
        try { token.params.B = BigInt(token.params.B); }
        catch (_) { return `\"${token.params.B}\" cannot be interpreted as a number`; }
      }
      if (token.flags.has("rm")) {
        if (!vars.hasVar(token.params.m)) return `Variable \"${token.params.m}\" does not exist`;
        try { token.params.m = BigInt(vars.getVar(token.params.m)); }
        catch (_) { return `\"${token.params.m}\": \'${vars.getVar(token.params.m)}\' cannot be interpreted as a number`; }
      }
      else {
        try { token.params.m = BigInt(token.params.m); }
        catch (_) { return `\"${token.params.m}\" cannot be interpreted as a number`; }
      }
      return "";
    }
  },
  "EG-decrypt": {
    flags: {
      "rk": "[p] and [b] are passed by reference (by variable name). Otherwise, values are assumed constants",
      "rm": "[M] and [A] are passed by reference",
      "v": "verbose"
    },
    params: {
      "p": "Large prime used for security",
      "b": "Private key of receiver",
      "M": "Encrypted message",
      "A": "Encrypted ephemeral key",
      "output": "Location to store decoded message"
    },
    validate: (token) => {
      if (token.flags.has("rk")) {
        if (!vars.hasVar(token.params.p)) return `Variable \"${token.params.p}\" does not exist`;
        if (!vars.hasVar(token.params.b)) return `Variable \"${token.params.b}\" does not exist`;

        try { token.params.p = BigInt(vars.getVar(token.params.p)); }
        catch (_) { return `\"${token.params.p}\": \'${vars.getVar(token.params.p)}\' cannot be interpreted as a number`; }
        try { token.params.b = BigInt(vars.getVar(token.params.b)); }
        catch (_) { return `\"${token.params.b}\": \'${vars.getVar(token.params.b)}\' cannot be interpreted as a number`; }
      }
      else {
        try { token.params.p = BigInt(token.params.p); }
        catch (_) { return `\"${token.params.p}\" cannot be interpreted as a number`; }
        try { token.params.b = BigInt(token.params.b); }
        catch (_) { return `\"${token.params.b}\" cannot be interpreted as a number`; }
      }
      if (token.flags.has("rm")) {
        if (!vars.hasVar(token.params.M)) return `Variable \"${token.params.M}\" does not exist`;
        if (!vars.hasVar(token.params.A)) return `Variable \"${token.params.A}\" does not exist`;

        try { token.params.M = BigInt(vars.getVar(token.params.M)); }
        catch (_) { return `\"${token.params.M}\": \'${vars.getVar(token.params.M)}\' cannot be interpreted as a number`; }
        try { token.params.A = BigInt(vars.getVar(token.params.A)); }
        catch (_) { return `\"${token.params.A}\": \'${vars.getVar(token.params.A)}\' cannot be interpreted as a number`; }
      }
      else {
        try { token.params.M = BigInt(token.params.M); }
        catch (_) { return `\"${token.params.M}\" cannot be interpreted as a number`; }
        try { token.params.A = BigInt(token.params.A); }
        catch (_) { return `\"${token.params.A}\" cannot be interpreted as a number`; }
      }
      return "";
    }
  }
};

export function run(token) {
  switch (token.type) {
    case "help":
      printHelp(token.params.command);
      break;
    case "echo":
      consolePrintCallback(token.flags.has("l") ? token.params.text.toUpperCase() : token.params.text);
      break;
    case "clear":
      consoleClearCallback(token.flags.has("h"));
      if (token.flags.has("v")) vars.clearAll();
      break;
    case "set":
      runSetVar(token);
      break;
    case "get":
      consolePrintCallback(vars.getVar(token.params.variable, `\"${token.params.variable}\" does not exist.`))
      break;
    case "EG-private":
      runEGPrivate(token);
      break;
    case "EG-public":
      runEGPublic(token);
      break;
    case "EG-encrypt":
      runEGEncrypt(token);
      break;
    case "EG-decrypt":
      runEGDecrypt(token);
      break;
    default:
      consolePrintCallback(`%c(background-color:#890000;color:red)${token.type} not yet implemented...`);
  }
}

var consolePrintCallback = () => {};
var consoleClearCallback = () => {};
export function attachConsole(lConsolePrintCallback) {
  consolePrintCallback = lConsolePrintCallback;
}

export function attachClear(lConsoleClearCallback) {
  consoleClearCallback = lConsoleClearCallback;
}

function printHelp(cmd) {
  let data = tokensData[cmd];
  const title = `-- ${cmd} --`;
  const flags = Object.keys(data.flags).map((flag) => { return "-" + flag }).join(", ");
  const params = Object.keys(data.params).join(", ");

  consolePrintCallback(title);
  consolePrintCallback("flags: " + (flags.length ? flags : "No flags."));
  for (const flag of Object.keys(data.flags)) {
    consolePrintCallback(` %c(color:yellow)(>) %c(color:unset)-${flag}: ${data.flags[flag]}`);
  }

  consolePrintCallback("parameters: " + (params.length ? params : "No flags."));
  for (const param of Object.keys(data.params)) {
    consolePrintCallback(` %c(color:orange)(>) %c(color:unset)${param}: ${data.params[param]}`);
  }
}

function runSetVar(token) {
  const oldVar = vars.getVar(token.params.variable, "?");
  let newVar = token.params.value;
  
  if (token.flags.has("d")) {
    vars.popVar(token.params.variable);
    newVar = "?";
  }
  else vars.setVar(token.params.variable, token.params.value);

  consolePrintCallback(`\"${token.params.variable}\": (\'%c(color:red)${oldVar}%c(color:unset)\' > \'%c(color:orange)${newVar}%c(color:unset)\')`);
}

function runEGPrivate(token) { // conversion of pass-by-reference settled at validation level
  const p = token.params.p;
  const b = eg.generatePrivateKey(BigInt(p));
  const oldVar = vars.getVar(token.params.output, "?");
  vars.setVar(
    token.params.output,
    b.toString()
  );

  if (token.flags.has("v")) { // verbose
    consolePrintCallback(`Picking psuedo-random number in range [1,${p}-1]`)
    consolePrintCallback(`\"${token.params.output}\" (private-key): (\'%c(color:red)${oldVar}%c(color:unset)\' > \'%c(color:orange)${b}%c(color:unset)\')`);
  }
  else {
    consolePrintCallback(b.toString());
  }
}

function runEGPublic(token) { // conversion of pass-by-reference settled at validation level
  const p = token.params.p;
  const r = token.params.r;
  const b = token.params.b;

  const B = eg.generatePublicKey(p,r,b);
  const oldVar = vars.getVar(token.params.output, "?");
  vars.setVar(
    token.params.output,
    B.toString()
  );
  
  if (token.flags.has("v")) { // verbose
    consolePrintCallback(`Evaluating %c(color:orange)(${r}^${b})%c(color:unset) with modulus of '${p}'`)
    consolePrintCallback(`\"${token.params.output}\" (public-key): (\'%c(color:red)${oldVar}%c(color:unset)\' > \'%c(color:orange)${b}%c(color:unset)\')`);
  }
  else {
    consolePrintCallback(B.toString());
  }
}

function runEGEncrypt(token) { // conversion of pass-by-reference settled at validation level
  const p = token.params.p;
  const r = token.params.r;
  const B = token.params.B;
  const m = token.params.m;

  const { M,A,a } = eg.encrypt(p,r,B,m);

  const oldMVar = vars.getVar(token.params["output (M)"], "?");
  const oldAVar = vars.getVar(token.params["output (A)"], "?");

  vars.setVar(
    token.params["output (M)"],
    M.toString()
  );
  vars.setVar(
    token.params["output (A)"],
    A.toString()
  );

  if (token.flags.has("v")) {
    consolePrintCallback("- Message:");
    consolePrintCallback(`Evaluating %c(color:orange)(${r}^${a})%c(color:unset) with modulus of '${p}'`)
    consolePrintCallback(`\"${token.params["output (M)"]}\" (Encrypted Message): (\'%c(color:red)${oldMVar}%c(color:unset)\' > \'%c(color:orange)${M}%c(color:unset)\')`);
    consolePrintCallback("- Ephemeral Key:");
    consolePrintCallback(`Picking psuedo-random number in range [1,${p}-1]; a=${a}`);
    consolePrintCallback(`Evaluating %c(color:orange)(${m}*${B}^${a})%c(color:unset) with modulus of '${p}'`)
    consolePrintCallback(`\"${token.params["output (A)"]}\" (Encrypted Ephemeral Key): (\'%c(color:red)${oldAVar}%c(color:unset)\' > \'%c(color:orange)${A}%c(color:unset)\')`);
  }
  else {
    consolePrintCallback(`${token.params["output (M)"]}: ${M.toString()}`);
    consolePrintCallback(`${token.params["output (A)"]}: ${A.toString()}`);
  }
}

function runEGDecrypt(token) { // conversion of pass-by-reference settled at validation level
  const p = token.params.p;
  const b = token.params.b;
  const M = token.params.M;
  const A = token.params.A;

  const m = eg.decrypt(p,b,M,A)

  const oldVar = vars.getVar(token.params.output, "?");

  vars.setVar(
    token.params.output,
    m.toString()
  );

  if (token.flags.has("v")) {
    consolePrintCallback(`Evaluating %c(color:orange)(${M}*${A}^(${p}-1-${b}))%c(color:unset) with modulus of '${p}'`)
    consolePrintCallback(`\"${token.params.output}\" (Decrypt): (\'%c(color:red)${oldVar}%c(color:unset)\' > \'%c(color:orange)${m}%c(color:unset)\')`);
  }
  else {
    consolePrintCallback(`${token.params.output}: ${m.toString()}`);
  }
}
