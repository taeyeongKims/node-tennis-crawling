function partChange() {
    let today = new Date(); 
    let lastDay = new Date(nowMonth.getFullYear(), today.getMonth()+1,0);

    let lastDate = lastDay.getDate();
    const MonthOfWeek = today.getMonth()+1;
    const dateOfWeek = today.getDate();
    let dayIndex = today.getDay();
    const dayName = getDayName(dayIndex);

    const MonthOfWeeks = [ MonthOfWeek,  MonthOfWeek,  MonthOfWeek,  MonthOfWeek,  MonthOfWeek,  MonthOfWeek,  MonthOfWeek]
    const dateOfWeeks = [dateOfWeek, dateOfWeek+1, dateOfWeek+2, dateOfWeek+3, dateOfWeek+4, dateOfWeek+5, dateOfWeek+6]
    const dayOfWeeks = [dayIndex,dayIndex,dayIndex,dayIndex,dayIndex,dayIndex,dayIndex]

    for(var i=0; i<7; i++){
        if(dateOfWeeks[i] > lastDate) { 
            dateOfWeeks[i] -= lastDate;
            MonthOfWeeks[i] = MonthOfWeeks[i]+1;
        }
        if(dayIndex == 6){
            dayOfWeeks[i] = getDayName(dayIndex)
            dayIndex = 0;
        }else {
            dayOfWeeks[i] = getDayName(dayIndex)
            dayIndex +=1;
        }
    }

    const keys = [`${MonthOfWeeks[0]}월 ${dateOfWeeks[0]}일 ${dayOfWeeks[0]}요일`, `${MonthOfWeeks[1]}월 ${dateOfWeeks[1]}일 ${dayOfWeeks[1]}요일`,`${MonthOfWeeks[2]}월 ${dateOfWeeks[2]}일 ${dayOfWeeks[2]}요일`,
    `${MonthOfWeeks[3]}월 ${dateOfWeeks[3]}일 ${dayOfWeeks[3]}요일`, `${MonthOfWeeks[4]}월 ${dateOfWeeks[4]}일 ${dayOfWeeks[4]}요일`,`${MonthOfWeeks[5]}월 ${dateOfWeeks[5]}일 ${dayOfWeeks[5]}요일`,`${MonthOfWeeks[6]}월 ${dateOfWeeks[6]}일 ${dayOfWeeks[6]}요일`];

    var part = document.querySelector("#select_part");
    var select_place = document.querySelector("#select_place");
    var partOption = part.options[part.selectedIndex].value;
    var info = document.querySelector("#info_text");

    var select_place_Options = {
        gangseo: {'선택' : 'select','강서 1번 코트' : 'gangseo1', '강서 2번 코트' : 'gangseo2', '강서 3번 코트' : 'gangseo3', '강서 4번 코트' : 'gangseo4'},
        macdo: {'선택' : 'select','맥도 1번 코트' : 'macdo01', '맥도 2번 코트' : 'macdo02', '맥도 3번 코트' : 'macdo03', '맥도 4번 코트' : 'macdo04', '맥도 5번 코트' : 'macdo05', '맥도 6번 코트' : 'macdo06'},
        daejeo: {'선택' : 'select','대저 1번 코트' : 'daejeo01', '대저 2번 코트' : 'daejeo02', '대저 3번 코트' : 'daejeo03', '대저 4번 코트' : 'daejeo04','대저 5번 코트' : 'daejeo05', '대저 6번 코트' : 'daejeo06',
                '대저 7번 코트' : 'daejeo07', '대저 8번 코트' : 'daejeo08',},
        hwamyeong: {'선택' : 'select','화명 1번 코트' : 'hwamyeong01', '화명 2번 코트' : 'hwamyeong02', '화명 3번 코트' : 'hwamyeong03', '화명 4번 코트' : 'hwamyeong04', '화명 5번 코트' : 'hwamyeong05', 
                    '화명 6번 코트' : 'hwamyeong06','화명 7번 코트' : 'hwamyeong07', '화명 8번 코트' : 'hwamyeong08','화명 9번 코트' : 'hwamyeong09', '화명 10번 코트' : 'hwamyeong10'},
        gudeok: {'선택' : 'select','구덕 1번 코트' : 'gudeok01', '구덕 2번 코트' : 'gudeok02', '구덕 3번 코트' : 'gudeok03'},
        spoonePark: {'선택' : 'select', '스포원 실내 1번 코트' : 'spoonePark_in01', '스포원 실내 2번 코트' : 'spoonePark_in02', '스포원 실내 3번 코트' : 'spoonePark_in03', '스포원 실내 4번 코트' : 'spoonePark_in04', '스포원 실내 5번 코트' : 'spoonePark_in05', '스포원 실내 6번 코트' : 'spoonePark_in06',
                '스포원 실외 1번 코트' : 'spoonePark_out01', '스포원 실외 2번 코트' : 'spoonePark_out02', '스포원 실외 3번 코트' : 'spoonePark_out03', '스포원 실외 4번 코트' : 'spoonePark_out04', '스포원 실외 5번 코트' : 'spoonePark_out05', '스포원 실외 6번 코트' : 'spoonePark_out06',
                '스포원 실외 7번 코트' : 'spoonePark_out07', '스포원 실외 8번 코트' : 'spoonePark_out08', '스포원 실외 9번 코트' : 'spoonePark_out09', '스포원 실외 10번 코트' : 'spoonePark_out10', '스포원 실외 11번 코트' : 'spoonePark_out11', '스포원 실외 센터 코트' : 'spoonePark_out12'},
        sapryang: {'선택' : 'select' ,'삽량 3번 코트' : 'sapryang3', '삽령 4번 코트' : 'sapryang4', '삽량 7번 코트' : 'sapryang7', '삽량 8번 코트' : 'sapryang8'},
        sajik: {'선택' : 'select', [keys[0]] : 'sajik01', [keys[1]] : 'sajik02', [keys[2]] : 'sajik03', [keys[3]] : 'sajik04', [keys[4]] : 'sajik05', [keys[5]] : 'sajik06', [keys[6]] : 'sajik07'}
    }

    var select_part_Informations = {
        gangseo: ['<h1>강서체육공원 테니스장</h1><p>운영 시간: 09:00 ~ 22:00</p><p>주차: 무료</p><p>예약 가능일 : <br>사용일 14일 전부터 ~ 1일 전까지 신청가능</p><strong>코트 가격</strong><br> 주간: 8,000원 / 야간 : 28,000원<br>테니스장 조명시설 이용료 : 1시간당(1면) 10,000원<p>예약 방법</p><a href="https://reserve.busan.go.kr/rent/list?resveGroupSn=&progrmSn=&srchGugun=&srchResveInsttCd=&srchBeginDe=&srchEndDe=&srchIngStat=&srchVal=%ED%85%8C%EB%8B%88%EC%8A%A4%EC%9E%A5" target="_blank">강서 체육공원 테니스장 바로가기</a><p>로그인 -> 테니스장(코트) 선택 -> 예약하기 <br>-> 날짜 선택 ->각 시간대별 예약</p>'].join(""),
        macdo: ['<h1>맥도생태공원 테니스장</h1><p>운영 시간: 07:00 ~ 18:00</p><p>주차: 무료</p><p>예약 가능일 : <br>다음달 말일까지 신청가능</p><strong>코트 가격</strong><br> 평일: 6,000원 / 토요일 및 공휴일: 9,000원<p>예약 방법</p><a href="https://reserve.busan.go.kr/rent/list?resveGroupSn=&progrmSn=&srchGugun=&srchResveInsttCd=&srchBeginDe=&srchEndDe=&srchIngStat=&srchVal=%ED%85%8C%EB%8B%88%EC%8A%A4%EC%9E%A5" target="_blank">맥도 생태공원 테니스장 바로가기</a><p>로그인 -> 테니스장(코트) 선택 -> 예약하기 <br>-> 날짜 선택 ->각 시간대별 예약</p>'].join(""),
        daejeo: ['<h1>대저생태공원 테니스장</h1><p>운영 시간: 07:00 ~ 18:00</p><p>주차: 무료</p><p>예약 가능일 : <br>다음달 말일까지 신청가능</p><strong>코트 가격</strong><br> 평일: 6,000원 / 토요일 및 공휴일: 9,000원<br>테니스장 조명시설 이용료 : 1시간당(1면) 10,000원<p>예약 방법</p><a href="https://reserve.busan.go.kr/rent/list?resveGroupSn=&progrmSn=&srchGugun=&srchResveInsttCd=&srchBeginDe=&srchEndDe=&srchIngStat=&srchVal=%ED%85%8C%EB%8B%88%EC%8A%A4%EC%9E%A5" target="_blank">대저 생태공원 테니스장 바로가기</a><p>로그인 -> 테니스장(코트) 선택 -> 예약하기 <br>-> 날짜 선택 ->각 시간대별 예약</p>'].join(""),
        hwamyeong: ['<h1>화명생태공원 테니스장</h1><p>운영 시간: 07:00 ~ 18:00</p><p>주차: 무료</p><p>예약 가능일 : <br>다음달 말일까지 신청가능</p><strong>코트 가격</strong><br> 평일: 6,000원 / 토요일 및 공휴일: 9,000원<br>테니스장 조명시설 이용료 : 1시간당(1면) 10,000원<p>예약 방법</p><a href="https://reserve.busan.go.kr/rent/list?resveGroupSn=&progrmSn=&srchGugun=&srchResveInsttCd=&srchBeginDe=&srchEndDe=&srchIngStat=&srchVal=%ED%85%8C%EB%8B%88%EC%8A%A4%EC%9E%A5" target="_blank">화명 생태공원 테니스장 바로가기</a><p>로그인 -> 테니스장(코트) 선택 -> 예약하기 <br>-> 날짜 선택 ->각 시간대별 예약</p>'].join(""),
        gudeok: ['<h1>구덕운동장 테니스장</h1><p>운영 시간: 08:00 ~ 22:00</p><p>주차: 무료</p><p>예약 가능일 : <br>14일 전부터 ~ 1일 전까지 신청가능</p><strong>코트 가격</strong><br> 평일, 토요일 및 공휴일: 8,000원<br>테니스장 조명시설 이용료 : 1시간당(1면) 10,000원<p>예약 방법</p><a href="https://reserve.busan.go.kr/rent/list?resveGroupSn=&progrmSn=&srchGugun=&srchResveInsttCd=&srchBeginDe=&srchEndDe=&srchIngStat=&srchVal=%ED%85%8C%EB%8B%88%EC%8A%A4%EC%9E%A5" target="_blank">구덕 운동장 테니스장 바로가기</a><p>로그인 -> 테니스장(코트) 선택 -> 예약하기 <br>-> 날짜 선택 ->각 시간대별 예약</p>'].join(""),
        spoonePark: ['<h1>스포원 파크 테니스장</h1><p>운영 시간: 06:00 ~ 22:00</p><p>주차: 무료</p><p>실내</p><p>평일 주간 : 40,000원 / 야간: 50,000원</p><p>주말 주간: 50,000원 / 야간 : 60,000원</p><p>실외</p><p>평일, 주말 주간: 8,000원 / 야간 : 28,000원</p><h3>예약 방법</h3><a href="https://nrsv.spo1.or.kr/fmcs/1" target="_blank">스포원파크 테니스장 바로가기</a><p>센터 선택 -> 시설 선택 -> 코트 선택 <br>-> 검색 후 각 시간대별 예약</p>'].join(""),
        sapryang: ['<h1>삽량 테니스장</h1><p>운영 시간:<br> 3번 코트 08:00 ~ 22:00<br> 4번, 7번 8번 코트 09:00 ~ 22:00</p><p>주차: 무료</p><p>실외</p><p>평일 주간 : 10,000원 / 야간: 18,500원</p><p>주말 주간: 15,000원 / 야간 : 23,500원</p><h3>예약 방법</h3><a href="https://www.yssisul.or.kr/rent" target="_blank">삽량 테니스장 바로가기</a><p>테니스장 선택 -> 코트 선택 -> 날짜 및 시간대별 예약</p>'].join(""),
        sajik: ['<h1>사직구장 테니스장</h1><p>운영 시간: 06:00 ~ 20:00</p><p>주차: 무료</p><p>실외</p><p>평일 주간 조조: 10,000원 / 평일 주간: 20,000원<br>평일 야간: 25,000원</p><p>주말·공휴일 주간: 25,000원 / 야간 : 30,000원</p><h3>예약 방법</h3><a href="https://www.sajiktennis.kr/html/" target="_blank">사직구장 테니스장 바로가기</a><p>로그인 -> 날짜 선택 -> 코트 선택 -> 남는 시간 예약</p>'].join(""),
    }
    
    var select_part_images = {
        gangseo: ["gangseo1","gangseo2","gangseo3"],  
        macdo: ["macdo1","macdo2","macdo3"], 
        daejeo: ["daejeo1","daejeo2","daejeo3"],
        hwamyeong: ["hwamyeong1","hwamyeong2","hwamyeong3"],
        gudeok: ["gudeok1","gudeok2","gudeok3"],
        spoonePark: ["spoonePark1","spoonePark2","spoonePark3"],
        sapryang: ["sapryang1","sapryang2","sapryang3"],
        sajik: ["sajik1","sajik2","sajik3"]
    }
    var select_place_Option = select_place_Options[partOption];
    var select_part_information = select_part_Informations[partOption];
    var select_part_image = select_part_images[partOption];

    select_place.options.length = 0;

    for (var key in select_place_Option) {
        var option = document.createElement('option');
        option.value = select_place_Option[key];
        option.innerText = key;
        select_place.append(option);    
    }
    // 장소 별 정보 HTML 기입
    info.innerHTML = select_part_information;

    //이미지 컨테이너 엘리먼트를 가져옵니다.
     const displayedImage = document.querySelectorAll('.displayedImage');

    for (var i =0; i<3; i++) {
        const imagePath = `css/${select_part_image[i]}.jpg`; // 해당 값에 맞는 이미지 경로
        displayedImage[i].src = imagePath;
    }


    const thisMonthButton = document.getElementById('thisMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    if (part.value === 'sajik') {
        nextMonthButton.style.display = 'none';
        thisMonthButton.style.width = "300px"
      }

    part.addEventListener('change', function() {
        if (part.value === 'sajik') {
            nextMonthButton.style.display = 'none'; // 버튼을 숨김
            thisMonthButton.style.width = "300px";
         } else {
            nextMonthButton.style.display = 'inline-block'; // 버튼을 보이게 함
            thisMonthButton.style.width = "170px";
        }
    });

}

function getDayName(dayIndex) {
    if(dayIndex > 6){
        dayIndex -= 6;
    }
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayIndex];
}

function choiceDay(e) {
    if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
        document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
    }
    e.classList.add("choiceDay");
}