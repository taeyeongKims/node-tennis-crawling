function getSchedule(){
    var selectPart = document.getElementById('select_part').value;
    var selectPlace = document.getElementById('select_place').value;
    var url = `http://localhost:3000/schedule?select_part=${selectPart}&select_place=${selectPlace}&Calendar=now`;

    var placeTdElements = document.querySelectorAll('#place td');
    for (var i = 0; i < placeTdElements.length; i++) {
    var tdElement = placeTdElements[i];
    tdElement.parentNode.removeChild(tdElement);
    }   

    showLoadingSpinner(); // 스피너 생성

    fetch( url, {
        method: 'GET',
        })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('서버 응답에 문제가 있습니다.');
        }
            return response.text();
            })
    .then(function(html) {
        document.getElementById('Calendar').innerHTML = html;
        hideLoadingSpinner();  // 스피너 숨김
        })
        .catch(function(error) {
         // 에러 처리
            console.error(error);
            hideLoadingSpinner(); // 오류 발생 시 스피너 숨김
        });
};


function nextCalendar(){
    document.getElementById('place').innerHTML = ""
    var selectPart = document.getElementById('select_part').value;
    var selectPlace = document.getElementById('select_place').value;

    var url = `http://localhost:3000/schedule?select_part=${selectPart}&select_place=${selectPlace}&Calendar=next`; 
    
    showLoadingSpinner(); // 스피너 생성

    fetch( url, {
        method: 'GET',
        })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('서버 응답에 문제가 있습니다.');
        }
            return response.text();
            })
    .then(function(html) {
        document.getElementById('Calendar').innerHTML = html
        hideLoadingSpinner();  // 스피너 숨김
        })
        .catch(function(error) {
         // 에러 처리
            console.error(error);
            hideLoadingSpinner();  // 스피너 숨김
        });
};

function prevCalendar(){

    var url = `http://localhost:3000/schedule?select_part=${selectPart}&select_place=${selectPlace}&Calendar=prev`; 
        
    fetch( url, {
        method: 'GET',
        })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('서버 응답에 문제가 있습니다.');
        }
            return response.text();
            })
    .then(function(html) {
        document.getElementById('Calendar').innerHTML = html
        })
        .catch(function(error) {
         // 에러 처리
            console.error(error);
        });
};
