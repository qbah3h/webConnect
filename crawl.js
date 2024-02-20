const {JSDOM} = require("jsdom");
// The base of this implementation was taken from the video:
// https://www.youtube.com/watch?v=C0pXaNchNTA&t=3101s
function normalizeUrl(url_string) {
    const url_obj = new URL(url_string);
    const host_path = `${url_obj.hostname}${url_obj.pathname}`;
    if(host_path.length > 0 && host_path.slice(-1) === '/') {
        return host_path.slice(0, -1);
    }
    return host_path;
}

// This function could be refactored to acept a list of elements
// (the ones selected to crawl) and return all the elements
function getUrlsFromHtml(html_body, base_url) {
    const urls = [];
    const dom = new JSDOM(html_body);
    const link_elements = dom.window.document.querySelectorAll("a");
    for (const link_element of link_elements) {
        if(link_element.href.slice(0, 1) === "/") {
            // relative
            try {
                const url_obj = new URL(`${base_url}${link_element.href}`);
                urls.push(url_obj.href);
            } catch (error) {
                console.log(`Error with relative url: ${error.message}`);
            }
        } else {
            // absolute
            try {
                const url_obj = new URL(`${link_element.href}`);
                urls.push(url_obj.href);
            } catch (error) {
                console.log(`Error with absolute url: ${error.message}`);
            }
        }
    }
    return urls;
}

async function crawlPage(page_to_crawl){
    console.log(`actively crawling ${page_to_crawl}`);
    try {
        const resp = await fetch(page_to_crawl);
        if(resp.status > 399) {
            console.log(`Error in fetch wit status code: ${resp.status}, on page ${page_to_crawl}`);
            return;
        }
        const content_type = resp.headers.get("content-type");
        if(!content_type.includes("text/html")) {
            console.log(`No html response, content type: ${content_type}, on page ${page_to_crawl}`);
            return;
        }
        console.log(await resp.text());
    } catch (error) {
        console.log(`Error when fetching url: ${error.message}, on page ${page_to_crawl}`);
    }
    
}

module.exports = {
    normalizeUrl,
    getUrlsFromHtml,
    crawlPage
}