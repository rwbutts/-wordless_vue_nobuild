const APP_VERSION="3.3.0-NB";

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
    exists;
    success;
    message;
    api_version;
    constructor(exists, message, api_version, success = true, ) {
        this.exists = exists;
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

function assert(condition, message = '') {
    if (!condition) {
        throw new Error('assert() failed: ' + message);
    }
}

