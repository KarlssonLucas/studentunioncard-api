const express = require("express");
const app = express();
const scraper = require('./scraper');

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get("/", scraper.result)   

app.listen(3000, () => {
 console.log("Server running on port 3000");
});