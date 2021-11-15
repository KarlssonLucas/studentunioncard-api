import puppeteer, { Puppeteer } from 'puppeteer';
import { Request, Response } from "express";

interface cookies {
    url: string;
    name: string;
    value: string;
  }

const fetchBalance = async (req: Request, res: Response) => {
    console.log("1")
    // Cookie from stringquery, kind of safe with https request.
    let cookie: string = req.params.cookie;

    // Check if user entered no cookie
    if(cookie == "") {
        res.status(200).json({bal: 'no cookie'})
    }

    // Launch options for opening chromium browser
    const chromeOptions: {headless: boolean, defaultViewport: any, args: [string, string, string]} = {
        headless: true,
        defaultViewport: null,
        args: [
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
    };
    
    // Launching the browser and opening a empty page
    const browser: puppeteer.Browser = await puppeteer.launch(chromeOptions);
    const page: puppeteer.Page = await browser.newPage();

    // Define the cookies used in the browser
    const cookies: cookies[] = [{
        'url': 'https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx',
        'name': 'userInfo',
        'value': cookie
    },{
        'url': 'https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx',
        'name': 'AspxAutoDetectCookieSupport',
        'value': '1'
    }];

    // Set the cookies and navigate to the student union card balance page
    await page.setCookie(...cookies);    
    await page.goto('https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx',{waitUntil: 'domcontentloaded'});  
    
    // Scrape the page for the data we are looking for using a queryselector and js path
    const textContent: string = await page.evaluate(() => {
        if (document.querySelector("#txtPTMCardValue") == null) {
            return "wrongcookie";
        } else {
            return document.querySelector("#txtPTMCardValue")!.innerHTML;
        }
    });

    // Close the browser and send the contents of the page
    await browser.close();
    res.status(200).json({bal: textContent});
}

export default { fetchBalance };