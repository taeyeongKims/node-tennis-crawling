const express = require('express')
const app = express()
const cors = require('cors')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

app.use(cors())
app.get('/', (req, res) =>{
  console.log("success")
})

app.get('/place', async(req, res) =>{
  const selected_place = req.query.select_place;
  const selected_date = req.query.valueToFind;
  console.log(selected_date);

  if(selected_place == "gangseo1"){
    order = 4;
  } else if(selected_place == "gangseo2"){
      order = 3;
  } else if(selected_place == "gangseo3"){
      order = 2;
  } else if(selected_place == "gangseo4"){
      order = 1;  
  } else if(selected_place == "macdo"){
      order = 5;
  } else if(selected_place == "daejeo"){
      order = 6;
  } else if(selected_place == "hwamyeong"){
      order = 7;
  } else if(selected_place == "samnak"){
      order = 8;
  } else if(selected_place == "gudeok1"){
      order = 9;
  } else if(selected_place == "gudeok2"){
      order = 10;
  } else if(selected_place == "gudeok3"){
      order = 11;
  } else if(selected_place == "spoonePark"){
      res.json({'place' : "스포원"});
  } else if(selected_place == "sapryang"){
      res.json({'place' : "삽량"});
  } else if(selected_place == "sajik"){
      res.json({'place' : "사직구장"});
  }
  let tennisTime = await reserveParsing(order, selected_date);
   res.json({'time' :tennisTime});
})

app.get('/schedule', async (req, res) => {
    const selected_place = req.query.select_place;

  if(selected_place == "gangseo1"){
    order = 4;
  } else if(selected_place == "gangseo2"){
      order = 3;
  } else if(selected_place == "gangseo3"){
      order = 2;
  } else if(selected_place == "gangseo4"){
      order = 1;  
  } else if(selected_place == "macdo"){
      order = 5;
  } else if(selected_place == "daejeo"){
      order = 6;
  } else if(selected_place == "hwamyeong"){
      order = 7;
  } else if(selected_place == "samnak"){
      order = 8;
  } else if(selected_place == "gudeok1"){
      order = 9;
  } else if(selected_place == "gudeok2"){
      order = 10;
  } else if(selected_place == "gudeok3"){
      order = 11;
  } else if(selected_place == "spoonePark"){
      res.json({'place' : "스포원"});
  } else if(selected_place == "sapryang"){
      res.json({'place' : "삽량"});
  } else if(selected_place == "sajik"){
      res.json({'place' : "사직구장"});
  }
    try {
        let $tableCalender = await scheduleParsing(order);
        res.send($tableCalender);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

app.listen(3000)

async function reserveParsing(order, valueToFind) {
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

  await page.waitForNavigation();

  await page.goto("https://reserve.busan.go.kr/rent/list?resveGroupSn=&progrmSn=&srchGugun=&srchResveInsttCd=&srchBeginDe=&srchEndDe=&srchIngStat=&srchVal=%ED%85%8C%EB%8B%88%EC%8A%A4%EC%9E%A5");

//   await page.waitForSelector(".reserve-map-list > li:nth-child(2)");
//   await page.click(".reserve-map-list > li:nth-child(3)");d
//   await page.click(".reserve-map-submit")

//   await page.waitForSelector('#srchVal');
//   await page.type('#srchVal', "테니스장");
//   await page.click('.btnInpType1');

  if(order < 11){
    await page.waitForSelector(`.reserveList > li:nth-of-type(${order})`);
    await page.click(`.reserveList > li:nth-of-type(${order})`);
  }else{
    await page.waitForSelector('.number > a');
    await page.click('.number > a');
    await page.waitForSelector('.reserveList > li');
    await page.click(`.reserveList > li`);
  }

  await page.waitForSelector(".btnTypeXL ");
  await page.click(".btnTypeXL ");



  await page.waitForSelector(".selectDay");
  const links = await page.$$('.selectDay > a'); // 모든 a 태그 선택
  let foundIndex = -1;
  
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const text = await link.evaluate(node => node.textContent);
    if (text === valueToFind) {
      foundIndex = i; // 일치하는 링크 요소의 인덱스를 foundIndex에 할당
      break; // 반복문 종료
    }
  }

  if (foundIndex !== -1) {
    const desiredChild = links[foundIndex];
    await desiredChild.click();
  }

  await page.waitForSelector("#beginTime");



  let courses = await timeParsing(page);
  browser.close();
  return courses;
}

async function scheduleParsing(order) {
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
  
    await page.waitForNavigation();
  
    await page.goto("https://reserve.busan.go.kr/rent/list?resveGroupSn=&progrmSn=&srchGugun=&srchResveInsttCd=&srchBeginDe=&srchEndDe=&srchIngStat=&srchVal=%ED%85%8C%EB%8B%88%EC%8A%A4%EC%9E%A5");
  
  //   await page.waitForSelector(".reserve-map-list > li:nth-child(2)");
  //   await page.click(".reserve-map-list > li:nth-child(3)");d
  //   await page.click(".reserve-map-submit")
  
  //   await page.waitForSelector('#srchVal');
  //   await page.type('#srchVal', "테니스장");
  //   await page.click('.btnInpType1');
  
    if(order < 11){
      await page.waitForSelector(`.reserveList > li:nth-of-type(${order})`);
      await page.click(`.reserveList > li:nth-of-type(${order})`);
    }else{
      await page.waitForSelector('.number > a');
      await page.click('.number > a');
      await page.waitForSelector('.reserveList > li');
      await page.click(`.reserveList > li`);
    }
  
    await page.waitForSelector(".btnTypeXL ");
    await page.click(".btnTypeXL ");
  
  
  
    await page.waitForSelector(".selectDay");
  
    let $tableCalender = await calenderParsing(page);
    browser.close();
    return $tableCalender;
  }
  

async function timeParsing(page) {
  const html = await page.content();
  const $ = cheerio.load(html);
  const $reserveList = $("#beginTime > option");

  let courses = [];
  $reserveList.each((index, node) => {
      let time = $(node).text();
      courses.push(time);
  });
  courses.shift();
  return courses
}

async function calenderParsing(page) {
    const html = await page.content();
    const $ = cheerio.load(html);
    endDay = $(".endDay").find('a').text();
    console.log(endDay);
    $(".endDay").find('a').remove();
    $(".endDay").text(endDay);
    let $tableCalender = $(".tableCalendar.cal1").html();

    return $tableCalender;
  }
