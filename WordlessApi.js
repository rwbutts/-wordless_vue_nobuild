"use strict";
// @ts-check
const API_SITE = process.env.VUE_APP_API_SITE;
const HEALTHCHECK_URI = process.env.VUE_APP_API_URI_HEALTHCHECK;
const GETWORD_URI = process.env.VUE_APP_API_URI_GETWORD;
const CHECKWORD_URI = process.env.VUE_APP_API_URI_CHECKWORD;
const GETMATCHCOUNT_URI = process.env.VUE_APP_API_URI_GETMATCHCOUNT;
const HTTP_VER_HEADER = "X-wordless-api-version";

class WordlessAPI {
    async getWordAsync(daysAgo = -1) {
        return getWordAsync(daysAgo);
    }
    async checkWordAsync(word) {
        return checkWordAsync(word);
    }
    async getMatchCountAsync(answer, guessArray) {
        return getMatchCountAsync(answer, guessArray);
    }
    async healthCheckAsync() {
        return healthCheckAsync();
    }
}
async function healthCheckAsync() {
    try {
        const json = await _fetchAndGetJson(`${API_SITE}${HEALTHCHECK_URI}`);
        return { healthy: true, message: '', api_version: json.api_version };
    }
    catch (err) {
        return { healthy: false, message: err.message, api_version: 'n/a' };
    }
}
async function getWordAsync(daysAgo = -1) {
    try {
        const json = await _fetchAndGetJson(`${API_SITE}${GETWORD_URI}/${daysAgo}`);
        return { word: json.word.toUpperCase(), success: true, message: '', api_version: json.api_version };
    }
    catch (err) {
        return { word: undefined, success: false, message: err.message, api_version: 'n/a' };
    }
}
export async function checkWordAsync(Word) {
    const WordLC = Word.toLowerCase();
    try {
        const json = await _fetchAndGetJson(`${API_SITE}${CHECKWORD_URI}/${WordLC}`);
        return { exists: json.exists, success: true, message: '', api_version: json.api_version };
    }
    catch (err) {
        return { exists: undefined, success: false, message: err.message, api_version: 'n/a' };
    }
}
export async function getMatchCountAsync(answer, guessArray) {
    const postData = {
        answer: answer.toLowerCase(),
        guesses: guessArray.map((d) => d.toLowerCase()),
    };
    try {
        const json = await _fetchAndGetJson(`${API_SITE}${GETMATCHCOUNT_URI}`, postData);
        return { count: json.count, success: true, message: '', api_version: json.api_version };
    }
    catch (err) {
        return { count: undefined, success: false, message: err.message, api_version: 'n/a' };
    }
}
async function _fetchAndGetJson(Url, PostData = null) {
    let RequestParams;
    if (PostData === null) {
        RequestParams = {
            method: 'GET',
            headers: {
                'Accept': '*/*',
            },
        };
    }
    else {
        RequestParams = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(PostData),
        };
    }
    const response = await fetch(Url, RequestParams);
    if (!response.ok) {
        throw new Error(`[${response.status}] ${response.statusText}`);
    }
    const json = await response.json();
    json['api_version'] = response.headers.get(HTTP_VER_HEADER) ?? 'n/a';
    return Promise.resolve(json);
}

const WordlessApiService = new WordlessAPI();
