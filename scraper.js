const puppeteer = require('puppeteer');
const { request, response } = require("express");

const result = async (request, response) => {
    if(request.params.cookie == "") {
        response.status(400).send("no cookie")
    }

    (async () => {
        const chromeOptions = {
            headless: true,
            defaultViewport: null,
            args: [
                "--no-sandbox",
                "--single-process",
                "--no-zygote"
            ],
        };
        const browser = await puppeteer.launch(chromeOptions);
        const page = await browser.newPage();
        const cookies = [{
            'url': 'https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx',
            'name': 'userInfo',
            'value': request.params.cookie
          },{
            'url': 'https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx',
            'name': 'AspxAutoDetectCookieSupport',
            'value': '1'
          }];
          
        await page.setCookie(...cookies);

        await page.goto('https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx',{waitUntil: 'domcontentloaded'});  

        const textContent = await page.evaluate(() => {
            if (document.querySelector("#txtPTMCardValue") == null) {
                return "wrongcookie";
            }

            return document.querySelector("#txtPTMCardValue").innerHTML;
        });
        
        await browser.close();
        await response.status(400).json({bal: textContent})

      })();
}

module.exports = {
    result
}
