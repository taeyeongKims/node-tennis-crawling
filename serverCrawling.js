const https = require("https"); // https 모듈 불러오기
const fs = require('fs');
const express = require('express');
const app = express()
const cors = require('cors')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

let sessionData;
let sessionDatas = [];

async function startServer() {
    // 로그인 및 세션 정보 얻기
    sessionDatas = await openWebPage();
  
    // 서버 시작
    server.listen(443, "0.0.0.0", () => {
      console.log('Server started');
    });
  }

app.use(cors())
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/tennisreservationchecking.shop/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tennisreservationchecking.shop/fullchain.pem')
};

const server = https.createServer(options, app);
app.get('/', (req, res) =>{
  console.log("success")
})

startServer();

app.get('/schedule', async (req, res) => {
  const selected_part = req.query.select_part;
  const selected_place = req.query.select_place;
  const calendarMonth = req.query.Calendar;

  try {
      $tableCalender = await scheduleParsing(selected_part, selected_place, calendarMonth);
      res.send($tableCalender);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/place', async(req, res) =>{
  const selected_part = req.query.select_part;
  const selected_place = req.query.select_place;
  const selected_date = req.query.valueToFind;
  const calendarMonth = req.query.Calendar;

  let tennisTime = await reserveParsing(selected_part, selected_place, selected_date, calendarMonth);
   res.json({'time' :tennisTime});
})

 //로그인 및 세션 정보 얻기 
async function openWebPage() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 강서, 구덕, 대저, 화명, 맥도 로그인정보 저장
  await page.goto('https://reserve.busan.go.kr/rent');

  await page.evaluate(() => {
    const el = document.querySelector('.header-inner > ul > li > a');
    el.click();
  })
  await page.waitForSelector('#mberId');
  await page.type('#mberId', 'xodud8530');
  await page.type('#mberPwd', 'qwpo1209!');
  await page.click('.btnLogin');

  await page.waitForNavigation();
  const sessionData1 = await page.cookies();

  // 스포원파크 로그인정보 저장

  await page.goto('https://nrsv.spo1.or.kr/fmcs/1');

  await page.evaluate(() => {
    const el = document.querySelector('#process_login');
    el.click();
  })

  const popupTarget = await browser.waitForTarget(target => target.url().includes('https://www.spo1.or.kr/login/login.do?returl=nrsv'));
    // 팝업 페이지에 접근
  const popupPage = await popupTarget.page();
  await popupPage.waitForSelector('#textfield01');
  await popupPage.type('#textfield01', 'xodud8530');
  await popupPage.type('#textfield02', 'nk125478@');
  await popupPage.click('#buttom01');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await popupPage.close();

  await page.waitForNavigation();
  const sessionData2 = await page.cookies();

   //  삽량테니스장 로그인 정보 
  await page.goto('https://www.yssisul.or.kr/rent');
  await page.evaluate(() => {
    const el = document.querySelectorAll('.utilBox > li > a')[3];
    el.click();
  })
  
  await page.waitForSelector('input[name="username"]')
  inputEl = await page.$('input[name="username"]')
  await inputEl.click();
  await page.keyboard.type('xodud8530');

  passwordEl = await page.$('input[name="password"]')
  await passwordEl.click();
  await page.keyboard.type('nk125478@');

 
  await page.click('.login > form > button');
  await page.waitForNavigation();
  const sessionData3 = await page.cookies();

  // 사직구장 로그인 정보
  await page.goto('https://www.sajiktennis.kr/html/');

  await page.evaluate(() => {
    const el = document.querySelector('.top-header > .inner > a');
    el.click();
  })
  await page.waitForSelector('#m_id');
  await page.type('#m_id', 'xodud8530');
  await page.type('#m_pass', 'nk125478@');
  await page.evaluate(() => {
    const el = document.querySelector('.login-account > li > button')
    el.click();
  })

  await page.waitForNavigation();
  const sessionData4 = await page.cookies();
  // 브라우저 종료
  await browser.close();
  
  return [sessionData1 , sessionData2, sessionData3, sessionData4]
}

async function reserveParsing(selected_part, selected_place, valueToFind, calendarMonth) {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  switch(selected_part){
    case "spoonePark" :
      sessionData = sessionDatas[1];
      break;
    case "sapryang" :
      sessionData = sessionDatas[2];
      break; 
    case "sajik" :
      sessionData = sessionDatas[3];
      break; 
    default :
      sessionData = sessionDatas[0];
      break;
  }
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

  // 강서, 구덕, 대저, 맥도, 화명 시간 가져오기
  if(selected_part !== "spoonePark" &&  selected_part !== "sapryang" && selected_part !== "sajik") {
    let url;
  switch(selected_part) {
    case 'gangseo': 
      if(selected_place == "gangseo1")
        { url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=342"; } 
      else if(selected_place == "gangseo2")
        { url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=343"; }
      else if(selected_place == "gangseo3")
        { url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=344"; } 
      else if(selected_place == "gangseo4")
        { url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=345"; }
        break;
    case 'macdo':  
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=219"
      break;
    case 'daejeo':  
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=217"
      break;
    case 'hwamyeong':  
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=214"
      break;
    case 'samnak':  
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=342";// url 바꿔야함
      break;
    case 'gudeok':  
      if(selected_place == "gudeok01")
        { url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=313"; } 
      else if(selected_place == "gudeok02")
        { url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=312"; }
      else if(selected_place == "gudeok03")
        { url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=311"; } 
      break;         
  }

  await page.goto(url);

  if(calendarMonth == "next"){
    await page.waitForSelector(".exSelect");
    await page.click('.next');
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
      }, 2000);
    }); }
    
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

  // 강서와 구덕이 아닌 장소면 코트 번호 고르기
  if(selected_part !== "gangseo" && selected_part !== "gudeok"){
    await page.waitForSelector("#resveOrd");
    // const selectElement = page.$('#resveOrd');
    const placeNum = parseInt(selected_place.match(/\d+$/)[0], 10)-1;

    const selectElement = await page.$('#resveOrd');

    // select 요소를 클릭하여 옵션 드롭다운을 열고, 특정 인덱스의 옵션을 클릭
    await selectElement.click();
    await page.waitForSelector('option'); // 모든 옵션들이 렌더링될 때까지 대기
    for (let i = 0; i < placeNum; i++) {
      await page.keyboard.press('ArrowDown');
    }
    // 엔터 키를 눌러 선택
    await page.keyboard.press('Enter');
  }

  await page.waitForSelector("#beginTime");
  await page.click("#beginTime");

  var courses = await timeParsing(page);
  browser.close();
  } 
  // 스포원파크 시간 가져오기
  else if(selected_part == "spoonePark") {

    let url;

    if(selected_place == "spoonePark_in01"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=21"; //실내 1번
    } else if(selected_place == "spoonePark_in02"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=22"; //실내 2번
    } else if(selected_place == "spoonePark_in03"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=23"; //실내 3번
    } else if(selected_place == "spoonePark_in04"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=24"; //실내 4번
    } else if(selected_place == "spoonePark_in05"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=25"; //실내 5번
    } else if(selected_place == "spoonePark_in06"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=26";  //실내 6번
    } else if(selected_place == "spoonePark_out01"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=7";  //실외 1번
    } else if(selected_place == "spoonePark_out02"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=8"; //실외 2번
    } else if(selected_place == "spoonePark_out03"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=12"; //실외 3번
    } else if(selected_place == "spoonePark_out04"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=13"; //실외 4번
    } else if(selected_place == "spoonePark_out05"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=14"; //실외 5번
    } else if(selected_place == "spoonePark_out06"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=15"; //실외 6번
    } else if(selected_place == "spoonePark_out07"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=16"; //실외 7번
    } else if(selected_place == "spoonePark_out08"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=17"; //실외 8번
    } else if(selected_place == "spoonePark_out09"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=18"; //실외 9번
    } else if(selected_place == "spoonePark_out10"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=19"; //실외 10번
    } else if(selected_place == "spoonePark_out11"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=20"; //실외 11번
    } else if(selected_place == "spoonePark_out12"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=59"; //실외 센터
    }
    
    await page.goto(url); 

    if(calendarMonth == "next"){
      await page.waitForSelector(".next_month");
      await page.click('.next_month');
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
      }); }

    await page.waitForSelector(".state_10");
    const links = await page.$$('.state_10 > strong'); // 모든 strong 태그 선택
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
    await new Promise(resolve => {
      setTimeout(() => {
        // 이제 Promise 내부의 waitForFunction을 기다립니다.
        page.waitForFunction(() => {
          return true;
        }).then(() => {
          resolve(); // waitForFunction이 완료되면 Promise를 해결(resolve)합니다.
        });
      }, 1000);
    });  
    var courses = await AtimeParsing(page, selected_part);
    browser.close();
  }
  //삽량 시간 가져오기
  else if(selected_part == "sapryang") {

    let url;

    if(selected_place == "sapryang3"){
      url = "https://www.yssisul.or.kr/rent/#/47/rent/step1"; //삽량 3번
    } else if(selected_place == "sapryang4"){
        url = "https://www.yssisul.or.kr/rent/#/64/rent/step1"; //삽량 4번
    } else if(selected_place == "sapryang7"){
        url = "https://www.yssisul.or.kr/rent/#/66/rent/step1"; //삽량 7번
    } else if(selected_place == "sapryang8"){
        url = "https://www.yssisul.or.kr/rent/#/67/rent/step1"; //삽량 8번
    }
    
    await page.goto(url); 

    if(calendarMonth == "next"){
    await page.waitForSelector(".fc-customNext-button");
      await page.click('.fc-customNext-button');
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
    await page.waitForSelector(".fc-daygrid-day-number");
    const links = await page.$$('.fc-daygrid-day-number'); // 모든 a 태그 선택
    let foundIndex = -1;

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const text = await link.evaluate(node => parseInt(node.textContent));

      if (text == valueToFind) {
        foundIndex = i; // 일치하는 링크 요소의 인덱스를 foundIndex에 할당
        break; // 반복문 종료
      }
    }
    if (foundIndex !== -1) {
      const desiredChild = links[foundIndex];
      await desiredChild.click();
    }
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
    var courses = await AtimeParsing(page , selected_part);
    browser.close();
  }
  return courses;
}

async function scheduleParsing(selected_part, selected_place, calendarMonth) {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280, // 원하는 너비 값으로 변경
    height: 800, // 원하는 높이 값으로 변경
  });

  switch(selected_part){
    case "spoonePark" :
      sessionData = sessionDatas[1];
      break;
    case "sapryang" :
      sessionData = sessionDatas[2];
      break; 
    case "sajik" :
      sessionData = sessionDatas[3];
      break; 
    default :
      sessionData = sessionDatas[0];
      break;
  }
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

  // 강서, 구덕, 대저, 맥도, 화명 캘린더 가져오기
  if(selected_part !== "spoonePark" &&  selected_part !== "sapryang" && selected_part !== "sajik") {
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
    } else if(selected_part == "macdo"){
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=219";
    } else if(selected_part == "daejeo"){
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=217";
    } else if(selected_part == "hwamyeong"){
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=55&progrmSn=214";
    } else if(selected_part == "samnak"){
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=498&progrmSn=342";// url 바꿔야함
    } else if(selected_place == "gudeok01"){
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=313";
    } else if(selected_place == "gudeok02"){
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=312";
    } else if(selected_place == "gudeok03"){
        url = "https://reserve.busan.go.kr/rent/preStep?resveProgrmSe=R&resveGroupSn=475&progrmSn=311";
    }
    await page.goto(url); 
    
    if (calendarMonth == "now"){
      await page.waitForSelector(".selectDay");
    }
    else if(calendarMonth == "next"){
      await page.waitForSelector(".exSelect");
      await page.click('.next');
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
        }, 2000);
      }); }
        
     $tableCalender = await calenderParsing(page, selected_part);
    browser.close();
  }
  // 스포원 캘린더 가져오기
  else if(selected_part == "spoonePark") {

    let url;

    if(selected_place == "spoonePark_in01"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=21"; //실내 1번
    } else if(selected_place == "spoonePark_in02"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=22"; //실내 2번
    } else if(selected_place == "spoonePark_in03"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=23"; //실내 3번
    } else if(selected_place == "spoonePark_in04"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=24"; //실내 4번
    } else if(selected_place == "spoonePark_in05"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=25"; //실내 5번
    } else if(selected_place == "spoonePark_in06"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=11&place=26";  //실내 6번
    } else if(selected_place == "spoonePark_out01"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=7";  //실외 1번
    } else if(selected_place == "spoonePark_out02"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=8"; //실외 2번
    } else if(selected_place == "spoonePark_out03"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=12"; //실외 3번
    } else if(selected_place == "spoonePark_out04"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=13"; //실외 4번
    } else if(selected_place == "spoonePark_out05"){
        url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=14"; //실외 5번
    } else if(selected_place == "spoonePark_out06"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=15"; //실외 6번
    } else if(selected_place == "spoonePark_out07"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=16"; //실외 7번
    } else if(selected_place == "spoonePark_out08"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=17"; //실외 8번
    } else if(selected_place == "spoonePark_out09"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=18"; //실외 9번
    } else if(selected_place == "spoonePark_out10"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=19"; //실외 10번
    } else if(selected_place == "spoonePark_out11"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=20"; //실외 11번
    } else if(selected_place == "spoonePark_out12"){
      url = "https://nrsv.spo1.or.kr/fmcs/42?facilities_type=T&base_date=20230815&rent_type=1001&center=SPOONE&part=15&place=59"; //실외 센터
    }
    
    await page.goto(url); 

    if (calendarMonth == "now"){
      await page.waitForSelector(".fit");
    }
    else if(calendarMonth == "next"){
      await page.waitForSelector(".next_month");
      await page.click('.next_month');
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
      }); } 

     $tableCalender = await AcalenderParsing(selected_part, page);
    // browser.close();
  }
  // 삽량 캘린더 가져오기
  else if(selected_part == "sapryang"){

    let url;

    if(selected_place == "sapryang3"){
      url = "https://www.yssisul.or.kr/rent/#/47/rent/step1"; //삽량 3번
    } else if(selected_place == "sapryang4"){
        url = "https://www.yssisul.or.kr/rent/#/64/rent/step1"; //삽량 4번
    } else if(selected_place == "sapryang7"){
        url = "https://www.yssisul.or.kr/rent/#/66/rent/step1"; //삽량 7번
    } else if(selected_place == "sapryang8"){
        url = "https://www.yssisul.or.kr/rent/#/67/rent/step1"; //삽량 8번
    }

    await page.goto(url); 

    if (calendarMonth == "now"){
      // await page.waitForSelector(".fc-scrollgrid "); //정보가 다 안 불러와질 때가 있음
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
      await page.waitForSelector(".fc-customNext-button");
      await page.click('.fc-customNext-button');
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
      }); } 
    $tableCalender = await AcalenderParsing(selected_part, page);
    // browser.close();
  }
  // 사직구장 캘린더 가져오기
  else if(selected_part == "sajik"){

    let url = "https://www.sajiktennis.kr/html/?pCode=7";

    let selectIndex;

    switch(selected_place) {
      case 'sajik01':
        selectIndex = 0;
        break;
      case 'sajik02':
        selectIndex = 1;
        break;
      case 'sajik03':
        selectIndex = 2;
        break;
      case 'sajik04':
        selectIndex = 3;
        break;
      case 'sajik05':
        selectIndex = 4;
        break;
      case 'sajik06':
        selectIndex = 5;
        break;
      case 'sajik07':
        selectIndex = 6;
        break;
    }

    const selector =  `.date-picker li:nth-child(${selectIndex+1})`

      
    await page.goto(url); 

    // await page.waitForSelector(".date-picker");
    // const links = await page.$$('.date-picker li'); // 모든 요일 li 선택

    // const desiredChild = links[selectIndex];
    // await desiredChild.click();
    await page.click(selector);
    
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

    await page.waitForSelector(".calendar-body");

    $tableCalender = await AcalenderParsing(selected_part, page);
    // browser.close();
  }
  return $tableCalender;
}
  

async function timeParsing(page) {
  const html = await page.content();
  const $ = cheerio.load(html);
  const $reserveList = $("#beginTime > option");

  let courses = [];

  $reserveList.each((index, node) => {   
    let time = $(node).text();
    const timeMatch  = time.match(/(\d{2}):(\d{2})/);
    if (timeMatch) {
      courses.push(timeMatch[0]);
    }
  })

  $reserveList.each((index, node) => {
      let string = $(node).text();
      let stringMatch = string.match(/\[(.*?)\]/);
      if (stringMatch) {
        courses.push(stringMatch[0]);
      } else {
          courses.push("예약 가능");
        }
  });
  courses.splice($reserveList.length, 1);
  // courses.shift();
  return courses;
}

async function AtimeParsing(page, selected_part) {
  const html = await page.content();
  const $ = cheerio.load(html);

  if(selected_part == "spoonePark"){
    let courses= [];
    const $reserveList = $(".txtcenter > tr > td");

    $reserveList.each((index, node) => {
      if(index % 5 == 2){
        let time = $(node).text();
        courses.push(time);
      }
    }); 
    $reserveList.each((index, node) => {
      if(index % 5 == 4){
        let reserve = $(node).text();
        courses.push(reserve);
      }
    });
    return courses;
  }
  else if(selected_part == "sapryang"){
    let courses = [];

    const $reserveList = $(".bookTimeChoice > li > a");

    let checkingTimeArray = ["예약가능", "예약가능", "예약가능", "예약가능", "예약가능", "예약가능", "예약가능"];
    let TimeArray = ["08:00 ~ 10:00","10:00 ~ 12:00","12:00 ~ 14:00","14:00 ~ 16:00","16:00 ~ 18:00","18:00 ~ 20:00","20:00 ~ 22:00"];

    $reserveList.each((index, node) => {   
        let reserve = $(node).text();
        let timeMatch  = reserve.match(/(\d{2}):(\d{2}) ~ \d{2}:\d{2}/);
        let hour = parseInt(timeMatch[1], 10); 
        switch(hour){
          case 8 :
            checkingTimeArray.splice(0,1,"마감");
            break;
          case 10 :
            checkingTimeArray.splice(1,1,"마감");
            break;
          case 12 :
            checkingTimeArray.splice(2,1,"마감");
            break; 
          case 14 :
            checkingTimeArray.splice(3,1,"마감");
            break; 
          case 16 :
            checkingTimeArray.splice(4,1,"마감");
            break; 
          case 18 :
            checkingTimeArray.splice(5,1,"마감");
            break;
          case 20 :
            checkingTimeArray.splice(6,1,"마감");
            break;          
        }
    });
    courses = courses.concat(TimeArray.slice(0, 7), checkingTimeArray.slice(0, 7));
    return courses;  
  } 
}

async function calenderParsing(page, selected_part) {
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

  const $calendarList = $(".selectDay a");

  $calendarList.each((index, node) => {
    $(node).attr('onclick','btnActive(this); choiceDay(this)')
  });

  $removeHrefList = $(".selectDay a");

  $removeHrefList.each((index, node) => {
    $(node).removeAttr("href");
  });

  let title;

  switch(selected_part) {
    case "gangseo" :
      title = "강서 체육공원 테니스장"
      break;
    case "macdo" :
      title = "맥도 생태공원 테니스장"
      break;
    case "daejeo" :
      title = "대저 생태공원 테니스장"
      break;
    case "hwamyeong" :
      title = "화명 생태공원 테니스장"
      break;
    case "gudeok" :
      title = "구덕 운동장 테니스장"
      break;
  }
  $(".tableCalendar caption").text(title);

  $tableCalender =  $(".tableCalendar.cal1").html();

    return $tableCalender;
}

  async function AcalenderParsing(selected_part, page) {
    const html = await page.content();
    const $ = cheerio.load(html);
    
    if(selected_part == "spoonePark"){

      const $removeHrefList = await page.$$(".fit  a");

      //a 태그의 href 제거
      for(element of $removeHrefList){
        await element.evaluate((el) => {
          el.removeAttribute("href");
        });
      }
      //지난날 class 부여
      const $parentSpanList = await page.$$(".status_end");
      for(element of $parentSpanList){
        await element.evaluate((el) => {
          const parentAtag = el.parentNode;
          parentAtag.parentNode.setAttribute("class", "state_end");
        });
      }
      // a 태그 하위 요소인 span 제거
      const $removeSpanList = await page.$$(".fit span");
      for(element of $removeSpanList){
        await element.evaluate((el) => {
          el.remove();
        });
      }

      //.state_10인 태그에 btnAcitve() 추가
      const $calendarList = await page.$$(".state_10");

      for(element of $calendarList){
        await element.evaluate((el) => {
          el.setAttribute("onclick", "btnActive(this); choiceDay(this)");
        });
      }

      //caption 테니스장 이름으로 변경
      const captionElement = await page.$$(".fit caption");
      for(element of captionElement){
        await element.evaluate((el) => {
          el.textContent = "스포원 파크 테니스장";
        });
      }

      $tableCalender = await page.evaluate(() => {
        return $(".fit").html();
      });
    } 
    else if(selected_part == "sapryang"){

      const $calendarList = await page.$$(".fc-day-future");
      const $tdCalendarList = await page.$$(".fc-col-header tbody th");

      const widthArray = [".fc-col-header", ".fc-daygrid-body", ".fc-scrollgrid-sync-table"];
      const backgroundArray = [".fc-day-past", ".fc-day-today", ".fc-day-disabled"];

      const widthElementsArray = await Promise.all(
        widthArray.map(selector => page.$$(selector))
      );
    
      for (const elements of widthElementsArray) {
        for (const element of elements) {
          // Process each element here
            await element.evaluate((el) => {
            el.setAttribute("style", "width:400px;");
          });
        }
      }

       const BgElementsArray = await Promise.all(
        backgroundArray.map(selector => page.$$(selector))
      );
    
      for (const elements of BgElementsArray) {
        for (const element of elements) {
          // Process each element here
            await element.evaluate((el) => {
            el.setAttribute("style", "background: rgb(255, 255, 255);");
          });
        }
      }

      for(element of $calendarList){
        await element.evaluate((el) => {
          el.setAttribute("onclick", "btnActive(this); choiceDay(this)");
        });
      }

      for(element of $tdCalendarList){
        await element.evaluate((el) => {
          el.style.width = '50px';
        });
      }

      //caption 추가하여 테니스장 이름으로 변경
      await page.evaluate(()=> {
        var table = document.querySelector('.fc-scrollgrid');
        var caption = document.createElement('caption');
        caption.textContent = "삽량 테니스장";
        table.appendChild(caption);
        const firstChild = table.firstChild;

        //첫번째 요소로 넣기
        table.insertBefore(caption, firstChild);
      })

      const $tableCalender = await page.evaluate(() => {
        const fcScrollgrid = document.querySelector('.fc-scrollgrid');
        const fcDaygridEventHarness = fcScrollgrid.querySelectorAll('.fc-daygrid-event-harness');
    
        // ".fc-daygrid-event-harness" 클래스가 있는 모든 태그를 삭제합니다.
        fcDaygridEventHarness.forEach(element => {
          element.remove();
        });

        return fcScrollgrid.innerHTML;
      });

      return $tableCalender;

    }
    else if(selected_part == "sajik"){      
      const $completeList = await page.$$(".reserve-complete");

      const $possibleList = await page.$$(".reserve-apply");

      const $theadReserveList = await page.$$(".calendar-body thead tr th");
      const $tbodyReserveList = await page.$$(".calendar-body tbody tr th");

      // $reserveList.each((index, node) => { 
      //   let reserve = $(node).text();
      //   timeMatch  = reserve.match(/(\d{2}):(\d{2})/); });

      for (const element of $completeList) {
        await element.evaluate((el) => {el.textContent = "X"
        });
      }
      for (const element of $possibleList) {
        await element.evaluate((el) => {
          el.textContent = "O"
          el.setAttribute("class", "possible");
        });
      }

      //글자 수 줄이기
      let timeMatch = [];

      for (const element of $theadReserveList) {
        await element.evaluate((el) => {
          let reserve = el.textContent;
          timeMatch = reserve.match(/\d+/);
          if(timeMatch)
            el.textContent = timeMatch[0];
        });
      }
      // ~(\d{2}):00/
      for (const element of $tbodyReserveList) {
        await element.evaluate((el) => {
          let reserve = el.textContent;
          timeMatch = reserve.match(/(\d{2}):00/);
          if(timeMatch)
            el.textContent = timeMatch[0];
          // if (timeMatch) {
          //   const extracted = `${timeMatch[1]} ~ ${timeMatch[2]}`;
          //   el.textContent = extracted;
          // }
        });
      }
      //스타일 width 400px로 하기

      widthArray = [".calendar-body caption", ".calendar-body thead", ".calendar-body tbody"];

      const elementsArray = await Promise.all(
        widthArray.map(selector => page.$$(selector))
      );
    
      for (const elements of elementsArray) {
        for (const element of elements) {
          // Process each element here
            await element.evaluate((el) => {
            el.setAttribute("style", "width:400px;");
          });
        }
      }

      //caption 테니스장 이름으로 변경
      const captionElement = await page.$$(".calendar-body caption");
      for(element of captionElement){
        await element.evaluate((el) => {
          el.textContent = "부산 종합 실내 테니스장";
        });
      }

      $tableCalender = await page.evaluate(() => {
        return $(".calendar-body.pc").html();
      });
    }
    // status_end 안에 a태그가 있는게 아니라서 의미 없음
    return $tableCalender;
  }  
