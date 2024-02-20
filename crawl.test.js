const {normalizeUrl, getUrlsFromHtml} = require ("./crawl.js");
const {test, expect} = require ("@jest/globals");

// https://google.com --> google.com
// http://google.com --> google.com

test('normalizeUrl strip protocol',() => {
    const input = "http://google.com/path";
    const actual = normalizeUrl(input);
    const expected = "google.com/path";
    expect(actual).toEqual(expected);
})

test('normalizeUrl strip trailing slash',() => {
    const input = "http://google.com/path/";
    const actual = normalizeUrl(input);
    const expected = "google.com/path";
    expect(actual).toEqual(expected);
})

test('normalizeUrl strip capitals',() => {
    const input = "http://Google.COM/path/";
    const actual = normalizeUrl(input);
    const expected = "google.com/path";
    expect(actual).toEqual(expected);
})

test('normalizeUrl strip http',() => {
    const input = "https://Google.COM/path/";
    const actual = normalizeUrl(input);
    const expected = "google.com/path";
    expect(actual).toEqual(expected);
})

// --

test('getUrlsFromHtml absolute url',() => {
    const input_html_body = `
    <html>
        <body>
            <a href="https://google.com/path/">
                Link to the website.
            </a>
        </body>
    </html>
    `;
    const input_base_url = "https://google.com";
    const actual = getUrlsFromHtml(input_html_body, input_base_url);
    const expected = ["https://google.com/path/"];
    expect(actual).toEqual(expected);
})

test('getUrlsFromHtml relative url',() => {
    const input_html_body = `
    <html>
        <body>
            <a href="/path/">
                Link to the website.
            </a>
        </body>
    </html>
    `;
    const input_base_url = "https://google.com";
    const actual = getUrlsFromHtml(input_html_body, input_base_url);
    const expected = ["https://google.com/path/"];
    expect(actual).toEqual(expected);
})

test('getUrlsFromHtml multiple url',() => {
    const input_html_body = `
    <html>
        <body>
            <a href="/path/1">
                First link to the website.
            </a>
            <a href="/path/2">
                Second link to the website.
            </a>
        </body>
    </html>
    `;
    const input_base_url = "https://google.com";
    const actual = getUrlsFromHtml(input_html_body, input_base_url);
    const expected = ["https://google.com/path/1", "https://google.com/path/2"];
    expect(actual).toEqual(expected);
})

test('getUrlsFromHtml invalid url',() => {
    const input_html_body = `
    <html>
        <body>
            <a href="invalid">
                Broken link to the website.
            </a>
        </body>
    </html>
    `;
    const input_base_url = "https://google.com";
    const actual = getUrlsFromHtml(input_html_body, input_base_url);
    const expected = [];
    expect(actual).toEqual(expected);
})
