const express = require('express');
const path = require('path');
const { startCrwawl } = require("./crawl.js");



const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/loadWebsite', async (req, res) => {
    const url = req.body.url;
    
    const test = startCrwawl(url);
    // console.log("size response" + response.length);

    // const formatted = extractInformation(response);

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



    res.json({ test });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
