var vars = {};

export function init() {
  const oldVars = localStorage.getItem("vars");
  if (!oldVars) return;
  
  let oldVarObj = {};
  try {
    oldVarObj = JSON.parse(oldVars);
    if (typeof oldVarObj != "object") {
      localStorage.removeItem("vars");
      return; // incorrect format
    }
  }
  catch (_) { // unable to convert
    localStorage.removeItem("vars");
    return;
  }
  
  for (let varName in oldVarObj) {
    vars[varName] = oldVarObj[varName];
  }
}

export function setVar(
  name,
  value
) {
  vars[name] = value;
  updateLocalStorage();
}

export function getVar(
  name,
  fallback = null
) {
  if (name in vars) return vars[name];
  return fallback;
}

export function popVar(
  name
) {
  if (name in vars) {
    delete vars[name];
    updateLocalStorage();
  }
}

export function hasVar(name) {
  return name in vars;
}

export function clearAll() {
  for (const name in vars) {
    delete vars[name];
  }
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("vars", JSON.stringify(vars));
}