const APP_VERSION="3.2.0-NB";

const  EventNames = {
    SET_KEY_COLOR : "set_key_color",
}

class GameOverEvt  {
    won;
    guesses;
    constructor( won, guesses ){
        this.won=won; 
        this.guesses=guesses;
    }
}

class KBRawKeyClickEvt  {
    key;
    constructor( key ){
        this.key=key; 
    }
}

class WordValidatedEvt  {
    word;
    constructor( word ){
        this.word=word; 
    }
}

class SetKeyColorEvt  {
    key;
    color;

    constructor( key, color ){
        this.key=key; 
        this.color=color; 
    }
}


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

function assert(condition, message = '') {
    if (!condition) {
        throw new Error('assert() failed: ' + message);
    }
}

