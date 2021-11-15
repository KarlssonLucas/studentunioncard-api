import express, { Express } from "express";
import scraperFunctions from './scraper';
const app: Express = express();
const port: string = process.env.PORT || '5000'

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get("/:cookie", scraperFunctions.fetchBalance)   

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})