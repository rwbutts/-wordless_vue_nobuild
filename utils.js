"use strict";

function extractFunctionText(fn) {
    const s = fn.toString().trim();

    if (typeof fn !== "function") {
        return `VALUE(${typeof fn}:${fn})`;
    }

    // Arrow with expression body: () => a + b
    let m = s.match(/=>\s*([\s\S]*)$/);
    if (m) {
        let body = m[1].trim();
        // block body: () => { return a + b; }
        if (body.startsWith("{")) {
            let ret = body.match(/return\s+([\s\S]*?);?\s*}/);
            if (ret) return ret[1].trim();
        }
        // expression body
        return body.replace(/;$/, "").trim();
    }

    // Normal function: function(){ return a + b; }
    m = s.match(/return\s+([\s\S]*?);?\s*}/);
    if (m) return m[1].trim();

    // fallback: whole function text
    return s;
}

function assert(conditionFn, message) {
  const isFunction = typeof conditionFn === 'function';
  const value = isFunction ? conditionFn() : !!conditionFn;
  const source = isFunction ? extractFunctionText(conditionFn) : String(conditionFn);

  if (!value) {
    throw new Error((`assert(${source})` || 'asserted condition') + ' is FALSE' + (message ? ': ' + message : ''));
  }
}

function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
