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
        console.log(dayIndex)
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
    var select_place_Option = select_place_Options[partOption];

    select_place.options.length = 0;

    for (var key in select_place_Option) {
        var option = document.createElement('option');
        option.value = select_place_Option[key];
        option.innerText = key;
        select_place.append(option);    
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
            thisMonthButton.style.marginRight = "0px";
         } else {
            nextMonthButton.style.display = 'inline-block'; // 버튼을 보이게 함
            thisMonthButton.style.width = "150px";
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

