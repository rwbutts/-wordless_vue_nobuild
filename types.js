const APP_VERSION="3.6.2-NB";
const APP_CHEAT_CODE = "XYZZY";    // 5-letter uppercase nonsense trigger word or "" to disable feature

const GamePlayStates = {
    LOADING_WORD : "gamestate-loading",
    PLAYING : "gamestate-playing",
    WON : "gamestate-won",
    LOST : "gamestate-lost",
}

const MatchCodes = {
    DEFAULT : "default",
    MISS : "miss",
    ELSEWHERE :  "elsewhere",
    CORRECT : "correct",
}

const statusMessageClass = { 
    DEFAULT: "",
    ERROR: "error",
    WIN: "winner",
    LOSE: "loser",
    WELCOME: "winner",
}

const KeyCodes = {
    ENTER : "ENTER",
    DELETE : "DELETE",
    ALPHA : "ALPHA",
    NONALPHA : "SPECIAL",
    ALL : "*",
    RESET : "RESET",
}

const GameModes = {
    EASY: 'easy',
    HARD: 'hard',
    EXTRA_HARD: 'extra-hard',
}

class HealthCheckApiResponse {
    healthy;
    message;
    api_version;
    constructor(healthy, message, api_version, ) {
        this.healthy = healthy;
        this.message = message;
        this.api_version = api_version;
    }
}

class CheckWordApiResponse {
    valid;
    success;
    message;
    api_version;
    constructor(valid, message, api_version, success = true, ) {
        this.valid = valid;
        this.message = message;
        this.success = success;
        this.api_version = api_version;
    }
}

class GetWordApiResponse {
    word;
    success;
    message;
    api_version;
    constructor(word, message, api_version, success = true, ) {
        this.word = word;
        this.message = message;
        this.success = success;
        this.api_version = api_version;
    }
}

class GetMatchCountApiResponse {
    count;
    success;
    message;
    api_version;
    constructor(count, message, api_version, success = true, ) {
        this.count = count;
        this.message = message;
        this.success = success;
        this.api_version = api_version;
    }
}

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
