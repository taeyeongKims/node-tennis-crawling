const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function main() {
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto("https://reserve.busan.go.kr/rent"); // 이동 페이지 URL
    
    await page.evaluate(() => {
        const el = document.querySelector(".header-inner > ul >li > a");
        el.click();
    });
    await page.waitForSelector('#mberId');
    await page.type('#mberId', 'xodud8530');
    await page.type('#mberPwd', 'qwpo1209!');

    await page.click('.btnLogin');
    await page.waitForSelector(".reserve-map-list > li:nth-child(2)");
    await page.click(".reserve-map-list > li:nth-child(3)");
    await page.click(".reserve-map-submit")

    await page.waitForSelector('#srchVal');
    await page.type('#srchVal', "테니스장");
    await page.click('.btnInpType1');

    await page.waitForSelector('.reserveItem');
    await page.click('.reserveItem');

    await page.waitForSelector(".btnTypeXL ");
    await page.click(".btnTypeXL ");

    await page.waitForSelector(".selectDay");
    await page.click(".selectDay");
    await page.waitForSelector("#beginTime");

    const parsing = async() => {
        const html = await page.content();
        const $ = cheerio.load(html);
        const $reserveList = $("#beginTime > option");

        let courses = [];
        $reserveList.each((index, node) => {
            let time = $(node).text();
            console.log(index);
            courses.push(time);
        });
        console.log(courses);
        
        let data = {
            time : courses
        }
        let tennisTime = JSON.stringify(data);
        console.log(tennisTime);

    }
    await parsing();
    browser.close();
}
main();