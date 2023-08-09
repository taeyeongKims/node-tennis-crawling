const express = require('express');
const app = express()
const cors = require('cors')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const currentDate = new Date();
const currentMonth = currentDate.getMonth()+1; 

let sessionData;

startServer();

app.use(cors())
app.get('/', (req, res) =>{
  console.log("success")
})

app.get('/place', async(req, res) =>{
  const selected_place = req.query.select_place;
  const selected_date = req.query.valueToFind;

  if(selected_place == "spoonePark"){
      res.json({'place' : "스포원"});
  } else if(selected_place == "sapryang"){
      res.json({'place' : "삽량"});
  } else if(selected_place == "sajik"){
      res.json({'place' : "사직구장"});
  }
  let tennisTime = await reserveParsing(selected_place, selected_date);
   res.json({'time' :tennisTime});
})

app.get('/schedule', async (req, res) => {
    const selected_place = req.query.select_place;
    const calendarMonth = req.query.Calendar;
    console.log(calendarMonth);
  if(selected_place == "spoonePark"){
      res.json({'place' : "스포원"});
  } else if(selected_place == "sapryang"){
      res.json({'place' : "삽량"});
  } else if(selected_place == "sajik"){
      res.json({'place' : "사직구장"});
  }
    try {
        let $tableCalender = await scheduleParsing(selected_place, calendarMonth);
        res.send($tableCalender);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  async function startServer() {
    // 로그인 및 세션 정보 얻기
    sessionData = await openWebPage();
  
    // 서버 시작
    app.listen(3000, () => {
      console.log('Server started');
    });
  }

 //로그인 및 세션 정보 얻기 
async function openWebPage() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // 로그인 페이지로 이동
  await page.goto('https://reserve.busan.go.kr/rent');
  
  // 로그인 동작 수행
  await page.evaluate((username, password) => {
    const el = document.querySelector('.header-inner > ul > li > a');
    el.click();
  })
  await page.waitForSelector('#mberId');
  await page.type('#mberId', 'xodud8530');
  await page.type('#mberPwd', 'qwpo1209!');
  await page.click('.btnLogin');

  // 로그인 후 로그인 성공 여부를 확인하여 세션 정보 반환
  await page.waitForNavigation();
  const sessionData = await page.cookies();
  
  // 브라우저 종료
  await browser.close();
  
  return sessionData;
}

async function reserveParsing(selected_place, valueToFind) {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setCookie(...sessionData);
  
  // page.setRequestInterception(true);

  // // request 이벤트를 가로채고 필요한 리소스만 요청하도록 설정합니다.
  // page.on('request', (request) => {
  //   const resourceType = request.resourceType();

  //   // CSS, Script, XHR, Fetch 리소스 유형만 허용
  //   if (
  //     resourceType !== 'document' &&
  //     resourceType !== 'script' &&
  //     resourceType !== 'xhr' &&
  //     resourceType !== 'fetch'
  //   ) {
  //     request.abort(); // 불필요한 리소스 요청 중단
  //   } else {
  //     request.continue(); // 필요한 리소스 요청 진행
  //   }
  // });

  let url;
  
  if(selected_place == "gangseo1"){
    url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=342";
  } else if(selected_place == "gangseo2"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=343";
  } else if(selected_place == "gangseo3"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=344";
  } else if(selected_place == "gangseo4"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=345";  
  } else if(selected_place == "macdo"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=219";
  } else if(selected_place == "daejeo"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=217";
  } else if(selected_place == "hwamyeong"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=214";
  } else if(selected_place == "samnak"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=342";// url 바꿔야함
  } else if(selected_place == "gudeok1"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=313";
  } else if(selected_place == "gudeok2"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=312";
  } else if(selected_place == "gudeok3"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=311";
  }

  await page.goto(url);

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

async function scheduleParsing(selected_place, calendarMonth) {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setCookie(...sessionData);
  console.log(calendarMonth);

  // page.setRequestInterception(true);

  // // request 이벤트를 가로채고 필요한 리소스만 요청하도록 설정합니다.
  // page.on('request', (request) => {
  //   const resourceType = request.resourceType();

  //   // CSS, Script, XHR, Fetch 리소스 유형만 허용
  //   if (
  //     resourceType !== 'document' &&
  //     resourceType !== 'script' &&
  //     resourceType !== 'xhr' &&
  //     resourceType !== 'fetch'
  //   ) {
  //     request.abort(); // 불필요한 리소스 요청 중단
  //   } else {
  //     request.continue(); // 필요한 리소스 요청 진행
  //   }
  // });

  let url;
  // 이동 페이지 URL
  if(selected_place == "gangseo1"){
    url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=342";
  } else if(selected_place == "gangseo2"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=343";
  } else if(selected_place == "gangseo3"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=344";
  } else if(selected_place == "gangseo4"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=345";  
  } else if(selected_place == "macdo"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=219";
  } else if(selected_place == "daejeo"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=217";
  } else if(selected_place == "hwamyeong"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=214";
  } else if(selected_place == "samnak"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=342";// url 바꿔야함
  } else if(selected_place == "gudeok1"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=313";
  } else if(selected_place == "gudeok2"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=312";
  } else if(selected_place == "gudeok3"){
      url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=311";
  }
  await page.goto(url); 
  
  if(calendarMonth == "prev"){
    await page.waitForSelector(".prev");
    await page.click('.prev'); 

    // setTimeout을 Promise로 감싸고 await 사용
    await new Promise(resolve => {
      setTimeout(() => {
        // 이제 Promise 내부의 waitForFunction을 기다립니다.
        page.waitForFunction(() => {
          return true;
        }).then(() => {
          resolve(); // waitForFunction이 완료되면 Promise를 해결(resolve)합니다.
        });
      }, 100);
    });
  }
  else if(calendarMonth == "next"){
    await page.waitForSelector(".next");
    await page.click('.next');
      // setTimeout을 Promise로 감싸고 await 사용
    await new Promise(resolve => {
      setTimeout(() => {
        // 이제 Promise 내부의 waitForFunction을 기다립니다.
        page.waitForFunction(() => {
          return true;
        }).then(() => {
          resolve(); // waitForFunction이 완료되면 Promise를 해결(resolve)합니다.
        });
      }, 1500);
    });
  }
  //   await page.waitForFunction((currentMonth)=>{
  //     monthValue = document.querySelector("#srchMonth").value;
  //     console.log(nextMonth);
  //     return monthValue === (currentMonth+1).toString();   
  //   }, currentMonth);
  // } 
  else if (calendarMonth == "now"){
    await page.waitForSelector(".selectDay");
  }

  
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
    let endDay = [];
    const $endDayList = $(".endDay");
    $endDayList.each((index, node) => {
      endDay[index] = $(node).text()
  });
  $(".endDay").find('a').remove();
    $endDayList.each((index, node) => {
    $(node).text(endDay[index]);
});
    let $tableCalender = $(".tableCalendar.cal1").html();

    return $tableCalender;
  }
