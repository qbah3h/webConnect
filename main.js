// The base of this implementation was taken from the video:
// https://www.youtube.com/watch?v=C0pXaNchNTA&t=3101s
const {crawlPage} = require("./crawl.js");
function main() {
    // const seed_url = "http://www.linkedin.com/in/andres-molina-28044b183/";
    // const seed_url = "http://www.cubadebate.cu/especiales/2024/02/20/errantes-en-su-propia-tierra-miradas-al-fenomeno-de-los-deambulantes-en-cuba-i-video-podcast-e-infografia/";
    const seed_url = "http://www.grong_url/";

    console.log("starting crawl...");
    crawlPage(seed_url);
}

main();