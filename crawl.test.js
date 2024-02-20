const {normalizeUrl} = require ("./crawl.js");
const {test, expect} = require ("@jest/globals");

// https://google.com --> google.com
// http://google.com --> google.com

test('normalizeUrl strip protocol',() => {
    const input = "http://google.com/something_else";
    const actual = normalizeUrl(input);
    const expected = "google.com/something_else";
    expect(actual).toEqual(expected);
})

test('normalizeUrl strip trailing slash',() => {
    const input = "http://google.com/something_else/";
    const actual = normalizeUrl(input);
    const expected = "google.com/something_else";
    expect(actual).toEqual(expected);
})

test('normalizeUrl strip capitals',() => {
    const input = "http://Google.COM/something_else/";
    const actual = normalizeUrl(input);
    const expected = "google.com/something_else";
    expect(actual).toEqual(expected);
})

test('normalizeUrl strip http',() => {
    const input = "https://Google.COM/something_else/";
    const actual = normalizeUrl(input);
    const expected = "google.com/something_else";
    expect(actual).toEqual(expected);
})
