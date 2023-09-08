const { default: puppeteer } = require("puppeteer");
const {load} =require('cheerio');
const fs = require("fs/promises");


(async ()=>{
const browser=await puppeteer.launch({headless: false});
const page=await browser.newPage();
await page.goto("https://www.nike.com/in/")
// await page.screenshot({path: "nikewebsite.png"});
await page.click('.pre-search-btn.ripple')
await page.type('#VisualSearchInput','nike')
await page.keyboard.press('Enter')

await page.waitForTimeout(5000);

const productData = []
const $ = load(await page.content())
$(".product-grid__items .product-card").each((index,el)=>{
    const name=$('.product-card__title',el).text();
    const detail=$('.product-card__subtitle',el).text();
    const image = $(el).find('img').attr('src');
    const price = $('.product-price in__styling is--current-price css-11s12ax',el).text();

productData.push({
    name:name,
    price:price,
    detail:detail,
    image:image,
});
});

await browser.close();
console.log(productData);
fs.writeFile("products.json", JSON.stringify(productData,null,4),"utf-8");


})();

