 function getPlace(date_value){

    var placeTrElements = document.querySelectorAll('#place tr');
    for (var i = 0; i < placeTrElements.length; i++) {
    var trElement = placeTrElements[i];
    trElement.parentNode.removeChild(trElement);
    }   
    
    var selectPart = document.getElementById('select_part').value;
    var selectPlace = document.getElementById('select_place').value; 
    let getMonth = document.getElementById("calMonth").classList;
    var url = `http://localhost:8080/place?select_part=${selectPart}&select_place=${selectPlace}&valueToFind=${date_value}&Calendar=${getMonth}`;
        
    showLoadingSpinner(); // 스피너 생성

    fetch( url, {
        method: 'GET',
        })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('서버 응답에 문제가 있습니다.');
        }
            return response.json();
            })
    .then(function(data) {
        var table = document.getElementById('place');

        var table1 = document.createElement('tr');
         table.appendChild(table1);
        var table2 = document.createElement('tr');
        table.appendChild(table2);
        var table3 = document.createElement('tr');
        table.appendChild(table3);
        var table4 = document.createElement('tr');
        table.appendChild(table4);

        // data.time 정보 다음에 불러올 때 초기화 시키기 해야함
        var dataArrayLength = data.time.length; 
        if(dataArrayLength<14){
            var lineNum = 3;
        } else {
            lineNum = 4;
        }

        for (var i = 0; i < dataArrayLength; i++) {
            if(i < lineNum) {
                var td = document.createElement('td');
                td.textContent = data.time[i]; // 셀 내용 설정 (원하는 내용으로 변경)
                table1.appendChild(td);
            } else if(i >= lineNum && i < dataArrayLength/2) {
                var td = document.createElement('td');
                td.textContent = data.time[i]; 
                table3.appendChild(td);
            }else if(i >= dataArrayLength/2 && i < lineNum + dataArrayLength/2) {
                var td = document.createElement('td');
                td.textContent = data.time[i]; 
                table2.appendChild(td);
            }else if(i >= lineNum + dataArrayLength/2 && i < dataArrayLength) {
                var td = document.createElement('td');
                td.textContent = data.time[i]; 
                table4.appendChild(td);
            }
          }
        
        var top_tdWidth = table.offsetWidth / (lineNum);
        var td1Elements = table1.querySelectorAll('td');
        for (var i = 0; i < td1Elements.length; i++) {
            td1Elements[i].style.width = top_tdWidth + 'px';
        }
        var bottom_tdWidth = table.offsetWidth / ((dataArrayLength/2)-lineNum);
        var td2Elements = table2.querySelectorAll('td');
        for (var i = 0; i < td2Elements.length; i++) {
            td2Elements[i].style.width = bottom_tdWidth + 'px';
        }
        var td3Elements = table3.querySelectorAll('td');
        for (var i = 0; i < td3Elements.length; i++) {
            td3Elements[i].style.width = top_tdWidth + 'px';
        }
        var td4Elements = table4.querySelectorAll('td');
        for (var i = 0; i < td4Elements.length; i++) {
            td4Elements[i].style.width = bottom_tdWidth + 'px';
        }

        hideLoadingSpinner();  // 스피너 숨김
    })
     .catch(function(error) {
         // 에러 처리
            console.error(error);
            hideLoadingSpinner(); // 오류 발생 시 스피너 숨김
    })
};

function fn_resveInfoFee(date, className){
    const date_value = date.slice(8, 10);
    // return date_value;
}
function btnActive(e) {
    date_value = parseInt(e.innerText); 
    getPlace(date_value);
}
