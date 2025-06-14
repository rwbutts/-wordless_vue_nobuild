"use strict";
function assert(condition, message = '') {
    if (!condition) {
        throw new Error('assert() failed: ' + message);
    }
}