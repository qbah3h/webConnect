const express = require('express');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




// The base of this implementation was taken from the video:
// https://www.youtube.com/watch?v=C0pXaNchNTA&t=3101s
const { crawlPage } = require("./crawl.js");
function main() {
    // const seed_url = "http://www.linkedin.com/in/andres-molina-28044b183/";
    // const seed_url = "http://www.cubadebate.cu/especiales/2024/02/20/errantes-en-su-propia-tierra-miradas-al-fenomeno-de-los-deambulantes-en-cuba-i-video-podcast-e-infografia/";
    const seed_url = "https://articulo.mercadolibre.com.uy/MLU-611983413-patines-rollers-flying-eagle-f110-eclipse-urbano-3-ruedas-_JM#polycard_client=recommendations_home_second-best-navigation-trend-recommendations&reco_backend=machinalis-homes-univb&reco_client=home_second-best-navigation-trend-recommendations&reco_item_pos=0&reco_backend_type=function&reco_id=aa965cc9-5095-4fb5-8ddf-2a9e678f2e66&c_id=/home/second-best-navigation-trend-recommendations/element&c_uid=de1528dc-55d8-4f34-899f-3ca824be6be6";

    console.log("starting crawl...");
    crawlPage(seed_url);
}

main();