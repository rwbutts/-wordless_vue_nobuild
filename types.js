"use strict";

const APP_VERSION="3.7.4-NB";
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
    EASY: "easy",
    HARD: "hard",
    EXTRA_HARD: "extra-hard",
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

class GuessScorer {
    _guessWord;
    _scoreCodes;
    constructor(guessWord, answerWord) {
        assert(() => guessWord !== null, "guessWord is empty");
        assert(() => answerWord !== null, "answerWord is empty");
        assert(() => guessWord.length === answerWord.length, "guessWord and answerWord strings have unequal lengths");
        this._guessWord = guessWord.toLowerCase();
        this._scoreCodes = GuessScorer.getWordScoreCodes(this._guessWord, answerWord.toLowerCase());
    }
    static getWordScoreCodes(guessWord, answerWord) {
        const codes = [];
        for (let i = 0; i < guessWord.length; i++) {
            codes.push(GuessScorer.getLetterScoreCode(guessWord, answerWord, i));
        }
        return codes;
    }
    static getLetterScoreCode(guessWord, answerWord, position) {
        assert(() => position < guessWord.length, "index past end of string");
        const guessChar = guessWord.charAt(position);
        return guessChar == answerWord.charAt(position)
            ? MatchCodes.CORRECT
            : answerWord.includes(guessChar)
                ? MatchCodes.ELSEWHERE
                : MatchCodes.MISS;
    }

    isCompatibleAnswer(alternateAnswer) {
        const testScore = GuessScorer.createGuessScorer(this._guessWord, alternateAnswer);
        assert(() => testScore._scoreCodes.length === this._scoreCodes.length, "alternateAnswer Score and this Score vectors have different lengths");
        return (testScore._scoreCodes.every((sc, ix) => sc === this._scoreCodes[ix]));
    }
    computeGuessCompatibility(newGuess) {

    }

    static createGuessScorer(guess, answer) {
        return new GuessScorer(guess, answer);
    }
}

class RNG {
    m = 0x80000000;
    a = 1103515245;
    c = 12345;
    state;
    constructor(seed) {
        // LCG using GCC's constants
        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }
    seed(seed) {
        this.state = seed;
    }
    nextInt() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }
    nextFloat() {
        // returns in range [0,1]
        return this.nextInt() / (this.m - 1);
    }
    nextRange(start, end) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        const rangeSize = end - start;
        const randomUnder1 = this.nextInt() / this.m;
        return start + Math.floor(randomUnder1 * rangeSize);
    }
    choice(array) {
        return array[this.nextRange(0, array.length)];
    }
}

