function getSchedule(){
    var selectPart = document.getElementById('select_part').value;
    var selectPlace = document.getElementById('select_place').value;
    var url = `http://localhost:3000/schedule?select_part=${selectPart}&select_place=${selectPlace}&Calendar=now`;
        
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


function nextCalendar(){
    document.getElementById('place').innerHTML = ""
    var selectPart = document.getElementById('select_part').value;
    var selectPlace = document.getElementById('select_place').value;

    var url = `http://localhost:3000/schedule?select_part=${selectPart}&select_place=${selectPlace}&Calendar=next`; 
        
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
