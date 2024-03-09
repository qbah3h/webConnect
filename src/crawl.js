const { extractInformation } = require("./information.js");
const { JSDOM } = require("jsdom");
/*
  create counter (max urls)
    send seed
    crawl -> extract characteristics -> extract urls
        filter to match urls with accepted urls (an array containing the acepted urls)
    save to database all info
    create counter2 (max depth)
    loop trough each url until counter is < 500 or (if price is not found and counter2 < 5)
        increment counter and counter2
        crawl
        */
let max_urls = 20;
let depth = 3;
async function startCrwawl(seed) {
    const response = await crawlPage(seed);
    //
    const formatted = extractInformation(response);
    formatted.content = response;
    formatted.url = seed;
    // console.log(formatted);
    // console.log(formatted.related_urls);

    const formatted_urls = selectUrls(formatted.related_urls, seed);
    formatted.formatted_urls = formatted_urls;
    // console.log(formatted);
    // Save to database formatted
    for (let i = 0; i < formatted_urls.length; i++) {
        if (max_urls > 0) {
            max_urls--;
            startCrwawl(formatted_urls[i]);
        }

    }


    // return response;
}

const possible_base_urls = ["https://tarjetero.uy"]
function selectUrls(related_urls, substring) {
    let allowed = false;
    let allowed_urls = [];
    for (let x = 0; x < related_urls.length; x++) {
        for (let i = 0; i < possible_base_urls.length; i++) {
            if (related_urls[x].startsWith(possible_base_urls[i])) {
                allowed = true;
            }
        }
        if (allowed) {
            allowed_urls.push(related_urls[x]);
        }
    }
    return allowed_urls;
}

function normalizeUrl(url_string) {
    const url_obj = new URL(url_string);
    const host_path = `${url_obj.hostname}${url_obj.pathname}`;
    if (host_path.length > 0 && host_path.slice(-1) === '/') {
        return host_path.slice(0, -1);
    }
    return host_path;
}

// This function could be refactored to acept a list of elements
// (the ones selected to crawl) and return all the elements
// function getUrlsFromHtml(html_body, base_url) {
//     const urls = [];
//     const dom = new JSDOM(html_body);
//     const link_elements = dom.window.document.querySelectorAll("a");

//     for (const link_element of link_elements) {
//         let url = "";
//         if (link_element.href.slice(0, 1) === "/") {
//             // relative
//             try {
//                 const url_obj = new URL(`${base_url}${link_element.href}`);
//                 url = url_obj.href;
//             } catch (error) {
//                 console.log(`Error with relative url: ${error.message}`);
//             }
//         } else {
//             // absolute
//             try {
//                 const url_obj = new URL(`${link_element.href}`);
//                 url = url_obj.href;
//             } catch (error) {
//                 console.log(`Error with absolute url: ${error.message}`);
//             }
//         }

//         if (url) {
//             urls.push(url);
//         }
//     }

//     // Remove duplicates
//     const uniqueUrls = [...new Set(urls)];

//     // Sort alphabetically
//     uniqueUrls.sort();

//     return uniqueUrls;
// }

async function crawlPage(page_to_crawl) {
    console.log(`actively crawling ${page_to_crawl}`);
    try {
        const resp = await fetch(page_to_crawl);
        if (resp.status > 399) {
            console.log(`Error in fetch wit status code: ${resp.status}, on page ${page_to_crawl}`);
            return;
        }
        const content_type = resp.headers.get("content-type");
        if (!content_type.includes("text/html")) {
            console.log(`No html response, content type: ${content_type}, on page ${page_to_crawl}`);
            return;
        }
        const response = await resp.text();
        return response;
    } catch (error) {
        console.log(`Error when fetching url: ${error.message}, on page ${page_to_crawl}`);
    }

}

module.exports = {
    normalizeUrl,
    // getUrlsFromHtml,
    crawlPage,
    startCrwawl
}