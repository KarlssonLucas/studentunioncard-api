const express = require("express");
const app = express();
const scraper = require('./scraper');
const port = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get("/", scraper.result)   

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})