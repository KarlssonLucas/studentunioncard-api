const puppeteer = require('puppeteer');
const { request, response } = require("express");

const result = async (request, response) => {
    (async () => {
        const browser = await puppeteer.launch();      
        const page = await browser.newPage();

        const cookies = [{
            'url': 'https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx',
            'name': 'userInfo',
            'value': request.body.cookie
          },{
            'url': 'https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx',
            'name': 'AspxAutoDetectCookieSupport',
            'value': '1'
          }];
          
          await page.setCookie(...cookies);

        await page.goto('https://kortladdning3.chalmerskonferens.se/CardLoad_Order.aspx');      
        
        const textContent = await page.evaluate(() => {
            return document.querySelector("#txtPTMCardValue").innerHTML;
        });
        response.status(400).send(textContent)
        await browser.close();
      })();
}

module.exports = {
    result
}