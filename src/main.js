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
    
    const test = await startCrwawl(url);
    // console.log(test)
    // console.log('---------------test---------------')
    res.json({test});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
