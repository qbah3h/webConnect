
// const { getUrlsFromHtml } = require("./crawl.js");
const {JSDOM} = require("jsdom");

function extractInformation(html) {
    // const responseCleaned = extractNonTechnicalText(response);
    // console.log("size responseCleaned" + responseCleaned.length);

    // const meta_content = extractMetaContent(response);
    // console.log("size meta_content" + meta_content.length);

    const body_only = extractBody(html);
    console.log("body_only size" + body_only.length);

    const categories = extractCategories(body_only);
    const images = extractImages(body_only);
    const price = extractPrice(body_only);
    const description = extractDescription(body_only);
    const seller = extractSellerInfo(body_only);
    const product_name = extractProductName(body_only);
    const rating = extractRating(body_only);
    const related_urls = getUrlsFromHtml(body_only);
    const metadata = {
        product_name,
        description,
        rating,
        price,
        seller,
        categories,
        images,
        related_urls
    }
    console.log(`metadata: ${JSON.stringify(related_urls)}`);

    return metadata;
}

function getUrlsFromHtml(html_body, base_url) {
    const urls = [];
    const dom = new JSDOM(html_body);
    const link_elements = dom.window.document.querySelectorAll("a");
    
    for (const link_element of link_elements) {
        let url = "";
        if (link_element.href.slice(0, 1) === "/") {
            // relative
            try {
                const url_obj = new URL(`${base_url}${link_element.href}`);
                url = url_obj.href;
            } catch (error) {
                console.log(`Error with relative url: ${error.message}`);
            }
        } else {
            // absolute
            try {
                const url_obj = new URL(`${link_element.href}`);
                url = url_obj.href;
            } catch (error) {
                console.log(`Error with absolute url: ${error.message}`);
            }
        }
        
        if (url) {
            urls.push(url);
        }
    }
    
    // Remove duplicates
    const uniqueUrls = [...new Set(urls)];
    
    // Sort alphabetically
    uniqueUrls.sort();
    
    return uniqueUrls;
}

function extractRating(html) {
    const ratingStart = '<span aria-hidden="true" class="ui-pdp-review__rating">';
    const ratingEnd = '</span>';
    const ratingStartIndex = html.indexOf(ratingStart);
    const ratingEndIndex = html.indexOf(ratingEnd, ratingStartIndex + ratingStart.length);

    let rating = null;
    if (ratingStartIndex !== -1 && ratingEndIndex !== -1) {
        rating = html.substring(ratingStartIndex + ratingStart.length, ratingEndIndex);
    }

    return { rating: rating };
}

function extractProductName(html) {
    const titleStart = '<h1 class="ui-pdp-title">';
    const titleEnd = '</h1>';
    const titleStartIndex = html.indexOf(titleStart);
    const titleEndIndex = html.indexOf(titleEnd, titleStartIndex + titleStart.length);

    let productName = null;
    if (titleStartIndex !== -1 && titleEndIndex !== -1) {
        productName = html.substring(titleStartIndex + titleStart.length, titleEndIndex);
    }

    return { name: productName };
}

function extractSellerInfo(html) {
    const sellerNameStart = 'class="ui-pdp-action-modal__link"><span class="ui-pdp-color--BLUE ui-pdp-family--REGULAR">';
    const sellerNameEnd = '</span>';
    const sellerNameStartIndex = html.indexOf(sellerNameStart);
    const sellerNameEndIndex = html.indexOf(sellerNameEnd, sellerNameStartIndex + sellerNameStart.length);

    let sellerName = null;
    if (sellerNameStartIndex !== -1 && sellerNameEndIndex !== -1) {
        sellerName = html.substring(sellerNameStartIndex + sellerNameStart.length, sellerNameEndIndex);
    }

    const urlStart = 'href="';
    const urlEnd = '"';
    const urlStartIndex = html.indexOf(urlStart);
    const urlEndIndex = html.indexOf(urlEnd, urlStartIndex + urlStart.length);

    let url = null;
    if (urlStartIndex !== -1 && urlEndIndex !== -1) {
        url = html.substring(urlStartIndex + urlStart.length, urlEndIndex);
    }

    return {
        seller: {
            name: sellerName,
            url: url
        }
    };
}

function extractDescription(html) {
    const startTag = '<p class="ui-pdp-description__content">';
    const endTag = '</p>';
    const startIndex = html.indexOf(startTag);
    const endIndex = html.indexOf(endTag, startIndex + startTag.length);
    if (startIndex !== -1 && endIndex !== -1) {
        const description = html.substring(startIndex + startTag.length, endIndex);
        // Remove <br /> tags and trim whitespace
        const cleanedDescription = description.replace(/<br\s*\/?>/g, ' ').trim();
        return { description: cleanedDescription };
    } else {
        return { description: null };
    }
}

function extractPrice(html) {
    const regex = /<meta\sitemProp="price"\scontent="(\d+)"/;
    const match = html.match(regex);
    if (match && match[1]) {
        return { price: parseInt(match[1]) };
    } else {
        return { price: null };
    }
}

function extractImages(html) {
    const regex = /<img[^>]+data-zoom="([^"]+)"[^>]*>/g;
    let match;
    const images = [];

    while ((match = regex.exec(html)) !== null) {
        images.push(match[1]);
    }

    return { images };
}

function extractCategories(html) {
    const regex = /<a\s+class="andes-breadcrumb__link"\s+href=".*?"\s+title="(.*?)">.*?<\/a>/g;
    let match;
    const categories = [];

    while ((match = regex.exec(html)) !== null) {
        categories.push(match[1]);
    }

    return { category: categories };
}

function extractBody(html) {
    // Remove script tags and their contents
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Extract body content
    const bodyRegex = /<body\b[^>]*>([\s\S]*)<\/body>/i;
    const match = bodyRegex.exec(html);
    if (match && match.length > 1) {
        return match[1];
    } else {
        return null;
    }
}

function extractUrls(sourceCode) {
    // Regular expression to match URLs
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    // Array to store extracted URLs
    var urls = [];
    
    // Find all matches of URLs in the source code
    var matches = sourceCode.match(urlRegex);
    
    // If matches found, push them to the urls array after trimming
    if (matches) {
        matches.forEach(function(url) {
            urls.push(url.trim());
        });
    }
    
    // Sort the urls alphabetically
    urls.sort();
    
    return urls;
}

// function extractAndSortUrls(sourceCode) {
//     // Regular expression to find URLs
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
    
//     // Extract URLs from source code
//     const urls = sourceCode.match(urlRegex) || [];
    
//     // Sort URLs alphabetically
//     urls.sort((a, b) => a.localeCompare(b));
    
//     return urls;
// }


module.exports = {
    extractInformation
}

// The base of this implementation was taken from the video:
// https://www.youtube.com/watch?v=C0pXaNchNTA&t=3101s
// const { crawlPage } = require("./crawl.js");
// function main() {
//     // const seed_url = "http://www.linkedin.com/in/andres-molina-28044b183/";
//     // const seed_url = "http://www.cubadebate.cu/especiales/2024/02/20/errantes-en-su-propia-tierra-miradas-al-fenomeno-de-los-deambulantes-en-cuba-i-video-podcast-e-infografia/";

//     console.log("starting crawl...");
//     crawlPage(seed_url);
// }

// main();