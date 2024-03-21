const { extractInformation } = require("./information.js");
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
let max_urls = 2;
let counter = 0;
let test = [];
async function startCrwawl(seed) {
    let formatted;
    counter++;
    console.log(counter);
    try {
        const response = await crawlPage(seed);        
        // Check if response is empty
        console.log('crawled');
        if (!response) {
            console.log("Empty response for:", seed);
            return; // Skip to next iteration
        }
        //
        try {
            formatted = extractInformation(response);
            // console.log("formatted:", formatted);
        } catch (error) {
            console.error("Error extracting information:", seed, error);
            // Handle error as required, e.g., log, skip, etc.
        }
        formatted.content = response;
        formatted.url = seed;
        const formatted_urls = selectUrls(formatted.related_urls, seed);
        if (!formatted_urls) {
            console.log("No associated urls found for:", seed);//mark url as last
            return; // Skip to next iteration
        }
        formatted.formatted_urls = formatted_urls;
        console.log("formatted:", formatted);
        // Save to database formatted
        return formatted;
        for (let i = 0; i < formatted_urls.length; i++) {
            if (!test.includes(formatted_urls[i]) && max_urls > 0) {
                console.log('if');
                max_urls--;
                // If not, add it to the array
                test.push(formatted_urls[i]);
                startCrwawl(formatted_urls[i]);
            }
            // if (max_urls > 0) {
            // max_urls--;
            // startCrwawl(formatted_urls[i]);
            // }

        }
    } catch (error) {
        console.error("Error crawling page:", seed, error);
        // Handle error as required, e.g., log, skip, etc.
    }
}

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

module.exports = {
    crawlPage,
    startCrwawl
}