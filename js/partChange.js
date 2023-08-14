function partChange() {
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
        sajik: {'선택' : 'select','사직 1번 코트' : 'sajik01', '사직 2번 코트' : 'sajik02', '사직 3번 코트' : 'sajik03', '사직 4번 코트' : 'sajik04'}
    }
    var select_place_Option = select_place_Options[partOption];

    select_place.options.length = 0;

    for (var key in select_place_Option) {
        var option = document.createElement('option');
        option.value = select_place_Option[key];
        option.innerText = key;
        console.log(option);
        select_place.append(option);
    }
}